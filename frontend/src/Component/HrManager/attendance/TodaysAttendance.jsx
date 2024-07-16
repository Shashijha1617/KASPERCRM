import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiOutlineMore } from "react-icons/ai";
import { RxCaretSort, RxCounterClockwiseClock } from "react-icons/rx";
import { MdNearbyError } from "react-icons/md";
import {
  HiOutlineLogin,
  HiOutlineLogout,
  HiStatusOnline
} from "react-icons/hi";
import { FaUserClock } from "react-icons/fa6";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config";

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
      "Saturday"
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
      Mark: getAttendanceMark(user).toUpperCase()
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Add the caption at the top of the worksheet
    XLSX.utils.sheet_add_aoa(worksheet, [["Kasper", "123 New Delhi 110044"]], {
      origin: -1
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    XLSX.writeFile(workbook, "attendance.xlsx");
  };

  return (
    <div className="container-fluid pb-5">
      <div
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)"
        }}
        className="d-flex  justify-content-between py-3"
      >
        <h6 className="fw-bold my-auto ">Today's Attendance</h6>
        <div className="d-flex gap-2">
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
          <span className="btn  btn-secondary   rounded-0  fs-6 text-muted d-flex align-items-center gap-2 ">
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
      <div style={{ maxHeight: "76vh", overflow: "auto" }}>
        <table
          className="table"
          style={{ fontSize: ".8rem", fontWeight: "normal" }}
        >
          <thead>
            <tr style={{ position: "sticky", top: "0", zIndex: "1" }}>
              <th
                colSpan={2}
                onClick={() => handleSort("FirstName")}
                style={{
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  border: "none",
                  whiteSpace: "pre"
                }}
              >
                <RxCaretSort /> Employee Name {renderSortIcon("FirstName")}
              </th>

              <th
                onClick={() => handleSort("FirstName")}
                style={{
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  border: "none",
                  whiteSpace: "pre"
                }}
              >
                <RxCaretSort /> Emp ID {renderSortIcon("FirstName")}
              </th>

              <th
                style={{
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  border: "none",
                  whiteSpace: "pre"
                }}
              >
                {" "}
                <HiOutlineLogin /> Login Time{" "}
              </th>

              <th
                style={{
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  border: "none",
                  whiteSpace: "pre"
                }}
              >
                {" "}
                Logout Time <HiOutlineLogout />{" "}
              </th>

              <th
                style={{
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  border: "none",
                  whiteSpace: "pre"
                }}
              >
                {" "}
                <RxCounterClockwiseClock /> Log Count{" "}
              </th>

              <th
                style={{
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  border: "none",
                  whiteSpace: "pre"
                }}
              >
                {" "}
                Total Break{" "}
              </th>

              <th
                style={{
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  border: "none",
                  whiteSpace: "pre"
                }}
              >
                {" "}
                <FaUserClock /> Total Login{" "}
              </th>

              <th
                style={{
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  border: "none",
                  whiteSpace: "pre"
                }}
              >
                {" "}
                Status <HiStatusOnline />
              </th>

              <th
                style={{
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  border: "none",
                  whiteSpace: "pre"
                }}
              >
                {" "}
                <IoCheckmarkDoneOutline /> Mark{" "}
              </th>

              {/* <th style={{ background: darkMode ? "var(--primaryDashMenuColor)" : "var(--primaryDashColorDark)", background: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)", border: 'none' }} className="text-center"> Break Count</th> */}

              <th
                style={{
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  border: "none"
                }}
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.length > 0 ? (
              sortedAndFilteredData.map((user) => {
                const mark = getAttendanceMark(user);
                return (
                  <tr
                    style={{ position: "sticky", top: "0" }}
                    key={user.userId}
                  >
                    <td
                      className="border-0"
                      style={{
                        background: darkMode
                          ? "var(--primaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                        whiteSpace: "pre",
                        verticalAlign: "middle"
                      }}
                    >
                      <div
                        style={{
                          height: "35px",
                          width: "35px",
                          overflow: "hidden",
                          borderRadius: "50%"
                        }}
                        className="profile-image bg-white  mx-auto border-0"
                      >
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: "50%",
                            objectFit: "cover"
                          }}
                          className=" border-0"
                          src={
                            user?.data?.profile?.image_url
                              ? user?.data?.profile?.image_url
                              : "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
                          }
                          alt=""
                        />
                      </div>
                    </td>
                    <td
                      style={{
                        background: darkMode
                          ? "var(--primaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                        whiteSpace: "pre",
                        verticalAlign: "middle"
                      }}
                    >
                      <span className="text-capitalize">
                        {user.FirstName} {user.LastName}
                      </span>
                    </td>
                    <td
                      style={{
                        background: darkMode
                          ? "var(--primaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                        whiteSpace: "pre",
                        verticalAlign: "middle"
                      }}
                    >
                      <span>{user.empID}</span>
                    </td>
                    <td
                      style={{
                        background: darkMode
                          ? "var(--primaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                        whiteSpace: "pre",
                        verticalAlign: "middle"
                      }}
                    >
                      {user.attendance ? user.attendance.loginTime[0] : "--"}
                    </td>
                    <td
                      style={{
                        background: darkMode
                          ? "var(--primaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                        whiteSpace: "pre",
                        verticalAlign: "middle"
                      }}
                    >
                      {user.attendance
                        ? user.attendance.logoutTime[
                            user.attendance.logoutTime.length - 1
                          ]
                        : "--"}
                    </td>
                    <td
                      style={{
                        background: darkMode
                          ? "var(--primaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                        whiteSpace: "pre",
                        verticalAlign: "middle"
                      }}
                      className="text-uppercase text-center"
                    >
                      {user.attendance
                        ? user.attendance.logoutTime.length
                        : "--"}
                    </td>
                    <td
                      style={{
                        background: darkMode
                          ? "var(--primaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                        whiteSpace: "pre",
                        verticalAlign: "middle"
                      }}
                    >
                      <span>
                        {user.attendance ?convertMinutesToHoursAndMinutes( user.attendance.totalBrake) : "--"}
                      </span>
                    </td>
                    <td
                      style={{
                        background: darkMode
                          ? "var(--primaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                        whiteSpace: "pre",
                        verticalAlign: "middle"
                      }}
                    >
                      {user.attendance
                        ? convertMinutesToHoursAndMinutes(
                            user.attendance.totalLogAfterBreak
                          )
                        : null}
                    </td>
                    <td
                      className="text-capitalize text-start"
                      style={{
                        background: darkMode
                          ? "var(--primaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                        whiteSpace: "pre",
                        verticalAlign: "middle"
                      }}
                    >
                      {user.attendance ? user.attendance.status : "--"}
                    </td>
                    <td
                      style={{
                        background: darkMode
                          ? "var(--primaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                        whiteSpace: "pre",
                        verticalAlign: "middle"
                      }}
                      className="text-start"
                    >
                      <span
                        style={{ fontSize: ".8rem" }}
                        className={`py-1 px-3 rounded-5 shadow-sm ${
                          mark === "Present"
                            ? "text-success"
                            : mark === "Late"
                            ? "text-info"
                            : mark === "Half Day"
                            ? "text-warning"
                            : "text-danger"
                        }`}
                      >
                        {mark}
                      </span>
                    </td>
                    {/* <td style={{ verticalAlign: "middle", textAlign: 'center' }} className='text-center'>{user.attendance ? user.attendance.breakTime.length : '--'}</td> */}
                    <td
                      style={{
                        background: darkMode
                          ? "var(--primaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none"
                      }}
                      className="text-center"
                    >
                      <Link to="/hr/viewAttenDance">
                        <button
                          style={{
                            background: darkMode
                              ? "var(--primaryDashMenuColor)"
                              : "var(--secondaryDashColorDark)",
                            color: darkMode
                              ? "var(--secondaryDashColorDark)"
                              : "var(--primaryDashMenuColor)",
                            border: "none"
                          }}
                          onMouseEnter={() => setActiveCategory(user)}
                          onMouseLeave={() => setActiveCategory(null)}
                          className=" btn p-0 fw-bold fs-5 position-relative"
                        >
                          <AiOutlineMore />
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="10"
                  style={{ height: "30vh", width: "94%", position: "absolute" }}
                  className="d-flex flex-column justify-content-center align-items-center gap-1"
                >
                  <span className="fw-bolder " style={{ fontSize: "2rem" }}>
                    <MdNearbyError
                      className="text-danger"
                      style={{ fontSize: "2.3rem" }}
                    />{" "}
                    OOPS!
                  </span>
                  <h6 className="p-0 m-0">Record not found.</h6>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodaysAttendance;
