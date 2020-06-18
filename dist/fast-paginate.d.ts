import { FetchMethod, Result } from './client';
declare const _default: <BodyType>({ api, concurrency, onPage, startPage, }: {
    api: FetchMethod;
    concurrency?: number | undefined;
    onPage: (res: Result<BodyType>) => Promise<boolean>;
    startPage?: number | undefined;
}) => (path: string, init?: RequestInit | undefined) => Promise<void>;
export default _default;
