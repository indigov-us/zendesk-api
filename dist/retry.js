"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
exports.default = async (req, { maxNumAttempts, retryDelay = 1000, } = {}) => {
    let numAttempts = 0;
    let res;
    while (!res) {
        try {
            // try the request
            numAttempts++;
            res = await req;
        }
        catch (e) {
            // if it is not a rate limit error, or we have tried enough times, throw it
            if (!(e instanceof errors_1.RateLimit) || (maxNumAttempts && numAttempts >= maxNumAttempts))
                throw e;
            // otherwise delay and keep looping
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
    }
    return res;
};
//# sourceMappingURL=retry.js.map