const axios = require("axios");
const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

let placeList = null;
let placeQuery = null;
let travelList = null;

//index페이지
router.get("/", (req, res) => {
  let nick = null;
  try {
    nick = req.user["dataValues"]["nick"];
  } catch (error) {
    console.log("로그인 전 입니다.");
  }
  if (req.cookies["isSetDestination"] == undefined) {
    res.render("index", {
      isSet: true,
      place_list: placeList,
      user_nick: nick,
      // travel_list: travelList,
    });
  } else {
    res.render("index", {
      isSet: false,
      destination: req.cookies["DestinationName"],
      place_list: placeList,
      user_nick: nick,
      // travel_list: travelList,
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

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join");
});

// //여행리스트에 장소 추가
// router.post("/list", (req, res, next) => {
//   travelList = req.body;
//   res.redirect("/");
// });

// router.delete("/list", (req, res, next) => {
//   try {
//     const targetId = req.query.id;
//     for (let i = 0; i < travelList.length; i++) {
//       if (travelList[i]["id"] == targetId) {
//         delete travelList[i];
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   res.redirect("/");
// });

module.exports = router;
