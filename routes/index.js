const axios = require("axios");
const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const DB = require("../module/db");
const router = express.Router();
const api = require("../module/api");

//index페이지
router.get("/", async (req, res) => {
  let nick = null;
  let destination = {
    name: req.cookies["DestinationName"],
    x: req.cookies["DestinationX"],
    y: req.cookies["DestinationY"],
  };
  try {
    const loginData = req.user["dataValues"];
    nick = loginData["nick"]; //로그인한 상태일 경우 닉네임을 가져옴
    travelList = await DB.getTravelList(loginData["id"]);
  } catch (error) {
    console.log("로그인 전 입니다.");
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

  const placeList = await api.getInfoByLocation(
    "음식점",
    destination["y"],
    destination["x"]
  );

  res.render("index", {
    destination: destination["name"],
    place_list: placeList,
    user_nick: nick,
    place_query: "음식점",
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
