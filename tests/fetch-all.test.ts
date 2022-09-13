import { Zendesk } from '../src'
import { zendeskAPI } from './_helpers'

test('fetchAll', async () => {
  await zendeskAPI.fetchAll<Zendesk.User>({
    bodyKey: 'users',
    path: '/users?role=agent',
    onPage: async (users) => {
      expect(users.length).toBeGreaterThanOrEqual(1)
    },
  })
}, 10000)
