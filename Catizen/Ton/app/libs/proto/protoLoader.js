import protobufjs from "protobufjs";
import { MESSAGE_TYPES } from "./protoMap.js";

export default class ProtoLoader {
  constructor() {
    Object.defineProperty(this, "loadProto", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(this, "deserizeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (message) => {
        const MessageType = this.loadProto.lookupType("pb.CSMessage");
        const buffer = Buffer.from(message, "hex");
        const decodedMessage = MessageType.toObject(MessageType.decode(buffer));
        if (!decodedMessage.body) {
          return {
            protoName: MESSAGE_TYPES[decodedMessage.cmdId],
          };
        }
        const bodyType = this.loadProto.lookupType(
          "pb." + MESSAGE_TYPES[decodedMessage.cmdId]
        );
        const bodyData = bodyType.toObject(
          bodyType.decode(decodedMessage.body),
          {
            longs: Number,
            enums: String,
            bytes: String,
          }
        );
        return {
          protoName: MESSAGE_TYPES[decodedMessage.cmdId],
          data: bodyData,
        };
      },
    });
    Object.defineProperty(this, "serizeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (messageType, transactionId, body) => {
        const MessageType = this.loadProto.lookupType("pb.CSMessage");
        const cmdId = Object.keys(MESSAGE_TYPES).find(
          (key) => MESSAGE_TYPES[Number(key)] === messageType
        );
        if (!cmdId) {
          throw new Error("cmdId is undefined");
        }
        let message;
        if (body === null) {
          message = {
            cmdId: parseInt(cmdId),
            transId: transactionId,
          };
        } else {
          message = {
            cmdId: parseInt(cmdId),
            transId: transactionId,
            body: body,
          };
        }
        const errMsg = MessageType.verify(message);
        if (errMsg) {
          throw Error(errMsg);
        }
        const messageInstance = MessageType.create(message);
        const serializedMessage = MessageType.encode(messageInstance).finish();
        return serializedMessage;
      },
    });
    Object.defineProperty(this, "createEnterGameReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (
        accountId,
        token,
        name,
        time,
        nickName,
        userId,
        inviterId,
        inviterClubId
      ) => {
        const EnterGameReq = this.loadProto.lookupType("pb.EnterGameReq");
        const payload = {
          accountId: accountId,
          token: token,
          name: name,
          time: time,
          nickName: nickName,
          userId: userId,
          inviterId: inviterId,
          inviterClubId: inviterClubId,
          bcId: 90001,
        };
        const errMsg = EnterGameReq.verify(payload);
        if (errMsg) {
          throw Error(errMsg);
        }
        const messageInstance = EnterGameReq.create(payload);
        const serializedMessage = EnterGameReq.encode(messageInstance).finish();
        return serializedMessage;
      },
    });
    Object.defineProperty(this, "createEnterGameReqMantle", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (
        accountId,
        token,
        name,
        time,
        nickName,
        userId,
        inviterId,
        inviterClubId
      ) => {
        const EnterGameReq = this.loadProto.lookupType("pb.EnterGameReq");
        const payload = {
          accountId: accountId,
          token: token,
          name: name,
          time: time,
          nickName: nickName,
          userId: userId,
          inviterId: inviterId,
          inviterClubId: inviterClubId,
          bcId: 5000,
        };
        const errMsg = EnterGameReq.verify(payload);
        if (errMsg) {
          throw Error(errMsg);
        }
        const messageInstance = EnterGameReq.create(payload);
        const serializedMessage = EnterGameReq.encode(messageInstance).finish();
        return serializedMessage;
      },
    });
    Object.defineProperty(this, "createGetOffLineGoldReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (type) => {
        const GetOffLineGoldReq = this.loadProto.lookupType(
          "pb.GetOffLineGoldReq"
        );
        const payload = {
          Type: type,
        };
        const errMsg = GetOffLineGoldReq.verify(payload);
        if (errMsg) {
          throw Error(errMsg);
        }
        const messageInstance = GetOffLineGoldReq.create(payload);
        const serializedMessage =
          GetOffLineGoldReq.encode(messageInstance).finish();
        return serializedMessage;
      },
    });
    Object.defineProperty(this, "createBoostGoldReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (type) => {
        const BoostGoldReq = this.loadProto.lookupType("pb.BoostGoldReq");
        const payload = {
          Type: type,
        };
        const errMsg = BoostGoldReq.verify(payload);
        if (errMsg) {
          throw Error(errMsg);
        }
        const messageInstance = BoostGoldReq.create(payload);
        const serializedMessage = BoostGoldReq.encode(messageInstance).finish();
        return serializedMessage;
      },
    });
    Object.defineProperty(this, "createGetRandomEventAwardReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (opType) => {
        const GetRandomEventAwardReq = this.loadProto.lookupType(
          "pb.GetRandomEventAwardReq"
        );
        const payload = {
          opType: opType,
        };
        const errMsg = GetRandomEventAwardReq.verify(payload);
        if (errMsg) {
          throw Error(errMsg);
        }
        const messageInstance = GetRandomEventAwardReq.create(payload);
        const serializedMessage =
          GetRandomEventAwardReq.encode(messageInstance).finish();
        return serializedMessage;
      },
    });
    Object.defineProperty(this, "createMergeCatReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (indexs) => {
        const MergeCatReq = this.loadProto.lookupType("pb.MergeCatReq");
        const payload = {
          indexs: indexs,
        };
        const errMsg = MergeCatReq.verify(payload);
        if (errMsg) {
          throw Error(errMsg);
        }
        const messageInstance = MergeCatReq.create(payload);
        const serializedMessage = MergeCatReq.encode(messageInstance).finish();
        return serializedMessage;
      },
    });
    Object.defineProperty(this, "createGenerateCatReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (lvl, type) => {
        const GenerateCatReq = this.loadProto.lookupType("pb.GenerateCatReq");
        const payload = {
          lvl: lvl,
          Type: type,
        };
        const errMsg = GenerateCatReq.verify(payload);
        if (errMsg) {
          throw Error(errMsg);
        }
        const messageInstance = GenerateCatReq.create(payload);
        const serializedMessage =
          GenerateCatReq.encode(messageInstance).finish();
        return serializedMessage;
      },
    });
    Object.defineProperty(this, "createDelCatReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (index) => {
        const DelCatReq = this.loadProto.lookupType("pb.DelCatReq");
        const payload = {
          indexs: [index],
        };
        const errMsg = DelCatReq.verify(payload);
        if (errMsg) {
          throw Error(errMsg);
        }
        const messageInstance = DelCatReq.create(payload);
        const serializedMessage = DelCatReq.encode(messageInstance).finish();
        return serializedMessage;
      },
    });
    const protoRoot = protobufjs.loadSync("./app/libs/proto/cat.proto");
    this.loadProto = protoRoot;
  }
}
