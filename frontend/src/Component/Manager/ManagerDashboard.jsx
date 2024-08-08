import React, { useState } from "react";
import "./DashboardHR.css";
import { HashRouter as Router } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MainContent from "./Router.jsx";
import NavBar from "../../Pages/Navbar/NavBar.jsx";
import SidebarSlider from "../../Pages/Sidebar/SidebarSlider.jsx";
import { useTheme } from "../../Context/TheamContext/ThemeContext.js";
import Footer from "../../Pages/Footer/Footer.jsx";
import SidebarSmallScreen from "./SidebarSmallScreen.jsx";
import { useSidebar } from "../../Context/AttendanceContext/smallSidebarcontext.jsx";

const DashboardHR = (props) => {
  const [checked, setChecked] = useState(true);
  const { isOpen } = useSidebar();
  const { darkMode } = useTheme();

  const handleChange = () => {
    console.log("switch");

    if (checked) {
      document.getElementById("sidebar").setAttribute("class", "display-none");
    } else {
      document.getElementById("sidebar").setAttribute("class", "display-block");
    }

    setChecked(!checked);
  };

  return (
    <div
      style={{
        backgroundColor: darkMode
          ? "var(--secondaryDashMenuColor)"
          : "var(--secondaryDashColorDark)",
        maxHeight: "100vh",
        overflow: "hidden",
        position: "fixed",
        width: "100%",
        left: "0",
        top: "0",
      }}
    >
      <SidebarSlider />
      <Router>
        <div id="outer-main-div">
          <div id="outer-nav">
            <NavBar
              loginInfo={props.data}
              checked={checked}
              handleChange={handleChange}
              onLogout={props.onLogout}
            />
          </div>

          <div
            className="d-flex"
            style={{
              maxHeight: "100vh",
            }}
            id="main-non-nav"
          >
            <div
              style={{
                transform: isOpen ? "translateX(0%)" : "translateX(-500%)",
                transition: "1s ease",
              }}
              className="sidebarsmall d-flex "
            >
              <SidebarSmallScreen />
            </div>
            <Sidebar />
            <div
              style={{ maxHeight: "92vh", overflow: "auto" }}
              className="w-100"
              id="main-area"
            >
              <MainContent />
              <div
                style={{ zIndex: "50", position: "absolute", bottom: "0" }}
                className="HrPannelFooter bg-dark w-100 text-white"
              >
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default DashboardHR;
