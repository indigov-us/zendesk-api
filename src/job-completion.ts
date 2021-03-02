import { RequestInit } from 'node-fetch'

import { FetchMethod } from './client'
import retry from './retry'
import Zendesk from './zendesk'

const statusUpdateInterval = 3000

export default ({
  api,
  onJobStatus,
  onProgress,
  retryRateLimitErrors,
}: {
  api: FetchMethod
  onJobStatus?: (jobStatus: Zendesk.JobStatus) => void
  onProgress?: (progress: number) => void
  retryRateLimitErrors?: boolean
}) => async (path: string, init?: RequestInit) => {
  // allow for retrying rate limits indefinitely.
  // maxNumAttempts = 1 is the same thing as not retrying at all
  const retryArgs: Parameters<typeof retry>[1] = {
    maxNumAttempts: retryRateLimitErrors ? undefined : 1,
  }

  let jobRes = await retry<Zendesk.SingleResults.JobStatus>(() => api(path, init), retryArgs)
  let initialProgress = 0

  while (['queued', 'working'].includes(jobRes.body.job_status.status)) {
    await new Promise((resolve) => setTimeout(resolve, statusUpdateInterval))

    jobRes = await retry<Zendesk.SingleResults.JobStatus>(
      () => api(`/job_statuses/${jobRes.body.job_status.id}.json`),
      retryArgs
    )

    if (onJobStatus) onJobStatus(jobRes.body.job_status)

    const progressDelta = jobRes.body.job_status.progress - initialProgress
    if (onProgress && progressDelta) onProgress(progressDelta)
    initialProgress = jobRes.body.job_status.progress
  }

  return jobRes
}
