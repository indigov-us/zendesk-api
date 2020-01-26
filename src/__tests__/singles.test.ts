import { zendeskAPI } from './helpers'

test('get a user', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.User>('/users/397525155434')
  expect(res.body.user.id).toBeTruthy()
})

test('get a page of tickets', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.Ticket>('/tickets/1')
  expect(res.body.ticket.id).toBeTruthy()
})
