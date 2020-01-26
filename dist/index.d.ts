import * as Errors from './errors';
declare const _default: ({ subdomain, email, token }: {
    subdomain: string;
    email: string;
    token: string;
}, opts?: {
    log?: boolean | undefined;
} | undefined) => <BodyType>(path: string, init?: RequestInit | undefined) => Promise<{
    body: BodyType;
    rateLimit: number | null;
    rateLimitRemaining: number | null;
    retryAfter: number | null;
}>;
export default _default;
export { Errors };
