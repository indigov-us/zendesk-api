import btoa from 'btoa-lite'
import fetch from 'isomorphic-unfetch'

export default ({ subdomain, email, token }: { subdomain: string; email: string; token: string }) => {
  const authHeaderValue = `Basic ${btoa(`${email}/token:${token}`)}`

  return async (path: string, init?: fetch.IsomorphicRequest) => {
    const url = `https://${subdomain}.zendesk.com/api/v2${path}`
    const method = init ? init.method || 'GET' : 'GET'

    console.log(`[${method}] ${url} ${init ? init.body : ''}`)

    const res = await fetch(url, {
      headers: {
        Authorization: authHeaderValue,
        'Content-Type': 'application/json',
      },
      ...init,
    })

    // localize the response headers for processing
    const [contentTypeHeader, rateLimitHeader, rateLimitRemainingHeader, retryAfterHeader] = ['content-type', 'x-rate-limit', 'x-rate-limit-remaining', 'retry-after'].map(h => res.headers.get(h))

    // response body will almost always be JSON unless zendesk has downtime
    const body = await (contentTypeHeader?.includes('application/json') ? res.json() : res.text())

    // rate limit headers can be helpful in optimizing usage
    const rateLimit = rateLimitHeader ? parseInt(rateLimitHeader, 10) : null
    const rateLimitRemaining = rateLimitRemainingHeader ? parseInt(rateLimitRemainingHeader, 10) : null

    // sometimes zendesk will return a 'Retry-After' header, which is in seconds
    const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : null

    return {
      body,
      rateLimit,
      rateLimitRemaining,
      retryAfter,
    }
  }
}
