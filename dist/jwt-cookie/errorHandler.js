"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var JwtCookieError_1 = require("./JwtCookieError");
exports.errorHandler = function (err, req, res, next) {
    try {
        if (err instanceof JwtCookieError_1.JwtCookieError)
            return res.sendStatus(err.code);
    }
    catch (err) {
        // handle unexpected errors gracefully
        return next(err);
    }
};
