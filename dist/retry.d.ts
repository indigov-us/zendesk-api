import { Result } from './client';
import * as Errors from './errors';
import { RateLimit } from './errors';
declare const _default: <ResultType>(fn: () => Promise<Result<ResultType>>, { maxNumAttempts, retryDelay, shouldLog, errorTypesToRetry, }?: {
    /** How many attempts before finally throwing an error? */
    maxNumAttempts?: number | undefined;
    /** How long to wait before retrying? (in milliseconds) */
    retryDelay?: number | undefined;
    /** Write a log line on rate limited? */
    shouldLog?: boolean | undefined;
    errorTypesToRetry?: "all" | (typeof Errors.RateLimit | typeof Errors.UnknownApiError)[] | undefined;
}) => Promise<Result<ResultType>>;
export default _default;
