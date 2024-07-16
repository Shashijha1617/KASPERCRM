import React, { useState } from "react";
import "./DashboardHR.css";
import { HashRouter as Router } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MainContent from "./Router.jsx";
import NavBar from "../../Pages/Navbar/NavBar.jsx";
import SidebarSlider from "../../Pages/Sidebar/SidebarSlider.jsx";
import { useTheme } from "../../Context/TheamContext/ThemeContext.js";

const DashboardHR = (props) => {
  const [checked, setChecked] = useState(true);
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
    <div style={{ backgroundColor: darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)" }}>
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
              maxHeight: "100vh"
            }}
            id="main-non-nav"
          >
            <Sidebar />
            <div className="HrDashBG w-100" id="main-area">
              <MainContent />
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default DashboardHR;
