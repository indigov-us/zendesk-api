# Zendesk API

The goal of this repo is to be a super-simple, strongly-typed interface to the Zendesk API.

## Usage

```
import createClient, { Errors, Zendesk, jobCompletion } from '@indigov/zendesk-api'

const api = createClient({
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
  // rate-limit errors can be acted up on easily
  if (e instanceof Errors.RateLimit) {
    await new Promise(resolve => setTimeout(resolve, 1000 * 60))
    // now resume where you left off
  }
}

// you can utilize a helper function to wait for jobs to complete
const jobRes = await jobCompletion({
  api,
  onProgress: async (progress: number) => {
    // do something with the progress number
  },
})('/users/create_many.json', {
  body: JSON.stringify({users: [{name: 'A user', email: 'email@email.com'}]}),
  method: 'POST',
})
```
