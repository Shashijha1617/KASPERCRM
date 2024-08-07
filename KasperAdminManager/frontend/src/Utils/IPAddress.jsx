import React, { useEffect, useState } from "react";
import { FaServer } from "react-icons/fa6";
import { PiComputerTower } from "react-icons/pi";

const IPAddress = () => {
  const [ipAddress, setIpAddress] = useState(null);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip))
      .catch((error) => console.error("Error fetching IP address:", error));
  }, []);

  return ipAddress ? (
    <span className="d-flex align-items-center gap-1" title="Current Location">
      <FaServer /> {ipAddress}
    </span>
  ) : null;
};

export default IPAddress;
