import { useFocusManager, useInput } from "ink";
import { useEffect, useState } from "react";
export const useMainMenu = ({ onChange: _0x47a547 }) => {
  const { focus: _0x436b8c } = useFocusManager();
  const [_0x4ccbb0, _0xdcba25] = useState(1);
  const [_0x316067, _0x397628] = useState(null);
  useInput((_0x106344, _0x4ac05e) => {
    if (_0x106344 === "1") {
      _0xdcba25(1);
    }
    if (_0x106344 === "2") {
      _0xdcba25(2);
    }
    if (_0x106344 === "3") {
      _0xdcba25(3);
    }
    if (_0x106344 === "q") {
      _0x47a547("exit");
      return;
    }
    if (_0x4ac05e.upArrow) {
      _0xdcba25(_0x4ccbb0 - 1);
    }
    if (_0x4ac05e.downArrow) {
      _0xdcba25(_0x4ccbb0 + 1);
    }
    if (_0x4ac05e.return) {
      _0x397628("");
      _0x47a547(_0x4ccbb0.toString());
      return;
    }
  });
  useEffect(() => {
    if (_0x4ccbb0 > 3) {
      _0xdcba25(1);
      _0x436b8c("1");
    } else if (_0x4ccbb0 < 1) {
      _0xdcba25(3);
      _0x436b8c("3");
    } else {
      _0x436b8c(_0x4ccbb0.toString());
    }
  }, [_0x4ccbb0]);
  return {
    message: _0x316067,
  };
};
