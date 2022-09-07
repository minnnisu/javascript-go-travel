const axios = require("axios");
const express = require("express");
const router = express.Router();

//location ID와 같은 장소 검색하여 반환하는 함수
async function getInfoByLocation(placeID, query, y, x) {
  let placeInfo = null;
  const headers = {
    Authorization: "KakaoAK " + process.env.KAKAO_REST_API,
  };
  for (let i = 1; i <= 3; i++) {
    if (placeInfo != null) return placeInfo;
    const params = {
      query: query,
      page: i,
    };

    const result = await axios.get(
      "https://dapi.kakao.com/v2/local/search/keyword.json?y=" + y + "&x=" + x,
      { params, headers }
    );

    result.data["documents"].forEach((element) => {
      if (element["id"] == placeID) {
        placeInfo = element;
      }
    });
  }
}

//장소 세부정보 페이지
router.get("/place/info", async (req, res, next) => {
  const data = await getInfoByLocation(
    req.query.id,
    req.cookies["placeQuery"],
    req.cookies["DestinationY"],
    req.cookies["DestinationX"]
  );
  res.render("place_info", {
    place: data,
  });
});
module.exports = router;
