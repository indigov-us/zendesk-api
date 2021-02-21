# Zendesk API

The goal of this repo is to be a super-simple, strongly-typed interface to the Zendesk API.

## Usage

```
import createClient, { Errors, Zendesk, jobCompletion, retry } from '@indigov/zendesk-api'

const api = createClient({
  subdomain: 'whatever',
  email: 'what@ever.com',
  token: 'token',
})

-or-

const api = createClient({
  subdomain: 'whatever',
  base64Token: btoa('what@ever.com/email:token'),
})

-or-

// if using AWS Parameter Store, make sure AWS creds + region are available
const api = createClient({
  subdomain: 'whatever',
  getAwsParameterStoreName: (subdomain) => `/tokens/${subdomain}`
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

// you can fetch things from sunshine
const sunshineRes = await api<Zendesk.PaginatedResults.Sunshine.ObjectTypes>('/sunshine/objects/types')

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

// retry wrapper method (for rate-limit errors):
// simply wrap the method in "retry" and move the generic outside to it
//
// before
const users = await api<Zendesk.PaginatedResults.Users>('/users')
// after
const users = await retry<Zendesk.PaginatedResults.Users>(api('/users'))

// you can also invoke the same logic in other helper methods:
await fastPaginate({ retryRateLimitErrors: true })
await createOrUpdateManyUsers({ retryRateLimitErrors: true })
await jobCompletion({ retryRateLimitErrors: true })('/thejob')

// there are helper methods available directly on the function itself
const user = await api.findUserByEmail('user@domain.com')
```
