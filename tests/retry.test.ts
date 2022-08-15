import { Errors } from '../src'
import retry from '../src/retry'
import Zendesk from '../src/zendesk'
import { zendeskAPI } from './_helpers'

it('retries forever on rate-limit errors', async () => {
  const res = await retry<Zendesk.PaginatedResults.Users>(() => zendeskAPI('/users'))
  expect(res.body.users.length).toBeGreaterThan(1)
}, 10000)

it('appropriately handles rate limit errors', async () => {
  let called = 0

  await expect(async () => {
    await retry(
      () => {
        called = called + 1
        throw new Errors.RateLimit({ retryAfter: 0.1 })
      },
      { maxNumAttemptsOnRateLimit: 3 }
    )
  }).rejects.toThrow(Errors.RateLimit)

  expect(called).toBe(3)
})
