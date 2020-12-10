import { RequestInit } from 'node-fetch';
import { FetchMethod } from './client';
import Zendesk from './zendesk';
declare const _default: ({ api, onJobStatus, onProgress, retryRateLimitErrors, }: {
    api: FetchMethod;
    onJobStatus?: ((jobStatus: Zendesk.JobStatus) => void) | undefined;
    onProgress?: ((progress: number) => void) | undefined;
    retryRateLimitErrors?: boolean | undefined;
}) => (path: string, init?: RequestInit | undefined) => Promise<import("./client").Result<Zendesk.SingleResults.JobStatus>>;
export default _default;
