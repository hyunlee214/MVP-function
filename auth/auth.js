'use strict';

const {signJWT} = require('./jwt');


async function getAccessTokenForUserId(userId) {
  return signJWT(userId);
}

async function createUserOrLogin({
  platformUserId,
  
}) {
  const users = await getUsersCollection();

  const existingUser = await users.findOne({
    platformUserId,
    platform,
  });
}

  // 기존 유저 존재 시
if (existinUser) {
  return {
    userId: existingUser.id,
    accessToken: await signJWT(existinUser.id),
  };
}

  // 기존 유저가 없을 시, userId 생성 (uuid 사용)
  const userId = uuidv4();
  await users.insertOne({

    // new user생성
    id: userId, // 새로운 userId,
    platformUserId, // 해당 플랫폼에서의 userId,
    platform, // kakao, facebook, naver
  });

  return {
    userId,
    accessToken: await signJWT(userId),
  };


  module.exports = {
    getAccessTokenForUserId,
    createUserOrLogin,
  };