import FormData from 'form-data'
import { createReadStream, readFileSync } from 'fs'

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
    base64Token: Buffer.from(`${process.env.EMAIL}/token:${process.env.TOKEN}`).toString('base64'),
  })
  const res = await client<Zendesk.PaginatedResults.Tickets>('/tickets.json')
  expect(res.body.tickets.length).toBeGreaterThanOrEqual(1)
})

test('auths with AWS parameter store', async () => {
  const client = createClient({
    subdomain: process.env.SUBDOMAIN as string,
    getAwsParameterStoreName: (subdomain) => `/ZendeskAPITokens/dev/${subdomain}`,
  })
  const res = await client<Zendesk.PaginatedResults.Tickets>('/tickets.json')
  expect(res.body.tickets.length).toBeGreaterThanOrEqual(1)
}, 10000)

test('returns parseable JSON when uploading form data', async () => {
  const body = new FormData()
  body.append('uploaded_data', createReadStream(__dirname + '/app.zip'))
  const res = await zendeskAPI<Zendesk.SingleResults.Id>('/apps/uploads.json', {
    method: 'POST',
    body,
  })
  expect(res.body.id).toBeTruthy()
}, 10000)

test('returns parseable JSON when uploading binary data', async () => {
  const res = await zendeskAPI<Zendesk.SingleResults.Upload>('/uploads.json?filename=test.zip', {
    method: 'POST',
    body: readFileSync(__dirname + '/app.zip'),
    headers: {
      'Content-Type': 'application/binary',
    },
  })
  expect(res.body.upload.token).toBeTruthy()
}, 10000)

test('getCreds', async () => {
  const { email, token, base64Token } = await zendeskAPI.getCreds()
  expect(email).toBeTruthy()
  expect(token).toBeTruthy()
  expect(base64Token).toBeTruthy()
})
