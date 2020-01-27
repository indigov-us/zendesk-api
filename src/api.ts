import btoa from 'btoa-lite'
import fetch from 'isomorphic-unfetch'

import * as Errors from './errors'

export default (
  { subdomain, email, token }: { subdomain: string; email: string; token: string },
  opts?: { log?: boolean }
) => {
  const authHeaderValue = `Basic ${btoa(`${email}/token:${token}`)}`

  return async <BodyType>(path: string, init?: RequestInit) => {
    const url = `https://${subdomain}.zendesk.com/api/v2${path}`
    const method = init ? init.method || 'GET' : 'GET'

    if (opts?.log) {
      console.log(`[${method}] ${url} ${init ? init.body : ''}`)
    }

    const res = await fetch(url, {
      headers: {
        Authorization: authHeaderValue,
        'Content-Type': 'application/json',
      },
      ...init,
    })

    // localize the response headers for processing
    const [contentTypeHeader, rateLimitHeader, rateLimitRemainingHeader, retryAfterHeader] = [
      'content-type',
      'x-rate-limit',
      'x-rate-limit-remaining',
      'retry-after',
    ].map(h => res.headers.get(h))

    // response body will almost always be JSON unless zendesk has downtime
    const body = await (contentTypeHeader?.includes('application/json') ? res.json() : res.text())

    // check for errors
    switch (res.status) {
      case 401:
        throw new Errors.Authentication(body)
      case 403:
        throw new Errors.Permission(body)
      case 422:
        throw new Errors.Unprocessable(body)
      case 429:
        throw new Errors.RateLimit(body)
    }

    // rate limit headers can be helpful in optimizing usage
    const rateLimit = rateLimitHeader ? parseInt(rateLimitHeader, 10) : null
    const rateLimitRemaining = rateLimitRemainingHeader ? parseInt(rateLimitRemainingHeader, 10) : null

    // sometimes zendesk will return a 'Retry-After' header, which is in seconds
    const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : null

    return {
      body: body as BodyType,
      rateLimit,
      rateLimitRemaining,
      retryAfter,
    }
  }
}
