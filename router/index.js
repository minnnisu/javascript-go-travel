const axios = require("axios");
const express = require("express");
const router = express.Router();

let placeList = null;
let placeQuery = null;

router.get("/", (req, res) => {
  if (req.cookies["isSetDestination"] == undefined) {
    res.render("index", { isSet: true, place_list: placeList });
  } else {
    res.render("index", {
      isSet: false,
      address: req.cookies["DestinationName"],
      place_list: placeList,
    });
  }
});

router.get("/place", (req, res, next) => {
  const page = req.query.page;
  const keyword = req.query.query;
  //쿼리로 page만 보내는 경우
  if (keyword != undefined) {
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
      console.log(placeList);
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/address", (req, res) => {
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
      });
  }
});

module.exports = router;
