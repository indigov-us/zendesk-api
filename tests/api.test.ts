import { zendeskAPI } from './_helpers'
import { Zendesk } from '../src'

test('accepts full urls as a path', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.Tickets>(
    `https://${process.env.SUBDOMAIN}.zendesk.com/api/v2/tickets.json`
  )
  expect(res.body.tickets).toBeTruthy()
})
