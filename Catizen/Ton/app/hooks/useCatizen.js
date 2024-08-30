import { useEffect, useState } from "react";
import { WebSocketClient } from "../libs/websocket.js";
import a9_0x4d122e from "../libs/catizen.js";
import { createEnterGameReq } from "../libs/helper.js";
import a9_0x1c7cb1 from "chalk";
import { convertTimestamp, getCurrentTime } from "../utils/helper.js";
import a9_0x3cca78 from "../libs/proxyManager.js";
const useCatizen = (_0x480113) => {
  const [_0x3b1e13, _0x335256] = useState(null);
  const [_0x5c9d31, _0x3b4cae] = useState([]);
  const [_0x2f6f98, _0x4d99e9] = useState(false);
  const [_0x4e4de3, _0x296e2e] = useState(true);
  const [_0x36dc80, _0x26b438] = useState();
  const [_0x1e272f, _0x5b17c1] = useState(null);
  const [_0x38a7b4, _0x4a0aa9] = useState(0);
  const [_0x51b610, _0x8e9f97] = useState({
    status: false,
    message: "",
    duration: 0,
  });
  useEffect(() => {
    const _0x43cacb = async () => {
      while (true) {
        try {
          let _0x41f4d;
          if (_0x480113.use_proxy) {
            const _0xc456c2 = new a9_0x3cca78({
              host: _0x480113.proxy_hostname,
              protocol: _0x480113.proxy_protocol,
              port: _0x480113.proxy_port,
              username: _0x480113.proxy_username,
              password: _0x480113.proxy_password,
            });
            _0x41f4d = _0xc456c2.createAxios();
          }
          const _0x566652 = new a9_0x4d122e({
            token: _0x480113.access_token,
            initData: _0x480113.init_data,
            proxyAgent: _0x41f4d,
          });
          _0x335256(a9_0x1c7cb1.yellowBright("Getting User Credentials"));
          const _0x327895 = await _0x566652.login();
          if ("code" in _0x327895) {
            if (_0x327895.code === 106) {
              _0x335256(a9_0x1c7cb1.yellowBright("Catizen on Maintenance"));
            } else if (_0x327895.code === 2) {
              _0x335256(
                a9_0x1c7cb1.redBright(
                  "Invalid Credentials, Please Recapture Credentials"
                )
              );
            }
            return null;
          }
          return _0x327895;
        } catch (_0x1df03f) {
          _0x335256(
            a9_0x1c7cb1.redBright(
              "Error while getting credentials. Try again on 5 seconds"
            )
          );
          await new Promise((_0x19ff17) => setTimeout(_0x19ff17, 5000));
        }
      }
    };
    const _0x3cf968 = async (_0x27b246) => {
      while (true) {
        try {
          _0x335256(a9_0x1c7cb1.yellowBright("Creating User Credentials"));
          const _0x48a7fa = createEnterGameReq(_0x27b246, 1);
          return _0x48a7fa;
        } catch (_0x4ed436) {
          _0x335256(
            a9_0x1c7cb1.redBright(
              "Error while creating credentials. Try again on 5 seconds"
            )
          );
          await new Promise((_0x1616d8) => setTimeout(_0x1616d8, 5000));
        }
      }
    };
    const _0x16dcef = async () => {
      if (!_0x2f6f98 && _0x4e4de3) {
        const _0x50360a = await _0x43cacb();
        if (_0x50360a === null) {
          return;
        }
        const _0x5d4f21 = await _0x3cf968(_0x50360a);
        let _0x2215d;
        if (_0x480113.use_proxy) {
          const _0x10d585 = new a9_0x3cca78({
            host: _0x480113.proxy_hostname,
            protocol: _0x480113.proxy_protocol,
            port: _0x480113.proxy_port,
            username: _0x480113.proxy_username,
            password: _0x480113.proxy_password,
          });
          _0x2215d = _0x10d585.createWebSocket();
        }
        _0x335256(a9_0x1c7cb1.yellowBright("Connecting To Game Server"));
        const _0x16c266 = new WebSocketClient({
          url: _0x50360a.addr,
          credentials: _0x5d4f21,
          websocketOption: _0x2215d,
        });
        _0x16c266.onEvents((_0x5a8889) => {
          if (_0x5a8889.event === "open") {
            _0x335256(a9_0x1c7cb1.yellowBright("Connection Opened"));
          }
          if (_0x5a8889.event === "connect") {
            _0x335256(a9_0x1c7cb1.yellowBright("Connection Connected"));
            _0x4d99e9(true);
            _0x296e2e(false);
            if (_0x16c266.user) {
              _0x26b438(_0x16c266.user);
            }
          }
          if (_0x5a8889.event === "close") {
            _0x16c266.close();
            _0x4d99e9(false);
            _0x296e2e(true);
            _0x3b4cae([]);
            _0x335256(a9_0x1c7cb1.yellowBright("Connection Closed"));
            _0x335256(a9_0x1c7cb1.yellowBright("Reconnecting"));
          }
          if (_0x5a8889.event === "error") {
            _0x16c266.close();
            _0x4d99e9(false);
            _0x296e2e(true);
            _0x3b4cae([]);
            _0x335256(a9_0x1c7cb1.yellowBright("Connection Error"));
          }
          if (_0x5a8889.event === "user") {
            if (_0x16c266.user) {
              _0x26b438(_0x16c266.user);
            }
          }
        });
        _0x16c266.onLogs((_0x188782) => {
          _0x3b4cae((_0x516028) => {
            const _0x32e8b0 = getCurrentTime() + " " + _0x188782;
            const _0x5e87e4 = Math.floor(process.stdout.rows - 34);
            let _0x57db4b = _0x5e87e4 > 2 ? _0x5e87e4 : 2;
            const _0x155587 = _0x516028.length + 1 - _0x57db4b;
            const _0x2e0ccd =
              _0x155587 > 0
                ? [..._0x516028.slice(_0x155587), _0x32e8b0]
                : [..._0x516028, _0x32e8b0];
            return _0x2e0ccd;
          });
        });
      }
    };
    _0x335256(a9_0x1c7cb1.yellowBright("Initialization"));
    const _0x2ef2e1 = setTimeout(_0x16dcef, 5000);
    return () => clearTimeout(_0x2ef2e1);
  }, [_0x2f6f98, _0x4e4de3]);
  useEffect(() => {
    const _0xe4c8a7 = async () => {
      if (_0x480113.use_proxy) {
        if (_0x38a7b4 > 0) {
          _0x4a0aa9(_0x38a7b4 - 1);
        }
        if (_0x38a7b4 < 1) {
          _0x4a0aa9(60);
          const _0x550577 = new a9_0x3cca78({
            host: _0x480113.proxy_hostname,
            protocol: _0x480113.proxy_protocol,
            port: _0x480113.proxy_port,
            username: _0x480113.proxy_username,
            password: _0x480113.proxy_password,
          });
          const _0x534cc3 = await _0x550577.testSpeed("https://ifconfig.me/ip");
          _0x8e9f97(_0x534cc3);
        }
      }
    };
    const _0x1d55ba = setInterval(_0xe4c8a7, 1000);
    return () => clearInterval(_0x1d55ba);
  }, [_0x38a7b4]);
  useEffect(() => {
    const _0x455369 = () => {
      if (_0x2f6f98 && _0x36dc80) {
        if (
          parseInt("" + _0x36dc80.boostEndTime) -
            Math.floor(Date.now() / 1000) >
          0
        ) {
          _0x5b17c1(
            convertTimestamp(
              parseInt("" + _0x36dc80.boostEndTime) -
                Math.floor(Date.now() / 1000)
            ) +
              " " +
              a9_0x1c7cb1.greenBright("Gold Boost")
          );
        } else {
          _0x5b17c1(
            convertTimestamp(
              Math.floor(parseInt("" + _0x36dc80.boostEndTime) + 7200) -
                Math.floor(Date.now() / 1000)
            ) +
              " " +
              a9_0x1c7cb1.yellowBright("Next Boost")
          );
        }
      }
    };
    const _0x4e7f4b = setInterval(_0x455369, 1000);
    return () => clearInterval(_0x4e7f4b);
  }, [_0x2f6f98, _0x36dc80]);
  const _0xbffe0b = (_0x37dfbc) => {
    if (_0x37dfbc <= 100) {
      return a9_0x1c7cb1.greenBright(_0x37dfbc);
    } else if (_0x37dfbc <= 1000) {
      return a9_0x1c7cb1.yellowBright(_0x37dfbc);
    } else {
      return a9_0x1c7cb1.redBright(_0x37dfbc);
    }
  };
  return {
    message: _0x3b1e13,
    logs: _0x5c9d31,
    user: _0x36dc80,
    isConnected: _0x2f6f98,
    boostGame: _0x1e272f,
    proxyStatus: _0x51b610,
    colorDuration: _0xbffe0b,
  };
};
export default useCatizen;
