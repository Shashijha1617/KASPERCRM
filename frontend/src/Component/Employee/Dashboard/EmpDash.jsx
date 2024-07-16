import React from "react";
import "./EmpDash.css";
// import "../../HrManager/DashboardHR.css";
import EmpTaskChart from "./EmpChart.jsx/EmpTaskChart";
import DepartmentChart from "./EmpChart.jsx/DepartmentChart";
// import WelcomeBoard from "../../../Pages/WelcomeBoard/WelcomeBoard";
import WelcomeBoard from "../WelcomeBoard/WelcomeBoard";
import AttendanceDetails from "../attendance/SelfAttendance";
// import MyTodaysLoginData from "../../../Pages/WelcomeBoard/MyTodaysLoginData/MyTodaysLoginData";
import MyTodaysLoginData from "../WelcomeBoard/MyTodaysLoginData/MyTodaysLoginData";

const HRDash = () => {
  return (
    <div className="d-flex flex-column gap-2 container-fluid py-3 mb-5 pb-5">
      <div className="col-12 mx-auto">
        {" "}
        <MyTodaysLoginData />
      </div>
      <div className="row px-2 row-gap-3 ">
        <div className="col-12 col-md-5 col-lg-6">
          <WelcomeBoard />
        </div>
        <div className="col-12 col-md-7 col-lg-6">
          <AttendanceDetails />
        </div>
      </div>
      <div className="row px-2 my-3">
        <div className="col-12 col-md-6">
          <EmpTaskChart />
        </div>
        <div className="col-12 col-md-6">
          <DepartmentChart />
        </div>
      </div>
    </div>
  );
};

export default HRDash;
