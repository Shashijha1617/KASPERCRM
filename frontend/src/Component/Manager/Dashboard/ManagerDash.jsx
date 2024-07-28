import React from "react";
import DepartmentChart from "../Chart/DepartmentChart";
import TaskChart from "./Chart/TaskChart";
import "./ManagerDash.css";
import WelcomeBoard from "../../../Pages/WelcomeBoard/WelcomeBoard";
import EmployeeLogCount from "../../HrManager/Dashboard/CountData/EmplooyeeLogCount";
import AdminEmployeeTable from "../../HrManager/Dashboard/CountData/EmployeeCount";
import DailyAttendChart from "../../../Pages/Chart/DailyAttendChart";
import MyTodaysLoginData from "../../Employee/WelcomeBoard/MyTodaysLoginData/MyTodaysLoginData";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";

const ManagerDash = () => {
  return (
    <div className="container-fluid ">
      <TittleHeader title={"Dashboard"} message={"View a comprehensive analysis of your data here."}/>
      <MyTodaysLoginData />
      <div className="row justif-content-between align-items-center">
        <div className="col-6 col-md-6 col-lg-4">
          <WelcomeBoard />
        </div>
        <div className="col-6 col-md-6 col-lg-4">
          <AdminEmployeeTable />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <EmployeeLogCount />
        </div>
      </div>
      <div className="row row-gap-3 my-2">
        <div className="col-12 col-md-6 col-lg-6">
          <DailyAttendChart />
        </div>
        <div className="col-12 col-md-6 col-lg-6">
          <DepartmentChart />
        </div>
        <div className="col-12 col-lg-12 abcdefg ">
          <TaskChart />
        </div>
      </div>
    </div>
  );
};

export default ManagerDash;
