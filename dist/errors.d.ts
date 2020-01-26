declare class DynamicPropsError extends Error {
    constructor(body: any);
}
export declare class Authentication extends DynamicPropsError {
    error: string;
}
export {};
