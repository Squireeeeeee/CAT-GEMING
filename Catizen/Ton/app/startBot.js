import React from "react";
import { render } from "ink";
import StartBotComponent from "./components/startBotComponent.js";

async function StartBot(accounts, banner) {
  return new Promise((resolve) => {
    let result;
    const { waitUntilExit } = render(
      React.createElement(StartBotComponent, {
        accounts: accounts,
        banner: banner,
        onChange: (newResult) => {
          result = newResult;
          resolve(result);
        },
      })
    );
    waitUntilExit();
  });
}

export default StartBot;
