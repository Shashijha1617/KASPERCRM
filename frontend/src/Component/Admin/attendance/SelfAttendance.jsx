import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import { TfiReload } from "react-icons/tfi";
import { FaCircleInfo } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import BASE_URL from "../../../Pages/config/config";

const SelfAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isInfoHovering, setIsInfoHovering] = useState(false);
  const empMail = localStorage.getItem("Email");
  const employeeId = localStorage.getItem("_id");

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

  //   useEffect(() => {
  //     fetchEmployees();
  //   }, []);

  //   const fetchEmployees = async () => {
  //     try {
  //       const response = await axios.get("${BASE_URL}/api/employee", {
  //         headers: {
  //           authorization: localStorage.getItem("token") || ""
  //         }
  //       });
  //       setEmployees(response.data);
  //     } catch (error) {
  //       console.error("Error fetching employees:", error);
  //     }
  //   };

  // const handleFetchAttendance = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${BASE_URL}/api/attendance/${employeeId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token") || ""}`
  //         }
  //       }
  //     );
  //     let singleUser = response.data.filter((val) => {
  //       return val.employeeObjID._id === employeeId;
  //     });
  //     setAttendanceData(singleUser.length > 0 ? singleUser[0] : null);
  //   } catch (error) {
  //     console.error("Error fetching attendance data:", error);
  //   }
  // };

  // setIsButtonClicked(true);
  useEffect(() => {
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
          return val.employeeObjID && val.employeeObjID.Email === empMail;
        });

        setAttendanceData(() => {
          return singleUser.length > 0 ? singleUser[0] : null;
        });
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    handleFetchAttendance();
  }, [employeeId, empMail]);

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

  return (
    <div className="d-flex flex-column p-5 gap-3">
      {/* <div className="d-flex gap-3 ">
        <div>
          <select
            className="form-select w-100 shadow-sm text-muted"
            id="employeeId"
            value={employeeId}
            onChange={handleEmployeeChange}
          >
            <option value="" disabled>
              --Select an employee--
            </option>

            {employees
              .sort((a, b) => a.empID - b.empID)
              .map((employee) => (
                <option
                  className="text-uppercase"
                  key={employee._id}
                  value={employee._id}
                >
                  🪪 ({employee.empID}) {employee.FirstName}-{employee.LastName}
                </option>
              ))}
          </select>
        </div>

        <button
          className="btn shadow btn-dark fw-bolder"
          style={{ width: "fit-content" }}
          onClick={handleFetchAttendance}
        >
          Fetch Attendance
        </button>
      </div> */}
      <div className="d-flex gap-3 justify-content-between">
        {/* <div>
          <select
            className="form-select w-100 shadow-sm text-muted"
            id="employeeId"
            value={employeeId}
            onChange={handleEmployeeChange}
          >
            <option value="" disabled>
              --Select an employee--
            </option>
            {employees
              .sort((a, b) => a.empID - b.empID)
              .map((employee) => (
                <option
                  className="text-uppercase"
                  key={employee._id}
                  value={employee._id}
                >
                  <p>
                    🪪 ({employee.empID}) {employee.FirstName}
                  </p>
                </option>
              ))}
          </select>
        </div> */}
        {/* <button
          disabled={!employeeId}
          style={{ display: "flex", alignItems: "center", gap: ".5rem" }}
          className="btn shadow btn-dark fw-bolder"
          onClick={handleFetchAttendance}
        >
          <MdOutlineRefresh
            className={`fs-4 ${isButtonClicked ? "rotate" : ""}`}
          />{" "}
          Get
        </button> */}
      </div>

      {attendanceData && (
        <div className="d-flex gap-3">
          <div>
            <label htmlFor="year">Select a year:</label>
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
        </div>
      )}

      {attendanceData && (
        <div style={{ overflow: "auto", height: "80vh" }}>
          <table className="table">
            <thead>
              <tr className="shadow-sm">
                <th className="bg-dark text-white text-center">Date</th>
                <th className="bg-dark text-white text-center">Status</th>
                <th className="bg-dark text-white">Login Time</th>
                <th className="bg-dark text-white">Logout Time</th>
                <th className="bg-dark text-white">Break</th>
                <th className="bg-dark text-white">Total Login</th>
                <th className="bg-dark text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {getYears().map((year) =>
                year.months
                  .filter((month) => month.month === selectedMonth)
                  .map((month) =>
                    month.dates
                      .sort((a, b) => a.date - b.date)
                      .map((date) => (
                        <tr
                          className="shadow-sm"
                          key={date.date}
                          id={`attendance-row-${date.date}`} // Assign unique ID to each row
                          onMouseEnter={() => handleMouseEnter(date.date)}
                          onMouseLeave={() => handleMouseLeave()}
                        >
                          <td className="text-center">
                            <span className="fw-bold bg-info py-1 px-2  shadow-sm text-white">
                              {date.date}
                            </span>
                          </td>
                          <td
                            style={{ whiteSpace: "pre", textAlign: "center" }}
                          >
                            {getAttendanceMark(date)}
                          </td>
                          <td className="text-uppercase">
                            {date.loginTime[0]}
                          </td>
                          <td className="text-uppercase">
                            {date.logoutTime[date.logoutTime.length - 1]}
                          </td>
                          <td className="position-relative bg-white">
                            <div
                              style={{
                                display: "flex ",
                                justifyContent: "start",
                                alignItems: "center"
                              }}
                              className="fs-6 gap-2 "
                              onMouseEnter={handleInfoMouseEnter}
                              onMouseLeave={handleInfoMouseLeave}
                            >
                              <span
                                style={{ scale: "0.7" }}
                                className="bg-warning py-0  text-white  px-2 rounded-5 my-auto"
                              >
                                {date.breakTime.length}
                              </span>
                              <span className="fw-bold text-dark fs-6">
                                {millisecondsToTime(date.totalBrake)}
                              </span>{" "}
                              <FaCircleInfo
                                style={{ fontSize: ".9rem" }}
                                className="text-info "
                              />
                            </div>

                            <div
                              style={{ zIndex: "5", right: "0%" }}
                              className="position-absolute"
                            >
                              {isInfoHovering &&
                                hoveredDate === date.date && ( // Check if info button is hovered and the date is the hovered date
                                  <table className="table table-bordered table-striped">
                                    <thead>
                                      <tr className="shadow-sm p-0">
                                        <th className="bg-info  py-0 text-white">
                                          Break
                                        </th>
                                        <th className="bg-info  py-0 text-white">
                                          Resume
                                        </th>
                                        <th
                                          className="text-end  py-0 bg-info text-white"
                                          style={{ whiteSpace: "pre" }}
                                        >
                                          Total Break
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {date.breakTime.map(
                                        (breakTime, index) => (
                                          <tr className="shadow-sm" key={index}>
                                            <td
                                              className="text-uppercase  py-1 text-center"
                                              style={{ whiteSpace: "pre" }}
                                            >
                                              {breakTime}
                                            </td>
                                            <td
                                              className="text-uppercase  py-1 text-center"
                                              style={{ whiteSpace: "pre" }}
                                            >
                                              {date.ResumeTime[index]}
                                            </td>
                                            <td
                                              className="text-end py-1 "
                                              style={{ whiteSpace: "pre" }}
                                            >
                                              {millisecondsToTime(
                                                date.BreakData[index]
                                              )}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                )}
                            </div>
                          </td>
                          <td>{millisecondsToTime(date.totalLogAfterBreak)}</td>
                          <td>{date.status}</td>
                        </tr>
                      ))
                  )
              )}
            </tbody>
          </table>
        </div>
      )}
      {attendanceData === null && (
        <div
          style={{
            height: "80vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            wordSpacing: "5px",
            flexDirection: "column",
            gap: "1rem"
          }}
        >
          <div className="fs-2 fw-bolder">
            <TfiReload className="spinner-border text-info" />
          </div>
          <p className="text-muted">
            User not selected. To view data, please select a user.
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(SelfAttendance);
