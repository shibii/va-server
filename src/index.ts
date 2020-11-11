import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, ".env") });
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log("listening on port %s", port);
});
