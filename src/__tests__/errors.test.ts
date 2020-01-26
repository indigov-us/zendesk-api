import { zendeskAPI } from './helpers'
import initZendeskAPI, { Errors } from '../'

test('throw authentication error', async () => {
  const badAPI = initZendeskAPI({
    subdomain: 'bad',
    email: 'email',
    token: 'token',
  })

  await expect(badAPI<Zendesk.PaginatedResults.Users>('/users')).rejects.toThrowError(Errors.Authentication)
})

test('throw unprocessable error', async () => {
  const input = {
    bad: 'input',
  }

  await expect(
    zendeskAPI('/users', {
      body: JSON.stringify({ user: input }),
      method: 'POST',
    })
  ).rejects.toThrowError(Errors.Unprocessable)
})
