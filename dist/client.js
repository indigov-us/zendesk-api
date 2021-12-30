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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
const ssm_1 = __importDefault(require("aws-sdk/clients/ssm"));
const form_data_1 = __importDefault(require("form-data"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const Errors = __importStar(require("./errors"));
const find_user_by_email_1 = __importDefault(require("./find-user-by-email"));
const credsToBase64Token = (email, token) => Buffer.from(`${email}/token:${token}`).toString('base64');
const credsFromBase64Token = (base64Token) => Buffer.from(base64Token, 'base64').toString().split('/token:');
const createClient = (args, opts) => {
    const { subdomain } = args;
    // generate and save creds once
    let email;
    let token;
    let base64Token;
    const generateCredsPromise = (async () => {
        // auth needs to be a base64 value
        // it can be supplied directly, or it can be generated from email+token,
        // or email+token can be retrieved from parameter store
        var _a;
        // if creds were explicitly provided, use them
        if (args.base64Token) {
            const [email, token] = credsFromBase64Token(args.base64Token);
            return { email, token, base64Token: args.base64Token };
        }
        // if email and token were provided, use them
        if (args.email && args.token) {
            return {
                email: args.email,
                token: args.token,
                base64Token: credsToBase64Token(args.email, args.token),
            };
        }
        // if a function to fetch email+token from AWS was provided, try that
        if (args.getAwsParameterStoreName) {
            const parameterName = args.getAwsParameterStoreName(subdomain);
            // Use custom AWS region if provided
            const ssm = new ssm_1.default({ region: args.awsRegion });
            const { Parameter } = await ssm.getParameter({ Name: parameterName }).promise();
            const [token, email] = ((_a = Parameter === null || Parameter === void 0 ? void 0 : Parameter.Value) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
            return {
                email,
                token,
                base64Token: credsToBase64Token(email, token),
            };
        }
        // if we are here, there is a problem
        throw new Error('Unable to generate creds');
    })().then((creds) => {
        // set the cached creds after the promise resolves
        email = creds.email;
        token = creds.token;
        base64Token = creds.base64Token;
    });
    const fetchMethod = async (path, init) => {
        const url = (() => {
            if (path.startsWith('http'))
                return path;
            const pathPrefix = path.startsWith('/sunshine') ? '' : '/v2';
            return `https://${subdomain}.zendesk.com/api${pathPrefix}${path}`;
        })();
        const method = init ? init.method || 'GET' : 'GET';
        if (opts === null || opts === void 0 ? void 0 : opts.log) {
            const message = `[${method}] ${url} ${(opts === null || opts === void 0 ? void 0 : opts.logFull) && init ? init.body : ''}`;
            (opts === null || opts === void 0 ? void 0 : opts.logger) ? opts.logger(message) : console.log(message);
        }
        // wait for the creds promise to resolve
        await generateCredsPromise;
        const res = await (0, node_fetch_1.default)(url, {
            ...init,
            headers: {
                // all requests should have Authorization header
                Authorization: `Basic ${base64Token}`,
                // all requests return json
                Accept: 'application/json',
                // only add JSON content-type header if we are not uploading a file
                // because node-fetch will calculate multipart boundary automatically
                ...(!((init === null || init === void 0 ? void 0 : init.body) instanceof form_data_1.default) && {
                    'Content-Type': 'application/json',
                }),
                // allow rest of the headers to override
                ...init === null || init === void 0 ? void 0 : init.headers,
            },
        });
        // localize the response headers for processing
        const [rateLimitHeader, rateLimitRemainingHeader, retryAfterHeader, contentType] = [
            'x-rate-limit',
            'x-rate-limit-remaining',
            'retry-after',
            'content-type',
        ].map((h) => res.headers.get(h));
        let body = await res.text();
        // will typically be "application/json; charset=UTF-8"
        if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('application/json')) {
            try {
                body = JSON.parse(body);
            }
            catch (e) {
                // in practice, zendesk will return invalid JSON even though the header is correct
                // if this happens, we will just leave the string body as-is
                if (opts === null || opts === void 0 ? void 0 : opts.log) {
                    (opts === null || opts === void 0 ? void 0 : opts.logger) ? opts.logger(e) : console.error(e);
                }
            }
        }
        // check for particular errors
        switch (res.status) {
            case 400:
                throw new Errors.BadRequestError(body);
            case 401:
                throw new Errors.Authentication(body);
            case 403:
                throw new Errors.Permission(body);
            case 404:
                throw new Errors.NotFound(body);
            case 422:
                throw new Errors.Unprocessable(body);
            case 429:
                throw new Errors.RateLimit(body);
        }
        // check for any other error statuses
        if (res.status >= 400 && res.status < 600) {
            throw new Error(body);
        }
        // rate limit headers can be helpful in optimizing usage
        const rateLimit = rateLimitHeader ? parseInt(rateLimitHeader, 10) : null;
        const rateLimitRemaining = rateLimitRemainingHeader ? parseInt(rateLimitRemainingHeader, 10) : null;
        // sometimes zendesk will return a 'Retry-After' header, which is in seconds
        const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : null;
        return {
            body,
            rateLimit,
            rateLimitRemaining,
            retryAfter,
        };
    };
    // add supplementary functions on top of the main fetchMethod
    // TODO: move other methods like fastPaginate to below?
    Object.defineProperties(fetchMethod, {
        getCreds: {
            value: async () => {
                // wait for the creds promise to resolve
                await generateCredsPromise;
                return {
                    email,
                    token,
                    base64Token,
                };
            },
        },
        findUserByEmail: {
            value: (0, find_user_by_email_1.default)(fetchMethod),
        },
    });
    return fetchMethod;
};
exports.createClient = createClient;
//# sourceMappingURL=client.js.map