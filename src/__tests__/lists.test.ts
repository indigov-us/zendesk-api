import initZendeskAPI from '../'

test('get a page of users', async () => {
  const api = initZendeskAPI({
    subdomain: process.env.SUBDOMAIN as string,
    email: process.env.EMAIL as string,
    token: process.env.TOKEN as string,
  })

  const res = await api<Zendesk.PaginatedResults.Users>('/users')

  expect(res.body.users.length).toBeGreaterThan(0)
})

test('get a page of tickets', async () => {
  const api = initZendeskAPI({
    subdomain: process.env.SUBDOMAIN as string,
    email: process.env.EMAIL as string,
    token: process.env.TOKEN as string,
  })

  const res = await api<Zendesk.PaginatedResults.Tickets>('/tickets')

  expect(res.body.tickets.length).toBeGreaterThan(0)
})
