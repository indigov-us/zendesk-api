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
exports.retry = exports.jobCompletion = exports.fastPaginate = exports.createOrUpdateManyUsers = exports.Errors = exports.Client = void 0;
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
const retry_1 = __importDefault(require("./retry"));
exports.retry = retry_1.default;
exports.default = Client.createClient;
//# sourceMappingURL=index.js.map