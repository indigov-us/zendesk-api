import jobCompletion from '../src/job-completion'
import { zendeskAPI } from './_helpers'

it('waits for jobs to complete', async () => {
  const jobRes = await jobCompletion({ api: zendeskAPI })('/users/create_or_update_many.json', {
    body: JSON.stringify({ users: [{ name: 'Job Wait Test', email: 'wat@ever.com' }] }),
    method: 'POST',
  })
  expect(jobRes.body.job_status.status).toEqual('completed')
}, 6000)
