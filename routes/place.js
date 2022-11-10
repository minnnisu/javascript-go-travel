const express = require("express");
const router = express.Router();
const api = require("../module/api");
const db = require("../module/db");
const { isLoggedIn } = require("./middlewares");

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

//여행지 정보를 가져옴
router.get("/info", async (req, res, next) => {
  let nick = null;
  let destination = {
    name: req.cookies["DestinationName"],
    x: req.cookies["DestinationX"],
    y: req.cookies["DestinationY"],
  };
  let placeList = null;

  try {
    const loginData = req.user["dataValues"];
    nick = loginData["nick"]; //로그인한 상태일 경우 닉네임을 가져옴
    travelList = await DB.getTravelList(loginData["id"]);
  } catch (error) {
    console.log("로그인 전 입니다");
  }

  if (destination["name"] == undefined) {
    const address = await api.getLatLngbyAddress("서울");
    res.cookie("DestinationName", address["address_name"], {
      maxAge: 60000 * 60,
    });
    res.cookie("DestinationX", address["x"], {
      maxAge: 60000 * 60,
    });
    res.cookie("DestinationY", address["y"], {
      maxAge: 60000 * 60,
    });
    destination["name"] = address["address_name"];
    destination["x"] = address["x"];
    destination["y"] = address["y"];
  }

  const headerButton = {
    url: "/list",
    value: "리스트",
  };

  try {
    const location_info = await api.getOneInfoByLocation(
      //여행지이름, 카테고리, 전화번호, 주소등의 정보를 받아옴
      req.query.placeId,
      req.query.query,
      req.query.y,
      req.query.x
    );

    const blog = await api.getBlog(req.query.query, req.query.y, req.query.x); //여행지와 관련된 블로그 정보를 가져옴
    res.render("place_info_add", {
      place: location_info,
      blog: blog,
      destination: destination["name"],
      user_nick: nick,
      header_button: headerButton,
    });
  } catch (err) {
    next(new Error(err.message));
  }
});

router.get("/info/modify", isLoggedIn, async (req, res, next) => {
  let nick = null;
  let destination = {
    name: req.cookies["DestinationName"],
    x: req.cookies["DestinationX"],
    y: req.cookies["DestinationY"],
  };
  let placeList = null;

  try {
    const loginData = req.user["dataValues"];
    nick = loginData["nick"]; //로그인한 상태일 경우 닉네임을 가져옴
    travelList = await DB.getTravelList(loginData["id"]);
  } catch (error) {
    console.log("로그인 전 입니다");
  }

  if (destination["name"] == undefined) {
    const address = await api.getLatLngbyAddress("서울");
    res.cookie("DestinationName", address["address_name"], {
      maxAge: 60000 * 60,
    });
    res.cookie("DestinationX", address["x"], {
      maxAge: 60000 * 60,
    });
    res.cookie("DestinationY", address["y"], {
      maxAge: 60000 * 60,
    });
    destination["name"] = address["address_name"];
    destination["x"] = address["x"];
    destination["y"] = address["y"];
  }

  const headerButton = {
    url: "/list",
    value: "리스트",
  };

  try {
    const location_info = await api.getOneInfoByLocation(
      //여행지이름, 카테고리, 전화번호, 주소등의 정보를 받아옴
      req.query.placeId,
      req.query.query,
      req.query.y,
      req.query.x
    );

    const blog = await api.getBlog(req.query.query, req.query.y, req.query.x); //여행지와 관련된 블로그 정보를 가져옴
    const userData = await db.getOneTravelPlace(
      req.user["dataValues"]["id"],
      req.query.placeId
    );

    res.render("place_info_modify", {
      place: location_info,
      blog: blog,
      user_data: userData,
      destination: destination["name"],
      user_nick: nick,
      header_button: headerButton,
    });
  } catch (err) {
    next(new Error(err.message));
  }
});

router.get("/thumbnail", async (req, res, next) => {
  console.log(req.query.placeId);
  const url = "https://place.map.kakao.com/" + req.query.placeId;
  try {
    const imgUrl = await api.getImage(url);
    res.send(imgUrl);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/img", async (req, res, next) => {
  const url = "https://place.map.kakao.com/" + req.query.placeId;
  try {
    const imgData = await api.getLargeImage(url);
    res.send(imgData);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/blog", async (req, res, next) => {
  try {
    const { query, y, x } = req.query;
    const blogData = await api.getBlog(query, y, x); //type: object
    res.json(blogData);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
