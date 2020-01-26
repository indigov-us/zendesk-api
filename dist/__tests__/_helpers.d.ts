export declare const zendeskAPI: <BodyType>(path: string, init?: RequestInit | undefined) => Promise<{
    body: BodyType;
    rateLimit: number | null;
    rateLimitRemaining: number | null;
    retryAfter: number | null;
}>;
