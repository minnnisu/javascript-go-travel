const express = require("express");
const router = express.Router();
const api = require("../module/api");

//장소 세부정보 페이지
router.get("/", async (req, res, next) => {
  try {
    const location_info = await api.getOneInfoByLocation(
      //여행지이름, 카테고리, 전화번호, 주소등의 정보를 받아옴
      req.query.id,
      req.query.name,
      req.query.y,
      req.query.x
    );

    const blog = await api.getBlog(req.query.name, req.query.y, req.query.x); //여행지와 관련된 블로그 정보를 가져옴

    res.render("place_info", {
      place: location_info,
      blog_list: blog,
    });
  } catch (err) {
    // next(err);
    next(new Error(err.message));
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

router.get("/info", async (req, res, next) => {
  try {
    const location_info = await api.getOneInfoByLocation(
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
