import SSM from 'aws-sdk/clients/ssm'
import btoa from 'btoa-lite'
import FormData from 'form-data'
import fetch, { RequestInit } from 'node-fetch'

import * as Errors from './errors'

import findUserByEmail from './find-user-by-email'

export interface AuthProps {
  subdomain: string
  email?: string
  token?: string
  base64Token?: string
  getAwsParameterStoreName?: (subdomain: string) => string
  awsRegion?: string
}

export interface ConstructorOpts {
  log?: boolean
  logger?: (message: string) => void
}

export interface Result<BodyType> {
  body: BodyType
  rateLimit: number | null
  rateLimitRemaining: number | null
  retryAfter: number | null
}

export type FetchMethod = (<BodyType>(path: string, init?: RequestInit) => Promise<Result<BodyType>>) & {
  findUserByEmail: ReturnType<typeof findUserByEmail>
  getBase64Token: Promise<string>
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
      // Use custom AWS region if provided
      const ssm = new SSM({ region: args.awsRegion })
      const { Parameter } = await ssm.getParameter({ Name: parameterName }).promise()
      const [token, email] = Parameter?.Value?.split(',') || []
      return btoa(`${email}/token:${token}`)
    }
    // if we are here, there is a problem
    throw new Error('Unable to generate base64 token')
  })()

  const fetchMethod = async <BodyType>(path: string, init?: RequestInit): Promise<Result<BodyType>> => {
    const url = (() => {
      if (path.startsWith('http')) return path
      const pathPrefix = path.startsWith('/sunshine') ? '' : '/v2'
      return `https://${subdomain}.zendesk.com/api${pathPrefix}${path}`
    })()

    const method = init ? init.method || 'GET' : 'GET'

    if (opts?.log) {
      const message = `[${method}] ${url} ${init ? init.body : ''}`
      opts?.logger ? opts.logger(message) : console.log(message)
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
    const [rateLimitHeader, rateLimitRemainingHeader, retryAfterHeader, contentType] = [
      'x-rate-limit',
      'x-rate-limit-remaining',
      'retry-after',
      'content-type',
    ].map((h) => res.headers.get(h))

    let body: string | any = await res.text()
    // will typically be "application/json; charset=UTF-8"
    if (contentType?.includes('application/json')) {
      try {
        body = JSON.parse(body)
      } catch (e) {
        // in practice, zendesk will return invalid JSON even though the header is correct
        // if this happens, we will just leave the string body as-is
        if (opts?.log) {
          opts?.logger ? opts.logger(e) : console.error(e)
        }
      }
    }

    // check for particular errors
    switch (res.status) {
      case 400:
        throw new Errors.BadRequestError(body)
      case 401:
        throw new Errors.Authentication(body)
      case 403:
        throw new Errors.Permission(body)
      case 404:
        throw new Errors.NotFound(body)
      case 422:
        throw new Errors.Unprocessable(body)
      case 429:
        throw new Errors.RateLimit(body)
    }

    // check for any other error statuses
    if (res.status >= 400 && res.status < 600) {
      throw new Error(body)
    }

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

  // add supplementary functions on top of the main fetchMethod
  // TODO: move other methods like fastPaginate to below?
  Object.defineProperties(fetchMethod, {
    findUserByEmail: {
      value: findUserByEmail(fetchMethod as FetchMethod),
    },
    getBase64Token: {
      value: getBase64Token,
    },
  })

  return fetchMethod as FetchMethod
}
