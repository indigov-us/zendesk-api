# Zendesk API

The goal of this repo is to be a super-simple, strongly-typed interface to the Zendesk API.

## Usage

```
import initZendeskAPI, { Errors } from '@indigov/zendesk-api'

const zendeskAPI = initZendeskAPI({
  subdomain: 'whatever',
  email: 'what@ever.com',
  token: 'token',
})

try {
  // tell the API what to expect in the result body
  const result = await api<Zendesk.PaginatedResults.Users>('/users')

  // now you can access the body as well as several useful attributes
  // result.body == {count: number, users: Zendesk.User[], next_page: string, previous_page: string}
  // result.rateLimit == number, how many requests have been recently made
  // result.rateLimitRemaining == number, how many requests can be made in the near future
  // result.retryAfter == number | null, how many seconds to wait before retrying
} catch (e) {
  // errors are all strongly-typed as well, and the result body will appear as properties of the error
  if (e instanceOf Errors.Authentication) {
    // e.error = "Couldn't authenticate you"
  }
}
```
