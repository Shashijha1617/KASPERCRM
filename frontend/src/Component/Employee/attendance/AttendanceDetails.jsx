import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaRegClock,
} from "react-icons/fa";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const AttendanceDetails = ({ data }) => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [viewType, setViewType] = useState("monthly");

  const employeeId = localStorage.getItem("_id");
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchEmployees();
    handleFetchAttendance();
  }, [selectedYear, selectedMonth]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/employee/${data["_id"]}`,
        {
          headers: { authorization: localStorage.getItem("token") || "" },
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
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      const userAttendance = response.data.find(
        (val) => val.employeeObjID?._id === employeeId
      );
      setAttendanceData(userAttendance || null);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const getTotalHolidays = () =>
    attendanceData?.user?.holidayObjID?.holidays.length || 0;

  const getMonthName = (monthNumber) =>
    new Date(0, monthNumber - 1).toLocaleString("en-US", { month: "long" });

  const getMonthsForYear = (year) =>
    year === new Date().getFullYear()
      ? Array.from({ length: new Date().getMonth() + 1 }, (_, i) => i + 1)
      : Array.from({ length: 12 }, (_, i) => i + 1);

  const getYears = () =>
    attendanceData?.years?.filter(
      (year) => year.year <= new Date().getFullYear()
    ) || [];

  const millisecondsToTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const millis = milliseconds % 1000;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}:${String(millis).padStart(3, "0")}`;
  };

  const getAttendanceMark = (date) => {
    const [loginHour, loginMinute] = date?.loginTime[0]
      ?.split(":")
      .map(Number) || [0, 0];
    return loginHour > 9 || (loginHour === 9 && loginMinute > 45)
      ? "H"
      : loginHour
      ? "P"
      : "A";
  };

  const calculateTotals = (data, type) => {
    if (!data) return null;
    const yearData = data.years.find(
      (yearData) => yearData.year === selectedYear
    );
    const monthData =
      type === "monthly"
        ? yearData?.months.find((month) => month.month === selectedMonth)
        : null;

    const totals = {
      totalWorkingHours: 0,
      totalPresent: 0,
      totalAbsent: 0,
      totalHalfDays: 0,
    };

    const dates =
      type === "monthly"
        ? monthData?.dates
        : yearData?.months.flatMap((month) => month.dates);
    if (dates) {
      dates.forEach((date) => {
        const mark = getAttendanceMark(date);
        totals.totalWorkingHours += date.totalLogAfterBreak;
        totals.totalPresent += mark === "P" ? 1 : 0;
        totals.totalAbsent += mark === "A" ? 1 : 0;
        totals.totalHalfDays += mark === "H" ? 1 : 0;
      });
    }

    return totals;
  };

  const totals =
    viewType === "monthly"
      ? calculateTotals(attendanceData, "monthly")
      : calculateTotals(attendanceData, "yearly");

  const containerStyle = {
    height: "fit-content",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
    maxHeight: "fit-content",
    overflow: "hidden",
  };

  return (
    <div style={containerStyle} className="p-2 py-3 rounded-0 shadow">
      {attendanceData && (
        <>
          <div className="mb-3 d-none">
            <select
              className="form-select shadow"
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {getYears().map((year) => (
                <option key={year.year} value={year.year}>
                  {year.year}
                </option>
              ))}
            </select>
            {viewType === "monthly" && (
              <div>
                <label htmlFor="month">Select a month:</label>
                <select
                  className="form-select shadow"
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
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
          <div className="container-fluid d-flex align-items-center justify-content-between">
            <div className="mb-3">
              <select
                className={`${
                  darkMode
                    ? "form-select bg-white text-dark border-0 shadow"
                    : "form-select bg-dark text-white border-0 shadow"
                }`}
                id="viewType"
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
              >
                <option value="monthly">View Monthly Logs</option>
                <option value="yearly">View Yearly Logs</option>
              </select>
            </div>
            <h6
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
                fontWeight: "normal",
              }}
            >
              {viewType === "monthly" ? "Monthly Logs" : "Yearly Logs"}
            </h6>
          </div>
          {totals && (
            <div>
              <div className="row px-4 py-2 justify-content-between row-gap-4">
                {Object.entries(totals).map(([key, value]) => (
                  <div
                    key={key}
                    className={`align-items-center col-12 col-md-6 p-1`}
                  >
                    <div
                      style={{
                        background: darkMode
                          ? "var(--basecolor)"
                          : "var(--basecolor4)",
                      }}
                      className="d-flex align-items-center py-3 rounded-2"
                    >
                      <div className="col-8">
                        <p className="m-0">{`Total ${key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}`}</p>
                        <h6 className="m-0 fw-normal">
                          {key === "totalWorkingHours"
                            ? millisecondsToTime(value) + " Hrs"
                            : `${value} Days`}
                        </h6>
                      </div>
                      <div className="col-4 d-flex justify-content-center align-items-center">
                        {key === "totalWorkingHours" && (
                          <FaRegClock className="fs-3" />
                        )}
                        {key === "totalPresent" && (
                          <FaCheckCircle className="fs-3" />
                        )}
                        {key === "totalAbsent" && (
                          <FaTimesCircle className="fs-3" />
                        )}
                        {key === "totalHalfDays" && (
                          <FaHourglassHalf className="fs-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceDetails;
