import { Errors } from '../src'
import retry from '../src/retry'
import Zendesk from '../src/zendesk'
import { zendeskAPI } from './_helpers'

it('retries forever on rate-limit errors', async () => {
  const res = await retry<Zendesk.PaginatedResults.Users>(() => zendeskAPI('/users'))
  expect(res.body.users.length).toBeGreaterThan(1)
}, 10000)

it('retries rate limit errors by default', async () => {
  let called = 0

  await expect(async () => {
    await retry(
      () => {
        called = called + 1
        throw new Errors.RateLimit({ retryAfter: 0.1 })
      },
      { maxNumAttempts: 3 }
    )
  }).rejects.toThrow(Errors.RateLimit)

  expect(called).toBe(3)
})

it('does not retry errors that are not listed', async () => {
  let called = 0

  await expect(async () => {
    await retry(
      () => {
        called = called + 1
        throw new Errors.UnknownApiError({ error: "I'm not a retriable error" })
      },
      { maxNumAttempts: 3 }
    )
  }).rejects.toThrow(Errors.UnknownApiError)

  expect(called).toBe(1)
})

it('retries errors that are explicitly listed', async () => {
  let called = 0

  await expect(async () => {
    await retry(
      () => {
        called = called + 1
        throw new Errors.UnknownApiError({ error: "I'm not a retriable error" })
      },
      { maxNumAttempts: 3, errorTypesToRetry: [Errors.UnknownApiError] }
    )
  }).rejects.toThrow(Errors.UnknownApiError)

  expect(called).toBe(3)
})

it('retries any errors if "all" is provided as type to retry', async () => {
  let called = 0

  await expect(async () => {
    await retry(
      () => {
        called = called + 1
        throw new Error("I'm a generic error")
      },
      { maxNumAttempts: 3, errorTypesToRetry: 'all' }
    )
  }).rejects.toThrow(Error)

  expect(called).toBe(3)
})
