"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fetchMethod) => async (email) => {
    var _a, _b;
    const searchRes = await fetchMethod(`/users/search?query=email:"${email}"`);
    if (((_b = (_a = searchRes.body.users[0]) === null || _a === void 0 ? void 0 : _a.email) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === email.toUpperCase()) {
        return searchRes.body.users[0];
    }
};
//# sourceMappingURL=find-user-by-email.js.map