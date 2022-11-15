const axios = require("axios");
const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const DB = require("../module/db");
const router = express.Router();
const api = require("../module/api");

//index페이지
router.get("/", async (req, res, next) => {
  let nick = null; // 닉네임
  let destination = {
    // 여행목적지
    name: req.cookies["DestinationName"],
    x: req.cookies["DestinationX"],
    y: req.cookies["DestinationY"],
  };
  let placeList = null; // 장소 리스트

  try {
    //로그인 정보를 불러옴
    const loginData = req.user["dataValues"];
    nick = loginData["nick"]; //로그인한 상태일 경우 닉네임을 가져옴
    travelList = await DB.getTravelList(loginData["id"]);
  } catch (error) {
    console.log("로그인 전 입니다");
  }

  if (destination["name"] == undefined) {
    //여행지 설정
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

  try {
    //장소 리스트를 불러옴
    placeList = await api.getInfoByLocation(
      "음식점",
      destination["y"],
      destination["x"]
    );
  } catch (error) {
    next(error);
  }

  const headerButton = {
    url: "/list",
    value: "리스트",
  };

  res.render("index", {
    destination: destination["name"],
    place_list: placeList,
    user_nick: nick,
    place_query: "음식점",
    header_button: headerButton,
  });
});

//회원가입 페이지
router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join");
});

//로그인 페이지
router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login");
});

module.exports = router;
