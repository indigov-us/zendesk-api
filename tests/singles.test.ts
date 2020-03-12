import { zendeskAPI } from './_helpers'
import { Zendesk } from '../src'

test('get a user', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.User>('/users/397525155434')
  expect(res.body.user.id).toBeTruthy()
})

test('get a ticket', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.Ticket>('/tickets/1')
  expect(res.body.ticket.id).toBeTruthy()
})

test('get a ticket field', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.TicketField>('/ticket_fields/360029892854')
  expect(res.body.ticket_field.id).toBeTruthy()
})

test('get a ticket form', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.TicketForm>('/ticket_forms/360002286493')
  expect(res.body.ticket_form.id).toBeTruthy()
})
