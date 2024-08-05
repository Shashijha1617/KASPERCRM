import React, { useState } from "react";
import DepartmentChart from "../../../Pages/Chart/DepartmentChart";
import DailyAttendChart from "../../../Pages/Chart/DailyAttendChart";
import EmployeeLogCount from "../../../Pages/Chart/EmployeeLogCount";
import AdminEmployeeTable from "../../../Pages/Chart/EmployeeCountTable";
import TaskChart from "./Chart/TaskChart";
import "./ManagerDash.css";
import WelcomeBoard from "../../../Pages/WelcomeBoard/WelcomeBoard";
import MyTodaysLoginData from "../../Employee/WelcomeBoard/MyTodaysLoginData/MyTodaysLoginData";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { MdRebaseEdit, MdSave } from "react-icons/md";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const widgetsOrder = [
  {
    key: "welcomeBoard",
    component: WelcomeBoard,
    colClasses: "col-6 col-md-6 col-lg-4",
  },
  {
    key: "adminEmployeeTable",
    component: AdminEmployeeTable,
    colClasses: "col-6 col-md-6 col-lg-4",
  },
  {
    key: "employeeLogCount",
    component: EmployeeLogCount,
    colClasses: "col-12 col-md-6 col-lg-4",
  },
  {
    key: "dailyAttendChart",
    component: DailyAttendChart,
    colClasses: "col-12 col-md-6 col-lg-6",
  },
  {
    key: "departmentChart",
    component: DepartmentChart,
    colClasses: "col-12 col-md-6 col-lg-6",
  },
  { key: "taskChart", component: TaskChart, colClasses: "col-12 col-lg-12" },
];

const ManagerDash = () => {
  const [selectedWidgets, setSelectedWidgets] = useState({
    welcomeBoard: true,
    adminEmployeeTable: true,
    employeeLogCount: true,
    dailyAttendChart: true,
    departmentChart: true,
    taskChart: true,
  });

  const [enableChanges, setEnableChanges] = useState(false);

  const { darkMode } = useTheme();

  const handleToggleWidget = (widget) => {
    setSelectedWidgets((prevWidgets) => ({
      ...prevWidgets,
      [widget]: !prevWidgets[widget],
    }));
  };

  const renderWidgets = () => {
    return widgetsOrder
      .filter((widget) => selectedWidgets[widget.key])
      .map((widget) => (
        <div key={widget.key} className={widget.colClasses}>
          <widget.component />
        </div>
      ));
  };

  const rowBodyStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--primaryDashMenuColor)",
    border: "none",
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between">
        <TittleHeader
          title={"Dashboard"}
          message={"View a comprehensive analysis of your data here."}
        />
        {enableChanges === true ? (
          <button
            onClick={() => setEnableChanges(true)}
            className="btn fs-6 p-0 m-0"
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
          >
            {" "}
            <MdRebaseEdit /> Edit Dashboard
          </button>
        ) : (
          <button
            onClick={() => setEnableChanges(false)}
            className="btn btn-outline-success d-flex alifn"
            // style={{
            //   color: darkMode
            //     ? "var(--secondaryDashColorDark)"
            //     : "var(--primaryDashMenuColor)",
            // }}
          >
            {" "}
            <MdSave /> Save Changes
          </button>
        )}
      </div>
      <MyTodaysLoginData />

      {enableChanges === true && (
        <div className="widget-selector">
          {widgetsOrder.map((widget) => (
            <label key={widget.key}>
              <input
                type="checkbox"
                checked={selectedWidgets[widget.key]}
                onChange={() => handleToggleWidget(widget.key)}
              />
              {widget.key.charAt(0).toUpperCase() +
                widget.key
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
            </label>
          ))}
        </div>
      )}

      <div className="row justify-content-between align-items-center">
        {renderWidgets().slice(0, 3)}
      </div>
      <div className="row row-gap-3 my-2">{renderWidgets().slice(3)}</div>
    </div>
  );
};

export default ManagerDash;
