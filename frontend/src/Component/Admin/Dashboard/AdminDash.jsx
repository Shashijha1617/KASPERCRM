import React from "react";
import "../AdminDash.css";
import UpcomingBirthdays from "../../../Pages/AddEmployee/UpcomingBirthdays";
import TaskChart from "../Dashboard/Chart/TaskChart";

import DepartmentChart from "../../../Pages/Chart/DepartmentChart";
import HolidayList from "../../../Pages/LeaveCalendar/HolidayList";
import EmployeeCount from "./CountData/EmployeeCount";
import LeaveCount from "./CountData/LeavesCount";
import DailyAttendChart from "../../../Pages/Chart/DailyAttendChart";
import NoticeBoard from "../Notification/NoticeBoard";

const AdminDash = () => {
  return (
    <div>
      <div className="hrdashgrid-container container-fluid py-3">
        <div className="hrdashgrid dash-1">
          <EmployeeCount />
        </div>
        <div className="hrdashgrid dash-3">
          <LeaveCount />
        </div>
        <div className="hrdashgrid dash-7 px-3">
          <DailyAttendChart />
        </div>
        <div className="hrdashgrid dash-5 px-3">
          <DepartmentChart />
        </div>
        <div className="hrdashgrid dash-4 px-3">
          <TaskChart />
        </div>
        <div className="hrdashgrid dash-2">
          <UpcomingBirthdays />
        </div>
        <div className="hrdashgrid dash-6">
          <HolidayList />
        </div>
        <div className="hrdashgrid dash-8">
          <NoticeBoard />
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
