namespace Zendesk {
  export interface JobStatus {
    id?: string
    url?: string
    total?: number
    progress?: number
    status?: 'queued' | 'working' | 'failed' | 'completed' | 'killed'
    message?: string
    results?: {
      id?: number
      action?: 'update'
      success?: boolean
      status?: 'Updated'
      index?: number
      errors?: string
    }[]
  }

  export interface SearchResult {
    count?: number
    next_page?: string
    prev_page?: string
    results?: ((User & { result_type: 'user' }) & (Ticket & { result_type: 'ticket' }))[]
  }

  export interface Ticket {
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

  export interface User {
    id?: number
    email?: string
    external_id?: string
    name?: string
    tags?: string[]
    user_fields?: { [key: string]: any }
  }

  export namespace PaginatedResults {
    interface _ {
      count?: number
      next_page?: string
      previous_page?: string
    }

    export interface Tickets extends _ {
      tickets?: Zendesk.Ticket[]
    }

    export interface Users extends _ {
      users?: Zendesk.User[]
    }
  }

  export namespace SingleResults {
    export interface Ticket {
      ticket?: Zendesk.Ticket
    }

    export interface User {
      user?: Zendesk.User
    }

    export interface JobStatus {
      job_status?: Zendesk.JobStatus
    }
  }
}

export = Zendesk
