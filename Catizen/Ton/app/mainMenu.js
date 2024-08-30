import a22_0x4572a9 from "react";
import { render } from "ink";
import a22_0xfd17f2 from "./components/mainMenuComponent.js";
async function MainMenu(_0x50c6f1) {
  return new Promise((_0x108c53) => {
    let _0x28e9df;
    const { waitUntilExit: _0x5182d5 } = render(
      a22_0x4572a9.createElement(a22_0xfd17f2, {
        banner: _0x50c6f1,
        onChange: (_0x11390e) => {
          _0x28e9df = _0x11390e;
          _0x108c53(_0x28e9df);
        },
      })
    );
    _0x5182d5();
  });
}
export default MainMenu;
