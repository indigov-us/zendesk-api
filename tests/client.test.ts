import btoa from 'btoa-lite'

import { zendeskAPI } from './_helpers'
import createClient, { Zendesk } from '../src'

test('accepts full urls as a path', async () => {
  const res = await zendeskAPI<Zendesk.PaginatedResults.Tickets>(
    `https://${process.env.SUBDOMAIN}.zendesk.com/api/v2/tickets.json`
  )
  expect(res.body.tickets).toBeTruthy()
})

test('auths with base64 tokens', async () => {
  const client = createClient({
    subdomain: process.env.SUBDOMAIN as string,
    base64Token: btoa(`${process.env.EMAIL}/token:${process.env.TOKEN}`),
  })
  const res = await client<Zendesk.PaginatedResults.Tickets>('/tickets.json')
  expect(res.body.tickets.length).toBeGreaterThanOrEqual(1)
})
