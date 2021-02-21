import { FetchMethod } from './client'
import Zendesk from './zendesk'

export default (fetchMethod: FetchMethod) => async (email: string) => {
  const searchRes = await fetchMethod<Zendesk.PaginatedResults.Users>(`/users/search?query=email:"${email}"`)
  if (searchRes.body.users[0]?.email?.toUpperCase() === email.toUpperCase()) {
    return searchRes.body.users[0]
  }
}
