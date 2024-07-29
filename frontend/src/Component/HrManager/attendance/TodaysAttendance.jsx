import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineNumber } from "react-icons/ai";
import noRecordFound from "../../../img/Attendance/noRecordFound.svg";
import {
  HiOutlineLogin,
  HiOutlineLogout,
  HiStatusOnline,
} from "react-icons/hi";
import { FaUserClock } from "react-icons/fa6";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config";
import { RxCaretSort } from "react-icons/rx";
import { MdFreeBreakfast } from "react-icons/md";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";

const TodaysAttendance = () => {
  // const [activeCategory, setActiveCategory] = useState(null);
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
      return (
        <span className="border border-danger py-0 p-2 rounded-5">Absent</span>
      );
    }

    const loginTime = user.attendance.loginTime && user.attendance.loginTime[0];

    // Check if loginTime exists and is a string
    if (typeof loginTime !== "string") {
      return (
        <span className="border border-danger py-0 p-2 rounded-5">Absent</span>
      );
    }

    // Split loginTime only if it exists
    const [loginHour, loginMinute] = loginTime.split(":").map(Number);

    // Check if loginHour and loginMinute are valid numbers
    if (isNaN(loginHour) || isNaN(loginMinute)) {
      return (
        <span className="border border-danger py-0 p-2 rounded-5">Absent</span>
      );
    }

    // Check login time against criteria
    if (loginHour > 9 || (loginHour === 9 && loginMinute > 45)) {
      return (
        <span className="border border-warning py-0 p-2 rounded-5">
          Half Day
        </span>
      );
    } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
      return (
        <span className="border border-info py-0 px-2 rounded-5">Late</span>
      );
    }

    // If loginTime exists, consider the user present, otherwise absent
    return loginTime ? (
      <span className="border border-success py-0 p-2 rounded-5">Present</span>
    ) : (
      <span className="border border-danger py-0 p-2 rounded-5">Absent</span>
    );
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

  function convertMinutesToHMS(totalSeconds) {
    // Calculate hours
    var hours = Math.floor((totalSeconds / 3600) * 60);
    // Calculate remaining minutes
    var remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    // Calculate remaining seconds
    var remainingSeconds = totalSeconds % 60;

    return (
      hours + " Hrs " + remainingMinutes + " Min " + remainingSeconds + " Sec"
    );
  }

  return (
    <div className="container-fluid">
      <div
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
        }}
        className="d-flex  justify-content-between py-3"
      >
        <TittleHeader
          title={"Today's Attendance"}
          message={"You can view today's employee attendance here."}
        />
        <div>
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
              fontWeight: "600",
            }}
            className=" m-0"
          ></h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className=" m-0"
          ></p>
        </div>
        <div className="d-flex gap-2 my-auto">
          <input
            value={searchQuery}
            onChange={handleInputChange}
            type="search"
            className="form-control rounded-0 py-0"
            placeholder="Search name ..."
          />
          <button
            style={{ whiteSpace: "pre" }}
            className="d-flex  align-items-center  gap-2 btn btn-outline-success  py-0 px-3 shadow-sm rounded-0"
            onClick={exportToExcel}
          >
            {" "}
            <SiMicrosoftexcel className="my-auto" />{" "}
            <span className="d-none d-md-flex">Export XLSX</span>
          </button>{" "}
          <span
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
              border: darkMode
                ? "1px solid var(--secondaryDashColorDark)"
                : "1px solid var(--secondaryDashMenuColor",
            }}
            className="btn     rounded-0  fs-6 d-flex align-items-center gap-2 "
          >
            <span className="text-uppercase m-0 p-0  text-center">
              {status(dayCurrent)}
            </span>
            <span className="m-0 p-0 text-center px-2">
              {" "}
              <span>{dd}</span>/<span>{mm}</span>/<span>{yyyy}</span>
            </span>
          </span>
        </div>
      </div>
      <div
        className={`${sortedAndFilteredData.length > 0 ? "border" : ""}  `}
        style={{ maxHeight: "80vh", overflow: "auto" }}
      >
        {sortedAndFilteredData.length > 0 ? (
          <table
            className="table"
            style={{ fontSize: ".8rem", fontWeight: "normal" }}
          >
            <thead>
              <tr style={{ position: "sticky", top: "0", zIndex: "1" }}>
                <th
                  colSpan={2}
                  onClick={() => handleSort("FirstName")}
                  style={rowHeadStyle}
                >
                  <RxCaretSort /> Employee Name {renderSortIcon("FirstName")}
                </th>

                <th
                  onClick={() => handleSort("FirstName")}
                  style={rowHeadStyle}
                >
                  <RxCaretSort /> Emp ID {renderSortIcon("FirstName")}
                </th>
                <th style={rowHeadStyle}>
                  {" "}
                  <IoCheckmarkDoneOutline /> Mark{" "}
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
                  <AiOutlineNumber /> Log{" "}
                </th>
                <th style={rowHeadStyle}>
                  {" "}
                  <AiOutlineNumber /> Gross Login
                </th>

                <th style={rowHeadStyle}>
                  {" "}
                  <AiOutlineNumber /> Break
                </th>
                <th style={rowHeadStyle}>
                  <MdFreeBreakfast />
                  Total Break{" "}
                </th>

                <th style={rowHeadStyle}>
                  <FaUserClock /> Net Login
                </th>

                <th style={rowHeadStyle}>
                  <HiStatusOnline /> Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredData.map((user) => {
                const mark = getAttendanceMark(user);
                return (
                  <tr key={user.userId}>
                    <td className="border-0" style={rowBodyStyle}>
                      <div
                        className="profile-image bg-white mx-auto border-0"
                        style={{
                          height: "30px",
                          width: "30px",
                          overflow: "hidden",
                          borderRadius: "50%",
                        }}
                      >
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                          className="border-0"
                          src={
                            user?.data?.profile?.image_url ||
                            "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
                          }
                          alt=""
                        />
                      </div>
                    </td>
                    <td style={rowBodyStyle}>
                      <span className="text-capitalize">
                        {user.FirstName} {user.LastName}
                      </span>
                    </td>
                    <td style={rowBodyStyle}>
                      <span>{user.empID}</span>
                    </td>
                    <td className="text-start" style={rowBodyStyle}>
                      {mark}
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
                    <td
                      className="text-uppercase text-center"
                      style={rowBodyStyle}
                    >
                      {user.attendance
                        ? user.attendance.logoutTime.length
                        : "--"}
                    </td>
                    <td style={rowBodyStyle}>
                      {convertMinutesToHMS(user.attendance.TotalLogin)}
                    </td>
                    <td className="text-center" style={rowBodyStyle}>
                      {user.attendance
                        ? user.attendance.breakTime.length
                        : "--"}
                    </td>
                    <td style={rowBodyStyle}>
                      {convertMinutesToHMS(user.attendance.totalBrake)}
                    </td>

                    <td style={rowBodyStyle}>
                      {user.attendance
                        ? convertMinutesToHMS(
                            user.attendance.totalLogAfterBreak
                          )
                        : null}
                    </td>
                    <td
                      className="text-capitalize text-start"
                      style={rowBodyStyle}
                    >
                      {user.attendance ? user.attendance.status : "--"}
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
              src={noRecordFound}
              alt="img"
            />
            <p
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var( --primaryDashMenuColor)",
              }}
            >
              User details not found{" "}
              {searchQuery && `using ( ${searchQuery} ) keyword `}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysAttendance;
