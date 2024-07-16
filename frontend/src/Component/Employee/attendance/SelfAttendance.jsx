import React, { useState, useEffect } from "react";
import axios from "axios";
import { TfiReload } from "react-icons/tfi";
import { FaCircleInfo, FaHourglassHalf } from "react-icons/fa6";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { FcVoicePresentation } from "react-icons/fc";
import { FaCheckCircle, FaTimesCircle, FaRegClock, FaExclamationCircle } from 'react-icons/fa';

const AttendanceDetails = (props) => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isInfoHovering, setIsInfoHovering] = useState(false);
  const [viewType, setViewType] = useState('monthly'); // State to manage view type

  const employeeId = localStorage.getItem("_id");
  const { darkMode } = useTheme();

  const handleMouseEnter = (date) => {
    setHoveredDate(date);
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  const handleInfoMouseEnter = () => {
    setIsInfoHovering(true);
  };

  const handleInfoMouseLeave = () => {
    setIsInfoHovering(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/employee/` + props.data["_id"],
        {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        }
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleFetchAttendance = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/attendance/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        }
      );

      let singleUser = response.data.filter((val) => {
        return val.employeeObjID && val.employeeObjID._id === employeeId;
      });

      setAttendanceData(singleUser.length > 0 ? singleUser[0] : null);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    handleFetchAttendance();
  }, [selectedYear, selectedMonth]); // Add dependencies to re-fetch attendance when year or month changes

  const getTotalHolidays = () => {
    if (
      attendanceData &&
      attendanceData.user &&
      attendanceData.user.holidayObjID
    ) {
      return attendanceData.user.holidayObjID.holidays.length;
    }
    return 0;
  };

  const getMonthName = (monthNumber) => {
    switch (monthNumber) {
      case 1:
        return "January";
      case 2:
        return "February";
      case 3:
        return "March";
      case 4:
        return "April";
      case 5:
        return "May";
      case 6:
        return "June";
      case 7:
        return "July";
      case 8:
        return "August";
      case 9:
        return "September";
      case 10:
        return "October";
      case 11:
        return "November";
      case 12:
        return "December";
      default:
        return "";
    }
  };

  const getMonthsForYear = (year) => {
    if (year === new Date().getFullYear()) {
      return Array.from({ length: new Date().getMonth() + 1 }, (_, i) => i + 1);
    }
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const getYears = () => {
    if (attendanceData && attendanceData.years) {
      const currentYear = new Date().getFullYear();
      return attendanceData.years.filter((year) => year.year <= currentYear);
    }
    return [];
  };

  const millisecondsToTime = (milliseconds) => {
    const millisecond = Math.floor(milliseconds);
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes % 60).padStart(2, "0");
    const formattedSeconds = String(seconds % 60).padStart(2, "0");
    const formattedMillisecond = String(millisecond % 60).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMillisecond}`;
  };

  const getAttendanceMark = (date) => {
    const loginTime = date && date.loginTime[0];
    if (loginTime) {
      const [loginHour, loginMinute] = loginTime.split(":").map(Number);
      if (loginHour > 9 || (loginHour === 9 && loginMinute > 45)) {
        return "H";
      } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
        return "L";
      }
    }
    return loginTime ? "P" : "A";
  };

  const calculateMonthlyTotals = () => {
    if (!attendanceData) return null;

    const monthlyData = attendanceData.years
      .find((yearData) => yearData.year === selectedYear)
      ?.months.find((month) => month.month === selectedMonth);

    if (monthlyData) {
      const totalWorkingHours = monthlyData.dates.reduce(
        (acc, date) => acc + date.totalLogAfterBreak,
        0
      );

      const totalPresent = monthlyData.dates.filter(
        (date) => getAttendanceMark(date) === "P"
      ).length;

      const totalAbsent = monthlyData.dates.filter(
        (date) => getAttendanceMark(date) === "A"
      ).length;

      const totalHalfDays = monthlyData.dates.filter(
        (date) => getAttendanceMark(date) === "H"
      ).length;

      return {
        totalWorkingHours,
        totalPresent,
        totalAbsent,
        totalHalfDays
      };
    }

    return null;
  };

  const calculateYearlyTotals = () => {
    if (!attendanceData) return null;

    const yearData = attendanceData.years.find(
      (yearData) => yearData.year === selectedYear
    );

    if (!yearData) return null;

    let totalWorkingHours = 0;
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalHalfDays = 0;

    yearData.months.forEach((monthData) => {
      monthData.dates.forEach((date) => {
        totalWorkingHours += date.totalLogAfterBreak;
        const mark = getAttendanceMark(date);
        if (mark === "P") totalPresent += 1;
        if (mark === "A") totalAbsent += 1;
        if (mark === "H") totalHalfDays += 1;
      });
    });

    return {
      totalWorkingHours,
      totalPresent,
      totalAbsent,
      totalHalfDays
    };
  };

  const monthlyTotals = calculateMonthlyTotals();
  const yearlyTotals = calculateYearlyTotals();

  const getTotalWHrs = (data) => {
    return data.slice(0, 5);
  };

  return (
    <div style={{ height: 'fit-content', background: darkMode ? "var(--primaryDashMenuColor)" : "var(--primaryDashColorDark)", color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)", }} className="p-2 rounded-3">
      {attendanceData && (
        <div className="gap-3 d-none">

          <div>
            <select
              className="form-select shadow"
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {getYears().map((year) => (
                <option key={year.year} value={year.year}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
          {viewType === 'monthly' && (
            <div>
              <label htmlFor="month">Select a month:</label>
              <select
                className="form-select shadow"
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {getMonthsForYear(selectedYear).map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      <div>
        <select style={{ width: 'fit-content' }}
          className="form-select border-0 shadow"
          id="viewType"
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
        >
          <option value="monthly">View Monthly Logs</option>
          <option value="yearly">View Yearly Logs</option>
        </select>
      </div>

      {attendanceData && viewType === 'monthly' && monthlyTotals && (
        <div >
          {/* <h5 style={{ color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)" }}>Monthly Logs</h5> */}
          <div className="row px-4 py-2 justify-content-between row-gap-4 text-white">
            <div style={{ height: '130px', }} className="bg-white bg-warning col-6 row  align-items-center rounded-3">
              <div className="col-8"><p className="fw-bold"> Total Working</p>
                <h3>{getTotalWHrs(millisecondsToTime(monthlyTotals.totalWorkingHours))} Hrs</h3></div>
              <div className="col-4"><FaRegClock className="fs-1" /></div>
            </div>
            <div style={{ height: '130px', }} className="bg-white bg-success col-6 row  align-items-center rounded-3">
              <div className="col-8"><p className="fw-bold"> Total Present</p>
                <h3>{monthlyTotals.totalPresent} Days</h3></div>
              <div className="col-4"><FaCheckCircle className="fs-1" /></div>
            </div>
            <div style={{ height: '130px', }} className="bg-white bg-secondary col-6 row  align-items-center rounded-3">
              <div className="col-8"><p className="fw-bold"> Total Absent</p>
                <h3>{monthlyTotals.totalAbsent} Days</h3></div>
              <div className="col-4"><FaTimesCircle className="fs-1" /></div>
            </div>
            <div style={{ height: '130px', }} className="bg-white bg-danger col-6 row  align-items-center rounded-3">
              <div className="col-8"><p className="fw-bold"> Total Half Days</p>
                <h3>{monthlyTotals.totalHalfDays} Days</h3></div>
              <div className="col-4"><FaHourglassHalf className="fs-1" /></div>
            </div>
          </div>
        </div>
      )}

      {attendanceData && viewType === 'yearly' && yearlyTotals && (
        <div >
          {/* <h5 style={{ color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)" }}>Yearly Logs</h5> */}
          <div className="row px-4 py-2 justify-content-between row-gap-4 text-white">
            <div style={{ height: '130px', }} className="bg-white bg-warning col-6 row  align-items-center rounded-3">
              <div className="col-8"><p className="fw-bold"> Total Working</p>
                <h3>{getTotalWHrs(millisecondsToTime(yearlyTotals.totalWorkingHours))} Hrs</h3></div>
              <div className="col-4"><FaRegClock className="fs-1" /></div>
            </div>
            <div style={{ height: '130px', }} className="bg-white bg-success col-6 row  align-items-center rounded-3">
              <div className="col-8"><p className="fw-bold"> Total Present</p>
                <h3>{yearlyTotals.totalPresent} Days</h3></div>
              <div className="col-4"><FaCheckCircle className="fs-1" /></div>
            </div>
            <div style={{ height: '130px', }} className="bg-white bg-secondary col-6 row  align-items-center rounded-3">
              <div className="col-8"><p className="fw-bold"> Total Absent</p>
                <h3>{yearlyTotals.totalAbsent} Days</h3></div>
              <div className="col-4"><FaTimesCircle className="fs-1" /></div>
            </div>
            <div style={{ height: '130px', }} className="bg-white bg-danger col-6 row  align-items-center rounded-3">
              <div className="col-8"><p className="fw-bold"> Total Half Days</p>
                <h3>{yearlyTotals.totalHalfDays} Days</h3></div>
              <div className="col-4"><FaHourglassHalf className="fs-1" /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDetails;
