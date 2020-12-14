import { RequestInit } from 'node-fetch';
export interface AuthProps {
    subdomain: string;
    email?: string;
    token?: string;
    base64Token?: string;
    getAwsParameterStoreName?: (subdomain: string) => string;
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
export declare type FetchMethod = (<BodyType>(path: string, init?: RequestInit) => Promise<Result<BodyType>>) & {
    getBase64Token?: Promise<string>;
};
export declare const createClient: (args: AuthProps, opts?: ConstructorOpts | undefined) => FetchMethod;
