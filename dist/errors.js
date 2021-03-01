"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// this generic error class will dynamically set all of the body properties on the Error instance itself
// use it by extending and strongly-typing the expected properties on the extended class
class DynamicPropsError extends Error {
    constructor(body) {
        super();
        if (typeof body === 'object') {
            for (const key of Object.keys(body)) {
                ;
                this[key] = body[key];
            }
        }
    }
}
class BadRequestError extends DynamicPropsError {
}
exports.BadRequestError = BadRequestError;
class Authentication extends DynamicPropsError {
}
exports.Authentication = Authentication;
class NotFound extends DynamicPropsError {
}
exports.NotFound = NotFound;
class Unprocessable extends DynamicPropsError {
}
exports.Unprocessable = Unprocessable;
class Permission extends DynamicPropsError {
}
exports.Permission = Permission;
class RateLimit extends DynamicPropsError {
}
exports.RateLimit = RateLimit;
//# sourceMappingURL=errors.js.map