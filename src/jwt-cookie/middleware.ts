import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtCookieError } from "./JwtCookieError";

declare global {
  namespace Express {
    interface Request {
      user: { id: number };
    }
  }
}

export const middleware = (
  key: jwt.Secret,
  ...config: Array<jwt.VerifyOptions>
) => {
  if (config.length === 0)
    throw new JwtCookieError(
      401,
      "jsonwebtoken library verification function parameters not passed to middleware"
    );

  return async (req: Request, resp: Response, next: NextFunction) => {
    try {
      // check that the required token is present
      if (!req.cookies || !req.cookies.token) {
        return next(
          new JwtCookieError(401, "Missing authentication token cookie.")
        );
      }

      // verify the token
      try {
        const payload = jwt.verify(req.cookies.token, key, ...config);
        req.user = payload as { id: number };
        return next();
      } catch (err) {
        return next(new JwtCookieError(401, "Authentication token is invalid"));
      }
    } catch (err) {
      // handle unexpected errors gracefully
      return next(err);
    }
  };
};
