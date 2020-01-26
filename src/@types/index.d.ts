declare namespace Zendesk {
  interface User {
    id?: number
    email?: string
    external_id?: string
    name: string
    tags?: string[]
    user_fields?: { [key: string]: any }
  }

  interface Ticket {
    id?: number
    url?: string
    external_id?: string
    created_at?: string
    updated_at?: string
    type?: string
    subject?: string
    raw_subject?: string
    description?: string
    priority?: string
    status?: 'new' | 'open' | 'pending' | 'hold' | 'solved' | 'closed'
    requester_id?: number
    submitter_id?: number
    assignee_id?: number
    organization_id?: number
    group_id?: number
    is_public?: boolean
    tags?: string[]
    custom_fields?: { id: number; value: any }[]
    fields?: { id: number; value: any }[]
    ticket_form_id?: number
  }

  namespace PaginatedResults {
    interface _ {
      count: number
      next_page: string
      previous_page: string
    }

    interface Users extends _ {
      users: Zendesk.User[]
    }

    interface Tickets extends _ {
      tickets: Zendesk.Ticket[]
    }
  }

  namespace SingleResults {
    interface User {
      user: Zendesk.User
    }

    interface Ticket {
      ticket: Zendesk.Ticket
    }
  }

  // TODO: searches, jobs
}
