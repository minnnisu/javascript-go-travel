const axios = require("axios");
const express = require("express");
const router = express.Router();

let placeList = null;
let placeQuery = null;
let travelList = null;

//index페이지
router.get("/", (req, res) => {
  if (req.cookies["isSetDestination"] == undefined) {
    res.render("index", {
      isSet: true,
      place_list: placeList,
      travel_list: travelList,
    });
  } else {
    res.render("index", {
      isSet: false,
      destination: req.cookies["DestinationName"],
      place_list: placeList,
      travel_list: travelList,
    });
  }
});

//여행 목적지 설정
router.get("/search/destination", (req, res, next) => {
  const keyword = req.query.query;

  if (keyword == "true") {
    res.clearCookie("isSetDestination");
    res.redirect("/");
  } else {
    const params = {
      query: keyword,
    };
    const headers = {
      Authorization: "KakaoAK " + process.env.KAKAO_REST_API,
    };

    axios
      .get("https://dapi.kakao.com//v2/local/search/address", {
        params,
        headers,
      })
      .then((result) => {
        const address = result.data["documents"][0]["address"];
        res.cookie("isSetDestination", true, {
          maxAge: 60000 * 60,
        });
        res.cookie("DestinationName", address["address_name"], {
          maxAge: 60000 * 60,
        });
        res.cookie("DestinationX", address["x"], {
          maxAge: 60000 * 60,
        });
        res.cookie("DestinationY", address["y"], {
          maxAge: 60000 * 60,
        });
        res.redirect("/");
        console.log(req.cookies["DestinationName"]);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  }
});

//키워드를 통한 특정 장소 검색
router.get("/search/place", (req, res, next) => {
  const page = req.query.page;
  const keyword = req.query.query;
  //쿼리로 page만 보내는 경우
  if (keyword != undefined) {
    res.cookie("placeQuery", req.query.query, {
      maxAge: 60000 * 60,
    });
    placeQuery = req.query.query;
  }
  const params = {
    query: placeQuery,
    page: page,
  };
  const headers = {
    Authorization: "KakaoAK " + process.env.KAKAO_REST_API,
  };
  axios
    .get(
      "https://dapi.kakao.com/v2/local/search/keyword.json?y=" +
        req.cookies["DestinationY"] +
        "&x=" +
        req.cookies["DestinationX"],
      { params, headers }
    )
    .then((result) => {
      placeList = result.data["documents"];
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/list", (req, res, next) => {
  travelList = req.body;
});

module.exports = router;
