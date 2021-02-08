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
const ssm_1 = __importDefault(require("aws-sdk/clients/ssm"));
const btoa_lite_1 = __importDefault(require("btoa-lite"));
const form_data_1 = __importDefault(require("form-data"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const Errors = __importStar(require("./errors"));
exports.createClient = (args, opts) => {
    const { subdomain } = args;
    // auth needs to be a base64 value
    // it can be supplied directly, or it can be generated from email+token,
    // or email+token can be retrieved from parameter store
    const getBase64Token = (async () => {
        var _a, _b;
        // if creds were explicitly provided, use them
        if (args.base64Token)
            return args.base64Token;
        // if email and token were provided, use them
        else if (args.email && args.token)
            return btoa_lite_1.default(`${args.email}/token:${args.token}`);
        // if a function to fetch email+token from AWS was provided, try that
        else if (args.getAwsParameterStoreName) {
            const parameterName = args.getAwsParameterStoreName(subdomain);
            const ssm = new ssm_1.default();
            const { Parameter } = await ssm.getParameter({ Name: parameterName }).promise();
            const [token, email] = ((_b = (_a = Parameter) === null || _a === void 0 ? void 0 : _a.Value) === null || _b === void 0 ? void 0 : _b.split(',')) || [];
            return btoa_lite_1.default(`${email}/token:${token}`);
        }
        // if we are here, there is a problem
        throw new Error('Unable to generate base64 token');
    })();
    const fetchMethod = async (path, init) => {
        var _a, _b, _c;
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
        const res = await node_fetch_1.default(url, {
            ...init,
            headers: {
                // all requests should have Authorization header
                Authorization: `Basic ${await getBase64Token}`,
                // all requests return json
                Accept: 'application/json',
                // only add JSON content-type header if we are not uploading a file
                // because node-fetch will calculate multipart boundary automatically
                ...(!(((_b = init) === null || _b === void 0 ? void 0 : _b.body) instanceof form_data_1.default) && {
                    'Content-Type': 'application/json',
                }),
                // allow rest of the headers to override
                ...(_c = init) === null || _c === void 0 ? void 0 : _c.headers,
            },
        });
        // localize the response headers for processing
        const [rateLimitHeader, rateLimitRemainingHeader, retryAfterHeader] = [
            'x-rate-limit',
            'x-rate-limit-remaining',
            'retry-after',
        ].map((h) => res.headers.get(h));
        // if there is an error, res.text will not be parseable JSON
        // rawBody will be empty on status 204
        const rawBody = await res.text();
        // check for errors
        switch (res.status) {
            case 401:
                throw new Errors.Authentication(rawBody);
            case 403:
                throw new Errors.Permission(rawBody);
            case 404:
                throw new Errors.NotFound(rawBody);
            case 422:
                throw new Errors.Unprocessable(rawBody);
            case 429:
                throw new Errors.RateLimit(rawBody);
        }
        // rate limit headers can be helpful in optimizing usage
        const rateLimit = rateLimitHeader ? parseInt(rateLimitHeader, 10) : null;
        const rateLimitRemaining = rateLimitRemainingHeader ? parseInt(rateLimitRemainingHeader, 10) : null;
        // sometimes zendesk will return a 'Retry-After' header, which is in seconds
        const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : null;
        return {
            body: rawBody ? JSON.parse(rawBody) : {},
            rateLimit,
            rateLimitRemaining,
            retryAfter,
        };
    };
    Object.defineProperties(fetchMethod, {
        getBase64Token: {
            value: getBase64Token,
        },
    });
    return fetchMethod;
};
//# sourceMappingURL=client.js.map