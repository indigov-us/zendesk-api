import { zendeskAPI } from './_helpers'
import initZendeskAPI, { Errors, Zendesk } from '../src'

test('throw authentication error', async () => {
  const badAPI = initZendeskAPI({
    subdomain: 'indigovdev',
    email: 'email',
    token: 'token',
  })

  await expect(badAPI<Zendesk.PaginatedResults.Users>('/users')).rejects.toThrowError(Errors.Authentication)
})

test('throw not found error', async () => {
  await expect(zendeskAPI('/users/3')).rejects.toThrowError(Errors.NotFound)
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

test('throw bad request error', async () => {
  await expect(
    zendeskAPI('/ticket_fields', {
      method: 'POST',
      body: JSON.stringify({
        ticket_field: {
          title: 'blah',
          type: 'tagger',
          custom_field_options: [{ name: 'who', value: 'hey', default: 'TRUE' }],
        },
      }),
    })
  ).rejects.toThrowError(Errors.BadRequestError)
})
