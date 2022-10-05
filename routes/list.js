const express = require("express");
const router = express.Router();
const api = require("../module/api");
const List = require("../models/list");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const listCurd = require("../module/list_curd");
const moment = require("moment");

const divideCategory = (category) => {
  const splited_category = category.split(" > ");
  if (splited_category.length < 3) {
    return splited_category[1];
  } else {
    return splited_category[1] + " > " + splited_category[2];
  }
};

//여행지 관리 페이지
router.get("/", isLoggedIn, async (req, res) => {
  let orderedDate = null;
  const data = await listCurd.getTravelList(req.user["dataValues"]["id"]);
  if (data.length) {
    //저장된 데이터가 있을 경우
    for (let idx = 0; idx < data.length; idx++) {
      //kakao api를 이용하여 데이터를 추가적으로 불러옴
      const element = data[idx];
      const location_info = await api.getInfoByLocation(
        element["placeId"],
        element["name"],
        Number(element["y"]),
        Number(element["x"])
      );
      element["road_address_name"] = location_info["road_address_name"];
      element["category_name"] = divideCategory(location_info["category_name"]);
      element["phone"] = location_info["phone"];
    }

    orderedDate = data.sort((a, b) => moment(a.date) - moment(b.date)); //데이터를 날짜순으로 정렬함
    let day = 1;
    let targetDate = moment(data[0]["date"]).format("YY-MM-DD");

    for (let idx = 0; idx < data.length; idx++) {
      //여행 일차(1일차, 2일차, ...)를 추가함
      const element = data[idx];
      if (targetDate < moment(element["date"]).format("YY-MM-DD")) {
        targetDate = moment(element["date"]).format("YY-MM-DD");
        day++;
      }
      element["day"] = day;
    }
  }

  res.render("my_list", { data: orderedDate });
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
  console.log(1);
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
  location_info["category_name"] = divideCategory(
    location_info["category_name"]
  );
  location_info["date"] = data["date"];
  location_info["memo"] = data["memo"];
  res.json(location_info);
});

module.exports = router;
