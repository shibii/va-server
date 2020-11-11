import express from "express";
import { db as database } from "va-database";

declare global {
  namespace Express {
    interface Request {
      user: { id: number };
    }
  }
}

let router = express.Router();
export const vacancies = router.post(
  "/vacancies/:id/pin",
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const vacancyId = Number(req.params.id);
      if (!userId || !vacancyId) return res.sendStatus(400);

      await database.users.pinVacancy(userId, vacancyId);
      return res.sendStatus(200);
    } catch (err) {
      // handle unexpected errors gracefully
      return next(err);
    }
  }
);

router.post("/vacancies/:id/unpin", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const vacancyId = Number(req.params.id);
    if (!userId || !vacancyId) return res.sendStatus(400);

    await database.users.unpinVacancy(userId, vacancyId);
    return res.sendStatus(200);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.post("/vacancies/:id/hide", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const vacancyId = Number(req.params.id);
    if (!userId || !vacancyId) return res.sendStatus(400);

    await database.users.hideVacancy(userId, vacancyId);
    return res.sendStatus(200);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.post("/vacancies/:id/unhide", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const vacancyId = Number(req.params.id);
    if (!userId || !vacancyId) return res.sendStatus(400);

    await database.users.unhideVacancy(userId, vacancyId);
    return res.sendStatus(200);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.get("/vacancies/hidden", async (req, res, next) => {
  try {
    const { offsetId, limit } = req.query;
    const userId = req.user.id;
    // userId is not optional
    if (!userId) return res.sendStatus(400);

    const results = await database.vacancies.getHidden(
      userId,
      Number(offsetId),
      Number(limit)
    );
    return res.status(200).json(results);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.get("/vacancies/pinned", async (req, res, next) => {
  try {
    const { offsetId, limit } = req.query;
    const userId = req.user.id;
    // userId is not optional
    if (!userId) return res.sendStatus(400);

    const results = await database.vacancies.getPinned(
      userId,
      Number(offsetId),
      Number(limit)
    );
    return res.status(200).json(results);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});

router.get("/vacancies", async (req, res, next) => {
  try {
    const { terms, offsetId, limit } = req.query;
    const userId = req.user.id;
    // search terms and userId are not optional
    if (!terms || !userId) return res.sendStatus(400);

    const results = await database.vacancies.getFts(
      terms as string,
      userId,
      Number(offsetId),
      Number(limit)
    );
    return res.status(200).json(results);
  } catch (err) {
    // handle unexpected errors gracefully
    return next(err);
  }
});
