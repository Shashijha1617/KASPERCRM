import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import { TfiReload } from "react-icons/tfi";
import { FaCircleInfo } from "react-icons/fa6";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";

const SelfAttendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isInfoHovering, setIsInfoHovering] = useState(false);
  const empMail = localStorage.getItem("Email");
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

  //   useEffect(() => {
  //     fetchEmployees();
  //   }, []);

  //   const fetchEmployees = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:4000/api/employee", {
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
  //       `http://localhost:4000/api/attendance/${employeeId}`,
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
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
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

  // const getTotalHolidays = () => {
  //   if (
  //     attendanceData &&
  //     attendanceData.user &&
  //     attendanceData.user.holidayObjID
  //   ) {
  //     return attendanceData.user.holidayObjID.holidays.length;
  //   }
  //   return 0;
  // };

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
        return (
          <span className="border border-warning px-2 rounded-5">Half Day</span>
        );
      } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
        return <span className="border border-info px-2 rounded-5">Late</span>;
      }
    }
    return loginTime ? (
      <span className="border border-success px-2 rounded-5">Present</span>
    ) : (
      <span className="border border-danger px-2 rounded-5">Absent</span>
    );
  };

  function convertMinutesToHMS(totalSeconds) {
    // Calculate hours
    var hours = Math.floor(totalSeconds / 3600 * 60);
    // Calculate remaining minutes
    var remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    // Calculate remaining seconds
    var remainingSeconds = totalSeconds % 60;
  
    return hours + " Hrs " + remainingMinutes + " Min " + remainingSeconds + " Sec";
  }

  const twoDigitDate = (date) => {
    return String(date).padStart(2, "0");
  };

  const daySwitch = (day) => {
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";

      default:
        return "Sunday";
    }
  };

  const rowHeadStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
    border: "none",
    position: "sticky",
    top: "0rem",
    zIndex: "100",
  };

  const rowBodyStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--primaryDashMenuColor)",
    border: "none",
  };

  return (
    <div className="d-flex flex-column px-2 gap-3">
      <div className="d-flex gap-3 justify-content-between"></div>
      <div className="d-flex align-items-center  justify-content-between">
        <TittleHeader
          title={"Attendance List"}
          message={"You can check yous attendance here."}
        />

        {attendanceData && (
          <div className="d-flex gap-3">
            <div>
              <label
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}
                className="m-0"
                htmlFor="year"
              >
                Select a year:
              </label>
              <select
                className="form-select my-0 rounded-0 shadow"
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
              <label
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}
                className="m-0"
                htmlFor="month"
              >
                Select a month:
              </label>
              <select
                className="form-select my-0 rounded-0 shadow"
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
      </div>

      {attendanceData && (
        <div className="border" style={{ overflow: "auto", maxHeight: "82vh" }}>
          <table
            style={{
              fontWeight: "normal",
              position: "relative",
            }}
            className="table"
          >
            <thead>
              <tr style={{ position: "sticky", zIndex: "10", top: "-2px" }}>
                <th style={rowHeadStyle}>Date</th>
                <th style={rowHeadStyle}>Status</th>
                <th style={rowHeadStyle}>Login Time</th>
                <th style={rowHeadStyle}>Logout Time</th>
                <th style={rowHeadStyle}>Logs</th>
                <th style={rowHeadStyle}>Gross Login</th>
                <th style={rowHeadStyle}>Breaks</th>
                <th style={rowHeadStyle}>Total Break</th>
                <th style={rowHeadStyle}>Net Login</th>
                <th style={rowHeadStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {getYears().map((year) =>
                year.months
                  .filter((month) => month.month === selectedMonth)
                  .map((month) =>
                    month.dates
                      .sort((a, b) => a.date - b.date)
                      .map((date) => {
                        return (
                          <tr
                            className="shadow-sm"
                            key={date.date}
                            id={`attendance-row-${date.date}`} // Assign unique ID to each row
                            onMouseEnter={() => handleMouseEnter(date.date)}
                            onMouseLeave={() => handleMouseLeave()}
                          >
                            <td style={rowBodyStyle} className="text-center">
                              <div className="d-flex gap-2 align-items-center">
                                <span
                                  style={{
                                    border: darkMode
                                      ? "1px solid var(--primaryDashColorDark)"
                                      : "1px solid var(--primaryDashMenuColor)",
                                    color: darkMode
                                      ? "var(--primaryDashColorDark)"
                                      : "var(--primaryDashMenuColor)",
                                    fontSize: ".8rem",
                                    fontWeight: "normal",
                                  }}
                                  className="btn rounded-0"
                                >
                                  {twoDigitDate(date.date)}
                                </span>
                                <span
                                  style={{
                                    border: darkMode
                                      ? "1px solid var(--primaryDashColorDark)"
                                      : "1px solid var(--primaryDashMenuColor)",
                                    color: darkMode
                                      ? "var(--primaryDashColorDark)"
                                      : "var(--primaryDashMenuColor)",
                                    fontSize: ".9rem",
                                    fontWeight: "normal",
                                  }}
                                  className="btn  rounded-0"
                                >
                                  {daySwitch(date.day)}
                                </span>
                              </div>
                            </td>
                            <td style={rowBodyStyle}>
                              {getAttendanceMark(date)}
                            </td>
                            <td style={rowBodyStyle} className="text-uppercase">
                              {date.loginTime[0] ? date.loginTime[0] : <>--</>}
                            </td>
                            <td style={rowBodyStyle} className="text-uppercase">
                              {date.logoutTime[date.logoutTime.length - 1] ? (
                                date.logoutTime[date.logoutTime.length - 1]
                              ) : (
                                <>--</>
                              )}
                            </td>
                            <td style={rowBodyStyle} className="text-uppercase">
                              {date.loginTime.length}
                            </td>
                            <td style={rowBodyStyle}>
                              {convertMinutesToHMS(date.TotalLogin)}
                            </td>
                            <td
                              style={rowBodyStyle}
                              className="position-relative"
                            >
                              <div
                                style={{
                                  display: "flex ",
                                  justifyContent: "start",
                                  alignItems: "center",
                                }}
                                className="fs-6 gap-2 "
                                onMouseEnter={handleInfoMouseEnter}
                                onMouseLeave={handleInfoMouseLeave}
                              >
                                {date.breakTime.length}
                              </div>

                              {/* {!isInfoHovering && hoveredDate === date.date && (
                                <div
                                  style={{
                                    zIndex: "5",
                                    top: "0",
                                    right: "-50%",
                                    minHeight: "2px",
                                    overflow: "auto",
                                  }}
                                  className="position-absolute bg-white"
                                >
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
                                </div>
                              )} */}
                            </td>
                            <td style={rowBodyStyle}>
                              {convertMinutesToHMS(date.totalBrake)}
                            </td>
                            <td style={rowBodyStyle}>
                              {convertMinutesToHMS(date.totalLogAfterBreak)}
                            </td>
                            <td style={rowBodyStyle}>{date.status}</td>
                          </tr>
                        );
                      })
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
            gap: "1rem",
          }}
        >
          <div className="fs-2 fw-bolder">
            <TfiReload className="spinner-border text-info" />
          </div>
          <p
            style={{ color: darkMode ? "black" : "white" }}
            className="text-muted"
          >
            User not selected. To view data, please select a user.
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(SelfAttendance);
