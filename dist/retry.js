"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errors = __importStar(require("./errors"));
const errors_1 = require("./errors");
exports.default = async (fn, { maxNumAttempts, retryDelay = 1000, shouldLog, errorTypesToRetry = [errors_1.RateLimit], } = {}) => {
    let numAttempts = 0;
    let res;
    while (!res) {
        try {
            // try the request
            numAttempts++;
            res = await fn();
        }
        catch (e) {
            const errorShouldBeRetried = errorTypesToRetry === 'all' || errorTypesToRetry.some((type) => e instanceof type);
            if (!errorShouldBeRetried) {
                throw e;
            }
            // if it's a rate limit error and we've retried too many times, throw the error
            if (maxNumAttempts && numAttempts >= maxNumAttempts) {
                if (shouldLog)
                    console.log(`Call failed and exceeded max number of attempts.`);
                throw e;
            }
            // Multiplying with 1100 instead of 1000 to account for small differences in timing.
            const retryAfter = e instanceof Errors.RateLimit && e.retryAfter ? e.retryAfter * 1100 : retryDelay;
            if (shouldLog)
                console.log(`Request failed, retrying in ${retryAfter / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, retryAfter));
        }
    }
    return res;
};
//# sourceMappingURL=retry.js.map