import React, { useState } from "react";
import { BsBuildings, BsBuildingsFill } from "react-icons/bs";
import { FaAddressBook, FaRegUserCircle } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";
import {
  MdMenuOpen,
  MdOutlineDashboardCustomize,
  MdOutlineLocationOn,
  MdTaskAlt,
} from "react-icons/md";
import { TbDeviceIpadMinus } from "react-icons/tb";
import { MdHolidayVillage } from "react-icons/md";
import { FcLeave } from "react-icons/fc";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { IoCalendarOutline } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { GoKey, GoTasklist } from "react-icons/go";
import { LuPartyPopper } from "react-icons/lu";

const Sidebar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [extended, setExtended] = useState(false);
  const { darkMode } = useTheme();

  const allLinks = [
    {
      icon: <MdOutlineDashboardCustomize />,
      name: "Dashboard",
      navLinks: [{ to: "/manager/dashboard", label: "Dashboard" }],
    },
    {
      icon: <IoMdCheckmarkCircleOutline />,
      name: "Attendance",
      navLinks: [
        { to: "/manager/attenDance", label: "Create Attendance" },
        { to: "/manager/myAttendance", label: "My Attencance" },
        { to: "/manager/todaysAttendance", label: "TodaysAttendance" },
        { to: "/manager/viewAttenDance", label: "View Attendance" },
      ],
    },
    {
      icon: <IoCalendarOutline />,
      name: "Leave",
      navLinks: [
        { to: "/manager/leaveBalance", label: "Leave Balance" },
        { to: "/manager/createLeave", label: "Apply Leave" },
        { to: "/manager/leaveApplication", label: "View ALL Leave " },
      ],
    },
    {
      icon: <GoTasklist />,
      name: "Task",
      navLinks: [
        { to: "/manager/newTask", label: "Assign New Task" },
        { to: "/manager/ActiveTask", label: "Active Task" },
        { to: "/manager/taskcancle", label: "Cancelled Task" },
        { to: "/manager/taskcomplete", label: "Completed Task" },
        { to: "/manager/rejectTask", label: "Rejected Task" },
      ],
    },
    {
      icon: <GoKey />,
      name: "Administration",
      navLinks: [
        { to: "/manager/role", label: "Role" },
        { to: "/manager/position", label: "Position" },
        { to: "/manager/department", label: "Department" },
      ],
    },
    {
      icon: <BsBuildings />,
      name: "Company",
      navLinks: [
        { to: "/manager/company", label: "Company List" },
        // { to: "/manager/employee", label: "Create Employee" },
      ],
    },
    {
      icon: <MdOutlineLocationOn />,
      name: "Address",
      navLinks: [
        { to: "/manager/country", label: "Country" },
        { to: "/manager/state", label: "State" },
        { to: "/manager/city", label: "City" },
      ],
    },
    {
      icon: <LuPartyPopper />,
      name: "Holiday",
      navLinks: [{ to: "/manager/holiday", label: "Leave Calendar" }],
    },
    {
      icon: <FaRegUserCircle />,
      name: "Profile",
      navLinks: [{ to: "/manager/personal-info", label: "Leave Calendar" }],
    },
  ];

  const ExtendClick = () => {
    setExtended(extended ? false : true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        overflowY: "auto",
        overflow: "inherit",
        width: "fit-content",
        borderRight: "1px solid rgba(90, 88, 88, 0.1)",
        backgroundColor: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        padding: ".5rem 1rem .5rem .5rem",
      }}
      className="d-none d-sm-flex flex-column gap-2"
    >
      <h3
        style={{ borderBottom: "3px solid green" }}
        className="text-success justify-content-between py-2 d-flex gap-2"
      >
        <button
          style={{ display: !extended ? "none" : "block", cursor: "none" }}
          className=" btn btn-success rounded-5 py-0"
        >
          Manager
        </button>
        <span
          onClick={ExtendClick}
          style={{
            border: "none",
            outline: "none",
            cursor: "pointer",
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
            transform: `rotate(${!extended ? "180deg" : "0deg"})`,
          }}
          className="my-auto p-0 fs-4"
        >
          <MdMenuOpen />
        </span>
      </h3>

      <div
        className="m-0 p-0"
        style={{ maxHeight: "50px", overflow: "auto initial" }}
      >
        {allLinks.map(({ icon, name, navLinks }) => (
          <div
            key={name}
            onMouseEnter={() => setActiveCategory(name)}
            onMouseLeave={() => setActiveCategory(null)}
            className="position-relative"
          >
            {navLinks.length > 1 ? (
              <span
                style={{
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  height: "3rem",
                  outline: "none",
                  border: "none",
                }}
                className="p-0 text-start gap-2 justify-between w-100 d-flex justify-content-between"
              >
                <div
                  style={{ width: "fit-content" }}
                  className="d-flex gap-2 my-auto"
                >
                  <p
                    style={{
                      height: "30px",
                      width: "30px",
                      alignItems: "center",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                    }}
                    className="m-auto d-flex rounded-5 justify-content-center fs-5"
                  >
                    {icon}
                  </p>
                  <p
                    style={{ display: !extended ? "none" : "block" }}
                    className="my-auto"
                  >
                    {name}
                  </p>
                </div>
                <span
                  style={{
                    transform: `rotate(${
                      activeCategory === name ? "135deg" : "0deg"
                    })`,
                    transition: "1s ease",
                    display: !extended ? "none" : "block",
                  }}
                  className="my-auto fs-4"
                >
                  +
                </span>
              </span>
            ) : (
              <OverlayTrigger
                placement="right"
                overlay={
                  !extended ? (
                    <Tooltip id={`tooltip-${name}`}>{name}</Tooltip>
                  ) : (
                    <span></span>
                  )
                }
              >
                <NavLink to={navLinks[0].to} className="text-decoration-none">
                  <span
                    style={{
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                      height: "3rem",
                      outline: "none",
                      border: "none",
                    }}
                    className="p-0 text-start gap-2 justify-between w-100 d-flex justify-content-between"
                  >
                    <div
                      style={{ width: "fit-content" }}
                      className="d-flex gap-2 my-auto"
                    >
                      <p
                        style={{
                          height: "30px",
                          width: "30px",
                          alignItems: "center",
                          color: darkMode
                            ? "var(--primaryDashColorDark)"
                            : "var(--primaryDashMenuColor)",
                        }}
                        className="m-auto d-flex rounded-5 justify-content-center fs-5"
                      >
                        {icon}
                      </p>
                      <p
                        style={{ display: !extended ? "none" : "block" }}
                        className="my-auto"
                      >
                        {name}
                      </p>
                    </div>
                  </span>
                </NavLink>
              </OverlayTrigger>
            )}

            {navLinks.length > 1 && (
              <div
                style={{
                  ...dropdownStyle,
                  display: activeCategory === name ? "flex" : "none",
                  backgroundColor: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  width: "fit-content",
                }}
                className="flex-column position-absolute top-0 start-100 py-2 px-1 gap-2 mt-2 shadow-sm"
              >
                <p
                  style={{
                    display: extended ? "none" : "block",
                    color: darkMode ? "green" : "orange",
                  }}
                  className="m-0 py-0 pl-1 fw-bold"
                >
                  {name}
                </p>
                {navLinks.map((link) => (
                  <NavLink
                    className="text-decoration-none"
                    key={link.to}
                    to={link.to}
                  >
                    <div
                      style={{
                        color: darkMode
                          ? "var(--primaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                      }}
                      className="text-decoration-none flex-nowrap text-start gap-3 d-flex justify-content-between "
                    >
                      <div className="d-flex gap-1 flex-nowrap">
                        <p className="m-0">{link.icon}</p>
                        <p style={{ whiteSpace: "pre" }} className="m-auto">
                          {link.label}
                        </p>
                      </div>
                      <span className="my-auto ">›</span>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const buttonStyle = {
  outline: "none",
  border: "none",
  height: "3rem",
};

const dropdownStyle = {
  width: "250px",
  zIndex: "5",
  borderLeft: "5px solid white",
};

export default Sidebar;
