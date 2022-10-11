const axios = require("axios");
const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const listCurd = require("../module/list_curd");
const router = express.Router();
const api = require("../module/api");

let placeList = null;
let placeQuery = null;

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
    travelList = await listCurd.getTravelList(loginData["id"]);
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

  if (placeList == null) {
    res.cookie("placeQuery", "음식점", {
      maxAge: 60000 * 60,
    });
    placeList = await api.getInfoByLocation(
      "음식점",
      destination["y"],
      destination["x"]
    );
  }

  res.render("index", {
    destination: destination["name"],
    place_list: placeList,
    user_nick: nick,
  });
});

//키워드를 통한 특정 장소 검색
router.get("/search/place", async (req, res, next) => {
  const page = req.query.page;
  const query = req.query.query;
  //쿼리로 page만 보내는 경우
  if (query != undefined) {
    res.cookie("placeQuery", req.query.query, {
      maxAge: 60000 * 60,
    });
    placeQuery = req.query.query;
  }
  try {
    const response = await api.getInfoByLocation(
      placeQuery,
      req.cookies["DestinationY"],
      req.cookies["DestinationX"],
      page
    );
    placeList = response;
    res.redirect("/");
  } catch (error) {
    next(error);
  }
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
