import { useFocusManager, useInput } from "ink";
import { useEffect, useState } from "react";
import { groupAccounts, runtimeServer } from "../utils/helper.js";

const useStartBot = ({ accounts, onChange }) => {
  const { focus } = useFocusManager();
  const [currentPage, setCurrentPage] = useState(0);
  const [groupedAccounts, setGroupedAccounts] = useState([]);
  const [runtimeStatus, setRuntimeStatus] = useState({
    status: "connect",
    baner: "",
  });

  const changePage = (page) => {
    if (page > groupedAccounts.length) {
      setCurrentPage(1);
    } else if (page < 1) {
      setCurrentPage(groupedAccounts.length);
    } else {
      setCurrentPage(page);
    }
  };

  useInput((input, keyPress) => {
    if (input) {
      try {
        let parsedInput = parseInt(input);
        if (parsedInput <= groupedAccounts.length) {
          setCurrentPage(parsedInput);
        }
      } catch (error) {}
    }
    if (keyPress.upArrow) {
      changePage(currentPage - 1);
    }
    if (keyPress.downArrow) {
      changePage(currentPage + 1);
    }
    if (keyPress.leftArrow) {
      changePage(currentPage - 1);
    }
    if (keyPress.rightArrow) {
      changePage(currentPage + 1);
    }
    if (keyPress.escape) {
      onChange("back");
    }
    if (input === "q") {
      onChange("exit");
    }
  });

  useEffect(() => {
    const checkReconnect = async () => {
      if (runtimeStatus.status === "reconnecting") {
        const newStatus = await runtimeServer();
        if (newStatus.status === "exit") {
          onChange("exit");
        }
        setRuntimeStatus(newStatus);
      }
    };
    const reconnectInterval = setInterval(checkReconnect, 5000);
    return () => {
      clearInterval(reconnectInterval);
    };
  }, [runtimeStatus]);

  useEffect(() => {
    const checkConnect = async () => {
      if (runtimeStatus.status === "connect") {
        const newStatus = await runtimeServer();
        if (newStatus.status === "exit") {
          onChange("exit");
        }
        setRuntimeStatus(newStatus);
      }
    };
    const connectInterval = setInterval(checkConnect, 60000);
    return () => {
      clearInterval(connectInterval);
    };
  }, [runtimeStatus]);

  useEffect(() => {
    if (groupedAccounts.length < 1) {
      const newGroupedAccounts = groupAccounts(accounts, 1);
      setGroupedAccounts(newGroupedAccounts);
      setCurrentPage(1);
    }
  }, [groupedAccounts]);

  useEffect(() => {
    focus(currentPage.toString());
  }, [currentPage]);

  return {
    pageAccount: groupedAccounts,
    runtimeStatus: runtimeStatus,
    focusOn: currentPage,
  };
};

export default useStartBot;
