import React, { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";

const Countdown = ({ duration }) => {
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const days = Math.floor(remainingTime / (3600 * 24));
  const hours = Math.floor((remainingTime % (3600 * 24)) / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  return (
    <div style={{ position: "relative" }}>
      <Text fontWeight="bold" fontSize="lg">
        {days > 0 ? `${days}d ` : ""}
        {hours > 0 ? `${hours}h ` : ""}
        {minutes > 0 ? `${minutes}m ` : ""}
        {seconds > 0 ? `${seconds}s` : ""}
      </Text>
    </div>
  );
};

export default Countdown;
