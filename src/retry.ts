import { Result } from './client'
import * as Errors from './errors'
import { RateLimit } from './errors'

export default async <ResultType>(
  fn: () => Promise<Result<ResultType>>,
  {
    maxNumAttempts,
    retryDelay = 1000,
    shouldLog,
    errorTypesToRetry = [RateLimit],
  }: {
    /** How many attempts before finally throwing an error? */
    maxNumAttempts?: number
    /** How long to wait before retrying? (in milliseconds) */
    retryDelay?: number
    /** Write a log line on rate limited? */
    shouldLog?: boolean
    errorTypesToRetry?: 'all' | (typeof Errors.UnknownApiError | typeof Errors.RateLimit)[]
  } = {}
) => {
  let numAttempts = 0
  let res: Result<ResultType> | undefined

  while (!res) {
    try {
      // try the request
      numAttempts++
      res = await fn()
    } catch (e) {
      const errorShouldBeRetried = errorTypesToRetry === 'all' || errorTypesToRetry.some((type) => e instanceof type)

      if (!errorShouldBeRetried) {
        throw e
      }

      // if it's a rate limit error and we've retried too many times, throw the error
      if (maxNumAttempts && numAttempts >= maxNumAttempts) {
        if (shouldLog) console.log(`Call failed and exceeded max number of attempts.`)
        throw e
      }

      // Multiplying with 1100 instead of 1000 to account for small differences in timing.
      const retryAfter = e instanceof Errors.RateLimit && e.retryAfter ? e.retryAfter * 1100 : retryDelay

      if (shouldLog) console.log(`Request failed, retrying in ${retryAfter / 1000}s...`)

      await new Promise((resolve) => setTimeout(resolve, retryAfter))
    }
  }

  return res
}
