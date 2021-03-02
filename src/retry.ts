import { Result } from './client'
import { RateLimit } from './errors'

export default async <ResultType>(
  req: Promise<Result<ResultType>>,
  {
    maxNumAttempts,
    retryDelay = 1000,
    shouldLog,
  }: {
    /** How many attempts before finally throwing an error? */
    maxNumAttempts?: number
    /** How long to wait before retrying? (in milliseconds) */
    retryDelay?: number
    /** Write a log line on rate limited? */
    shouldLog?: boolean
  } = {}
) => {
  let numAttempts = 0
  let res: Result<ResultType> | undefined

  while (!res) {
    try {
      // try the request
      numAttempts++
      res = await req
    } catch (e) {
      // if it is not a rate limit error, or we have tried enough times, throw it
      if (!(e instanceof RateLimit) || (maxNumAttempts && numAttempts >= maxNumAttempts)) throw e
      // otherwise delay and keep looping
      if (shouldLog) console.log(`Rate limited, retrying in ${retryDelay / 1000}s...`)
      await new Promise((resolve) => setTimeout(resolve, retryDelay))
    }
  }

  return res
}
