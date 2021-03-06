import { FetchMethod } from './client'
import jobCompletion from './job-completion'
import Zendesk from './zendesk'

// if not specific, what default name should we give users?
const defaultNameFallback = 'Friend'

export default ({ api, retryRateLimitErrors }: { api: FetchMethod; retryRateLimitErrors?: boolean }) =>
  async ({ users, defaultName }: { users: Zendesk.User[]; defaultName?: string }): Promise<boolean> => {
    // we should never attempt to pass empty "name"s, because it will fail for existing users,
    // and the fallback name will also fail because the user already exists during the /users/create_many
    const usersWithEmptyNamesRemoved = users.map(({ name, ...user }) => {
      if (name) (user as Zendesk.User).name = name
      return user
    })

    // attempt to create or update the users
    const createOrUpdateRes = await jobCompletion({ api, retryRateLimitErrors })('/users/create_or_update_many', {
      body: JSON.stringify({ users: usersWithEmptyNamesRemoved }),
      method: 'POST',
    })
    const results = createOrUpdateRes.body.job_status.results

    // figure out exactly which users failed due to name errors
    const failures = users.filter((_, i) => results[i]?.status === 'Failed' && results[i]?.details?.includes('Name'))

    // retry the failures using the create_many endpoint and a default name
    if (failures.length) {
      const name = defaultName || defaultNameFallback
      await jobCompletion({ api, retryRateLimitErrors })('/users/create_many', {
        body: JSON.stringify({ users: failures.map((u) => ({ ...u, name })) }),
        method: 'POST',
      })
    }

    return true
  }
