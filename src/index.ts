import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, ".env") });
import express from "express";
import cookieParser from "cookie-parser";
import { middleware, errorHandler } from "./jwt-cookie";
import { me } from "./routes/me";
import { vacancies } from "./routes/vacancies";
import { authentication } from "./routes/authentication";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authentication);

app.use(
  middleware(process.env.JWT_SECRET_PRIVATE!, {
    algorithms: ["RS256"],
  })
);

app.use("/api", me);
app.use("/api", vacancies);

app.use(errorHandler);

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log("listening on port %s", port);
});
