import { FetchMethod } from './client';
import Zendesk from './zendesk';
declare const _default: ({ api, retryRateLimitErrors }: {
    api: FetchMethod;
    retryRateLimitErrors?: boolean | undefined;
}) => ({ users, defaultName }: {
    users: Zendesk.User[];
    defaultName?: string | undefined;
}) => Promise<boolean>;
export default _default;
