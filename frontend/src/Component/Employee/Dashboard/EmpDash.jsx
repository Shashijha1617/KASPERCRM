import React from "react";
import "./EmpDash.css";
import EmpTaskChart from "./EmpChart.jsx/EmpTaskChart";
import DepartmentChart from "../../../Pages/Chart/DepartmentChart";
import WelcomeBoard from "../../../Pages/WelcomeBoard/WelcomeBoard";
import MyTodaysLoginData from "../WelcomeBoard/MyTodaysLoginData/MyTodaysLoginData";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import AttendanceDetails from "../attendance/SelfAttendance";

const HRDash = () => {
  return (
    <div className="container-fluid py-2 ">
      <TittleHeader
        title={"Dashboard"}
        message={"View a comprehensive analysis of your data here."}
      />
        <MyTodaysLoginData />
      <div className="row justif-content-between row-gap-4 mt-3 align-items-center">
      <div className="col-12 col-lg-4">
          <WelcomeBoard height={"252px"} />
        </div>
        <div className="col-12 col-lg-8">
        <AttendanceDetails />
        </div>
      </div>
      <div className="row justif-content-between row-gap-4 mt-3 align-items-center">

        <div className="col-12 col-md-6 col-lg-6">
          <DepartmentChart />
        </div>
        <div className="col-12 col-md-6 col-lg-6">
        <EmpTaskChart />
        </div>
      </div>

      
    </div>
  );
};

export default HRDash;
