import initZendeskAPI, { Errors } from '../'

test('get a page of users', async () => {
  const api = initZendeskAPI({
    subdomain: process.env.SUBDOMAIN as string,
    email: process.env.EMAIL as string,
    token: process.env.TOKEN as string,
  })

  const res = await api<Zendesk.PaginatedResults.Users>('/users')

  expect(res.body.users.length).toBeGreaterThan(0)
})

test('throw authentication errors', async () => {
  const api = initZendeskAPI({
    subdomain: 'bad',
    email: 'email',
    token: 'token',
  })

  await expect(api<Zendesk.PaginatedResults.Users>('/users')).rejects.toThrowError(Errors.Authentication)
})
