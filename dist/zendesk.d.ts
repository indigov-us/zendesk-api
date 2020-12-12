declare namespace Zendesk {
    interface JobStatus {
        id: string;
        url: string;
        total: number;
        progress: number;
        status: 'queued' | 'working' | 'failed' | 'completed' | 'killed';
        message: string;
        results: {
            id: number;
            action?: 'update';
            details?: string;
            success?: boolean;
            status?: 'Updated' | 'Failed';
            index: number;
            error?: string;
            errors?: string;
        }[];
    }
    interface SearchResult {
        count: number;
        next_page: string;
        prev_page: string;
        results: ((User & {
            result_type: 'user';
        }) & (Ticket & {
            result_type: 'ticket';
        }))[];
    }
    interface Ticket {
        id?: number;
        url?: string;
        external_id?: string;
        created_at?: string;
        updated_at?: string;
        type?: string;
        subject?: string;
        raw_subject?: string;
        description?: string;
        priority?: string;
        status?: 'new' | 'open' | 'pending' | 'hold' | 'solved' | 'closed';
        requester_id?: number;
        submitter_id?: number;
        assignee_id?: number;
        organization_id?: number;
        group_id?: number;
        is_public?: boolean;
        tags?: string[];
        custom_fields?: {
            id: number;
            value: any;
        }[];
        fields?: {
            id: number;
            value: any;
        }[];
        ticket_form_id?: number;
    }
    interface Metadata {
        system?: object;
        custom?: object;
    }
    interface Via {
        channel?: string;
        source?: {
            to?: object;
            from?: object;
            rel?: string;
        };
    }
    interface TicketField {
        id?: number;
        title?: string;
        description?: string;
        position?: number;
        active?: boolean;
        custom_field_options?: {
            id?: number;
            name?: string;
            raw_name?: string;
            value?: string;
            default?: boolean;
        }[];
    }
    interface TicketForm {
        id?: number;
        name?: string;
        position?: number;
        active?: boolean;
        ticket_field_ids?: number[];
    }
    interface TicketAudit {
        id?: number;
        ticket_id?: number;
        created_at?: string;
        author_id?: number;
        metadata?: Metadata;
        via?: Via;
        events?: object[];
    }
    interface Comment {
        id?: number;
        type?: 'Comment' | 'VoiceComment';
        author_id?: number;
        body?: string;
        html_body?: string;
        plain_body?: string;
        public?: boolean;
        attachments?: Attachment[];
        audit_id?: number;
        via?: Via;
        created_at?: string;
        metadata?: Metadata;
    }
    interface Attachment {
        id?: number;
        file_name?: string;
        content_url?: string;
        content_type?: string;
        size?: number;
        thumbnails?: Photo[];
    }
    interface Identity {
        url?: string;
        id?: number;
        user_id?: number;
        type?: 'email' | 'twitter' | 'facebook' | 'google' | 'phone_number' | 'agent_fowarding' | 'sdk';
        value?: string;
        verified?: boolean;
        primary?: boolean;
        created_at?: string;
        updated_at?: string;
        undeliverable_count?: number;
        deliverable_state?: string;
    }
    interface Photo {
        id?: number;
        file_name?: string;
        content_url?: string;
        content_type?: string;
        size?: number;
    }
    interface Target {
        url?: string;
        id?: number;
        created_at?: string;
        type?: string;
        title?: string;
        active?: boolean;
        method?: string;
        username?: string;
        content_type?: string;
        password?: string;
        target_url?: string;
    }
    interface Trigger {
        url?: string;
        id?: number;
        title?: string;
        active?: boolean;
        updated_at?: string;
        created_at?: string;
        actions?: {
            field?: string;
            value?: string;
        }[];
        conditions?: {
            all?: {
                field?: string;
                operator?: string;
                value?: string;
            }[];
            any?: {
                field?: string;
                operator?: string;
                value?: string;
            }[];
        };
        description?: string;
        position?: number;
        raw_title?: string;
    }
    interface Action {
        field?: string;
        value?: string | boolean | string[];
    }
    interface Macro {
        id?: number;
        actions?: Action[];
        title?: string;
        description?: string;
    }
    interface Group {
        name?: string;
    }
    interface User {
        id?: number;
        email?: string;
        external_id?: string;
        name?: string;
        phone?: string;
        tags?: string[];
        user_fields?: {
            [key: string]: any;
        };
        created_at?: string;
        updated_at?: string;
    }
    interface UserField {
        url?: string;
        id?: number;
        type?: string;
        key?: string;
        title?: string;
        description?: string;
        raw_title?: string;
        raw_description?: string;
        position?: number;
        active?: boolean;
        system?: boolean;
        regexp_for_validation?: string;
        created_at?: string;
        updated_at?: string;
        custom_field_options?: {
            id?: number;
            name?: string;
            position?: number;
            raw_name?: string;
            url?: string;
            value?: string;
        }[];
    }
    interface App {
        id?: number;
        name?: string;
        state?: string;
        version?: string;
        framework_version?: string;
        parameters: {
            id?: number;
            app_id?: number;
            name?: string;
            kind?: string;
            required?: boolean;
            position?: number;
            created_at?: string;
            updated_at?: string;
            default_value?: string | number | boolean | null;
            secure?: boolean;
        }[];
        plans: {
            id?: number;
            app_id?: number;
            plan_type?: string;
            stripe_plan_id?: number | null;
            created_at?: string;
            updated_at?: string;
            amount?: number;
            deleted_at?: string;
            active?: boolean;
            hidden?: boolean;
            cost_type?: string;
            cost_id?: number;
            service_identifier?: string;
            trial_days?: number;
            name?: string;
            description?: string;
            vat_reversible?: boolean;
        }[];
        rating: {
            total_count?: number;
            average?: number;
            count: {
                '1': number;
                '2': number;
                '3': number;
                '4': number;
                '5': number;
            };
        };
        single_install?: boolean;
        default_locale?: string;
        feature_color?: string;
        google_analytics_code?: string;
        remote_installation_url?: string;
        products?: string[];
        categories: {
            id: number;
            name: string;
        }[];
        collections: [];
        stripe_publishable_key?: string;
        created_at?: string;
        updated_at?: string;
        terms_conditions_url?: string;
        app_organization: {
            country_code?: string;
            stripe_account_id?: string;
        };
        locations?: number[];
        owner_id?: number;
        author_name?: string;
        author_email?: string;
        author_url?: string;
        short_description?: string;
        long_description?: string;
        installation_instructions?: string;
        raw_long_description?: string;
        raw_installation_instructions?: string;
        visibility?: string;
        promoted?: boolean;
        featured?: boolean;
        paid?: boolean;
        deprecated?: boolean;
        obsolete?: boolean;
        installable?: boolean;
        marketing_only?: boolean;
        small_icon?: string;
        large_icon?: string;
        screenshots?: string[];
    }
    interface AppInstallation {
        id?: number;
        app_id?: number;
        product?: string;
        settings: {
            name?: string;
            title?: string;
        };
        settings_objects: {
            name?: string;
            value?: string;
        }[];
        enabled?: boolean;
        updated?: string;
        updated_at?: string;
        created_at?: string;
        role_restrictions?: string;
        recurring_payment?: boolean;
        collapsible?: boolean;
        plan_information: {
            name?: string;
        };
        paid?: boolean;
        has_unpaid_subscription?: boolean;
        has_incomplete_subscription?: boolean;
        stripe_publishable_key?: string;
        stripe_account?: string;
        group_restrictions?: string[];
    }
    interface AppRequirement {
        account_id?: number;
        created_at?: string;
        identifier?: string;
        requirement_id?: number;
        requirement_type?: string;
        updated_at?: string;
    }
    interface AppJobStatus {
        app_id?: number;
        app_url?: string;
        id?: string;
        message?: string;
        progress?: number;
        retry_in?: number;
        status?: 'queued' | 'working' | 'failed' | 'completed' | 'killed';
        total?: number;
        url?: string;
    }
    namespace Sunshine {
        interface ObjectType<Schema> {
            key?: string;
            schema?: Schema;
            end_users_can_read?: boolean;
            created_at?: string;
            updated_at?: string;
        }
        interface ObjectRecord<Attributes> {
            type?: string;
            id?: string;
            external_id?: string;
            attributes?: Attributes;
            created_at?: string;
            updated_at?: string;
        }
        interface RelationshipType {
            key?: string;
            source?: string;
            target?: string | string[];
            end_users_can_read?: boolean;
            created_at?: string;
            updated_at?: string;
        }
        interface RelationshipRecord {
            id?: string;
            relationship_type?: string;
            source?: string;
            target?: string | string[];
            created_at?: string;
            updated_at?: string;
        }
    }
    namespace PaginatedResults {
        interface _ {
            count: number;
            next_page: string;
            previous_page: string;
        }
        interface Cursor {
            after_url: string;
            before_url: string;
            after_cursor: string;
            before_cursor: string;
        }
        export interface Tickets extends _ {
            tickets: Zendesk.Ticket[];
        }
        export interface TicketFields extends _ {
            ticket_fields: Zendesk.TicketField[];
        }
        export interface TicketForms extends _ {
            ticket_forms: Zendesk.TicketForm[];
        }
        export interface TicketAudits extends Cursor {
            audits: Zendesk.TicketAudit[];
        }
        export interface Identities extends _ {
            identities: Zendesk.Identity[];
        }
        export interface Targets extends _ {
            targets: Zendesk.Target[];
        }
        export interface Triggers extends _ {
            triggers: Zendesk.Trigger[];
        }
        export interface Users extends _ {
            users: Zendesk.User[];
        }
        export interface UserFields extends _ {
            user_fields: Zendesk.UserField[];
        }
        export interface Macros extends _ {
            macros: Zendesk.Macro[];
        }
        export interface Groups extends _ {
            groups: Zendesk.Group[];
        }
        export namespace Sunshine {
            interface ObjectTypes {
                data: Zendesk.Sunshine.ObjectType<any>[];
            }
            interface ObjectRecords<Attributes> {
                data: Zendesk.Sunshine.ObjectRecord<Attributes>[];
            }
            interface RelationshipTypes {
                data: Zendesk.Sunshine.RelationshipType[];
            }
            interface RelationshipRecords {
                data: Zendesk.Sunshine.RelationshipRecord[];
            }
        }
        export {};
    }
    namespace SingleResults {
        interface Ticket {
            ticket: Zendesk.Ticket;
        }
        interface TicketField {
            ticket_field: Zendesk.TicketField;
        }
        interface TicketForm {
            ticket_form: Zendesk.TicketForm;
        }
        interface TicketAudit {
            audit: Zendesk.TicketAudit;
        }
        interface Identity {
            identity: Zendesk.Identity;
        }
        interface Target {
            target: Zendesk.Target;
        }
        interface Trigger {
            trigger: Zendesk.Trigger;
        }
        interface User {
            user: Zendesk.User;
        }
        interface UserField {
            user_field: Zendesk.UserField;
        }
        interface Comments {
            comments: Zendesk.Comment[];
        }
        interface JobStatus {
            job_status: Zendesk.JobStatus;
        }
        interface JobId {
            job_id: string;
        }
        interface Id {
            id: number;
        }
        interface Attachment {
            attachment: Attachment;
        }
        interface Upload {
            upload: {
                token: string;
                attachment: Attachment;
            };
        }
        interface Apps {
            apps: Zendesk.App[];
        }
        interface AppInstallations {
            installations: Zendesk.AppInstallation[];
        }
        interface AppRequirements {
            requirements: Zendesk.AppRequirement[];
        }
    }
    namespace IncrementalResults {
        interface _ {
            count: number;
            end_of_stream: boolean;
            end_time: number;
            next_page: string;
        }
        export interface Users extends _ {
            users: User[];
        }
        export interface Tickets extends _ {
            tickets: Ticket[];
        }
        export {};
    }
}
export = Zendesk;
