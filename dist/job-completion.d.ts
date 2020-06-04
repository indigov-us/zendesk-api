import { FetchMethod } from './client';
import Zendesk from './zendesk';
declare const _default: ({ api, onProgress }: {
    api: FetchMethod;
    onProgress?: ((progress: number) => void) | undefined;
}) => (path: string, init?: RequestInit | undefined) => Promise<import("./client").Result<Zendesk.SingleResults.JobStatus>>;
export default _default;