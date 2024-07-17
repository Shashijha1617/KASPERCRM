// MainContent.jsx
import React from "react";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import Role from "../../Pages/Department/Role.jsx";
import Position from "../../Pages/Department/Position.jsx";
import Department from "../../Pages/Department/Department.jsx";
import Country from "../../Pages/Location/Country.jsx";
import State from "../../Pages/Location/State.jsx";
import City from "../../Pages/Location/City.jsx";
import Company from "../../Pages/Company/Company.jsx";
// import Employee from "../../Pages/AddEmployee/Employee.jsx";
import Salary from "../../Pages/Salary/Salary.jsx";
import LeaveApplicationHR from "../HrManager/LeaveApplicationHR.jsx";
import NotFound404 from "../../Pages/PageNot/NotFound404.jsx";
import Dashboard from "../Manager/Dashboard/ManagerDash.jsx";
import ViewAttendance from "../HrManager/attendance/ViewAttendance.jsx";
// task management
import ManagerNewTask from "../HrManager/ManagerTaskManagement/ManagerNewTask.jsx";
import ManagerCencelledTask from "../HrManager/ManagerTaskManagement/ManagerCencelledTask.jsx";
import ManagerCompletedTask from "../HrManager/ManagerTaskManagement/ManagerCompletedTask.jsx";
import ManagerRejectedTask from "../HrManager/ManagerTaskManagement/ManagerRejectedTask.jsx";
import ManagerActiveTask from "./ManagerTaskManagement/ManagerActiveTask.jsx";
import Attendance from "../HrManager/attendance/AttendanceSample.jsx";
import LeaveCalendar from "../../Pages/LeaveCalendar/LeaveCalendar.jsx";
import TodaysAttendance from "../HrManager/attendance/TodaysAttendance.jsx";
import Employee from "../../Pages/AddEmployee/Employee.jsx";
import LeaveApplication from "../../Pages/ApplyLeave/LeaveApplication.jsx";
import Notification from "./Notification/Notification.jsx";
import PersonalInfo from "../Employee/EmpPresonal/PersonalInfo.jsx";
import SelfAttendance from "../HrManager/attendance/SelfAttendance.jsx";

const MainContent = () => {
  return (
    <div id="main-area">
      <Switch>
        <Route path="/manager/employee" component={Employee} />
        <Route path="/manager/salary" exact component={Salary} />
        <Route path="/manager/company" exact component={Company} />
        <Route path="/manager/role" component={Role} />
        <Route path="/manager/position" exact component={Position} />
        <Route path="/manager/department" exact component={Department} />
        <Route path="/manager/country" exact component={Country} />
        <Route path="/manager/state" exact component={State} />
        <Route path="/manager/city" exact component={City} />
        <Route
          path="/manager/leaveApplication"
          exact
          component={LeaveApplicationHR}
        />

        <Route path="/manager/city" exact component={City} />
        <Route path="/manager/dashboard" exact component={Dashboard} />
        {/* <Route path="/manager/task" exact component={TaskAssign} /> */}
        <Route path="/manager/newTask" exact component={ManagerNewTask} />
        <Route path="/manager/ActiveTask" exact component={ManagerActiveTask} />
        <Route
          path="/manager/taskcancle"
          exact
          component={ManagerCencelledTask}
        />
        <Route
          path="/manager/taskcomplete"
          exact
          component={ManagerCompletedTask}
        />
        <Route
          path="/manager/rejectTask"
          exact
          component={ManagerRejectedTask}
        />
        <Route path="/manager/attenDance" exact component={Attendance} />
        <Route
          path="/manager/viewAttenDance"
          exact
          component={ViewAttendance}
        />
        <Route path="/manager/holiday" exact component={LeaveCalendar} />
        <Route
          path="/manager/todaysAttendance"
          exact
          component={TodaysAttendance}
        />
        <Route path="/manager/myAttendance" exact component={SelfAttendance} />
        <Route path="/manager/notification" exact component={Notification} />
        <Route path="/manager/createLeave" exact component={LeaveApplication} />

        <Route
          exact
          path="/manager/personal-info"
          render={(props) => <PersonalInfo />}
        />
        {/* attendance */}
        <Route render={() => <NotFound404 />} />
      </Switch>
    </div>
  );
};

export default MainContent;
