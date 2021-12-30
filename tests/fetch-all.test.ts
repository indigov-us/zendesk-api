import { Zendesk } from '../src'
import { zendeskAPI } from './_helpers'

test('fetchAll', async () => {
  const users = await zendeskAPI.fetchAll<Zendesk.User>('users', '/users?role=agent&page[size]=1')
  expect(users.length).toBe(1)
})
