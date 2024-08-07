// MainContent.jsx
import React from "react";
import { Route, Switch } from "react-router-dom";
import LeaveApplicationHR from "../HrManager/LeaveApplicationHR.jsx";
import NotFound404 from "../../Pages/PageNot/NotFound404.jsx";
import Dashboard from "../Manager/Dashboard/ManagerDash.jsx";
import ViewAttendance from "../HrManager/attendance/ViewAttendance.jsx";
import ManagerNewTask from "../HrManager/ManagerTaskManagement/ManagerNewTask.jsx";
import ManagerCencelledTask from "../HrManager/ManagerTaskManagement/ManagerCencelledTask.jsx";
import ManagerCompletedTask from "../HrManager/ManagerTaskManagement/ManagerCompletedTask.jsx";
import ManagerRejectedTask from "../HrManager/ManagerTaskManagement/ManagerRejectedTask.jsx";
import ManagerActiveTask from "./ManagerTaskManagement/ManagerActiveTask.jsx";
import Attendance from "../HrManager/attendance/AttendanceSample.jsx";
import LeaveCalendar from "../../Pages/LeaveCalendar/LeaveCalendar.jsx";
import TodaysAttendance from "../HrManager/attendance/TodaysAttendance.jsx";
import LeaveApplication from "../../Pages/ApplyLeave/LeaveApplication.jsx";
import Notification from "./Notification/Notification.jsx";
import PersonalInfo from "../Employee/EmpPresonal/PersonalInfo.jsx";
import SelfAttendance from "../HrManager/attendance/SelfAttendance.jsx";
import LeaveBalance from "../HrManager/LeaveStatus/LeaveBalance.jsx";

const MainContent = () => {
  return (
    <div id="main-area">
      <Switch>
        <Route
          path="/manager/leaveApplication"
          exact
          component={LeaveApplicationHR}
        />
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
        <Route path="/manager/LeaveBalance" exact component={LeaveBalance} />
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
