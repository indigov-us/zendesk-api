import { RequestInit } from 'node-fetch';
import fetchAll from './fetch-all';
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
    /** If true, will log every request minus the body */
    log?: boolean;
    /** If true, will log every request body */
    logFull?: boolean;
    logger?: (message: unknown) => void;
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
    fetchAll: ReturnType<typeof fetchAll>;
    findUserByEmail: ReturnType<typeof findUserByEmail>;
};
export declare const createClient: (args: AuthProps, opts?: ConstructorOpts | undefined) => FetchMethod;
