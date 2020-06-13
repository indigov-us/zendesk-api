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
      details?: string
      success?: boolean
      status?: 'Updated' | 'Failed'
      index: number
      error?: string
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
    custom_field_options?: {
      id?: number
      name?: string
      raw_name?: string
      value?: string
      default?: boolean
    }[]
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

  export interface Identity {
    url?: string
    id?: number
    user_id?: number
    type?: 'email' | 'twitter' | 'facebook' | 'google' | 'phone_number' | 'agent_fowarding' | 'sdk'
    value?: string
    verified?: boolean
    primary?: boolean
    created_at?: string
    updated_at?: string
    undeliverable_count?: number
    deliverable_state?: string
  }

  export interface Photo {
    id?: number
    file_name?: string
    content_url?: string
    content_type?: string
    size?: number
  }

  export interface Target {
    url?: string
    id?: number
    created_at?: string
    type?: string
    title?: string
    active?: boolean
    method?: string
    username?: string
    content_type?: string
    password?: string
    target_url?: string
  }

  export interface Trigger {
    url?: string
    id?: number
    title?: string
    active?: boolean
    updated_at?: string
    created_at?: string
    actions?: { field?: string; value?: string }[]
    conditions?: {
      all?: { field?: string; operator?: string; value?: string }[]
      any?: { field?: string; operator?: string; value?: string }[]
    }
    description?: string
    position?: number
    raw_title?: string
  }

  export interface User {
    id?: number
    email?: string
    external_id?: string
    name?: string
    phone?: string
    tags?: string[]
    user_fields?: { [key: string]: any }
    created_at?: string
    updated_at?: string
  }

  export interface UserField {
    url?: string
    id?: number
    type?: string
    key?: string
    title?: string
    description?: string
    raw_title?: string
    raw_description?: string
    position?: number
    active?: boolean
    system?: boolean
    regexp_for_validation?: string
    created_at?: string
    updated_at?: string
    custom_field_options?: {
      id?: number
      name?: string
      position?: number
      raw_name?: string
      url?: string
      value?: string
    }[]
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

    export interface Identities extends _ {
      identities: Zendesk.Identity[]
    }

    export interface Targets extends _ {
      targets: Zendesk.Target[]
    }

    export interface Triggers extends _ {
      triggers: Zendesk.Trigger[]
    }

    export interface Users extends _ {
      users: Zendesk.User[]
    }

    export interface UserFields extends _ {
      user_fields: Zendesk.UserField[]
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

    export interface Identity {
      identity: Zendesk.Identity
    }

    export interface Target {
      target: Zendesk.Target
    }

    export interface Trigger {
      trigger: Zendesk.Trigger
    }

    export interface User {
      user: Zendesk.User
    }

    export interface UserField {
      user_field: Zendesk.UserField
    }

    export interface Comments {
      comments: Zendesk.Comment[]
    }

    export interface JobStatus {
      job_status: Zendesk.JobStatus
    }

    export interface Attachment {
      attachment: Attachment
    }

    export interface Upload {
      upload: {
        token: string
        attachment: Attachment
      }
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
