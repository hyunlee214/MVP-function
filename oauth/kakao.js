'use strict';

const { createUserOrLogin } = require('../auth/auth');
const { KAKAO_REST_KEY, KAKAO_REDIRECT_URI } = require('../common');
const { default: fetch } = require('node-fetch');


function setupKakaoLogin(app) {
  // https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api
  app.get("/auth/kakao/callback", async (req, res) => {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      res.status(400).end();
      return;
    }

    // 'kakao developers > 내 애플리케이션 > 앱 설정 > 요약 정보'에 있는 정보
    // https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api 참고

    const url = new URL("https://kauth.kakao.com/oauth/token");
    url.searchParams.append("grant_type", "authorization_code");
    url.searchParams.append("client_id", KAKAO_REST_KEY);
    url.searchParams.append("redirect_uri", KAKAO_REDIRECT_URI);
    url.searchParams.append("code", code);        // code - '/auth/kakao/callback'페이지가 불렸을 때, query 파라미터로 가져온 값

    const kakaoTokenRes = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    // 요청 후, access_token 발급 가능
    const accessToken = (await kakaoTokenRes.json()).access_token;

    // access_token 발급 후, kakao의 해당 유저 프로필을 받아올 수 있음.
    const userInfoRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    /** @type {KakaoMeAPIResult} */
    const me = await userInfoRes.json();
    if (!me.id) {
      res.status(500).end();
      return;
    }
    const user = await createUserOrLogin({
      platform: "kakao",
      platformUserId: me.id.toString(),
      nickname, profileImageURL,
      nickname: me.kakao_account.profile.nickname,
      profileImageURL: me.kakao_account.profile.profile_image_url,
    });
    setAccessTokenCookie(res, user.accessToken);    // 그 이후, 액세스 토큰 설정과 함께 홈으로 redirect
    res.redirect("/");
  });
}

module.exports = {
  setupKakaoLogin,
};
