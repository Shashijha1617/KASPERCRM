import React from "react";
import DepartmentChart from "../../../Pages/Chart/DepartmentChart";
import DailyAttendChart from "../../../Pages/Chart/DailyAttendChart";
import EmployeeLogCount from "../../../Pages/Chart/EmployeeLogCount";
import AdminEmployeeTable from "../../../Pages/Chart/EmployeeCountTable";
import TaskChart from "./Chart/TaskChart";
import "./ManagerDash.css";
import WelcomeBoard from "../../../Pages/WelcomeBoard/WelcomeBoard";
import MyTodaysLoginData from "../../Employee/WelcomeBoard/MyTodaysLoginData/MyTodaysLoginData";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";

const ManagerDash = () => {
  return (
    <div className="container-fluid py-2 pb-4">
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
          <AdminEmployeeTable />
        </div>
        <div className="col-12 col-md-12 col-lg-4">
          <EmployeeLogCount />
        </div>
      </div>
      <div className="row row-gap-3 my-2">
        <div className="col-12 col-md-6 col-lg-3">
          <DailyAttendChart />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <DepartmentChart />
        </div>
        <div className="col-12 col-md-12 col-lg-6">
          <TaskChart />
        </div>
      </div>
    </div>
  );
};

export default ManagerDash;
