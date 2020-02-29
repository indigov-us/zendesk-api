"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-unfetch");
const Client = __importStar(require("./client"));
exports.Client = Client;
const Errors = __importStar(require("./errors"));
exports.Errors = Errors;
exports.default = Client.createClient;
