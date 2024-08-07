import React from "react";
import "./HRDash.css";
import TaskChart from "../../../Pages/Chart/TaskChart";
import DepartmentChart from "../../../Pages/Chart/DepartmentChart";
import EmployeeCount from "../../../Pages/Chart/EmployeeCountTable";
import DailyAttendChart from "../../../Pages/Chart/DailyAttendChart";
import EmplooyeeLogCount from "./CountData/EmplooyeeLogCount";
import WelcomeBoard from "../../../Pages/WelcomeBoard/WelcomeBoard";
import MyTodaysLoginData from "../../Employee/WelcomeBoard/MyTodaysLoginData/MyTodaysLoginData";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
const HRDash = () => {
  return (
    <div className="container-fluid mb-5 pb-3">
      <TittleHeader
        title={"Dashboard"}
        message={"View a comprehensive analysis of your data here."}
      />
      <MyTodaysLoginData />
      <div className="row justif-content-between align-items-center">
        <div className="col-6 col-md-6 col-lg-4">
          <WelcomeBoard />
        </div>
        <div className="col-6 col-md-6 col-lg-4">
          <EmployeeCount />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <EmplooyeeLogCount />
        </div>
      </div>
      <div className="row row-gap-3 my-2">
        <div className="col-12 col-md-6 col-lg-3">
          <DailyAttendChart />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <DepartmentChart />
        </div>
        <div className="col-12 col-lg-6 ">
          <TaskChart />
        </div>
      </div>
    </div>
  );
};

export default HRDash;
