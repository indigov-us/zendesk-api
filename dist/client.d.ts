export interface AuthProps {
    subdomain: string;
    email?: string;
    token?: string;
    base64Token?: string;
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
export declare const createClient: ({ subdomain, email, token, base64Token }: AuthProps, opts?: ConstructorOpts | undefined) => FetchMethod;
