const axios = require("axios");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const indexRouter = require("./router/index");
const searchRouter = require("./router/search");
const app = express();
require("dotenv").config();

const port = 8080;

app.use("/", express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use("/", indexRouter);
app.use("/search", searchRouter);

const params = {
  query: "이태원 맛집",
  page: 3,
};

const headers = {
  Authorization: "KakaoAK " + process.env.KAKAO_REST_API,
};

axios
  .get(
    "https://dapi.kakao.com/v2/local/search/keyword.json?y=37.514322572335935&x=127.06283102249932&radius=20000",
    { params, headers }
  )
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
