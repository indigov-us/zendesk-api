import { zendeskAPI } from './_helpers'
import { Zendesk } from '../src'

test('object types', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.Sunshine.ObjectTypes>('/sunshine/objects/types')
  expect(res.body.data.length).toBeGreaterThan(1)
})
