import { useFocusManager, useInput } from "ink";
import { useEffect, useState } from "react";
import { groupAccounts, runtimeServer } from "../utils/helper.js";

const vF = ({
  accounts: _0x4f4545,
  onChange: _0x48dbe5
}) => {
  const { focus: _0x4752ad } = useFocusManager();
  const [v, v2] = useState(0);
  const [v3, v4] = useState([]);
  const [v5, v6] = useState({
    status: "connect",
    baner: ""
  });

  const vF2 = (p) => {
    if (p > v3.length) {
      v2(1);
    } else if (p < 1) {
      v2(v3.length);
    } else {
      v2(p);
    }
  };

  useInput((p2, p3) => {
    if (p2) {
      try {
        let vParseInt = parseInt(p2);
        if (vParseInt <= v3.length) {
          v2(vParseInt);
        }
      } catch (_0x4b2f45) {}
    }
    if (p3.upArrow) {
      vF2(v - 1);
    }
    if (p3.downArrow) {
      vF2(v + 1);
    }
    if (p3.leftArrow) {
      vF2(v - 1);
    }
    if (p3.rightArrow) {
      vF2(v + 1);
    }
    if (p3.escape) {
      _0x48dbe5("back");
    }
    if (p2 === "q") {
      _0x48dbe5("exit");
    }
  });

  useEffect(() => {
    const vF3 = async () => {
      if (v5.status === "reconnecting") {
        const v7 = await runtimeServer();
        if (v7.status === "exit") {
          _0x48dbe5("exit");
        }
        v6(v7);
      }
    };
    const vSetInterval = setInterval(vF3, 5000);
    return () => {
      clearInterval(vSetInterval);
    };
  }, [v5]);

  useEffect(() => {
    const vF4 = async () => {
      if (v5.status === "connect") {
        const v8 = await runtimeServer();
        if (v8.status === "exit") {
          _0x48dbe5("exit");
        }
        v6(v8);
      }
    };
    const vSetInterval2 = setInterval(vF4, 60000);
    return () => {
      clearInterval(vSetInterval2);
    };
  }, [v5]);

  useEffect(() => {
    if (v3.length < 1) {
      const vGroupAccounts = groupAccounts(_0x4f4545, 1);
      v4(vGroupAccounts);
      v2(1);
    }
  }, [v3]);

  useEffect(() => {
    _0x4752ad(v.toString());
  }, [v]);

  return {
    pageAccount: v3,
    runtimeStatus: v5,
    focusOn: v
  };
};

export default vF;
