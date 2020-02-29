export interface AuthProps {
    subdomain: string;
    email: string;
    token: string;
}
export interface ConstructorOpts {
    log?: boolean;
}
export interface Result<BodyType> {
    body: BodyType;
    rateLimit: number | null;
    rateLimitRemaining: number | null;
    retryAfter: number | null;
}
export declare type FetchMethod = <BodyType>(path: string, init?: RequestInit) => Promise<Result<BodyType>>;
declare const _default: ({ subdomain, email, token }: AuthProps, opts?: ConstructorOpts | undefined) => FetchMethod;
export default _default;
