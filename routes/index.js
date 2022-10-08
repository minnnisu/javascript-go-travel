const axios = require("axios");
const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();
const api = require("../module/api");
const db = require("../module/db");

// const divideCategory = (category) => {
//   //카테고리에서 필요한 부분만 추출
//   const splited_category = category.split(" > ");
//   if (splited_category.length < 3) {
//     return splited_category[1];
//   } else {
//     return splited_category[1] + " > " + splited_category[2];
//   }
// };

//index페이지
router.get("/", async (req, res) => {
  let category = req.query.category;
  let nick = null;
  let destination = req.cookies["destinationName"];

  //로그인 여부
  try {
    const loginData = req.user["dataValues"];
    nick = loginData["nick"]; //로그인한 상태일 경우 닉네임을 가져옴
  } catch (error) {
    console.log("로그인 전 입니다.");
  }

  //첫 방문시 default 여행 목적지(서울특별시) 설정
  if (destination == undefined) {
    const address = await api.searchAddress("서울");
    res.cookie("destinationName", address["documents"][0]["address_name"], {
      maxAge: 60000 * 60,
    });
    destination = address["documents"][0]["address_name"];
  }

  //첫 방문시 default 여행 추천 카테고리(음식점) 설정
  if (category == undefined) {
    category = "음식점";
  }

  const placeList = [];
  placeList[0] = await db.getPlace(destination, category);
  res.render("index", {
    destination: req.cookies["destinationName"],
    place_list: placeList,
    user_nick: nick,
  });
});

//키워드를 통한 특정 장소 검색
// router.get("/search/place", (req, res, next) => {
//   const page = req.query.page;
//   const keyword = req.query.query;
//   //쿼리로 page만 보내는 경우
//   if (keyword != undefined) {
//     res.cookie("placeQuery", req.query.query, {
//       maxAge: 60000 * 60,
//     });
//     placeQuery = req.query.query;
//   }
//   const params = {
//     query: placeQuery,
//     page: page,
//   };
//   const headers = {
//     Authorization: "KakaoAK " + process.env.KAKAO_REST_API,
//   };
//   axios
//     .get(
//       "https://dapi.kakao.com/v2/local/search/keyword.json?y=" +
//         req.cookies["DestinationY"] +
//         "&x=" +
//         req.cookies["DestinationX"],
//       { params, headers }
//     )
//     .then((result) => {
//       placeList = result.data["documents"];
//       placeList.forEach(async (element) => {
//         element["category_name"] = divideCategory(element["category_name"]);
//       });
//       res.redirect("/");
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

// router.get("/search/place/prev", (req, res) => {
//   res.json(placeList);
// });

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join");
});

router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login");
});

module.exports = router;
