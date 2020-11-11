import express from "express";

let router = express.Router();
export const me = router.get("/me", async (req, res, next) => {
  try {
    if (!req.user) return res.status(401);
    return res.status(200).json(req.user);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});
