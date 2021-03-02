"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
exports.default = async (fn, { maxNumAttempts, retryDelay = 1000, shouldLog, } = {}) => {
    let numAttempts = 0;
    let res;
    while (!res) {
        try {
            // try the request
            numAttempts++;
            res = await fn();
        }
        catch (e) {
            // if it is not a rate limit error, or we have tried enough times, throw it
            if (!(e instanceof errors_1.RateLimit) || (maxNumAttempts && numAttempts >= maxNumAttempts))
                throw e;
            // otherwise delay and keep looping
            if (shouldLog)
                console.log(`Rate limited, retrying in ${retryDelay / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
    }
    return res;
};
//# sourceMappingURL=retry.js.map