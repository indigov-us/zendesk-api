import { zendeskAPI } from './_helpers'

test('create a job and check on the status until it is finished', async () => {
  const createJobRes = await zendeskAPI<Zendesk.SingleResults.JobStatus>('/users/create_many.json', {
    body: JSON.stringify({ users: [...Array(50)].map(_ => ({})) }),
    method: 'POST',
  })

  const jobId = createJobRes.body.job_status.id
  let isCompleted = false

  while (!isCompleted) {
    const jobStatusRes = await zendeskAPI<Zendesk.SingleResults.JobStatus>(`/job_statuses/${jobId}.json`)
    isCompleted = jobStatusRes.body.job_status.status === 'completed'
    await new Promise(resolve => setTimeout(resolve, 100))
  }
})
