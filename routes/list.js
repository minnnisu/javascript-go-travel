const express = require("express");
const router = express.Router();
const api = require("../module/api");
const List = require("../models/list");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const listCurd = require("../module/list_curd");

const testData = [
  {
    day: 1,
    name: "a",
  },
  {
    day: 1,
    name: "b",
  },
  {
    day: 1,
    name: "c",
  },
  {
    day: 2,
    name: "d",
  },
  {
    day: 2,
    name: "e",
  },
  {
    day: 2,
    name: "",
  },
];

//여행지 관리 페이지
router.get("/", (req, res) => {
  res.render("my_list", { data: testData });
});

// DB내 List 테이블에 데이터 추가
router.post("/", isLoggedIn, (req, res) => {
  const data = req.body; //DB 내 저장할 데이터

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
    if (!created) {
      //여행리스트에 해당 데이터가 이미 존재할 경우
      res.status(403).send("리스트에 이미 저장되어있습니다");
    } else {
      res.send("ok");
    }
  });
});

// DB내 List 테이블에서 특정 데이터 삭제
router.delete("/", isLoggedIn, (req, res) => {
  List.destroy({
    where: { userId: req.user["dataValues"]["id"], placeId: req.query.id },
  }).then(() => {
    res.send("Delete Success");
  });
});

// DB내 List 테이블의 모든 데이터 삭제
router.delete("/all", isLoggedIn, (req, res) => {
  List.destroy({
    where: { userId: req.user["dataValues"]["id"] },
  }).then(() => {
    res.send("Delete Success");
  });
});

//여행지 정보를 가져옴
// router.get("/info", isLoggedIn, async (req, res, next) => {
//   const location_info = await api.getInfoByLocation(
//     req.query.id,
//     req.query.name,
//     req.query.y,
//     req.query.x
//   );
//   const data = await listCurd.getOneTravelPlace(
//     req.user["dataValues"]["id"],
//     req.query.id
//   );
//   location_info["date"] = data["date"];
//   location_info["memo"] = data["memo"];
//   res.render("list_info", { place: location_info });
// });

module.exports = router;
