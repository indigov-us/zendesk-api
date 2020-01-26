import initZendeskAPI, { Errors } from '../'

test('throw authentication error', async () => {
  const api = initZendeskAPI({
    subdomain: 'bad',
    email: 'email',
    token: 'token',
  })

  await expect(api<Zendesk.PaginatedResults.Users>('/users')).rejects.toThrowError(Errors.Authentication)
})
