import fastPaginate from '../src/fast-paginate'
import { zendeskAPI } from './_helpers'
import Zendesk from '../src/zendesk'

it('fetches pages of resources concurrently', async () => {
  const tickets: Zendesk.Ticket[] = []

  await fastPaginate<Zendesk.PaginatedResults.Tickets>({
    api: zendeskAPI,
    concurrency: 10,
    retryRateLimitErrors: true,
    onPage: async (ticketsRes) => {
      for (const ticket of ticketsRes.body.tickets) tickets.push(ticket)
      return tickets.length <= 1000
    },
  })('/tickets')

  expect(tickets.length).toBeGreaterThanOrEqual(1000)
}, 600000)
