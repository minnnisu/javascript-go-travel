const axios = require("axios");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const indexRouter = require("./router/index");
const placeRouter = require("./router/place");
require("dotenv").config();

const app = express();
const port = 8080;

const nunjucks = require("nunjucks");
app.set("view engine", "html"); // 확장자를 html 로도 사용이 가능함.
nunjucks.configure("views", {
  // views폴더가 넌적스파일의 위치가 됨
  express: app,
  watch: true,
});

app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/", placeRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
