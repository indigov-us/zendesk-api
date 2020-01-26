"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _helpers_1 = require("./_helpers");
const __1 = __importStar(require("../"));
test('throw authentication error', async () => {
    const badAPI = __1.default({
        subdomain: 'bad',
        email: 'email',
        token: 'token',
    });
    await expect(badAPI('/users')).rejects.toThrowError(__1.Errors.Authentication);
});
test('throw unprocessable error', async () => {
    await expect(_helpers_1.zendeskAPI('/users', {
        body: JSON.stringify({
            user: {
                bad: 'input',
            },
        }),
        method: 'POST',
    })).rejects.toThrowError(__1.Errors.Unprocessable);
});
