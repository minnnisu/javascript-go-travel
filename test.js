const api = require("./module/api");

api
  .getBlog("대구 미진삼겹살", 35.86682141148037, 128.6014657312536)
  .then((data) => {
    console.log(data);
  });
