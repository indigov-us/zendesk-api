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

test('get a user field', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.UserField>('/user_fields/360001055373')
  expect(res.body.user_field.id).toBeTruthy()
})

test('get a ticket form', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.TicketForm>('/ticket_forms/360002286493')
  expect(res.body.ticket_form.id).toBeTruthy()
})

test('get a ticket audit', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.TicketAudit>('/tickets/1/audits/940080446574')
  expect(res.body.audit.id).toBeTruthy()
})

test('get an identity', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.Identity>('/users/397525155434/identities/374738834714')
  expect(res.body.identity.id).toBeTruthy()
})

test('get a target', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.Target>('/targets/360002132533')
  expect(res.body.target.id).toBeTruthy()
})

test('get a trigger', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.Trigger>('/triggers/360182340594')
  expect(res.body.trigger.id).toBeTruthy()
})

test('get an automation', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.Automation>('/automations/360124001594')
  expect(res.body.automation.id).toBeTruthy()
})

test('get a view', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.View>('/views/360187511734')
  expect(res.body.view).toBeTruthy()
}, 20000)

test('get a side conversation', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.SideConversation>(
    '/tickets/1/side_conversations/2d990f9c-5a78-11eb-9d17-f9b4d1fb8f7b'
  )
  expect(res.body.side_conversation).toBeTruthy()
}, 20000)

test('get a schedule', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.Schedule>('/business_hours/schedules/360000312914')
  expect(res.body.schedule).toBeTruthy()
}, 20000)

test('get a trigger category', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.TriggerCategory>('/trigger_categories/1500000494561')
  expect(res.body.trigger_category).toBeTruthy()
})
