"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_completion_1 = __importDefault(require("./job-completion"));
// if not specific, what default name should we give users?
const defaultNameFallback = 'Friend';
exports.default = ({ api }) => async ({ users, defaultName, }) => {
    // attempt to create or update the users
    const createOrUpdateRes = await job_completion_1.default({ api })('/users/create_or_update_many', {
        body: JSON.stringify({ users }),
        method: 'POST',
    });
    const results = createOrUpdateRes.body.job_status.results;
    // figure out exactly which users failed due to name errors
    const failures = users.filter((_, i) => { var _a, _b, _c; return ((_a = results[i]) === null || _a === void 0 ? void 0 : _a.status) === 'Failed' && ((_c = (_b = results[i]) === null || _b === void 0 ? void 0 : _b.details) === null || _c === void 0 ? void 0 : _c.includes('Name')); });
    // retry the failures using the create_many endpoint and a default name
    if (failures.length) {
        const name = defaultName || defaultNameFallback;
        await job_completion_1.default({ api })('/users/create_many', {
            body: JSON.stringify({ users: failures.map((u) => ({ ...u, name })) }),
            method: 'POST',
        });
    }
    return true;
};
//# sourceMappingURL=create-or-update-many-users.js.map