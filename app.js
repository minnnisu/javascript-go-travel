const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const indexRouter = require("./routes/index");
const placeRouter = require("./routes/place");
const listRouter = require("./routes/list");
const authRouter = require("./routes/auth");
const passport = require("passport");

require("dotenv").config();
const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();
passportConfig();
const port = 8080;
const nunjucks = require("nunjucks");
app.set("view engine", "html"); // 확장자를 html 로도 사용이 가능함.
nunjucks.configure("views", {
  // views폴더가 넌적스파일의 위치가 됨
  express: app,
  watch: true,
});

sequelize //sync()를 통해 데이터베이스와 서버 연결
  .sync({ force: false }) //{force:true}로 할 경우 서버 실행 시 마다 테이블을 재생성한다.
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

//미들웨어
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//라우터
app.use("/", indexRouter);
app.use("/place", placeRouter);
app.use("/list", listRouter);
app.use("/auth", authRouter);

//에러처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
