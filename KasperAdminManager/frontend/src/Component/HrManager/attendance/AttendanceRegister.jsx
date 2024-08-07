import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config"

function AttendanceRegister() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterYear, setFilterYear] = useState(currentYear);
  const [attendance, setAttendance] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchAttendanceData();
  }, [filterYear, filterMonth]);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/attendance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        }
      });
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();

  const markAttendance = (loginTime) => {
    if (!loginTime || loginTime.length === 0) {
      return { status: "--", color: "#c1bdbd", title: "No Data" };
    }
    if (loginTime === "WO") {
      return { status: "WO", color: "#6e99de", title: "Work Off" };
    }
    const loginHour = parseInt(loginTime.split(":")[0]);
    const loginMinute = parseInt(loginTime.split(":")[1]);

    if (loginHour < 9 || (loginHour === 9 && loginMinute < 31)) {
      return { status: "P", color: "#6BCB77", title: "Present" };
    } else if (loginHour === 9 && loginMinute < 46) {
      return { status: "L", color: "#41C9E2", title: "Late" };
    } else if (loginHour < 14 || (loginHour === 14 && loginMinute === 0)) {
      return { status: "H", color: "#FDA403", title: "Half Day" };
    } else {
      return { status: "A", color: "#EF4040", title: "Absent" };
    }
  };

  const uniqueYears = Array.from(
    new Set(
      attendance.flatMap((employee) => employee.years.map((year) => year.year))
    )
  );

  const uniqueMonths = Array.from(
    new Set(
      attendance.flatMap((employee) =>
        employee.years
          .filter((year) => year.year === filterYear)
          .flatMap((year) => year.months.map((month) => month.month))
      )
    )
  );

  const getUserStatusColor = (month) => {
    switch (month) {
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

  const calculateTotal = (status, employee) => {
    let total = 0;
    const yearIndex = employee.years.findIndex(
      (year) => year.year === filterYear
    );
    const monthIndex = employee.years[yearIndex]?.months.findIndex(
      (month) => month.month === filterMonth
    );
    const dates = employee.years[yearIndex]?.months[monthIndex]?.dates || [];
    dates.forEach((date) => {
      const loginTime = date.loginTime[0];
      const attendanceStatus = markAttendance(loginTime).status;
      if (
        attendanceStatus === status ||
        (status === "P" &&
          (attendanceStatus === "WO" || attendanceStatus === "L")) ||
        (status === "A" && markAttendance(loginTime).status === "--")
      ) {
        total++;
      }
    });
    return total;
  };

  const handleExport = () => {
    const wsData = [];
    const monthYear = `${getUserStatusColor(filterMonth)} ${filterYear}`;
    const companyName = "Kasper Infotech Private Limited";
    const companyAddressLine1 = "214, Tower B, The iThum Towers,";
    const companyAddressLine2 = "Sector 62, Noida, Uttar Pradesh 201301";

    wsData.push([companyName]);
    wsData.push([companyAddressLine1]);
    wsData.push([companyAddressLine2]);
    wsData.push([]);
    wsData.push([`Attendance Summary for ${monthYear}`]);
    wsData.push([]);

    const headers = [
      "S.No",
      "Employee ID",
      "Employee Name",
      ...[...Array(daysInMonth)].map((_, day) =>
        (day + 1).toString().padStart(2, "0")
      ),
      "Total Absent",
      "Total Present",
      "Total Halfday"
    ];
    wsData.push(headers);

    attendance.forEach((employee, index) => {
      const yearIndex = employee.years.findIndex(
        (year) => year.year === filterYear
      );
      const monthIndex = employee.years[yearIndex]?.months.findIndex(
        (month) => month.month === filterMonth
      );
      const dates = employee.years[yearIndex]?.months[monthIndex]?.dates || [];
      const row = [
        (index + 1).toString().padStart(2, "0"),
        employee.employeeObjID?.empID || "NA",
        employee.employeeObjID?.FirstName || "NA",
        ...[...Array(daysInMonth)].map((_, day) => {
          const dateObject = dates.find(
            (date) => date.date === day + 1
          );
          const loginTimeForDay = dateObject
            ? dateObject.loginTime[0]
            : undefined;
          return markAttendance(loginTimeForDay).status;
        }),
        calculateTotal("A", employee),
        calculateTotal("P", employee),
        calculateTotal("H", employee)
      ];
      wsData.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Summary");
    XLSX.writeFile(wb, "Attendance_Summary.xlsx");
  };

  return (
    <div
      style={{ height: "93vh", overflow: "auto" }}
      className="container-fluid pb-5"
    >
      <div className="d-flex justify-content-between py-3">
        <div style={{ color: darkMode ? "black" : "white" }} className="d-flex gap-2">
          <h6 className="my-auto ">Attendance Summary</h6>
          <button
            style={{ whiteSpace: "pre" }}
            onClick={handleExport}
            className="btn py-0 px-2 btn-outline-success d-flex align-items-center  gap-2 my-auto shadow-sm rounded-5"
          >
            {" "}
            <SiMicrosoftexcel /> <span className="d-none d-md-flex">Export XLSX</span>
          </button>
        </div>
        <div style={{ color: darkMode ? "var(--secondaryDashColorDark:)" : "var(--secondaryDashMenuColor)" }} className="d-flex gap-3">
          <div className="d-flex align-items-center gap-2">
            <label className="my-auto">Year</label>
            <select
              className="form-select py-1 rounded-0 "
              value={filterYear}
              onChange={(e) => setFilterYear(parseInt(e.target.value))}
            >
              <option value="">--Select Year--</option>
              {uniqueYears
                .sort(function (a, b) {
                  return a - b;
                })
                .map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <label className="my-auto">Month</label>
            <select
              className="form-select py-1 rounded-0  "
              value={filterMonth}
              onChange={(e) => setFilterMonth(parseInt(e.target.value))}
            >
              <option value="">--Select Month--</option>
              {uniqueMonths
                .sort(function (a, b) {
                  return a - b;
                })
                .map((month, index) => (
                  <option key={index} value={month}>
                    {getUserStatusColor(month)}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <div
        style={{
          overflow: "scroll auto",
          maxHeight: "64vh",
          position: "relative",
          overflowX: "auto",
          overflowY: "auto"
        }}
        className="border border-1 employee-attendence-table mt-0"
      >
        <table className="table table-bordered table-striped" style={{ fontSize: '.9rem', fontWeight: 'normal' }}>
          <thead>
            <tr style={{ position: "sticky", top: "-2px", zIndex: "5" }}>
              <th
                style={{
                  whiteSpace: "pre",
                  backgroundColor: "var(--primaryDashColorDark)",
                  color: "var(--primaryDashMenuColor)",
                  position: "sticky",
                  left: "0",
                  top: "0"
                }}
              >
                S.No
              </th>
              <th
                style={{
                  whiteSpace: "pre",
                  backgroundColor: "var(--primaryDashColorDark)",
                  color: "var(--primaryDashMenuColor)",
                  position: "sticky",
                  left: "0",
                  top: "0"
                }}
              >
                Employee ID
              </th>
              <th
                style={{
                  whiteSpace: "pre",
                  backgroundColor: "var(--primaryDashColorDark)",
                  color: "var(--primaryDashMenuColor)",
                  position: "sticky",
                  left: "-1px",
                  top: "0"
                }}
              >
                Employee Name
              </th>
              {/* Render days of the month */}
              {[...Array(daysInMonth)].map((_, day) => (
                <th
                  style={{
                    background: "var(--primaryDashColorDark)",
                    color: "var(--primaryDashMenuColor)"
                  }}
                  className="text-center"
                  key={day}
                >
                  {(day + 1).toString().padStart(2, "0")}
                </th>
              ))}
              <th
                className="text-white"
                style={{ whiteSpace: "pre", backgroundColor: "#EF4040" }}
              >
                Total Absent
              </th>
              <th
                className="text-white"
                style={{ whiteSpace: "pre", backgroundColor: "#6BCB77" }}
              >
                Total Present
              </th>
              {/* <th className='text-white' style={{ whiteSpace: 'pre', backgroundColor: "#41C9E2" }}>Total Late</th> */}
              <th
                className="text-white"
                style={{ whiteSpace: "pre", backgroundColor: "#FDA403" }}
              >
                Total Halfday
              </th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((employee, index) => {
              const yearIndex = employee.years.findIndex(
                (year) => year.year === filterYear
              );
              const monthIndex = employee.years[yearIndex]?.months.findIndex(
                (month) => month.month === filterMonth
              );
              const dates = employee.years[yearIndex]?.months[monthIndex]?.dates || [];
              return (
                <tr key={employee._id}>
                  <td className="text-center">
                    {(index + 1).toString().padStart(2, 0)}
                  </td>
                  <td>{employee.employeeObjID?.empID || "N/A"}</td>
                  <td
                    style={{
                      whiteSpace: "pre",
                      textTransform: "capitalize",
                      position: "sticky",
                      left: "-1px",
                      top: "0"
                    }}
                  >
                    {employee.employeeObjID?.FirstName}{" "}
                    {employee.employeeObjID?.LastName}
                  </td>
                  {[...Array(daysInMonth)].map((_, day) => {
                    const dateObject = dates.find(
                      (date) => date.date === day + 1
                    );
                    const loginTimeForDay = dateObject
                      ? dateObject.loginTime[0]
                      : undefined;
                    const { status, color } = markAttendance(loginTimeForDay);
                    return (
                      <td
                        style={{
                          whiteSpace: "pre",
                          backgroundColor: color,
                          color: "white"
                        }}
                        key={day}
                      >
                        {status}
                      </td>
                    );
                  })}
                  <td className="text-center">{calculateTotal("A", employee)}</td>
                  <td className="text-center">{calculateTotal("P", employee)}</td>
                  {/* <td className='text-center'>{calculateTotal('L', employee)}</td> */}
                  <td className="text-center">{calculateTotal("H", employee)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pt-3 d-flex align-items-center gap-2">
        <h6 style={{ textAlign: "start", color: darkMode ? 'var( --secondaryDashColorDark)' : "var(--secondaryDashMenuColor)", fontWeight: 'normal', fontSize: '.9rem' }} className="my-auto">Abbreviation</h6>
        <table className="table-bordered table-striped" style={{ textAlign: "start", color: darkMode ? 'var( --secondaryDashColorDark)' : "var(--secondaryDashMenuColor)", fontWeight: 'normal', fontSize: '.9rem' }}>
          <tr>
            <td
              className="px-3"
              style={{
                backgroundColor: "#EF4040",
                color: "white",
                textAlign: "center"
              }}
            >
              A
            </td>
            <td className="px-2" style={{ textAlign: "start" }}>
              Absent
            </td>

            <td
              className="px-3"
              style={{
                backgroundColor: "#6BCB77",
                color: "white",
                textAlign: "center"
              }}
            >
              P
            </td>
            <td className="px-2" style={{ textAlign: "start" }}>
              Present
            </td>

            <td
              className="px-3"
              style={{
                backgroundColor: "#41C9E2",
                color: "white",
                textAlign: "center"
              }}
            >
              L
            </td>
            <td className="px-2" style={{ textAlign: "start" }}>
              Late
            </td>

            <td
              className="px-3"
              style={{
                backgroundColor: "#FDA403",
                color: "white",
                textAlign: "center"
              }}
            >
              H
            </td>
            <td className="px-2" style={{ textAlign: "start" }}>
              Halfday
            </td>
            <td
              className="px-3"
              style={{
                backgroundColor: "#6e99de",
                color: "white",
                textAlign: "center"
              }}
            >
              WO
            </td>
            <td className="px-2" >
              Week Off
            </td>
          </tr>
        </table>
      </div>
      <div style={{ textAlign: "start", color: darkMode ? 'var( --secondaryDashColorDark)' : "var(--secondaryDashMenuColor)", fontWeight: 'normal', fontSize: '.9rem' }} className="py-3">
        <h6>Notes</h6>
        <p style={{ fontSize: ".8rem" }} className="m-0 p-0">
          Weekly off (WO) is considered part of an employee's present status,
          meaning it is not deducted from their attendance.
        </p>
        <p style={{ fontSize: ".8rem" }} className="m-0 p-0">
          Being late mark (L) is used to identify whether employees are arriving
          on time, but it is still counted as part of their present status.
        </p>
      </div>
    </div >
  );
}

export default AttendanceRegister;
