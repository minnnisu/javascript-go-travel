const axios = require("axios");
const express = require("express");
const router = express.Router();

let json = null;

router.get("/", (req, res) => {
  if (req.cookies["isSetDestination"] == undefined) {
    res.render("index", { isSet: true, place_list: json });
  } else {
    res.render("index", {
      isSet: false,
      address: req.cookies["DestinationName"],
      place_list: json,
    });
  }
});

router.get("/place", (req, res) => {
  const keyword = req.query.query;
  const params = {
    query: keyword,
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
    .then((result) => {
      json = result.data["documents"];
      console.log(json);
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
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
