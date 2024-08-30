import ProtoLoader from "./proto/protoLoader.js";

const protoLoader = new ProtoLoader();

const createEnterGameReq = (account, message) => {
  const enterGameReq = protoLoader.createEnterGameReq(
    account.accountId,
    account.token,
    account.name,
    account.time,
    account.nickName,
    account.userId,
    account.inviterId,
    account.inviterCludId
  );
  const serializedMessage = protoLoader.serizeMessage(
    "EnterGameReq",
    message,
    enterGameReq
  );
  return serializedMessage;
};

const createHeartBeatReq = (message) => {
  const serializedMessage = protoLoader.serizeMessage(
    "HeartBeatReq",
    message,
    null
  );
  return serializedMessage;
};

const createGetOffLineGoldReq = (message) => {
  const getOffLineGoldReq = protoLoader.createGetOffLineGoldReq(2);
  const serializedMessage = protoLoader.serizeMessage(
    "GetOffLineGoldReq",
    message,
    getOffLineGoldReq
  );
  return serializedMessage;
};

const createBoostGoldReq = (message) => {
  const boostGoldReq = protoLoader.createBoostGoldReq(1);
  const serializedMessage = protoLoader.serizeMessage(
    "BoostGoldReq",
    message,
    boostGoldReq
  );
  return serializedMessage;
};

const createGatherGoldReq = (message) => {
  const serializedMessage = protoLoader.serizeMessage(
    "GatherGoldReq",
    message,
    null
  );
  return serializedMessage;
};

const createMergeCatReq = (account, catId) => {
  const mergeCatReq = protoLoader.createMergeCatReq(catId);
  const serializedMessage = protoLoader.serizeMessage(
    "MergeCatReq",
    account,
    mergeCatReq
  );
  return serializedMessage;
};

const createDelCatReq = (account, catId) => {
  const delCatReq = protoLoader.createDelCatReq(catId);
  const serializedMessage = protoLoader.serizeMessage(
    "DelCatReq",
    account,
    delCatReq
  );
  return serializedMessage;
};

const createGetAirDropCatReq = (message) => {
  const serializedMessage = protoLoader.serizeMessage(
    "GetAirDropCatReq",
    message,
    null
  );
  return serializedMessage;
};

const createGetFreeCatReq = (message) => {
  const serializedMessage = protoLoader.serizeMessage(
    "GetFreeCatReq",
    message,
    null
  );
  return serializedMessage;
};

const createGetRandomEventAwardReq = (account, eventId) => {
  const getRandomEventAwardReq =
    protoLoader.createGetRandomEventAwardReq(eventId);
  const serializedMessage = protoLoader.serizeMessage(
    "GetRandomEventAwardReq",
    account,
    getRandomEventAwardReq
  );
  return serializedMessage;
};

const createGetRandomEventBoxReq = (message) => {
  const serializedMessage = protoLoader.serizeMessage(
    "GetRandomEventBoxReq",
    message,
    null
  );
  return serializedMessage;
};

const createRandomEventReq = (message) => {
  const serializedMessage = protoLoader.serizeMessage(
    "RandomEventReq",
    message,
    null
  );
  return serializedMessage;
};

const createGenerateCatReq = (account, catId, attributes) => {
  const generateCatReq = protoLoader.createGenerateCatReq(catId, attributes);
  const serializedMessage = protoLoader.serizeMessage(
    "GenerateCatReq",
    account,
    generateCatReq
  );
  return serializedMessage;
};

const decodeMessage = (message) => {
  const deserializedMessage = protoLoader.deserizeMessage(message);
  return deserializedMessage;
};

const getDuplicateLvl = (levels) => {
  let duplicates = [];
  for (let i = 0; i < levels.length; i++) {
    let currentLevel = levels[i];
    if (currentLevel === 0) {
      continue;
    }
    for (let j = 0; j < levels.length; j++) {
      let comparedLevel = levels[j];
      if (i !== j && currentLevel === comparedLevel && currentLevel !== 0) {
        duplicates.push([i, j]);
      }
    }
  }
  return duplicates;
};

const getSmallestCatsLvl = (levels) => {
  const nonZeroLevels = levels.filter((level) => level !== 0);
  const smallestLevel = Math.min(...nonZeroLevels);
  return levels.indexOf(smallestLevel);
};

export {
  createEnterGameReq,
  createHeartBeatReq,
  createGetOffLineGoldReq,
  createBoostGoldReq,
  createGatherGoldReq,
  createMergeCatReq,
  createDelCatReq,
  createGetAirDropCatReq,
  createGetFreeCatReq,
  createGetRandomEventAwardReq,
  createGetRandomEventBoxReq,
  createRandomEventReq,
  createGenerateCatReq,
  decodeMessage,
  getDuplicateLvl,
  getSmallestCatsLvl,
};
