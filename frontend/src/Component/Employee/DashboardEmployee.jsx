import React, { useState } from "react";
import NavBar from "../../Pages/Navbar/NavBar.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";
import EmpRoutes from "./router/Routes.jsx";
import { HashRouter as Router } from "react-router-dom";
import "./DashboardEmployee.css";

import { useSidebar } from "../../Context/AttendanceContext/smallSidebarcontext.jsx";
import SidebarSmallScreen from "./sidebar/SidebarSmallScreen.jsx";
import { useTheme } from "../../Context/TheamContext/ThemeContext.js";
import SidebarSlider from "../../Pages/Sidebar/SidebarSlider.jsx";
// import Footer from "../../Pages/Footer/Footer.jsx";

const DashboardEmployee = (props) => {
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
        <div className="dashboard-grid-employee">
          <div
            style={{
              transform: isOpen ? "translateX(0%)" : "translateX(-500%)",
              transition: "1s ease",
            }}
            className="sidebarsmall d-flex "
          >
            <SidebarSmallScreen data={props.data} />
          </div>
          <div className="employeenavbar-grid">
            <NavBar
              loginInfo={props.data}
              checked={checked}
              handleChange={handleChange}
              onLogout={props.onLogout}
            />
          </div>
          <div className="employeesidebar-grid">
            <Sidebar data={props.data} />
          </div>
          <div className="employeemainbar-grid">
            <EmpRoutes data={props.data} />
            <div
              style={{ zIndex: "50", position: "absolute", bottom: "0" }}
              className="HrPannelFooter bg-dark w-100 text-white"
            >
              {/* <Footer /> */}
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default DashboardEmployee;
