import { render } from "ink";
import a8_0x560976 from "react";
import a8_0x181770 from "./components/formComponent.js";
async function Form(_0x2dea52, _0x57d612) {
  return new Promise((_0x53acac) => {
    let _0x9c6dbb;
    const { waitUntilExit: _0x55a2fd } = render(
      a8_0x560976.createElement(a8_0x181770, {
        name: _0x2dea52,
        banner: _0x57d612,
        onChange: (_0x47ab54) => {
          _0x9c6dbb = _0x47ab54;
          _0x53acac(_0x9c6dbb);
        },
      })
    );
    _0x55a2fd();
  });
}
export default Form;
