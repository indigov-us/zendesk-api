import { RequestInit } from 'node-fetch';
import { FetchMethod, Result } from './client';
declare const _default: <BodyType>({ api, concurrency, onPage, retryRateLimitErrors, startPage, }: {
    api: FetchMethod;
    concurrency?: number | undefined;
    retryRateLimitErrors?: boolean | undefined;
    onPage: (res: Result<BodyType>) => Promise<boolean>;
    startPage?: number | undefined;
}) => (path: string, init?: RequestInit | undefined) => Promise<void>;
export default _default;
