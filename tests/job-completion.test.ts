import jobCompletion from '../src/job-completion'
import { zendeskAPI } from './_helpers'

it('waits for jobs to complete', async () => {
  const onProgress = jest.fn()
  const onJobStatus = jest.fn()
  const jobRes = await jobCompletion({ api: zendeskAPI, onJobStatus, onProgress })(
    '/users/create_or_update_many.json',
    {
      body: JSON.stringify({ users: [{ name: 'Job Wait Test', email: 'wat@ever.com' }] }),
      method: 'POST',
    }
  )
  expect(jobRes.body.job_status.status).toEqual('completed')
  expect(onJobStatus).toHaveBeenCalled()
  expect(onProgress).toHaveBeenCalledWith(1)
}, 60000)
