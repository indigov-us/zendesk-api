import { zendeskAPI } from './_helpers'
import { Zendesk } from '../src'

test('search users', async () => {
  const res = await zendeskAPI<Zendesk.SearchResult>(`/search.json?query=${encodeURIComponent('test type:user')}`)
  const object = res.body.results[0]
  if (object.result_type === 'user') {
    expect(object.name).toBeTruthy() // only users have :name
  }
}, 10000)

test('search tickets', async () => {
  const res = await zendeskAPI<Zendesk.SearchResult>(`/search.json?query=${encodeURIComponent('test type:ticket')}`)
  const object = res.body.results[0]
  if (object.result_type === 'ticket') {
    expect(object.subject).toBeTruthy() // only tickets have :subject
  }
}, 10000)
