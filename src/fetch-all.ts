import { RequestInit } from 'node-fetch'

import { FetchMethod } from './client'
import Zendesk from './zendesk'

export default (fetchMethod: FetchMethod) =>
  async <ObjectType>({
    bodyKey,
    path,
    init,
    onPage,
  }: {
    /** Which key in the response body to pull the objects from? Probably 'tickets' or 'users' */
    bodyKey: string
    path: string
    init?: RequestInit
    /** This method gets invoked after every page, with the current page of objects */
    onPage: (objects: ObjectType[]) => Promise<void>
  }) => {
    // must include page[size] for zendesk to use cursor pagination
    if (!path.includes('page[size]')) {
      const separator = path.includes('?') ? '&' : '?'
      path += `${separator}page[size]=100`
    }

    let hasMore = true
    while (hasMore) {
      const res = await fetchMethod<Zendesk.CursorResults._>(path, init)
      await onPage((res.body as any)[bodyKey])

      hasMore = res.body.meta.has_more
      path = res.body.links.next
    }
  }
