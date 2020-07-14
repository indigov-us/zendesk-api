import { FetchMethod } from './client'
import Zendesk from './zendesk'

const statusUpdateInterval = 3000

export default ({
  api,
  onJobStatus,
  onProgress,
}: {
  api: FetchMethod
  onJobStatus?: (jobStatus: Zendesk.JobStatus) => void
  onProgress?: (progress: number) => void
}) => async (path: string, init?: RequestInit) => {
  let jobRes = await api<Zendesk.SingleResults.JobStatus>(path, init)
  let initialProgress = 0

  while (['queued', 'working'].includes(jobRes.body.job_status.status)) {
    await new Promise((resolve) => setTimeout(resolve, statusUpdateInterval))

    jobRes = await api<Zendesk.SingleResults.JobStatus>(`/job_statuses/${jobRes.body.job_status.id}.json`)

    if (onJobStatus) onJobStatus(jobRes.body.job_status)

    const progressDelta = jobRes.body.job_status.progress - initialProgress
    if (onProgress && progressDelta) onProgress(progressDelta)
    initialProgress = jobRes.body.job_status.progress
  }

  return jobRes
}
