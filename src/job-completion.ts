import { FetchMethod } from './client'
import Zendesk from './zendesk'

const statusUpdateInterval = 3000

export default ({ api }: { api: FetchMethod }) => async (path: string, init?: RequestInit) => {
  let jobRes = await api<Zendesk.SingleResults.JobStatus>(path, init)

  while (['queued', 'working'].includes(jobRes.body.job_status.status)) {
    await new Promise(resolve => setTimeout(resolve, statusUpdateInterval))
    jobRes = await api<Zendesk.SingleResults.JobStatus>(`/job_statuses/${jobRes.body.job_status.id}.json`)
  }

  return jobRes
}
