const express = require("express");
const router = express.Router();
const api = require("../module/api");
const List = require("../models/list");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const listCurd = require("../module/list_curd");

router.get("/info", isLoggedIn, async (req, res, next) => {
  const location_info = await api.getInfoByLocation(
    req.query.id,
    req.query.name,
    req.query.y,
    req.query.x
  );
  const data = await listCurd.getOneTravelPlace(
    req.user["dataValues"]["id"],
    req.query.id
  );
  location_info["date"] = data["date"];
  location_info["memo"] = data["memo"];
  res.render("list_info", { place: location_info });
});

// DB내 List 테이블에 특정 여행지 추가
router.post("/", isLoggedIn, (req, res) => {
  const data = req.body; //요청 받은 데이터

  List.findOrCreate({
    where: { placeId: data["id"] }, //DB 내 같은 placeId가 존재하는지 확인
    defaults: {
      //DB에 저장할 데이터
      userId: req.user["dataValues"]["id"],
      placeId: data["id"],
      name: data["name"],
      y: data["y"],
      x: data["x"],
      date: data["date"] + " " + data["time"],
      memo: data["memo"],
    },
  }).then(([row, created]) => {
    //여행리스트에 해당 여행지가 이미 존재할 경우
    if (!created) {
      res.status(403).send("리스트에 이미 저장되어있습니다");
    } else {
      res.send("ok");
    }
  });
});

// DB내 List 테이블에서 특정 여행지 삭제
router.delete("/", isLoggedIn, (req, res) => {
  List.destroy({
    where: { userId: req.user["dataValues"]["id"], placeId: req.query.id },
  }).then(() => {
    res.send("Delete Success");
  });
});

router.delete("/all", isLoggedIn, (req, res) => {
  List.destroy({
    where: { userId: req.user["dataValues"]["id"] },
  }).then(() => {
    res.send("Delete Success");
  });
});

module.exports = router;
