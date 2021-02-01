import { zendeskAPI } from './_helpers'
import { Zendesk } from '../src'

test('get a page of users', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.Users>('/users')
  expect(res.body.users.length).toBeGreaterThan(0)
}, 60000)

test('get a page of tickets', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.Tickets>('/tickets')
  expect(res.body.tickets.length).toBeGreaterThan(0)
})

test('get a page of ticket audits', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.TicketAudits>('/ticket_audits?limit=1')
  expect(res.body.audits.length).toBeGreaterThan(0)
})

test('get a page of ticket fields', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.TicketFields>('/ticket_fields')
  expect(res.body.ticket_fields.length).toBeGreaterThan(0)
})

test('get a page of ticket forms', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.TicketForms>('/ticket_forms')
  expect(res.body.ticket_forms.length).toBeGreaterThan(0)
})

test('gets identities', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.Identities>('/users/397525155434/identities/')
  expect(res.body.identities.length).toBeGreaterThan(0)
})

test('get a page of user fields', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.UserFields>('/user_fields')
  expect(res.body.user_fields.length).toBeGreaterThan(0)
})

test('get a page of targets', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.Targets>('/targets')
  expect(res.body.targets.length).toBeGreaterThan(0)
})

test('get a page of triggers', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.Triggers>('/triggers')
  expect(res.body.triggers.length).toBeGreaterThan(0)
})

test('get a page of views', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.Views>('/views')
  expect(res.body.views.length).toBeGreaterThan(0)
})

test('get a page of side conversations', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.SideConversations>('/tickets/1/side_conversations')
  expect(res.body.side_conversations.length).toBeGreaterThan(0)
})

test('get a page of side conversation events', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.SideConversationEvents>(
    '/tickets/1/side_conversations/2d990f9c-5a78-11eb-9d17-f9b4d1fb8f7b/events'
  )
  expect(res.body.events.length).toBeGreaterThan(0)
})

test('get a page of automations', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.Automations>('/automations')
  expect(res.body.automations.length).toBeGreaterThan(0)
})
