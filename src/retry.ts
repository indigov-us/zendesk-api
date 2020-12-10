import { Result } from './client'
import { RateLimit } from './errors'

export default async <ResultType>(
  req: Promise<Result<ResultType>>,
  {
    maxNumAttempts,
    retryDelay = 1000,
  }: {
    /** How many attempts before finally throwing an error? */
    maxNumAttempts?: number
    /** How long to wait before retrying? (in milliseconds) */
    retryDelay?: number
  }
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
      await new Promise((resolve) => setTimeout(resolve, retryDelay))
    }
  }

  return res
}
