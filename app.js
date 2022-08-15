const express = require("express");
const morgan = require("morgan");
const path = require("path");
const indexRouter = require("./router/index");
const searchRouter = require("./router/search");
const app = express();
const port = 8080;

app.use("/", express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use("/", indexRouter);
app.use("/search", searchRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
