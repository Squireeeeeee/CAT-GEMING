import a7_0x318c4d from "react";
import a7_0x5a27db from "./components/deleteAccountComponent.js";
import { render } from "ink";
async function DeleteAccount(_0x5d6a74, _0x4f7e64) {
  return new Promise((_0x29713c) => {
    let _0x3d2e16;
    const { waitUntilExit: _0x532341 } = render(
      a7_0x318c4d.createElement(a7_0x5a27db, {
        accounts: _0x5d6a74,
        banner: _0x4f7e64,
        onChange: (_0x31ed4b) => {
          _0x3d2e16 = _0x31ed4b;
          _0x29713c(_0x3d2e16);
        },
      })
    );
    _0x532341();
  });
}
export default DeleteAccount;
