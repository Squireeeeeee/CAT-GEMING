import a17_0xbf17c1 from "axios";
import { HttpProxyAgent } from "http-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";
var ProxyType;
(function (_0x13a84c) {
  _0x13a84c.HTTP = "http";
  _0x13a84c.SOCKS4 = "socks4";
  _0x13a84c.SOCKS5 = "socks5";
})((ProxyType ||= {}));
class ProxyManager {
  constructor({
    host: _0x458672,
    protocol: _0x3b8d18,
    port: _0x2ec7ff,
    username: _0xe8a92,
    password: _0x3e4c6c,
  }) {
    Object.defineProperty(this, "proxyUrl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(this, "proxyAuth", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: null,
    });
    Object.defineProperty(this, "proxyType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined,
    });
    this.proxyType = this.determineProxyType(_0x3b8d18);
    if (_0xe8a92 && _0xe8a92 !== "" && _0x3e4c6c && _0x3e4c6c !== "") {
      this.proxyAuth = _0xe8a92 + ":" + _0x3e4c6c;
      this.proxyUrl =
        _0x3b8d18 + "://" + this.proxyAuth + "@" + _0x458672 + ":" + _0x2ec7ff;
    } else {
      this.proxyUrl = _0x3b8d18 + "://" + _0x458672 + ":" + _0x2ec7ff;
    }
  }
  determineProxyType(_0x560231) {
    if (_0x560231 === "http" || _0x560231 === "https") {
      throw new Error("Unsupported http or https proxy protocol");
    } else if (_0x560231 === "socks4") {
      return ProxyType.SOCKS4;
    } else if (_0x560231 === "socks5") {
      return ProxyType.SOCKS5;
    } else {
      throw new Error("Unsupported proxy protocol");
    }
  }
  createAgent() {
    switch (this.proxyType) {
      case ProxyType.HTTP:
        return new HttpProxyAgent(this.proxyUrl);
      case ProxyType.SOCKS4:
      case ProxyType.SOCKS5:
        return new SocksProxyAgent(this.proxyUrl);
      default:
        throw new Error("Unsupported proxy protocol");
    }
  }
  async testSpeed(_0x3d3cb1) {
    const _0x8726fd = this.createAgent();
    const _0x39dcdf = Date.now();
    try {
      await a17_0xbf17c1.get(_0x3d3cb1, {
        httpAgent: _0x8726fd,
        httpsAgent: _0x8726fd,
      });
      const _0x3dd555 = Date.now() - _0x39dcdf;
      return {
        status: true,
        duration: _0x3dd555,
      };
    } catch (_0x26c91e) {
      if (_0x26c91e instanceof Error) {
        return {
          status: false,
          message: _0x26c91e.message,
        };
      } else {
        return {
          status: false,
          message: _0x26c91e.toString(),
        };
      }
    }
  }
  createAxios() {
    const _0x9eb239 = this.createAgent();
    return {
      httpAgent: _0x9eb239,
      httpsAgent: _0x9eb239,
    };
  }
  createWebSocket() {
    const _0x48b0dd = this.createAgent();
    return {
      agent: _0x48b0dd,
    };
  }
}
export default ProxyManager;
