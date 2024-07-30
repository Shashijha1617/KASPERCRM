import React from "react";
import "../AdminDash.css";
import TaskChart from "../Dashboard/Chart/TaskChart";
import DepartmentChart from "../../../Pages/Chart/DepartmentChart";
import DailyAttendChart from "../../../Pages/Chart/DailyAttendChart";
import EmployeeLogCount from "../../../Pages/Chart/EmployeeLogCount";
import AdminEmployeeTable from "../../../Pages/Chart/EmployeeCountTable";
import MyTodaysLoginData from "../../Employee/WelcomeBoard/MyTodaysLoginData/MyTodaysLoginData";
import WelcomeBoard from "../../../Pages/WelcomeBoard/WelcomeBoard";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";

const AdminDash = () => {
  return (
    <div className="container-fluid ">
      <TittleHeader
        title={"Dashboard"}
        message={"View a comprehensive analysis of your data here."}
      />
      <MyTodaysLoginData />
      <div className="row justif-content-between row-gap-2 mb-3 align-items-center">
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
      <div className="row row-gap-3  my-2">
        <div className="col-12 col-md-5 ">
          <DailyAttendChart />
        </div>
        <div className="col-12 col-md-7 ">
          <DepartmentChart />
        </div>
        <div className="col-12 col-lg-12 ">
          <TaskChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
