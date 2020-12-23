import { SSM } from 'aws-sdk'
import btoa from 'btoa-lite'
import FormData from 'form-data'
import fetch, { RequestInit } from 'node-fetch'

import * as Errors from './errors'

export interface AuthProps {
  subdomain: string
  email?: string
  token?: string
  base64Token?: string
  getAwsParameterStoreName?: (subdomain: string) => string
}

export interface ConstructorOpts {
  log?: boolean
}

export interface Result<BodyType> {
  body: BodyType
  rateLimit: number | null
  rateLimitRemaining: number | null
  retryAfter: number | null
}

export type FetchMethod = (<BodyType>(path: string, init?: RequestInit) => Promise<Result<BodyType>>) & {
  getBase64Token?: Promise<string>
}

export const createClient = (args: AuthProps, opts?: ConstructorOpts) => {
  const { subdomain } = args

  // auth needs to be a base64 value
  // it can be supplied directly, or it can be generated from email+token,
  // or email+token can be retrieved from parameter store
  const getBase64Token = (async () => {
    // if creds were explicitly provided, use them
    if (args.base64Token) return args.base64Token
    // if email and token were provided, use them
    else if (args.email && args.token) return btoa(`${args.email}/token:${args.token}`)
    // if a function to fetch email+token from AWS was provided, try that
    else if (args.getAwsParameterStoreName) {
      const parameterName = args.getAwsParameterStoreName(subdomain)
      const ssm = new SSM()
      const { Parameter } = await ssm.getParameter({ Name: parameterName }).promise()
      const [token, email] = Parameter?.Value?.split(',') || []
      return btoa(`${email}/token:${token}`)
    }
    // if we are here, there is a problem
    throw new Error('Unable to generate base64 token')
  })()

  const fetchMethod: FetchMethod = async <BodyType>(path: string, init?: RequestInit): Promise<Result<BodyType>> => {
    const url = (() => {
      if (path.startsWith('http')) return path
      const pathPrefix = path.startsWith('/sunshine') ? '' : '/v2'
      return `https://${subdomain}.zendesk.com/api${pathPrefix}${path}`
    })()

    const method = init ? init.method || 'GET' : 'GET'

    if (opts?.log) {
      console.log(`[${method}] ${url} ${init ? init.body : ''}`)
    }

    const res = await fetch(url, {
      ...init,
      headers: {
        // all requests should have Authorization header
        Authorization: `Basic ${await getBase64Token}`,
        // all requests return json
        Accept: 'application/json',
        // only add JSON content-type header if we are not uploading a file
        // because node-fetch will calculate multipart boundary automatically
        ...(!(init?.body instanceof FormData) && {
          'Content-Type': 'application/json',
        }),
        // allow rest of the headers to override
        ...init?.headers,
      },
    })

    // localize the response headers for processing
    const [rateLimitHeader, rateLimitRemainingHeader, retryAfterHeader] = [
      'x-rate-limit',
      'x-rate-limit-remaining',
      'retry-after',
    ].map((h) => res.headers.get(h))

    // if there is an error, res.text will not be parseable JSON
    const rawBody = await res.text()

    // check for errors
    switch (res.status) {
      case 401:
        throw new Errors.Authentication(rawBody)
      case 403:
        throw new Errors.Permission(rawBody)
      case 404:
        throw new Errors.NotFound(rawBody)
      case 422:
        throw new Errors.Unprocessable(rawBody)
      case 429:
        throw new Errors.RateLimit(rawBody)
    }

    // rate limit headers can be helpful in optimizing usage
    const rateLimit = rateLimitHeader ? parseInt(rateLimitHeader, 10) : null
    const rateLimitRemaining = rateLimitRemainingHeader ? parseInt(rateLimitRemainingHeader, 10) : null

    // sometimes zendesk will return a 'Retry-After' header, which is in seconds
    const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : null

    return {
      body: JSON.parse(rawBody),
      rateLimit,
      rateLimitRemaining,
      retryAfter,
    }
  }

  Object.defineProperties(fetchMethod, {
    getBase64Token: {
      value: getBase64Token,
    },
  })

  return fetchMethod
}
