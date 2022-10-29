const express = require("express");
const router = express.Router();
const api = require("../module/api");

//장소 세부정보 페이지
// router.get("/", async (req, res, next) => {
//   try {
//     const location_info = await api.getOneInfoByLocation(
//       //여행지이름, 카테고리, 전화번호, 주소등의 정보를 받아옴
//       req.query.id,
//       req.query.name,
//       req.query.y,
//       req.query.x
//     );

//     const blog = await api.getBlog(req.query.name, req.query.y, req.query.x); //여행지와 관련된 블로그 정보를 가져옴

//     res.render("place_info", {
//       place: location_info,
//       blog_list: blog,
//     });
//   } catch (err) {
//     // next(err);
//     next(new Error(err.message));
//   }
// });

//키워드를 통한 특정 장소 검색
router.get("/", async (req, res, next) => {
  let nick = null;
  const page = req.query.page;
  const query = req.query.query;

  try {
    const loginData = req.user["dataValues"];
    nick = loginData["nick"]; //로그인한 상태일 경우 닉네임을 가져옴
    travelList = await DB.getTravelList(loginData["id"]);
  } catch (error) {
    console.log("로그인 전 입니다.");
  }

  try {
    const placeList = await api.getInfoByLocation(
      query,
      req.cookies["DestinationY"],
      req.cookies["DestinationX"],
      page
    );

    // for (let element of placeList) {
    //   const imgUrl = await api.getImage("포항 카페" + element["place_name"]);
    //   if (imgUrl[0] != undefined) {
    //     element["img_url"] = imgUrl[0]["image_url"];
    //   } else {
    //     console.log("이미지가 없습니다");
    //   }
    // }

    res.render("index", {
      destination: req.cookies["DestinationName"],
      place_list: placeList,
      user_nick: nick,
      place_query: query,
    });
  } catch (error) {
    next(error);
  }
});

//여행 목적지 설정
router.get("/destination", async (req, res, next) => {
  const query = req.query.query;
  const address = await api.getLatLngbyAddress(query);
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
});

router.get("/info", async (req, res, next) => {
  try {
    const location_info = await api.getOneInfoByLocation(
      //요청받은 하나의 장소에 대한 정보를 가져옴
      req.query.id,
      req.query.name,
      req.query.y,
      req.query.x
    );
    res.send(location_info);
  } catch (error) {
    next(error);
  }
});

router.get("/thumbnail", async (req, res, next) => {
  const url = "https://place.map.kakao.com/" + req.query.placeId;
  try {
    const imgUrl = await api.getImage(url);
    res.send(imgUrl);
  } catch (error) {
    next(error);
  }
});

router.get("/blog", async (req, res, next) => {
  try {
    const { query, y, x } = req.query;
    const blogData = await api.getBlog(query, y, x); //type: object
    res.json(blogData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
