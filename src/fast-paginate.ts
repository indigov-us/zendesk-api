import { RequestInit } from 'node-fetch'
import PQueue from 'p-queue'

import { FetchMethod, Result } from './client'
import { RateLimit } from './errors'

const defaultConcurrency = 5

export default <BodyType>({
  api,
  concurrency,
  onPage,
  retryRateLimitErrors,
  startPage,
}: {
  api: FetchMethod
  concurrency?: number
  retryRateLimitErrors?: boolean
  onPage: (res: Result<BodyType>) => Promise<boolean>
  startPage?: number
}) => async (path: string, init?: RequestInit) => {
  const concurrencyWithFallback = concurrency || defaultConcurrency
  const pQueue = new PQueue({ concurrency: concurrencyWithFallback })

  let keepLooping = true
  let page = startPage || 1

  while (keepLooping) {
    for (const [i] of Array.from(Array(concurrencyWithFallback)).entries()) {
      // don't allow the queue size to explode
      while (pQueue.size >= 100) await new Promise((resolve) => setTimeout(resolve, 1000))

      // make sure to cache the value of page outside of the async worker function
      const currentPage = page + i

      pQueue.add(async () => {
        if (!keepLooping) return

        const pathWithPage = path.includes('?') ? `${path}&page=${currentPage}` : `${path}?page=${currentPage}`

        let res: Result<BodyType> | undefined
        while (!res) {
          try {
            res = await api<BodyType>(pathWithPage, init)
          } catch (e) {
            // if we were rate-limited and we should retry, do so
            if (retryRateLimitErrors && e instanceof RateLimit) {
              await new Promise((resolve) => setTimeout(resolve, 1000))
            } else throw e
          }
        }

        // return false in onPage to stop looping
        keepLooping = await onPage(res)
      })
    }

    page += concurrencyWithFallback
  }

  await pQueue.onIdle()
}
