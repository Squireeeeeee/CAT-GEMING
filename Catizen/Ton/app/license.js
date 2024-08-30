import a21_0x1d7d4d from "chalk";
import { getLicense, validateLicense } from "./utils/helper.js";
const License = async () => {
  const _0x16cb6d = await getLicense();
  if (_0x16cb6d === null) {
    console.log(
      a21_0x1d7d4d.redBright(
        "Some Error detected please contact admin for more information"
      )
    );
    process.exit();
  }
  const _0x3f3d59 = await validateLicense(_0x16cb6d);
  if (_0x3f3d59.code !== 200 || _0x3f3d59.data === null) {
    console.log(
      "" +
        a21_0x1d7d4d.magenta("[") +
        a21_0x1d7d4d.redBright("x") +
        a21_0x1d7d4d.magenta("] ") +
        a21_0x1d7d4d.redBright("Invalid License Key") +
        "\n" +
        a21_0x1d7d4d.magenta("[") +
        a21_0x1d7d4d.yellowBright("!") +
        a21_0x1d7d4d.magenta("] ") +
        a21_0x1d7d4d.greenBright("Please contact") +
        " " +
        a21_0x1d7d4d.whiteBright("t.me/ajit_vepal") +
        " " +
        a21_0x1d7d4d.greenBright("to activate license") +
        " \n" +
        a21_0x1d7d4d.magenta("[") +
        a21_0x1d7d4d.blueBright("i") +
        a21_0x1d7d4d.magenta("] ") +
        a21_0x1d7d4d.blueBright(_0x16cb6d)
    );
    process.exit();
  }
  if (Math.floor(Date.now() / 1000) >= _0x3f3d59.data.exp) {
    console.log(
      "" +
        a21_0x1d7d4d.magenta("[") +
        a21_0x1d7d4d.redBright("x") +
        a21_0x1d7d4d.magenta("] ") +
        a21_0x1d7d4d.yellowBright("License Ended") +
        "\n" +
        a21_0x1d7d4d.magenta("[") +
        a21_0x1d7d4d.yellowBright("!") +
        a21_0x1d7d4d.magenta("] ") +
        a21_0x1d7d4d.greenBright("Please contact") +
        " " +
        a21_0x1d7d4d.whiteBright("t.me/ajit_vepal") +
        " " +
        a21_0x1d7d4d.greenBright("to activate license") +
        " \n" +
        a21_0x1d7d4d.magenta("[") +
        a21_0x1d7d4d.blueBright("i") +
        a21_0x1d7d4d.magenta("] ") +
        a21_0x1d7d4d.blueBright(_0x16cb6d)
    );
    process.exit();
  }
  return _0x3f3d59;
};
export default License;
