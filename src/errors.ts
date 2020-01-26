// this generic error class will dynamically set all of the body properties on the Error instance itself
// use it by extending and strongly-typing the expected properties on the extended class
class DynamicPropsError extends Error {
  constructor(body: any) {
    super()
    for (const key of Object.keys(body)) {
      ;(this as any)[key] = body[key]
    }
  }
}

export class Authentication extends DynamicPropsError {
  error: string
}

export class Client extends DynamicPropsError {
  error: string
  details: {
    value: { type: string; description: string }[]
  }
  description: string
}

export class Permission extends DynamicPropsError {
  error: string
}

export class RateLimit extends DynamicPropsError {
  error: string
}
