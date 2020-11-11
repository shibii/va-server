import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, ".env") });
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { middleware, errorHandler } from "./jwt-cookie";
import { me } from "./routes/me";
import { vacancies } from "./routes/vacancies";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

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
