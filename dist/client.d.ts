import { RequestInit } from 'node-fetch';
import findUserByEmail from './find-user-by-email';
export interface AuthProps {
    subdomain: string;
    email?: string;
    token?: string;
    base64Token?: string;
    getAwsParameterStoreName?: (subdomain: string) => string;
    awsRegion?: string;
}
export interface ConstructorOpts {
    log?: boolean;
    logger?: (message: string) => void;
}
export interface Result<BodyType> {
    body: BodyType;
    rateLimit: number | null;
    rateLimitRemaining: number | null;
    retryAfter: number | null;
}
export declare type FetchMethod = (<BodyType>(path: string, init?: RequestInit) => Promise<Result<BodyType>>) & {
    getCreds: () => Promise<{
        email: string;
        token: string;
        base64Token: string;
    }>;
    findUserByEmail: ReturnType<typeof findUserByEmail>;
};
export declare const createClient: (args: AuthProps, opts?: ConstructorOpts | undefined) => FetchMethod;
