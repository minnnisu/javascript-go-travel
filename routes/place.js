const express = require("express");
const router = express.Router();
const api = require("../module/api");

//장소 세부정보 페이지
router.get("/", async (req, res, next) => {
  try {
    const location_info = await api.getInfoByLocation(
      req.query.id,
      req.query.name,
      req.query.y,
      req.query.x
    );

    const blog = await api.getBlog(req.query.name, req.query.y, req.query.x);

    res.render("place_info", {
      place: location_info,
      blog_list: blog,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/info", async (req, res, next) => {
  try {
    const location_info = await api.getInfoByLocation(
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

module.exports = router;
