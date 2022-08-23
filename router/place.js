const axios = require("axios");
const express = require("express");
const router = express.Router();

//장소 세부정보
router.get("/place/info", (req, res, next) => {
  const placeID = req.query.id;
  const headers = {
    Authorization: "KakaoAK " + process.env.KAKAO_REST_API,
  };
  for (let i = 1; i <= 3; i++) {
    const params = {
      query: req.cookies["placeQuery"],
      page: i,
    };

    const data = axios
      .get(
        "https://dapi.kakao.com/v2/local/search/keyword.json?y=" +
          req.cookies["DestinationY"] +
          "&x=" +
          req.cookies["DestinationX"],
        { params, headers }
      )
      .then((result) => {
        const json = result.data["documents"];
        json.forEach((element) => {
          if (element["id"] == placeID) {
            console.log(element);
            return;
          }
        });
      })
      .catch((err) => {
        next(err);
      });
    if (data == 0) {
      break;
    }
  }
});
module.exports = router;
