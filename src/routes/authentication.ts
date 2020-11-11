import express from "express";
import { db as database, User } from "va-database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: { id: number };
    }
  }
}

let router = express.Router();
export const authentication = router.post("/login", async (req, res, next) => {
  try {
    // check required fields in body
    const { email, password } = req.body;
    if (!email || !password) return res.sendStatus(400);

    let user: User | null,
      match: boolean,
      token: string,
      payload: { id: number };
    // get user from database
    try {
      user = await database.users.getByEmail(email);
      if (!user) return res.sendStatus(403);
    } catch (err) {
      return res.sendStatus(500);
    }

    // compare pasword hashes
    try {
      match = await bcrypt.compare(password, user.pwhash);
    } catch (err) {
      return res.sendStatus(500);
    }

    // sign token
    payload = { id: user.id };
    if (match) {
      try {
        token = jwt.sign(payload, process.env.JWT_SECRET_PRIVATE!, {
          algorithm: "RS256",
          expiresIn: process.env.JWT_EXPIRATION,
        });
      } catch (err) {
        return res.sendStatus(500);
      }
    } else {
      return res.sendStatus(403);
    }

    // if everything checked out, return token cookie
    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(
          Date.now() + parseInt(process.env.COOKIE_EXPIRATION!)
        ),
        secure: false,
        httpOnly: true,
      })
      .json(payload);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    // unset token cookie
    return res.cookie("token", {}).sendStatus(200);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    // check required fields in body
    const { email, password } = req.body;
    if (!email || !password) return res.sendStatus(400);

    // check that email is new
    try {
      let user = await database.users.getByEmail(email);
      if (user) return res.sendStatus(400);
    } catch (error) {}

    let pwhash;
    // generate hash for the given password
    try {
      pwhash = await bcrypt.hash(
        password,
        parseInt(process.env.JWT_SALT_ROUNDS!, 10)
      );
    } catch (err) {
      return res.sendStatus(500);
    }

    // insert new user into the database
    try {
      await database.users.add(email, pwhash);
    } catch (err) {
      return res.sendStatus(500);
    }

    // respond to the succesfully handled request
    return res.sendStatus(200);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});
