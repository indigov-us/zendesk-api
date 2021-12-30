import { RequestInit } from 'node-fetch'

import { FetchMethod } from './client'
import Zendesk from './zendesk'

export default (fetchMethod: FetchMethod) =>
  async <ObjectType>(
    /** Which key in the response body to pull the objects from? Probably 'tickets' or 'users' */
    bodyKey: string,
    path: string,
    init?: RequestInit
  ) => {
    // must include page[size] for zendesk to use cursor pagination
    if (!path.includes('page[size]')) {
      const separator = path.includes('?') ? '&' : '?'
      path += `${separator}page[size]=100`
    }

    const objects: ObjectType[] = []
    let hasMore = true

    while (hasMore) {
      const res = await fetchMethod<Zendesk.CursorResults._>(path, init)
      for (const object of (res.body as any)[bodyKey]) objects.push(object)

      hasMore = res.body.meta.has_more
      path = res.body.links.next
    }

    return objects
  }
