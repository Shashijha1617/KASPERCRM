
import React, { useState, useEffect } from "react";
import { HashRouter as Router } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar.jsx";
import AdminRoutes from "./Routes.jsx";
import NavBar from "../../Pages/Navbar/NavBar.jsx";
import "./DashboardAdmin.css";
import SidebarSmallScreen from "./Sidebar/SidebarSmallScreen.jsx";
import { useSidebar } from "../../Context/AttendanceContext/smallSidebarcontext.jsx";

const DashboardAdmin = (props) => {
  const [checked, setChecked] = useState(true);
  const { isOpen } = useSidebar();

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
    <div>
      <Router>
        <div className="dashboard-grid-manager">
          <div style={{ transform: isOpen ? "translateX(0%)" : "translateX(-500%)", transition: '1s ease' }} className="sidebarsmall d-flex ">
            <SidebarSmallScreen />
          </div>
          <div style={{ maxHeight: "fit-contenty=" }} className="navbar-grid">
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
          <div className="mainbar-grid"><AdminRoutes /></div>
        </div>
      </Router>
    </div>
  );
};

export default DashboardAdmin;
