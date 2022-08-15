"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
exports.default = async (fn, { maxNumAttempts, maxNumAttemptsOnRateLimit = 20, retryDelay = 1000, shouldLog, } = {}) => {
    let numAttempts = 0;
    let res;
    while (!res) {
        try {
            // try the request
            numAttempts++;
            res = await fn();
        }
        catch (e) {
            // if it's a rate limit error and we've retried too many times, throw the error
            if (e instanceof errors_1.RateLimit && numAttempts >= maxNumAttemptsOnRateLimit) {
                if (shouldLog)
                    console.log(`Call failed and exceeded max number of attempts.`);
                throw e;
            }
            if (e instanceof errors_1.RateLimit) {
                // Multiplying with 1100 instead of 1000 to account for small differences in timing.
                const retryAfter = e.retryAfter ? e.retryAfter * 1100 : retryDelay;
                if (shouldLog)
                    console.log(`Rate limited, retrying in ${retryAfter / 1000}s...`);
                await new Promise((resolve) => setTimeout(resolve, retryAfter));
                continue;
            }
            // if it is not a rate limit error and we've tried enough times, throw it
            if (maxNumAttempts && numAttempts >= maxNumAttempts) {
                if (shouldLog)
                    console.log(`Call failed and exceeded max number of attempts.`);
                throw e;
            }
            // retry after a delay
            if (shouldLog)
                console.log(`Call failed, retrying in ${retryDelay / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
    }
    return res;
};
//# sourceMappingURL=retry.js.map