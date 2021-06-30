import { zendeskAPI } from './_helpers'
import { Zendesk } from '../src'

test('object types and records', async () => {
  const typeRes = await zendeskAPI<Zendesk.PaginatedResults.Sunshine.ObjectTypes<any>>('/sunshine/objects/types')
  expect(typeRes.body.data.length).toBeGreaterThan(1)

  const objectType = typeRes.body.data[0].key
  const recordsRes = await zendeskAPI<Zendesk.PaginatedResults.Sunshine.ObjectRecords<any>>(
    `/sunshine/objects/records?type=${objectType}`
  )
  expect(recordsRes.body.data.length).toBeGreaterThan(1)
})

test('relationship types and records', async () => {
  const typeRes = await zendeskAPI<Zendesk.PaginatedResults.Sunshine.RelationshipTypes>('/sunshine/relationships/types')
  expect(typeRes.body.data.length).toBeGreaterThan(1)

  const objectType = typeRes.body.data[0].key
  const recordsRes = await zendeskAPI<Zendesk.PaginatedResults.Sunshine.RelationshipRecords>(
    `/sunshine/relationships/records?type=${objectType}`
  )
  expect(recordsRes.body.data.length).toBeGreaterThanOrEqual(0)
})
