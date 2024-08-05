import React, { useState } from "react";
import "./DashboardHR.css";
import { HashRouter as Router } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MainContent from "./Router.jsx";
import NavBar from "../../Pages/Navbar/NavBar.jsx";
import { useSidebar } from "../../Context/AttendanceContext/smallSidebarcontext.jsx";
import SidebarSmallScreen from "./SidebarSmallScreen.jsx";
import Footer from "../../Pages/Footer/Footer.jsx";
import { useTheme } from "../../Context/TheamContext/ThemeContext.js";
import SidebarSlider from "../../Pages/Sidebar/SidebarSlider.jsx";

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
        <div className="dashboard-grid-manager">
          <div
            style={{
              transform: isOpen ? "translateX(0%)" : "translateX(-500%)",
              transition: "1s ease",
            }}
            className="sidebarsmall d-flex "
          >
            <SidebarSmallScreen />
          </div>
          <div className="navbar-grid  shadow-sm">
            <NavBar
              loginInfo={props.data}
              checked={checked}
              handleChange={handleChange}
              onLogout={props.onLogout}
            />
          </div>
          <div className="sidebar-grid">
            <Sidebar />
          </div>
          <div className="mainbar-grid">
            <MainContent />
            <div
              style={{ zIndex: "50", position: "absolute", bottom: "0" }}
              className="HrPannelFooter bg-dark w-100 text-white"
            >
              <Footer />
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default DashboardHR;
