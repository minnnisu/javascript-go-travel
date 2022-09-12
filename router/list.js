const express = require("express");
const router = express.Router();
const api = require("../module/api");

router.get("/info", async (req, res, next) => {
  const location_info = await api.getInfoByLocation(
    req.query.id,
    req.query.name,
    req.query.y,
    req.query.x
  );

  res.render("list_info", { place: location_info });
});

module.exports = router;
