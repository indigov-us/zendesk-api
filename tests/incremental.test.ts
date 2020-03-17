import { zendeskAPI } from './_helpers'
import { Zendesk } from '../src'

test('get an incremental page of users', async () => {
  const res = await zendeskAPI<Zendesk.IncrementalResults.Users>('/incremental/users?start_time=0')
  expect(res.body.users.length).toBeGreaterThan(0)
}, 10000)

test('get an incremental page of tickets', async () => {
  const res = await zendeskAPI<Zendesk.IncrementalResults.Tickets>('/incremental/tickets?start_time=0')
  expect(res.body.tickets.length).toBeGreaterThan(0)
}, 10000)
