import chalk from "chalk";
import {
  createSessionDirectory,
  getAllFilesFromFolder,
  getSessionDirectory,
  getUserFromUrl,
  readJsonFile,
  runtimeServer,
  updateBanner,
  writeToFile,
} from "./app/utils/helper.js";
import { DIR_PATH_SESSION } from "./app/utils/konst.js";
import form from "./app/form.js";
import deleteAccount from "./app/deleteAccount.js";
import mainMenu from "./app/mainMenu.js";
import proxyManager from "./app/libs/proxyManager.js";
import catizen from "./app/libs/catizen.js";
import startBot from "./app/startBot.js";

createSessionDirectory(DIR_PATH_SESSION);
(async () => {
  let sessionData = await runtimeServer();
  if (sessionData.status === "exit") {
    process.stdout.write(updateBanner(sessionData.baner));
    process.exit();
  }
  let reconnectAttempts = 0;
  while (sessionData.status === "reconnecting") {
    reconnectAttempts++;
    process.stdout.write("c");
    process.stdout.write(updateBanner(sessionData.baner));
    console.log(
      chalk.yellowBright("Reconnecting ") +
        chalk.whiteBright("•".repeat(reconnectAttempts))
    );
    if (reconnectAttempts > 4) {
      reconnectAttempts = 0;
    }
    sessionData = await runtimeServer();
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  process.stdout.write("c");
  process.stdout.write(updateBanner(sessionData.baner));
  process.stdout.write("c");
  while (true) {
    const menuOption = await mainMenu(sessionData.baner);
    if (menuOption === "exit") {
      process.exit();
    }
    if (menuOption === "1") {
      var files = getAllFilesFromFolder(DIR_PATH_SESSION);
      let accounts = [];
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (file) {
          var accountData = readJsonFile(file);
          accounts.push(accountData);
        }
      }
      if (files.length < 1) {
        await form(
          chalk.yellowBright(
            "Account is empty, please add account before start bot"
          ) +
            "\n" +
            chalk.blackBright("Press Enter To Back"),
          sessionData.baner
        );
      } else {
        const startResult = await startBot(accounts, sessionData.baner);
        if (startResult === "exit") {
          process.exit();
        }
      }
    }
    if (menuOption === "2") {
      const initDataInput = await form(
        "Enter your init_data",
        sessionData.baner
      );
      let userData;
      try {
        userData = getUserFromUrl(initDataInput);
      } catch (error) {
        await form(
          chalk.yellowBright("WTF with your input, Check your input moron!") +
            "\n" +
            chalk.blackBright("Press Enter To Back"),
          sessionData.baner
        );
        continue;
      }
      let proxyConfig = {
        use_proxy: false,
        proxy_hostname: "",
        proxy_protocol: "socks5",
        proxy_port: 0,
        proxy_username: "",
        proxy_password: "",
      };
      const catizenInstance = new catizen({
        token: "",
        initData: initDataInput,
      });
      const loginResponse = await catizenInstance.login();
      if ("code" in loginResponse) {
        if (loginResponse.code === 106) {
          await form(
            chalk.redBright("Catizen on Maintenance") +
              "\n" +
              chalk.blackBright("Press Enter To Back"),
            sessionData.baner
          );
        }
        if (loginResponse.code === 2) {
          await form(
            chalk.redBright(
              "Invalid Credentials, Please Recapture Credentials"
            ) +
              "\n" +
              chalk.blackBright("Press Enter To Back"),
            sessionData.baner
          );
        }
      } else {
        try {
          const useProxy = await form(
            "Do you want to use proxy " +
              chalk.whiteBright("?") +
              " " +
              chalk.blackBright("y/n"),
            sessionData.baner
          );
          if (useProxy === "y" || useProxy === "Y") {
            let proxySetup = true;
            while (proxySetup) {
              const hostname = await form(
                chalk.yellowBright("For now we only use socks5 proxy") +
                  "\n\n" +
                  chalk.white("Enter Hostname or Ip Address"),
                sessionData.baner
              );
              const port = await form(
                chalk.yellowBright("For now we only use socks5 proxy") +
                  "\n\n" +
                  chalk.white("Enter Port"),
                sessionData.baner
              );
              const username = await form(
                chalk.yellowBright("For now we only use socks5 proxy") +
                  "\n\n" +
                  chalk.white("Enter Username") +
                  " " +
                  chalk.blackBright("(leave blank if not sure)"),
                sessionData.baner
              );
              const password = await form(
                chalk.yellowBright("For now we only use socks5 proxy") +
                  "\n\n" +
                  chalk.white("Enter Password") +
                  " " +
                  chalk.blackBright("(leave blank if not sure)"),
                sessionData.baner
              );
              const proxyInstance = new proxyManager({
                host: hostname,
                protocol: "socks5",
                port: parseInt(port),
                username: username,
                password: password,
              });
              const testResult = await proxyInstance.testSpeed(
                "https://ifconfig.me/ip"
              );
              if (testResult.status) {
                const latencyDisplay = (latency) => {
                  if (latency < 100) {
                    return chalk.greenBright(latency);
                  } else if (latency >= 100) {
                    return chalk.yellowBright(latency);
                  } else {
                    return chalk.redBright(latency);
                  }
                };
                await form(
                  "Proxy Connected\n" +
                    chalk.whiteBright("Latency") +
                    " " +
                    latencyDisplay(testResult.duration) +
                    " " +
                    chalk.whiteBright("ms") +
                    "\n" +
                    chalk.blackBright("Press Enter Save Credentials"),
                  sessionData.baner
                );
                proxySetup = false;
                proxyConfig = {
                  use_proxy: true,
                  proxy_hostname: hostname,
                  proxy_protocol: "socks5",
                  proxy_port: parseInt(port),
                  proxy_username: username,
                  proxy_password: password,
                };
                break;
              } else {
                const retryProxy = await form(
                  chalk.redBright(testResult.message) +
                    "\nDo you want to re enter proxy " +
                    chalk.whiteBright("?") +
                    " " +
                    chalk.blackBright("y/n"),
                  sessionData.baner
                );
                if (retryProxy === "n" || retryProxy === "N") {
                  proxySetup = false;
                  proxyConfig = {
                    use_proxy: false,
                    proxy_hostname: "",
                    proxy_protocol: "socks5",
                    proxy_port: 0,
                    proxy_username: "",
                    proxy_password: "",
                  };
                  break;
                }
              }
            }
          }
          writeToFile(
            getSessionDirectory(DIR_PATH_SESSION) +
              "/" +
              userData.username +
              ".json",
            JSON.stringify({
              username: userData.username,
              access_token: "",
              init_data: initDataInput,
              ...proxyConfig,
            })
          );
          await form(
            chalk.greenBright("Success To Add Login") +
              "\n" +
              chalk.blackBright("Press Enter To Back"),
            sessionData.baner
          );
        } catch (error) {
          await form(
            chalk.redBright("Something went wrong") +
              "\n" +
              chalk.blackBright("Press Enter To Back"),
            sessionData.baner
          );
          continue;
        }
      }
    }
    if (menuOption === "3") {
      try {
        var files = getAllFilesFromFolder(DIR_PATH_SESSION);
        let accountList = [];
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          if (file) {
            var accountData = readJsonFile(file);
            accountList.push({
              name: accountData.username,
              location: file,
            });
          }
        }
        if (accountList.length > 0) {
          const deleteResult = await deleteAccount(
            accountList,
            sessionData.baner
          );
          if (deleteResult === "exit") {
            process.exit();
          }
        } else {
          await form(
            chalk.redBright("Account is empty") +
              "\n" +
              chalk.blackBright("Press Enter To Back"),
            sessionData.baner
          );
          continue;
        }
      } catch (error) {
        await form(
          chalk.redBright("Something went wrong") +
            "\n" +
            chalk.blackBright("Press Enter To Back"),
          sessionData.baner
        );
        continue;
      }
    }
  }
})();
