import { zendeskAPI } from './_helpers'

test('search users', async () => {
  const res = await zendeskAPI<Zendesk.SearchResult>(`/search.json?query=${encodeURIComponent('test type:user')}`)
  const object = res.body.results[0]
  expect(object.result_type).toBe('user')
  expect(object.name).toBeTruthy() // only users have :name
})

test('search tickets', async () => {
  const res = await zendeskAPI<Zendesk.SearchResult>(`/search.json?query=${encodeURIComponent('test type:ticket')}`)
  const object = res.body.results[0]
  expect(object.result_type).toBe('ticket')
  expect(object.subject).toBeTruthy() // only tickets have :subject
})
