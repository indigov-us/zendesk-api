"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importStar(require("../"));
test('get a page of users', async () => {
    const api = __1.default({
        subdomain: process.env.SUBDOMAIN,
        email: process.env.EMAIL,
        token: process.env.TOKEN,
    });
    const res = await api('/users');
    expect(res.body.users.length).toBeGreaterThan(0);
});
test('throw authentication errors', async () => {
    const api = __1.default({
        subdomain: 'bad',
        email: 'email',
        token: 'token',
    });
    await expect(api('/users')).rejects.toThrowError(__1.Errors.Authentication);
});
