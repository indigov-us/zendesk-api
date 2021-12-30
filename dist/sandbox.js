"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("./"));
const main = async () => {
    const api = (0, _1.default)({
        subdomain: 'something',
        getAwsParameterStoreName: (subdomain) => `/ZendeskAPITokens/prod/${subdomain}`,
    }, {
        log: true,
    });
    try {
        const res = await api('/something');
        console.log(res);
    }
    catch (e) {
        console.error(e);
    }
};
main().then(() => process.exit());
//# sourceMappingURL=sandbox.js.map