"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, ".env") });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var jwt_cookie_1 = require("./jwt-cookie");
var me_1 = require("./routes/me");
var vacancies_1 = require("./routes/vacancies");
var app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(cookie_parser_1.default());
app.use(jwt_cookie_1.middleware(process.env.JWT_SECRET_PRIVATE, {
    algorithms: ["RS256"],
}));
app.use("/api", me_1.me);
app.use("/api", vacancies_1.vacancies);
app.use(jwt_cookie_1.errorHandler);
var port = process.env.SERVER_PORT;
app.listen(port, function () {
    console.log("listening on port %s", port);
});
