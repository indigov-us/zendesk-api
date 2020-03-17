namespace Zendesk {
  export interface JobStatus {
    id: string
    url: string
    total: number
    progress: number
    status: 'queued' | 'working' | 'failed' | 'completed' | 'killed'
    message: string
    results: {
      id: number
      action?: 'update'
      success?: boolean
      status?: 'Updated'
      index: number
      errors?: string
    }[]
  }

  export interface SearchResult {
    count: number
    next_page: string
    prev_page: string
    results: ((User & { result_type: 'user' }) & (Ticket & { result_type: 'ticket' }))[]
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

  export interface TicketField {
    id?: number
    title?: string
    description?: string
    position?: number
    active?: boolean
  }

  export interface TicketForm {
    id?: number
    name?: string
    position?: number
    active?: boolean
    ticket_field_ids: number[]
  }

  export interface User {
    id?: number
    email?: string
    external_id?: string
    name?: string
    phone?: string
    tags?: string[]
    user_fields?: { [key: string]: any }
  }

  export namespace PaginatedResults {
    interface _ {
      count: number
      next_page: string
      previous_page: string
    }

    export interface Tickets extends _ {
      tickets: Zendesk.Ticket[]
    }

    export interface TicketFields extends _ {
      ticket_fields: Zendesk.TicketField[]
    }

    export interface TicketForms extends _ {
      ticket_forms: Zendesk.TicketForm[]
    }

    export interface Users extends _ {
      users: Zendesk.User[]
    }
  }

  export namespace SingleResults {
    export interface Ticket {
      ticket: Zendesk.Ticket
    }

    export interface TicketField {
      ticket_field: Zendesk.TicketField
    }

    export interface TicketForm {
      ticket_form: Zendesk.TicketForm
    }

    export interface User {
      user: Zendesk.User
    }

    export interface JobStatus {
      job_status: Zendesk.JobStatus
    }
  }

  export namespace IncrementalResults {
    interface _ {
      count: number
      end_of_stream: boolean
      end_time: number
      next_page: string
    }

    export interface Users extends _ {
      users: User[]
    }

    export interface Tickets extends _ {
      tickets: Ticket[]
    }
  }
}

export = Zendesk
