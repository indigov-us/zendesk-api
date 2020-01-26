import { zendeskAPI } from './_helpers'
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
  await expect(
    zendeskAPI('/users', {
      body: JSON.stringify({
        user: {
          bad: 'input',
        },
      }),
      method: 'POST',
    })
  ).rejects.toThrowError(Errors.Unprocessable)
})
