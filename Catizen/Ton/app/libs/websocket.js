import WebSocket from "ws";
import {
  createBoostGoldReq,
  createDelCatReq,
  createGatherGoldReq,
  createGenerateCatReq,
  createGetAirDropCatReq,
  createGetFreeCatReq,
  createGetOffLineGoldReq,
  createGetRandomEventAwardReq,
  createGetRandomEventBoxReq,
  createHeartBeatReq,
  createMergeCatReq,
  createRandomEventReq,
  decodeMessage,
  getDuplicateLvl,
  getSmallestCatsLvl,
} from "./helper.js";
import { formatNumber, getOrdinalSuffix } from "../utils/helper.js";
import chalk from "chalk";

export class WebSocketClient {
  constructor(config) {
    Object.defineProperty(this, "url", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(this, "credentials", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(this, "websocketOption", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(this, "transId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1,
    });
    Object.defineProperty(this, "ws", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(this, "logCallback", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(this, "eventCallback", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(this, "isConnected", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false,
    });
    Object.defineProperty(this, "user", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: null,
    });
    Object.defineProperty(this, "connect", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        this.ws = new WebSocket(this.url, this.websocketOption);
        this.ws.on("open", () => {
          this.send(this.credentials);
          this.setOnEvents({
            event: "open",
          });
        });
        this.ws.on("message", (message) => {
          this.handleMessage(message);
        });
        this.ws.on("close", () => {
          this.isConnected = false;
          this.transId = 1;
          this.setOnEvents({
            event: "close",
          });
        });
        this.ws.on("error", (error) => {
          this.setOnLogs("" + chalk.redBright("WebSocket error: " + error));
          this.isConnected = false;
          this.transId = 1;
          this.setOnEvents({
            event: "error",
          });
        });
      },
    });
    Object.defineProperty(this, "setOnLogs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (log) => {
        if (this.logCallback) {
          this.logCallback(log);
        }
      },
    });
    Object.defineProperty(this, "setOnEvents", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (event) => {
        if (this.eventCallback) {
          this.eventCallback(event);
        }
      },
    });
    Object.defineProperty(this, "handleMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (message) => {
        const decodedMessage = decodeMessage(message.toString("hex"));
        switch (decodedMessage.protoName) {
          case "EnterGameAck":
            this.user = decodedMessage.data.userInfo;
            this.runtimeHeartBeatReq();
            this.runtimeCheckBoostGold();
            this.runtimeCheckRandomEventBoxLeft();
            this.runtimeGatherGoldReq();
            this.runtimeGetAirDropCatReq();
            this.runtimeRandomEventReq();
            this.runtimeGetFreeCatReq();
            this.isConnected = true;
            this.checkMergerOrDeleteCats();
            this.setOnLogs("" + chalk.greenBright("Connected to game server"));
            this.setOnEvents({
              event: "connect",
            });
            break;
          case "OffLineGoldNtf":
            this.sendGetOflineGold();
            break;
          case "GetOffLineGoldAck":
            if (this.user) {
              const collectedGold = formatNumber(
                parseInt(decodedMessage.data.gold) - parseInt(this.user.gold)
              );
              this.user.offGold = decodedMessage.data.offGold;
              this.user.gold = decodedMessage.data.gold;
              this.user.goldTime = decodedMessage.data.goldTime;
              this.user.fishCoin = decodedMessage.data.fishCoin;
              this.setOnLogs(
                chalk.greenBright("Collected Offline Gold") +
                  " " +
                  chalk.whiteBright(collectedGold)
              );
              this.setOnEvents({
                event: "user",
              });
            }
            break;
          case "GatherGoldAck":
            if (this.user) {
              const gatheredGold = formatNumber(
                parseInt(decodedMessage.data.gold) - parseInt(this.user.gold)
              );
              this.user.gold = decodedMessage.data.gold;
              this.user.goldTime = decodedMessage.data.goldTime;
              this.setOnLogs(
                chalk.greenBright("Collected") +
                  " " +
                  chalk.whiteBright(gatheredGold) +
                  " " +
                  chalk.greenBright("Gold")
              );
              this.setOnEvents({
                event: "user",
              });
            }
            break;
          case "BoostGoldAck":
            if (this.user) {
              this.user.boostEndTime = decodedMessage.data.boostEndTime;
              this.user.fishCoin = decodedMessage.data.fishCoin;
              this.setOnLogs("" + chalk.cyanBright("Activating Gold Boost"));
              this.setOnEvents({
                event: "user",
              });
            }
            break;
          case "GetFreeCatAck":
            if (decodedMessage.data) {
              this.sendGenerateCatReq(decodedMessage.data.catLvl, 3);
              this.setOnLogs(
                chalk.yellowBright("Free Cats LVL") +
                  " " +
                  chalk.whiteBright(decodedMessage.data.catLvl) +
                  " " +
                  chalk.yellowBright("Appear")
              );
            }
            break;
          case "GetAirDropCatAck":
            if (this.user) {
              if (decodedMessage.data.airdropIndex !== -1) {
                this.user.cats = decodedMessage.data.cats;
                this.checkMergerOrDeleteCats();
                if (decodedMessage.data.airdropIndex !== undefined) {
                  this.setOnLogs(
                    chalk.magentaBright("Got Airdrop Cat LVL") +
                      " " +
                      chalk.whiteBright(
                        decodedMessage.data.cats[
                          decodedMessage.data.airdropIndex
                        ]
                      )
                  );
                }
                this.setOnEvents({
                  event: "user",
                });
              }
            }
            break;
          case "GenerateCatAck":
            if (this.user) {
              this.user.cats[decodedMessage.data.index] =
                decodedMessage.data.catLvl;
              this.user.gold = decodedMessage.data.gold;
              this.user.fishCoin = decodedMessage.data.fishCoin;
              this.checkMergerOrDeleteCats();
              this.setOnEvents({
                event: "user",
              });
              if (
                parseInt(this.user.gold) === parseInt(decodedMessage.data.gold)
              ) {
                this.setOnLogs(
                  chalk.magentaBright("Generate Free Cats LVL") +
                    " " +
                    chalk.whiteBright(decodedMessage.data.catLvl)
                );
              } else {
                this.setOnLogs(
                  chalk.magentaBright("Buy Cats LVL") +
                    " " +
                    chalk.whiteBright(decodedMessage.data.catLvl)
                );
              }
            }
            break;
          case "MergeCatAck":
            if (this.user) {
              this.user.cats = decodedMessage.data.cats;
              this.checkMergerOrDeleteCats();
              this.setOnEvents({
                event: "user",
              });
            }
            break;
          case "DelCatAck":
            if (this.user) {
              this.user.cats = decodedMessage.data.cats;
              this.setOnEvents({
                event: "user",
              });
            }
            break;
          case "RandomEventAck":
            if (this.user) {
              this.user.randomEvent = decodedMessage.data.randomEventData;
              this.sendGetRandomEventAwardReq();
              this.setOnLogs("" + chalk.yellowBright("Random Event Appear"));
            }
            break;
          case "GetRandomEventAwardAck":
            if (this.user) {
              this.user.randomEvent = decodedMessage.data.randomEventData;
              if (this.user.randomEvent.type === 1) {
                this.sendGetRandomEventBoxReq();
              } else {
                this.setOnLogs("" + chalk.cyanBright("Get Boost Gold Event"));
              }
            }
            break;
          case "GetRandomEventBoxAck":
            if (this.user) {
              this.user.randomEvent = decodedMessage.data.randomEventData;
              this.user.cats = decodedMessage.data.cats;
              this.checkMergerOrDeleteCats();
              this.setOnLogs("" + chalk.cyanBright("Got Cats Box Event"));
            }
            break;
          case "HeartBeatAck":
            break;
          default:
        }
      },
    });
    Object.defineProperty(this, "runtimeHeartBeatReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const sendHeartBeat = () => {
          if (this.user && this.isConnected) {
            try {
              this.transId++;
              const heartBeatReq = createHeartBeatReq(this.transId);
              this.send(heartBeatReq);
            } catch (error) {}
          }
        };
        setInterval(sendHeartBeat, 1000);
      },
    });
    Object.defineProperty(this, "runtimeCheckBoostGold", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const checkBoostGold = () => {
          if (this.user && this.isConnected) {
            if (
              this.user &&
              Math.floor(
                parseInt("" + this.user.boostEndTime) -
                  Math.floor(Date.now() / 1000)
              ) < 1
            ) {
              const boostEndTime = parseInt("" + this.user.boostEndTime) + 7200;
              if (Math.floor(Date.now() / 1000) > boostEndTime) {
                try {
                  this.transId++;
                  const boostGoldReq = createBoostGoldReq(this.transId);
                  this.send(boostGoldReq);
                } catch (error) {}
              }
            }
          }
        };
        setInterval(checkBoostGold, 1000);
      },
    });
    Object.defineProperty(this, "runtimeCheckRandomEventBoxLeft", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const checkRandomEventBoxLeft = () => {
          if (this.user) {
            if (
              this.user.cats.filter((cat) => cat === 0).length > 0 &&
              this.user.randomEvent.boxNum !== undefined &&
              this.user.randomEvent.boxNum > 0
            ) {
              this.sendGetRandomEventBoxReq();
            }
          }
        };
        setInterval(checkRandomEventBoxLeft, 1000);
      },
    });
    Object.defineProperty(this, "runtimeGatherGoldReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const gatherGold = () => {
          if (this.user && this.isConnected) {
            try {
              this.transId++;
              const gatherGoldReq = createGatherGoldReq(this.transId);
              this.send(gatherGoldReq);
            } catch (error) {}
          }
        };
        setInterval(gatherGold, 10000);
      },
    });
    Object.defineProperty(this, "runtimeGetAirDropCatReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const getAirDropCat = () => {
          if (this.user && this.isConnected) {
            try {
              this.transId++;
              const airDropCatReq = createGetAirDropCatReq(this.transId);
              this.send(airDropCatReq);
            } catch (error) {}
          }
        };
        setInterval(getAirDropCat, 25000);
      },
    });
    Object.defineProperty(this, "runtimeGetFreeCatReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const getFreeCat = () => {
          if (this.user && this.isConnected) {
            try {
              this.transId++;
              const freeCatReq = createGetFreeCatReq(this.transId);
              this.send(freeCatReq);
            } catch (error) {}
          }
        };
        setInterval(getFreeCat, 30000);
      },
    });
    Object.defineProperty(this, "runtimeRandomEventReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const randomEvent = () => {
          if (this.user && this.isConnected) {
            try {
              this.transId++;
              const randomEventReq = createRandomEventReq(this.transId);
              this.send(randomEventReq);
            } catch (error) {}
          }
        };
        setInterval(randomEvent, 30000);
      },
    });
    Object.defineProperty(this, "sendGetOflineGold", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        if (this.user && this.isConnected) {
          try {
            this.transId++;
            const getOffLineGoldReq = createGetOffLineGoldReq(this.transId);
            this.send(getOffLineGoldReq);
          } catch (error) {}
        }
      },
    });
    Object.defineProperty(this, "sendGenerateCatReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (catLvl, type) => {
        if (this.user && this.isConnected) {
          try {
            this.transId++;
            const generateCatReq = createGenerateCatReq(
              this.transId,
              catLvl,
              type
            );
            this.send(generateCatReq);
          } catch (error) {}
        }
      },
    });
    Object.defineProperty(this, "sendGetRandomEventAwardReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        if (this.user && this.isConnected) {
          try {
            this.transId++;
            const getRandomEventAwardReq = createGetRandomEventAwardReq(
              this.transId,
              2
            );
            this.send(getRandomEventAwardReq);
          } catch (error) {}
        }
      },
    });
    Object.defineProperty(this, "sendGetRandomEventBoxReq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        if (this.user && this.isConnected) {
          try {
            this.transId++;
            const getRandomEventBoxReq = createGetRandomEventBoxReq(
              this.transId
            );
            this.send(getRandomEventBoxReq);
          } catch (error) {}
        }
      },
    });
    Object.defineProperty(this, "checkMergerOrDeleteCats", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        if (this.user && this.isConnected) {
          const duplicateLvls = getDuplicateLvl(this.user.cats);
          if (duplicateLvls.length > 0 && duplicateLvls[0] !== undefined) {
            try {
              this.transId++;
              const mergeCatReq = createMergeCatReq(
                this.transId,
                duplicateLvls[0]
              );
              this.setOnLogs(
                chalk.greenBright("Mate The") +
                  " " +
                  chalk.whiteBright(getOrdinalSuffix(duplicateLvls[0][0] + 1)) +
                  " " +
                  chalk.greenBright("And") +
                  " " +
                  chalk.whiteBright(getOrdinalSuffix(duplicateLvls[0][1] + 1)) +
                  " " +
                  chalk.greenBright("Cats")
              );
              this.send(mergeCatReq);
            } catch (error) {}
          } else if (this.user.cats.filter((cat) => cat === 0).length < 2) {
            const smallestCatLvl = getSmallestCatsLvl(this.user.cats);
            try {
              if (this.user.cats[smallestCatLvl] !== 0) {
                this.transId++;
                const delCatReq = createDelCatReq(this.transId, smallestCatLvl);
                this.setOnLogs(
                  chalk.redBright("Delete Cats LVL") +
                    " " +
                    chalk.whiteBright(this.user.cats[smallestCatLvl])
                );
                this.send(delCatReq);
              }
            } catch (error) {}
          }
        }
      },
    });
    Object.defineProperty(this, "onLogs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (callback) => {
        this.logCallback = callback;
      },
    });
    Object.defineProperty(this, "onEvents", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (callback) => {
        this.eventCallback = callback;
      },
    });
    Object.defineProperty(this, "send", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (message) => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(message);
        }
      },
    });
    Object.defineProperty(this, "close", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        if (this.ws) {
          this.ws.close();
          this.isConnected = false;
          this.ws = null;
        }
      },
    });
    this.url = config.url;
    this.credentials = config.credentials;
    this.websocketOption = config.websocketOption || {};
    this.ws = null;
    this.connect();
  }
}
