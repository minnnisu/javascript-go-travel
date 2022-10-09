const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

//회원가입
router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password, userName } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      //이메일(아이디)이 존재 할 경우
      return res.send("이미 존재하는 아이디입니다.");
    }
    const hash = await bcrypt.hash(password, 12); //hash(패스워드, salt횟수)
    await User.create({
      email,
      nick,
      userName,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//로그인
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

//로그아웃
router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
