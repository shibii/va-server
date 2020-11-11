import { ErrorRequestHandler } from "express";
import { JwtCookieError } from "./JwtCookieError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  try {
    if (err instanceof JwtCookieError) return res.sendStatus(err.code);
    return next(err);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
};
