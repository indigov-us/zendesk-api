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

  export interface Metadata {
    system?: object
    custom?: object
  }

  export interface Via {
    channel?: string
    source?: {
      to?: object
      from?: object
      rel?: string
    }
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
    ticket_field_ids?: number[]
  }

  export interface TicketAudit {
    id?: number
    ticket_id?: number
    created_at?: string
    author_id?: number
    metadata?: Metadata
    via?: Via
    events?: object[]
  }

  export interface Comment {
    id?: number
    type?: 'Comment' | 'VoiceComment'
    author_id?: number
    body?: string
    html_body?: string
    plain_body?: string
    public?: boolean
    attachments?: Attachment[]
    audit_id?: number
    via?: Via
    created_at?: string
    metadata?: Metadata
  }

  export interface Attachment {
    id?: number
    file_name?: string
    content_url?: string
    content_type?: string
    size?: number
    thumbnails?: Photo[]
  }

  export interface Photo {
    id?: number
    file_name?: string
    content_url?: string
    content_type?: string
    size?: number
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

  export namespace Sunshine {
    export interface ObjectType<Schema> {
      key?: string
      schema?: Schema
      end_users_can_read?: boolean
      created_at?: string
      updated_at?: string
    }

    export interface ObjectRecord<Attributes> {
      type?: string
      id?: string
      external_id?: string
      attributes?: Attributes
      created_at?: string
      updated_at?: string
    }

    export interface RelationshipType {
      key?: string
      source?: string
      target?: string | string[]
      end_users_can_read?: boolean
      created_at?: string
      updated_at?: string
    }

    export interface RelationshipRecord {
      id?: string
      relationship_type?: string
      source?: string
      target?: string | string[]
      created_at?: string
      updated_at?: string
    }
  }

  export namespace PaginatedResults {
    interface _ {
      count: number
      next_page: string
      previous_page: string
    }

    interface Cursor {
      after_url: string
      before_url: string
      after_cursor: string
      before_cursor: string
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

    export interface TicketAudits extends Cursor {
      audits: Zendesk.TicketAudit[]
    }

    export interface Users extends _ {
      users: Zendesk.User[]
    }

    export namespace Sunshine {
      export interface ObjectTypes {
        data: Zendesk.Sunshine.ObjectType<any>[] // TODO: accept an array of schemas?
      }

      export interface ObjectRecords<Attributes> {
        data: Zendesk.Sunshine.ObjectRecord<Attributes>[]
      }

      export interface RelationshipTypes {
        data: Zendesk.Sunshine.RelationshipType[]
      }

      export interface RelationshipRecords {
        data: Zendesk.Sunshine.RelationshipRecord[]
      }
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

    export interface TicketAudit {
      audit: Zendesk.TicketAudit
    }

    export interface User {
      user: Zendesk.User
    }

    export interface Comments {
      comments: Zendesk.Comment[]
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
