import createOrUpdateManyUsers from '../src/create-or-update-many-users'
import { zendeskAPI } from './_helpers'

it('creates or updates many users without names', async () => {
  const res = await createOrUpdateManyUsers({ api: zendeskAPI })({
    users: [{ email: 'testingcreateorupdatemany4@indigov.us' }],
  })
  expect(res).toBeTruthy()
}, 60000)
