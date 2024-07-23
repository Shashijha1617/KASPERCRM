import React from "react";
import "../AdminDash.css";
import TaskChart from "../Dashboard/Chart/TaskChart";
import DepartmentChart from "../../../Pages/Chart/DepartmentChart";
import DailyAttendChart from "../../../Pages/Chart/DailyAttendChart";
import MyTodaysLoginData from "../../Employee/WelcomeBoard/MyTodaysLoginData/MyTodaysLoginData";
import WelcomeBoard from "../../../Pages/WelcomeBoard/WelcomeBoard";
import AdminEmployeeTable from "../../HrManager/Dashboard/CountData/EmployeeCount";
import EmployeeLogCount from "../../HrManager/Dashboard/CountData/EmplooyeeLogCount";

const AdminDash = () => {
  return (
    <div className="container-fluid ">
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

export default AdminDash;
