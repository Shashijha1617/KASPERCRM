import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiOutlineMore } from "react-icons/ai";
import { RxCaretSort, RxCounterClockwiseClock } from "react-icons/rx";
import SearchLight from "../../img/Attendance/SearchLight.svg";
import {
  HiOutlineLogin,
  HiOutlineLogout,
  HiStatusOnline,
} from "react-icons/hi";
import { FaUserClock } from "react-icons/fa6";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const TodaysAttendance = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/todays-attendance`);
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching today's attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  let dayCurrent = today.getDay();

  const getAttendanceMark = (user) => {
    // Check if user and attendance are defined
    if (!user || !user.attendance) {
      return "Absent";
    }

    const loginTime = user.attendance.loginTime && user.attendance.loginTime[0];

    // Check if loginTime exists and is a string
    if (typeof loginTime !== "string") {
      return "Absent";
    }

    // Split loginTime only if it exists
    const [loginHour, loginMinute] = loginTime.split(":").map(Number);

    // Check if loginHour and loginMinute are valid numbers
    if (isNaN(loginHour) || isNaN(loginMinute)) {
      return "Absent";
    }

    // Check login time against criteria
    if (loginHour > 9 || (loginHour === 9 && loginMinute > 45)) {
      return "Half Day";
    } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
      return "Late";
    }

    // If loginTime exists, consider the user present, otherwise absent
    return loginTime ? "Present" : "Absent";
  };

  const status = (s) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[s];
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) =>
      sortField === field ? (prevOrder === "asc" ? "desc" : "asc") : "asc"
    );
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const renderSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? "▴" : "▾";
    }
    return null;
  };

  const sortedAndFilteredData = attendanceData
    .slice()
    .filter((item) =>
      item.FirstName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField) {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
      }
      return 0;
    });

  function convertMinutesToHoursAndMinutes(minutes) {
    // Calculate hours
    var hours = Math.floor(minutes / 60);
    // Calculate remaining minutes
    var remainingMinutes = minutes % 60;

    return hours + " Hrs " + remainingMinutes + " Min";
  }

  const exportToExcel = () => {
    const dataToExport = attendanceData.map((user) => ({
      "Employee ID": user.empID.toUpperCase(),
      "Employee Name":
        user.FirstName.toUpperCase() + " " + user.LastName.toUpperCase(),
      "Login Time (24Hrs)": user.attendance
        ? user.attendance.loginTime[0]
        : "--",
      "Logout Time (24Hrs)": user.attendance
        ? user.attendance.logoutTime[user.attendance.logoutTime.length - 1]
        : "--",
      "Total Login Time": user.attendance
        ? convertMinutesToHoursAndMinutes(
            user.attendance.totalLogAfterBreak
          ).toUpperCase()
        : "--",
      Mark: getAttendanceMark(user).toUpperCase(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Add the caption at the top of the worksheet
    XLSX.utils.sheet_add_aoa(worksheet, [["Kasper", "123 New Delhi 110044"]], {
      origin: -1,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    XLSX.writeFile(workbook, "attendance.xlsx");
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

  console.log(sortedAndFilteredData);

  return (
    <div className="container-fluid pb-5">
      <div className="d-flex justify-content-between py-3">
        <div>
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
            className=" my-auto"
          >
            Today's Attendance
          </h5>
          <span className="p-0 fs-6 d-flex ">
            <span
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
              }}
              className="m-0 p-0 fs-6 text-center"
            >
              {status(dayCurrent)} , <span>{dd}</span> - <span>{mm}</span> -
              <span>{yyyy}</span>
            </span>
          </span>
        </div>
        <div>
          <div className="d-flex gap-2">
            <input
              value={searchQuery}
              onChange={handleInputChange}
              type="search"
              className="form-control d-none d-sm-flex rounded-5"
              placeholder="Search by employee name"
            />
            <button
              style={{
                whiteSpace: "pre",
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
              className="btn d-flex btn-success gap-2 align-items-center justify-content-center m-auto shadow-sm py-3 py-sm-2 px-3 px-sm-3   rounded-5"
              onClick={exportToExcel}
            >
              {" "}
              <SiMicrosoftexcel />{" "}
              <span className="d-none d-md-flex">Export XLSX</span>
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex d-sm-none">
        <input
          value={searchQuery}
          onChange={handleInputChange}
          type="search"
          className="form-control mb-3 rounded-0"
          placeholder="Search by employee name"
        />
      </div>
      <div className="border" style={{ maxHeight: "78vh", overflow: "auto" }}>
        {sortedAndFilteredData.length > 0 ? (
          <table className="table" style={{ fontSize: ".9rem" }}>
            <thead>
              <tr style={{ position: "sticky", top: "0", zIndex: "1" }}>
                <th
                  onClick={() => handleSort("FirstName")}
                  style={rowHeadStyle}
                >
                  <RxCaretSort /> Employee {renderSortIcon("FirstName")}
                </th>
                <th style={rowHeadStyle}>
                  {" "}
                  <HiOutlineLogin /> Login Time{" "}
                </th>
                <th style={rowHeadStyle}>
                  {" "}
                  Logout Time <HiOutlineLogout />{" "}
                </th>

                <th style={rowHeadStyle}>
                  {" "}
                  <RxCounterClockwiseClock /> Log Count{" "}
                </th>
                <th style={rowHeadStyle}>
                  {" "}
                  Gross Login <HiOutlineLogout />{" "}
                </th>
                <th style={rowHeadStyle}> Total Break </th>
                <th style={rowHeadStyle}>
                  {" "}
                  <FaUserClock /> Net Login{" "}
                </th>
                <th style={rowHeadStyle}>
                  {" "}
                  Status <HiStatusOnline />
                </th>
                <th style={rowHeadStyle}>
                  {" "}
                  <IoCheckmarkDoneOutline /> Mark{" "}
                </th>
                <th style={rowHeadStyle} className="text-center">
                  {" "}
                  Break Count
                </th>
                <th style={rowHeadStyle}></th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredData.map((user) => {
                const mark = getAttendanceMark(user);
                return (
                  <tr
                    style={{ position: "sticky", top: "0" }}
                    key={user.userId}
                  >
                    <td style={rowBodyStyle}>
                      <div className="d-flex w-100 align-items-center gap-2">
                        <div
                          style={{
                            height: "35px",
                            width: "35px",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#ccc", // background color for the initials
                            borderRadius: "50%",
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#fff",
                          }}
                        >
                          {user?.profile?.image_url ? (
                            <img
                              style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                                overflow: "hidden",
                                borderRadius: "50%",
                              }}
                              src={user.profile.image_url}
                              alt={`${user?.FirstName} ${user?.LastName}`}
                            />
                          ) : (
                            `${user?.FirstName?.[0]}${user?.LastName?.[0]}`
                          )}
                        </div>
                        <div>
                          <p
                            style={{ fontSize: ".75rem" }}
                            className="p-0 m-0 w-100"
                          >
                            {user.empID}
                          </p>
                          <p
                            style={{ fontSize: ".80rem" }}
                            className="p-0 m-0 w-100 text-uppercase"
                          >
                            {user.FirstName} {user.LastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={rowBodyStyle}>
                      {user.attendance ? user.attendance.loginTime[0] : "--"}
                    </td>
                    <td style={rowBodyStyle}>
                      {user.attendance
                        ? user.attendance.logoutTime[
                            user.attendance.logoutTime.length - 1
                          ]
                        : "--"}
                    </td>
                    <td className="text-center" style={rowBodyStyle}>
                      {user.attendance
                        ? user.attendance.loginTime.length
                        : "--"}
                    </td>
                    <td style={rowBodyStyle}>
                      {user.attendance
                        ? convertMinutesToHoursAndMinutes(
                            user.attendance.TotalLogin
                          )
                        : null}
                    </td>
                    <td style={rowBodyStyle}>
                      {user.attendance
                        ? convertMinutesToHoursAndMinutes(
                            user.attendance.totalBrake
                          )
                        : null}
                    </td>
                    <td style={rowBodyStyle}>
                      {user.attendance
                        ? convertMinutesToHoursAndMinutes(
                            user.attendance.totalLogAfterBreak
                          )
                        : null}
                    </td>
                    <td style={rowBodyStyle}>
                      {user.attendance ? user.attendance.status : "--"}
                    </td>
                    <td style={rowBodyStyle}>
                      <span
                        style={{ fontSize: ".8rem" }}
                        className={`py-0 px-3 rounded-5 ${
                          mark === "Present"
                            ? "border border-success"
                            : mark === "Late"
                            ? "border border-info"
                            : mark === "Half Day"
                            ? "border border-warning"
                            : "border border-danger"
                        }`}
                      >
                        {mark}
                      </span>
                    </td>
                    <td className="text-center" style={rowBodyStyle}>
                      {user.attendance
                        ? user.attendance.breakTime.length
                        : "--"}
                    </td>
                    <td style={rowBodyStyle}>
                      <button
                        onMouseEnter={() => setActiveCategory(user)}
                        onMouseLeave={() => setActiveCategory(null)}
                        className=" btn p-0 fw-bold fs-5 position-relative"
                      >
                        <AiOutlineMore style={rowBodyStyle} />{" "}
                        <span
                          style={{
                            display: activeCategory === user ? "flex" : "none",
                          }}
                        >
                          <Link
                            to="/hr/viewAttenDance"
                            style={{
                              position: "absolute",
                              whiteSpace: "pre",
                              right: "70%",
                              bottom: "-50%",
                              zIndex: "2",
                            }}
                            className="shadow px-2 py-0  fs-6 bg-white rounded-5"
                          >
                            Detailed
                          </Link>
                        </span>
                      </button>{" "}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
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
              src={SearchLight}
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
              Sorry records not found or attendance not marked yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysAttendance;
