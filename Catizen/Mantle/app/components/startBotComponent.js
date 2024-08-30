import a6_0x497046 from "react";
import { Box, Text } from "ink";
import a6_0x14855a from "ink-spinner";
import a6_0x1b4fd7 from "chalk";
import a6_0x385eab from "./pageComponent.js";
import { updateBanner } from "../utils/helper.js";
import a6_0x5906b3 from "../hooks/useStartBot.js";

const vF = ({
  accounts: _0x2dcbfd,
  banner: _0x374b6a,
  onChange: _0x383041
}) => {
  const {
    pageAccount: _0x4c247b,
    runtimeStatus: _0x1d777f,
    focusOn: _0x37c1be
  } = a6_0x5906b3({
    accounts: _0x2dcbfd,
    onChange: _0x383041
  });

  return a6_0x497046.createElement(Box, {
    flexDirection: "column",
    width: 52
  }, a6_0x497046.createElement(Text, null, updateBanner(_0x374b6a)), a6_0x497046.createElement(Box, {
    flexDirection: "column",
    marginTop: -1,
    marginX: -1,
    borderStyle: {
      topLeft: "",
      top: "",
      topRight: "",
      bottomLeft: "",
      bottom: "~",
      bottomRight: "",
      right: "",
      left: ""
    }
  }, a6_0x497046.createElement(Box, {
    flexDirection: "column",
    marginRight: 2
  }, _0x1d777f.status === "reconnecting" && a6_0x497046.createElement(Text, {
    color: "yellowBright"
  }, "Reconnecting ", a6_0x497046.createElement(a6_0x14855a, null)), a6_0x497046.createElement(Box, {
    flexDirection: "column",
    display: _0x1d777f.status !== "reconnecting" && "flex" || "none"
  }, a6_0x497046.createElement(Box, {
    justifyContent: "center"
  }, a6_0x497046.createElement(Text, null, _0x37c1be, " / ", _0x4c247b.length)), _0x4c247b.map((p, p2) => a6_0x497046.createElement(a6_0x385eab, {
    key: p2,
    accounts: p,
    id: (p2 + 1).toString()
  })), a6_0x497046.createElement(Box, {
    marginTop: -1
  }, 
    a6_0x497046.createElement(Text, null, 
      `${a6_0x1b4fd7.magenta("[")}${a6_0x1b4fd7.white("CTRL")}${a6_0x1b4fd7.blackBright(" + ")}${a6_0x1b4fd7.white("C")}${a6_0x1b4fd7.magenta("]")}${a6_0x1b4fd7.blackBright(" or ")}${a6_0x1b4fd7.white("Q")}${a6_0x1b4fd7.blackBright(" for exit, ")}${a6_0x1b4fd7.white("ESC")}${a6_0x1b4fd7.blackBright(" for back")}`)
    )
  ))));
};

export default vF;
