"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("./"));
const main = async () => {
    const api = _1.default({
        subdomain: 'repvanduyne',
        getAwsParameterStoreName: (subdomain) => `/ZendeskAPITokens/prod/${subdomain}`,
    });
    try {
        const res = await api('/incremental/users.json?start_time=1613972128');
        console.log(res);
    }
    catch (e) {
        console.error(e);
    }
};
main().then(() => process.exit());
//# sourceMappingURL=sandbox.js.map