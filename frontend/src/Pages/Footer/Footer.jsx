import React from "react";
import BatteryStatus from "../../Utils/BatteryStatus";
import BrowserIcon from "../../Utils/BrowserIcon";
import IPAddress from "../../Utils/IPAddress";
import GeoLocation from "../../Utils/GeoLocation";
import WifiStatus from "../../Utils/WifiStatus";
import CurrentTime from "../../Utils/CurrentTime";
import CameraModal from "../../Utils/CameraModal";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import ScreenShareModal from "../../Utils/ScreenShareModal";

const Footer = () => {
  const { darkMode } = useTheme();
  return (
    <div
      style={{
        backgroundColor: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="d-flex align-items-center gap-3 p-1"
    >
      <CurrentTime />
      <WifiStatus />
      {/* <BatteryStatus /> */}
      <BrowserIcon />
      <IPAddress />
      <GeoLocation />
      {/* <CameraModal /> */}
      {/* <ScreenShareModal /> */}
    </div>
  );
};

export default Footer;
