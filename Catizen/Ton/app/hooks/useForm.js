import { useInput } from "ink";
import { useEffect, useState } from "react";
const useForm = ({ onChange: _0x24d8db, name: _0x14f193 }) => {
  const [_0x9b5736, _0x1d316d] = useState("");
  const [_0x4406d0, _0x3984ca] = useState(false);
  useInput((_0x1aeee6, _0x2d90f3) => {
    if (_0x2d90f3.return) {
      _0x24d8db(_0x9b5736);
      _0x3984ca(true);
    } else if (_0x2d90f3.backspace || _0x2d90f3.delete) {
      _0x1d316d((_0x4bac1c) => _0x4bac1c.slice(0, -1));
    } else {
      _0x1d316d((_0x1abcba) => _0x1abcba + _0x1aeee6);
    }
  });
  useEffect(() => {
    _0x3984ca(false);
    _0x1d316d("");
  }, [_0x14f193]);
  return {
    value: _0x9b5736,
    isLoading: _0x4406d0,
  };
};
export default useForm;
