import { getUnixTime, parseISO, isBefore } from 'date-fns'

import { FetchMethod } from './client'
import * as Errors from './errors'
import Zendesk from './zendesk'

// helper function for fetching either tickets or users
const fetchAllIncremental =
  (fetchMethod: FetchMethod) =>
  async <T extends { tickets?: Zendesk.Ticket[]; users?: Zendesk.User[]; next_page: string; end_of_stream: boolean }>({
    bodyKey,
    startDate,
    endDate,
    onPage,
  }: {
    bodyKey: 'tickets' | 'users'
    startDate: string
    endDate?: string
    onPage: (objects: Zendesk.Ticket[] | Zendesk.User[]) => Promise<void>
  }) => {
    const startAt = getUnixTime(parseISO(startDate))
    const endAt = endDate ? parseISO(endDate) : null

    let path = `/incremental/${bodyKey}.json?start_time=${startAt}`
    let keepGoing = true

    while (keepGoing) {
      try {
        const res = await fetchMethod<T>(path)
        const eligibleObjects = (res.body[bodyKey] as { updated_at?: string }[]).filter(
          (o) => o.updated_at && (endAt ? isBefore(parseISO(o.updated_at), endAt) : true)
        )
        await onPage(eligibleObjects)

        path = res.body.next_page
        keepGoing = !res.body.end_of_stream && eligibleObjects.length === res.body[bodyKey]?.length
      } catch (e) {
        if (e instanceof Errors.RateLimit) {
          console.log('Rate limited, waiting...')
          // TODO: use the retry-after header
          await new Promise((resolve) => setTimeout(resolve, 1000 * 5))
        } else {
          throw e
        }
      }
    }
  }

export const fetchAllIncrementalTickets =
  (fetchMethod: FetchMethod) =>
  async ({
    startDate,
    endDate,
    onPage,
  }: {
    /** ISO-format string */
    startDate: string
    /** ISO-format string */
    endDate?: string
    /** Invoked after each page of results */
    onPage: (tickets: Zendesk.Ticket[]) => Promise<void>
  }) =>
    fetchAllIncremental(fetchMethod)({ bodyKey: 'tickets', startDate, endDate, onPage })

export const fetchAllIncrementalUsers =
  (fetchMethod: FetchMethod) =>
  async ({
    startDate,
    endDate,
    onPage,
  }: {
    /** ISO-format string */
    startDate: string
    /** ISO-format string */
    endDate?: string
    /** Invoked after each page of results */
    onPage: (users: Zendesk.User[]) => Promise<void>
  }) =>
    fetchAllIncremental(fetchMethod)({ bodyKey: 'users', startDate, endDate, onPage })
