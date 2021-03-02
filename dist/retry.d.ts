import { Result } from './client';
declare const _default: <ResultType>(req: Promise<Result<ResultType>>, { maxNumAttempts, retryDelay, shouldLog, }?: {
    /** How many attempts before finally throwing an error? */
    maxNumAttempts?: number | undefined;
    /** How long to wait before retrying? (in milliseconds) */
    retryDelay?: number | undefined;
    /** Write a log line on rate limited? */
    shouldLog?: boolean | undefined;
}) => Promise<Result<ResultType>>;
export default _default;
