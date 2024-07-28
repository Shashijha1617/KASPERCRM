import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi";
import { FaUserClock } from "react-icons/fa6";
import SearchDark from "../../../img/Attendance/SearchDark.svg";
import SearchLight from "../../../img/Attendance/SearchLight.svg";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config";
import { AiOutlineFieldNumber } from "react-icons/ai";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { getMonthName } from "../../../Utils/GetDayFormatted";
import { MdOutlineTimelapse, MdOutlineWbSunny } from "react-icons/md";
import { TbStatusChange } from "react-icons/tb";
import { GoHash } from "react-icons/go";
import { IoIosTimer, IoMdTimer } from "react-icons/io";

const AttendanceDetails = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const { darkMode } = useTheme();

  const [hoveredDate, setHoveredDate] = useState(null);
  const [isInfoHovering, setIsInfoHovering] = useState(false);

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
      const response = await axios.get(`${BASE_URL}/api/employee`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleEmployeeChange = (event) => {
    setEmployeeId(event.target.value);
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

      let singleUser = response.data.filter((val) => {
        return val.employeeObjID && val.employeeObjID._id === employeeId;
      });

      setAttendanceData(singleUser.length > 0 ? singleUser[0] : null);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
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

  const getAttendanceMark = (date) => {
    const loginTime = date && date.loginTime[0];
    if (loginTime) {
      const [loginHour, loginMinute] = loginTime.split(":").map(Number);
      if (loginHour > 9 || (loginHour === 9 && loginMinute > 45)) {
        return (
          <span className="btn btn-outline-warning py-0 rounded-5">
            Half Day
          </span>
        );
      } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
        return (
          <span className="btn btn-outline-info py-0 rounded-5">Late</span>
        );
      }
    }
    return loginTime ? (
      <span className="btn btn-outline-success py-0 rounded-5">Present</span>
    ) : (
      <span className="btn btn-outline-danger py-0 rounded-5">Absent</span>
    );
  };

  const GetDay = (s) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[s];
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
    <div className="container-fluid d-flex flex-column gap-3">
      <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between my-2">
      <TittleHeader title={"Employee Wise Attendance"} message={"You can view attendance by employee here."}/>
                <div className="d-flex gap-3 justify-content-start justify-content-md-end my-auto">
          <div className="w-50">
            <select
              className="form-select rounded-0  shadow-sm text-muted"
              id="employeeId"
              value={employeeId}
              onChange={handleEmployeeChange}
            >
              <option value="" disabled>
                --Select Employee--
              </option>

              {employees
                .sort((a, b) => a.empID - b.empID)
                .map((employee) => (
                  <option
                    className="form-select"
                    key={employee._id}
                    value={employee._id}
                  >
                    {employee.empID} | {employee.FirstName.toUpperCase()}{" "}
                    {employee.LastName.toUpperCase()}
                  </option>
                ))}
            </select>
          </div>

          <button
            className="btn shadow my-auto rounded-0 btn-dark fw-bolder"
            style={{ width: "fit-content" }}
            onClick={handleFetchAttendance}
          >
            Fetch Attendance
          </button>
        </div>
      </div>

      {attendanceData && (
        <div
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="d-flex gap-3"
        >
          <div className="w-25">
            <label htmlFor="year">Select Year:</label>
            <select
              className="form-select shadow rounded-0"
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
          <div className="w-25">
            <label htmlFor="month">Select Month:</label>
            <select
              className="form-select shadow rounded-0"
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
        <div
          className="border border-1 border-dark "
          style={{ overflow: "auto", maxHeight: "73vh" }}
        >
          <table
            className="table"
            style={{ fontSize: ".9rem", fontWeight: "normal" }}
          >
            <thead>
              <tr
                style={{ position: "sticky", top: "0", zIndex: "3" }}
                className="shadow-sm"
              >
                <th
                  style={rowHeadStyle}
                >
                  <MdOutlineWbSunny /> Date | Day
                </th>
                <th
                  style={rowHeadStyle}
                >
                  <TbStatusChange /> Status
                </th>
                <th
                  style={rowHeadStyle}
                >
                  <HiOutlineLogin />
                  Login Time
                </th>
                <th
                  style={rowHeadStyle}
                >
                  <HiOutlineLogout /> Logout Time 
                </th>
                <th
                  style={rowHeadStyle}
                >
                  <GoHash /> logs
                </th>
                <th
                  style={rowHeadStyle}
                >
                  <IoIosTimer /> Gross Login
                </th>
                <th
                  style={rowHeadStyle}
                >
                  <GoHash /> Breaks
                </th>
                <th
                  style={rowHeadStyle}
                >
                  <IoMdTimer />Total Break
                </th>
                <th
                  style={rowHeadStyle}
                >
                  <MdOutlineTimelapse />
                  Net Login
                </th>
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
                            id={`attendance-row-${date.date}`}
                            onMouseEnter={() => handleMouseEnter(date.date)}
                            onMouseLeave={() => handleMouseLeave()}
                          >
                            <td
                              style={rowBodyStyle}
                              className="d-flex gap-2 align-items-center"
                            >
                              <span
                                className=" d-flex btn align-items-center justify-content-center rounded-0"
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  border: `1px solid ${
                                    darkMode
                                      ? "var(--primaryDashColorDark)"
                                      : "var( --primaryDashMenuColor)"
                                  }`,
                                  color: darkMode
                                    ? "var(--primaryDashColorDark)"
                                    : "var( --primaryDashMenuColor)",
                                }}
                              >
                                {String(date.date).padStart(2, "0")}
                              </span>{" "}
                              <span
                                className="py-0 btn  d-flex align-items-center justify-content-center rounded-0"
                                style={{
                                  height: "30px",
                                  width: "45px",
                                  border: `1px solid ${
                                    darkMode
                                      ? "var(--primaryDashColorDark)"
                                      : "var( --primaryDashMenuColor)"
                                  }`,
                                  color: darkMode
                                    ? "var(--primaryDashColorDark)"
                                    : "var( --primaryDashMenuColor)",
                                }}
                              >
                                {" "}
                                {GetDay(date.day)}
                              </span>
                            </td>
                            <td style={rowBodyStyle} className="text-start">
                              {getAttendanceMark(date)}
                            </td>
                            <td style={rowBodyStyle} className="text-uppercase">
                              {date.loginTime[0] ? date.loginTime[0] : "--"}
                            </td>
                            <td style={rowBodyStyle} className="text-uppercase">
                              {date.logoutTime[date.logoutTime.length - 1]
                                ? date.logoutTime[date.logoutTime.length - 1]
                                : "--"}
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
                                <span
                                  className="py-0 "
                                  style={{color: darkMode
                                        ? "var(--primaryDashColorDark)"
                                        : "var( --primaryDashMenuColor)",}}
                                >
                                  {" "}
                                  {date.loginTime.length}
                                </span>
                              </div>
                              <div
                                style={{
                                  zIndex: "5",
                                  right: "100%",
                                  maxHeight: "30vh",
                                  overflow: "auto",
                                  top: "0",
                                }}
                                className="position-absolute"
                              >
                                {isInfoHovering &&
                                  hoveredDate === date.date && (
                                    <table className="table table-bordered table-striped">
                                      <thead>
                                        <tr className="shadow-sm">
                                          <th
                                            style={{
                                              whiteSpace: "pre",
                                              backgroundColor:
                                                "var(--secondaryDashColorDark)",
                                              color:
                                                "var(--primaryDashMenuColor)",
                                            }}
                                          >
                                            Login
                                          </th>
                                          <th
                                            style={{
                                              whiteSpace: "pre",
                                              backgroundColor:
                                                "var(--secondaryDashColorDark)",
                                              color:
                                                "var(--primaryDashMenuColor)",
                                            }}
                                          >
                                            Logout
                                          </th>
                                          <th
                                            style={{
                                              whiteSpace: "pre",
                                              backgroundColor:
                                                "var(--secondaryDashColorDark)",
                                              color:
                                                "var(--primaryDashMenuColor)",
                                            }}
                                          >
                                            Total Login
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {date.loginTime.map(
                                          (loginTime, index) => (
                                            <tr key={index}>
                                              <td>{loginTime}</td>
                                              <td>{date.logoutTime[index]}</td>
                                              <td>
                                                {convertMinutesToHMS(
                                                  date.LogData[index]
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
                            <td style={rowBodyStyle}>
                              {convertMinutesToHMS(
                                date.TotalLogin
                              )}
                            </td>
                            <td style={rowBodyStyle}>
                              <span
                                className="py-0 "
                                style={{color: darkMode
                                  ? "var(--primaryDashColorDark)"
                                  : "var( --primaryDashMenuColor)",}}
                              >
                                {" "}
                                {date.breakTime.length}
                              </span>
                            </td>
                            <td  style={rowBodyStyle}>
                              {convertMinutesToHMS(
                                date.totalBrake
                              )}
                            </td>
                            <td style={rowBodyStyle}>
                              {convertMinutesToHMS(
                                date.totalLogAfterBreak
                              )}
                            </td>
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
            gap: "2rem",
          }}
        >
          <img
            style={{
              height: "auto",
              width: "20%",
            }}
            src={darkMode ? SearchDark : SearchLight}
            alt="img"
          />
          <p
            className="text-center w-75 mx-auto"
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var( --primaryDashMenuColor)",
            }}
          >
            User not selected. To view data, please select a user.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceDetails;
