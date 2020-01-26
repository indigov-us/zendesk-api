"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const btoa_lite_1 = __importDefault(require("btoa-lite"));
const isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
const Errors = __importStar(require("./errors"));
exports.Errors = Errors;
exports.default = ({ subdomain, email, token }, opts) => {
    const authHeaderValue = `Basic ${btoa_lite_1.default(`${email}/token:${token}`)}`;
    return async (path, init) => {
        var _a, _b;
        const url = `https://${subdomain}.zendesk.com/api/v2${path}`;
        const method = init ? init.method || 'GET' : 'GET';
        if ((_a = opts) === null || _a === void 0 ? void 0 : _a.log) {
            console.log(`[${method}] ${url} ${init ? init.body : ''}`);
        }
        const res = await isomorphic_unfetch_1.default(url, Object.assign({ headers: {
                Authorization: authHeaderValue,
                'Content-Type': 'application/json',
            } }, init));
        // localize the response headers for processing
        const [contentTypeHeader, rateLimitHeader, rateLimitRemainingHeader, retryAfterHeader] = [
            'content-type',
            'x-rate-limit',
            'x-rate-limit-remaining',
            'retry-after',
        ].map(h => res.headers.get(h));
        // response body will almost always be JSON unless zendesk has downtime
        const body = await (((_b = contentTypeHeader) === null || _b === void 0 ? void 0 : _b.includes('application/json')) ? res.json() : res.text());
        // check for errors
        switch (res.status) {
            case 401:
                throw new Errors.Authentication(body);
        }
        // rate limit headers can be helpful in optimizing usage
        const rateLimit = rateLimitHeader ? parseInt(rateLimitHeader, 10) : null;
        const rateLimitRemaining = rateLimitRemainingHeader ? parseInt(rateLimitRemainingHeader, 10) : null;
        // sometimes zendesk will return a 'Retry-After' header, which is in seconds
        const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : null;
        return {
            body: body,
            rateLimit,
            rateLimitRemaining,
            retryAfter,
        };
    };
};
