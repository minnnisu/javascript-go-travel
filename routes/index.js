const axios = require("axios");
const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const listCurd = require("../module/list_curd");
const List = require("../models/list");
const router = express.Router();
const api = require("../module/api");

let placeList = null;
let placeQuery = null;

const divideCategory = (category) => {
  //카테고리에서 필요한 부분만 추출
  const splited_category = category.split(" > ");
  if (splited_category.length < 3) {
    return splited_category[1];
  } else {
    return splited_category[1] + " > " + splited_category[2];
  }
};

//index페이지
router.get("/", async (req, res) => {
  let nick = null;
  let travelList = null;
  try {
    const loginData = req.user["dataValues"];
    nick = loginData["nick"]; //로그인한 상태일 경우 닉네임을 가져옴
    travelList = await listCurd.getTravelList(loginData["id"]);
  } catch (error) {
    console.log("로그인 전 입니다.");
  }

  if (req.cookies["isSetDestination"] == undefined) {
    res.render("index", {
      isSet: true,
      place_list: placeList,
      user_nick: nick,
      travel_list: travelList,
    });
  } else {
    res.render("index", {
      isSet: false,
      destination: req.cookies["DestinationName"],
      place_list: placeList,
      user_nick: nick,
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
        res.status(404).send("잘못된 주소입니다.");
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
      placeList.forEach(async (element) => {
        element["category_name"] = divideCategory(element["category_name"]);
      });
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/search/place/prev", (req, res) => {
  res.json(placeList);
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join");
});

router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login");
});

module.exports = router;
