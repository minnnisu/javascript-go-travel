const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/", (req, respone) => {
  const request = require("request");
  const NAVER_CLIENT_ID = process.env.NaverClientID;
  const NAVER_CLIENT_SECRET = process.env.NaverClientSecret;
  const option = {
    query: "대구 맛집",
    display: 5,
  };

  request.get(
    {
      uri: "https://openapi.naver.com/v1/search/local.json",
      qs: option,
      headers: {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
      },
    },
    function (err, res, body) {
      let json = JSON.parse(body); //json으로 파싱
      respone.send(json);
    }
  );
});

module.exports = router;
