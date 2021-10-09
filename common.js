const HOST = "https://"     

const FB_APP_ID             = process.env.FB_APP_ID;
const FB_CLIENT_SECRET      = process.env.FB_CLIENT_SECRET;

const NAVER_CLIENT_ID       = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET   = process.env.NAVER_CLIENT_SECRET;
const NAVER_REDIRECT_URI    = `https://${HOST}/naver/callback`;

const KAKAO_JAVASCRIPT_KEY  = process.env.KAKAO_JAVASCRIPT_KEY;
const KAKAO_REST_KEY        = process.env.KAKAO_REST_KEY;
const KAKAO_REDIRECT_URI    = `https://${HOST}/kakao/callback`;

const APP_CONFIG_JSON = JSON.stringify({
  HOST,
  FB_APP_ID,
  NAVER_CLIENT_ID,
  NAVER_REDIRECT_URI,
  KAKAO_JAVASCRIPT_KEY,
  KAKAO_REDIRECT_URI,
  KAKAO_REST_KEY,
}).replace(/"/g, '\\"');

module.exports = {
  HOST,
  FB_APP_ID,
  FB_CLIENT_SECRET,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
  NAVER_REDIRECT_URI,
  KAKAO_REDIRECT_URI,
  KAKAO_REST_KEY,
  APP_CONFIG_JSON,
};
