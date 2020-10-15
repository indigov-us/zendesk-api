"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client = __importStar(require("./client"));
exports.Client = Client;
const Errors = __importStar(require("./errors"));
exports.Errors = Errors;
const create_or_update_many_users_1 = __importDefault(require("./create-or-update-many-users"));
exports.createOrUpdateManyUsers = create_or_update_many_users_1.default;
const fast_paginate_1 = __importDefault(require("./fast-paginate"));
exports.fastPaginate = fast_paginate_1.default;
const job_completion_1 = __importDefault(require("./job-completion"));
exports.jobCompletion = job_completion_1.default;
exports.default = Client.createClient;
//# sourceMappingURL=index.js.map