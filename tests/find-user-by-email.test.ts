import { zendeskAPI } from './_helpers'

test('findUserByEmail', async () => {
  const user = await zendeskAPI.findUserByEmail('ethan@indigov.us')
  expect(user?.email).toBe('ethan@indigov.us')
})
