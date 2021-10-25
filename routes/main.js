'use strict';

const express = require('express');
const { v4 : uuidv4 } = require('uuid');

const { APP_CONFIG_JSON, HOST } = require('../common');
const {
  setAccessTokenCookie,
  encryptPassword,
  comparePassword,
  getAccessTokenForUserId,
} = require('../auth/auth');

const {signJWT} = require('../auth/jwt');

const router = express.Router();




function redirectWithMsg({ res, dest, error, info }) {
  // redirectWithMsg() => 특정 주소로 redirect를 하되, UI상에 어떠한 메세지를 띄우는 함수
  res.redirect(`${dest}?${makeQueryString({ info, error })}`);
}

router.get("/", (req, res) => {
  if (req.user) {
    res.render("home", {
      APP_CONFIG_JSON,
    });
  } else {
    res.render("signin", {
      APP_CONFIG_JSON,
    });
  }
});


router.get("/signup", (req, res) => {
  res.render("signup", {
    APP_CONFIG_JSON,
  });
});


router.post("/signin", async (req, res) => {
  if (!req.body) {
    redirectWithMsg({
      res,
      dest: "/",
      error: "잘못된 요청입니다.",
    });
    return;
  }

  const users = await getUsersCollection();
  const { email, password } = req.body;

  if (!email || !password) {
    redirectWithMsg({
      res,
      dest: "/",
      error: "이메일과 비밀번호를 모두 입력해주세요.",
    });
    return;
  }

  // signin 진행
  const existingUser = await users.findOne({
    email,
  });

  if (!existingUser) {
    redirectWithMsg({
      res,
      dest: "/",
      error: "email혹은 비밀번호가 일치하지 않습니다",
    });
    return;
  }
  const isPasswordCorrect = await comparePassword(
    password,
    existingUser.password
  );
  if (isPasswordCorrect) {
    const token = await getAccessTokenForUserId(existingUser.id);
    setAccessTokenCookie(res, token);

    redirectWithMsg({
      res,
      dest: "/", // redirect후 홈으로
      info: "로그인 완료",
    });
  } else {
    // Password가 틀린경우
    redirectWithMsg({
      res,
      dest: "/",
      info: "email혹은 비밀번호가 일치하지 않습니다",
    });
  }
});


router.post("/signup", async (req, res) => {
  const users = await getUsersCollection();
  const { email, password } = req.body;

  // email과 password 둘 중 하나라도 없으면 진행 x
  if (!email || !password) {
    redirectWithMsg({
      dest: "/signup",
      error: "email과 password 모두 입력해 주세요",
      res,
    });
    return;
  }
  // signUp시, 해당 email에 해당하는 user가 있는지 확인
  // 이미 있다면, 가입 x
  const existingUser = await users.findOne({
    email,
  });

  if (existingUser) {
    // existingUser가 있다면,
    redirectWithMsg({
      // redirectWithMsg
      dest: "/singup", // signup페이지로 돌려보냄
      error: "같은 이메일의 유저가 이미 존재함",
      res,
    });
    return;
  }
  // 가입 가능 조건 부합
  const newUserId = uuidv4();
  const emailVerificationCode = uuidv4(); // 인증 코드로 uuid생성
  await ses
    .sendEmail({
      Content: {
        Simple: {
          Subject: {
            Data: "email 인증 요청",
            Charset: "UTF-8",
          },
          Body: {
            Text: {
              Data: `다음 링크를 클릭해 이메일 인증을 진행해 주세요. https://${HOST}/verify-email?code=${emailVerificationCode}`, // 환경변수 포함된 링크 추가
              Charset: "UTF-8",
            },
          },
        },
      },
      Destination: {
        ToAddresses: [email],
      },
      FromEmailAddress: "noreply@hyunlee214.com",
    })
    .promise();         // promise가 없으면 await이 안통함

  await users.insertOne({
    id: newUserId,
    email,
    password: await encryptPassword(password),      // 비교해서 같다는 것만 확인하기 위함
    // 윗줄에 await 붙여줘야 패스워드 해쉬값으로 나옴, 안붙여주면 DB에 object만 나와서 로그인 시 에러뜸.
    // 이거 확인 못해서 3시간 애먹었으니 꼭 기억할 것.
    verified: false,
    emailVerificationCode,
  });

  // accessToken 설정
  setAccessTokenCookie(res, await signJWT(newUserId));
  res.redirect("/");
});

router.get("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
});

module.exports = router;