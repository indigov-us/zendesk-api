import { Result } from './client';
declare const _default: <ResultType>(fn: () => Promise<Result<ResultType>>, { maxNumAttempts, maxNumAttemptsOnRateLimit, retryDelay, shouldLog, }?: {
    /** How many attempts before finally throwing an error? */
    maxNumAttempts?: number | undefined;
    /** How often should rate limit errors be retried? */
    maxNumAttemptsOnRateLimit?: number | undefined;
    /** How long to wait before retrying? (in milliseconds) */
    retryDelay?: number | undefined;
    /** Write a log line on rate limited? */
    shouldLog?: boolean | undefined;
}) => Promise<Result<ResultType>>;
export default _default;
