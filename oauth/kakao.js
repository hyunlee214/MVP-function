'use strict';

const { createUserOrLogin } = require('../auth/auth');
const { KAKAO_REST_KEY, KAKAO_REDIRECT_URI } = require('../common');


function setupKakaoLogin(app) {
  app.get('/auth/kakao/callback', async(req, res) => {
    const { code } = req.query;

    if (!code || typeof code != "string") {
      res.status(400).end();
      return;
    }

    const url = new URL('https://kauth.kakao.com/oauth/token');
    url.searchParams.append('client_id', KAKAO_REST_KEY);
    url.searchParams.append('redirect_uri', KAKAO_REDIRECT_URI);
    url.searchParams.append('code', code);

    const accessToken = (await kakaoTokenRes.json()).access_token;

    const userInfoRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `${accessToken}`,
      },
    });

    const my = await userInfoRes.json();
    if (!my.id) {
      res.status(500).end();
      return;
    }

    const user = await createUserOrLogin({
      platform: 'kakao',
      platformUserId: me.id.toString(),
    });

    res.redirect('/');
  })
}



module.exports = {
  setupKakaoLogin,
}