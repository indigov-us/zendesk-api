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
const form_data_1 = __importDefault(require("form-data"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const Errors = __importStar(require("./errors"));
const find_user_by_email_1 = __importDefault(require("./find-user-by-email"));
const credsToBase64Token = (email, token) => Buffer.from(`${email}/token:${token}`).toString('base64');
const credsFromBase64Token = (base64Token) => Buffer.from(base64Token, 'base64').toString().split('/token:');
exports.createClient = (args, opts) => {
    const { subdomain } = args;
    // generate and save creds once
    let email;
    let token;
    let base64Token;
    const generateCredsPromise = (async () => {
        // auth needs to be a base64 value
        // it can be supplied directly, or it can be generated from email+token,
        // or email+token can be retrieved from parameter store
        var _a, _b;
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
            const [token, email] = ((_b = (_a = Parameter) === null || _a === void 0 ? void 0 : _a.Value) === null || _b === void 0 ? void 0 : _b.split(',')) || [];
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
        var _a, _b, _c, _d, _e, _f, _g;
        const url = (() => {
            if (path.startsWith('http'))
                return path;
            const pathPrefix = path.startsWith('/sunshine') ? '' : '/v2';
            return `https://${subdomain}.zendesk.com/api${pathPrefix}${path}`;
        })();
        const method = init ? init.method || 'GET' : 'GET';
        if ((_a = opts) === null || _a === void 0 ? void 0 : _a.log) {
            const message = `[${method}] ${url} ${init ? init.body : ''}`;
            ((_b = opts) === null || _b === void 0 ? void 0 : _b.logger) ? opts.logger(message) : console.log(message);
        }
        // wait for the creds promise to resolve
        await generateCredsPromise;
        const res = await node_fetch_1.default(url, {
            ...init,
            headers: {
                // all requests should have Authorization header
                Authorization: `Basic ${base64Token}`,
                // all requests return json
                Accept: 'application/json',
                // only add JSON content-type header if we are not uploading a file
                // because node-fetch will calculate multipart boundary automatically
                ...(!(((_c = init) === null || _c === void 0 ? void 0 : _c.body) instanceof form_data_1.default) && {
                    'Content-Type': 'application/json',
                }),
                // allow rest of the headers to override
                ...(_d = init) === null || _d === void 0 ? void 0 : _d.headers,
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
        if ((_e = contentType) === null || _e === void 0 ? void 0 : _e.includes('application/json')) {
            try {
                body = JSON.parse(body);
            }
            catch (e) {
                // in practice, zendesk will return invalid JSON even though the header is correct
                // if this happens, we will just leave the string body as-is
                if ((_f = opts) === null || _f === void 0 ? void 0 : _f.log) {
                    ((_g = opts) === null || _g === void 0 ? void 0 : _g.logger) ? opts.logger(e) : console.error(e);
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
            value: find_user_by_email_1.default(fetchMethod),
        },
    });
    return fetchMethod;
};
//# sourceMappingURL=client.js.map