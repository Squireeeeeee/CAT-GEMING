import a13_0x38b117 from "axios";
export default class Catizen {
  constructor(_0x5becd1) {
    Object.defineProperty(this, "baseURL", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "https://lg1.catizen.ai",
    });
    Object.defineProperty(this, "token", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(this, "initData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(this, "proxyAgent", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(this, "login", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: async () => {
        const _0x2d39c7 = a13_0x38b117.create(this.proxyAgent);
        const _0x3becd6 = await _0x2d39c7.post(
          this.baseURL + "/pflogin",
          {
            channelId: 1,
            bcId: 90001,
            data: {
              token: this.token,
              initdata: this.initData,
              botname: "catizenbot",
              fromtfid: "",
            },
            language: "ind",
          },
          {
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              Host: "lg1.catizen.ai",
              Origin: "https://game.catizen.ai",
              Referer: "https://game.catizen.ai/",
              "User-Agent":
                "Mozilla/5.0 (Linux; Android 9; ASUS_Z01QD Build/PQ3A.190605.05081124; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36",
              "X-Requested-With": "org.telegram.messenger",
            },
          }
        );
        return _0x3becd6.data;
      },
    });
    this.token = _0x5becd1.token || "";
    this.initData = _0x5becd1.initData;
    this.proxyAgent = _0x5becd1.proxyAgent || {};
  }
}
