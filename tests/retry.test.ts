import retry from '../src/retry'
import { zendeskAPI } from './_helpers'
import Zendesk from '../src/zendesk'

it('retries forever on rate-limit errors', async () => {
  const res = await retry<Zendesk.PaginatedResults.Users>(zendeskAPI('/users'), {
    maxNumAttempts: 3,
    retryDelay: 1000,
  })
  expect(res.body.users.length).toBeGreaterThan(1)
}, 10000)
