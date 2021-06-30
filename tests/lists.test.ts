import { zendeskAPI } from './_helpers'
import { Zendesk } from '../src'

test('get the schedules', async () => {
  const res = await zendeskAPI<Zendesk.ListResults.Schedules>('/business_hours/schedules')
  expect(res.body.schedules).toBeTruthy()
}, 20000)

test('get a list of apps', async () => {
  const res = await zendeskAPI<Zendesk.ListResults.Apps>('/apps')
  expect(res.body.apps.length).toBeGreaterThan(0)
}, 20000)

test('get a list of app installations', async () => {
  const installationsRes = await zendeskAPI<Zendesk.ListResults.AppInstallations>('/apps/installations')
  expect(installationsRes.body.installations.length).toBeGreaterThan(0)
}, 20000)

test('get ticket comments', async () => {
  const res = await zendeskAPI<Zendesk.ListResults.Comments>('/tickets/1/comments')
  expect(res.body.comments.length).toBeGreaterThanOrEqual(0)
})

test('get trigger categories', async () => {
  const res = await zendeskAPI<Zendesk.ListResults.TriggerCategories>('/trigger_categories')
  expect(res.body.trigger_categories.length).toBeGreaterThanOrEqual(0)
})
