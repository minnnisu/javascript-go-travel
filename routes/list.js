const express = require("express");
const router = express.Router();
const api = require("../module/api");
const List = require("../models/list");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

router.get("/info", async (req, res, next) => {
  const location_info = await api.getInfoByLocation(
    req.query.id,
    req.query.name,
    req.query.y,
    req.query.x
  );

  res.render("list_info", { place: location_info });
});

router.post("/", isLoggedIn, (req, res, next) => {
  const data = req.body;

  List.findOrCreate({
    where: { placeId: data["id"] },
    defaults: {
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
      res.status(403).send("리스트에 이미 저장되어있습니다");
      console.log("리스트에 이미 저장되어있습니다");
    }
  });
});

module.exports = router;
