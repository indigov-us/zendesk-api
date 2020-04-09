"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const Errors = __importStar(require("./errors"));
exports.createClient = ({ subdomain, email, token, base64Token }, opts) => {
    const authHeaderValue = `Basic ${base64Token || btoa_lite_1.default(`${email}/token:${token}`)}`;
    return ((path, init) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const url = (() => {
            if (path.startsWith('http'))
                return path;
            const pathPrefix = path.startsWith('/sunshine') ? '' : '/v2';
            return `https://${subdomain}.zendesk.com/api${pathPrefix}${path}`;
        })();
        const method = init ? init.method || 'GET' : 'GET';
        if ((_a = opts) === null || _a === void 0 ? void 0 : _a.log) {
            console.log(`[${method}] ${url} ${init ? init.body : ''}`);
        }
        const res = yield fetch(url, Object.assign({ headers: {
                Authorization: authHeaderValue,
                'Content-Type': 'application/json',
            } }, init));
        // localize the response headers for processing
        const [contentTypeHeader, rateLimitHeader, rateLimitRemainingHeader, retryAfterHeader] = [
            'content-type',
            'x-rate-limit',
            'x-rate-limit-remaining',
            'retry-after',
        ].map((h) => res.headers.get(h));
        // response body will almost always be JSON unless zendesk has downtime
        const body = yield (((_b = contentTypeHeader) === null || _b === void 0 ? void 0 : _b.includes('application/json')) ? res.json() : res.text());
        // check for errors
        switch (res.status) {
            case 401:
                throw new Errors.Authentication(body);
            case 403:
                throw new Errors.Permission(body);
            case 422:
                throw new Errors.Unprocessable(body);
            case 429:
                throw new Errors.RateLimit(body);
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
    }));
};
