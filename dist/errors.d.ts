declare class DynamicPropsError extends Error {
    constructor(body: any);
}
export declare class BadRequestError extends DynamicPropsError {
    error: any;
}
export declare class Authentication extends DynamicPropsError {
    error: string;
}
export declare class NotFound extends DynamicPropsError {
    error: string;
}
export declare class Unprocessable extends DynamicPropsError {
    error: string;
    details: {
        [key: string]: {
            error: string;
            description: string;
        }[];
    };
    description: string;
}
export declare class Permission extends DynamicPropsError {
    error: string;
}
export declare class RateLimit extends DynamicPropsError {
    error: string;
    rateLimit?: number;
    rateLimitRemaining?: number;
    retryAfter?: number;
}
export declare class UnknownApiError extends DynamicPropsError {
    error: string;
}
export {};
