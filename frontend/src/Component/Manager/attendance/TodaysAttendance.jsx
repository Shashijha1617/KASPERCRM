import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "../../InnerDashContainer";
import { Link } from "react-router-dom";
import { AiOutlineMore } from "react-icons/ai";
import { TbLogin } from "react-icons/tb";
import { TbLogin2 } from "react-icons/tb";
import BASE_URL from "../../../Pages/config/config";

const TodaysAttendance = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    // Fetch today's attendance data when the component mounts
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

  const Today = () => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date()
      .toLocaleDateString(undefined, options)
      .replace(/\//g, "-");
  };

  const getAttendanceMark = (user) => {
    const loginTime = user.attendance && user.attendance.loginTime[0];
    if (loginTime) {
      const [loginHour, loginMinute] = loginTime.split(":").map(Number);
      if (loginHour > 9 || (loginHour === 9 && loginMinute > 45)) {
        return "Half Day";
      } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
        return "Late";
      }
    }
    return loginTime ? "Present" : "Absent";
  };

  const calculateTotalLoginTime = (loginTimeMs, logoutTimeMs) => {
    if (loginTimeMs && logoutTimeMs) {
      const totalMilliseconds = logoutTimeMs - loginTimeMs;

      // Convert totalMilliseconds to hours, minutes, and seconds
      const hours = Math.floor(totalMilliseconds / (60 * 60 * 1000));
      const minutes = Math.floor(
        (totalMilliseconds % (60 * 60 * 1000)) / (60 * 1000)
      );
      const seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);

      // Return the total login time in the format HH:MM:SS
      return `${hours} H:${minutes} M:${seconds} S`;
    }
    return "--";
  };

  // const calculateTotalLoginTime = (loginTimeMs, logoutTimeMs, totalBreak) => {
  //     if (loginTimeMs && logoutTimeMs) {
  //         const totalMilliseconds = logoutTimeMs - loginTimeMs - totalBreak;

  //         // Convert totalMilliseconds to hours, minutes, and seconds
  //         const hours = Math.floor(totalMilliseconds / (60 * 60 * 1000));
  //         const minutes = Math.floor((totalMilliseconds % (60 * 60 * 1000)) / (60 * 1000));
  //         const seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);

  //         // Return the total login time in the format HH:MM:SS
  //         return `${hours}:${minutes}:${seconds}`;
  //     }
  //     return 'N/A';
  // };
  const calculatetotalBrake = (totalBrake) => {
    if (totalBrake) {
      const totalMilliseconds = totalBrake;

      // Convert totalMilliseconds to hours, minutes, and seconds
      const hours = Math.floor(totalMilliseconds / (60 * 60 * 1000));
      const minutes = Math.floor(
        (totalMilliseconds % (60 * 60 * 1000)) / (60 * 1000)
      );
      const seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);

      // Return the total login time in the format HH:MM:SS
      return `${hours} H:${minutes} M:${seconds} S`;
    }
    return "--";
  };

  return (
    <Container>
      <div className="d-flex justify-content-between py-3">
        <h4 className="fw-bolder my-auto text-success mb-2">
          Today's Attendance
        </h4>
        <span className="p-0 fw-bolder fs-6 text-success ">{Today()} </span>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="bg-dark text-white py-1">User ID</th>
            <th className="bg-dark text-white py-1">Name</th>
            <th className="bg-dark text-white py-1">
              <TbLogin /> Login Time
            </th>
            <th className="bg-dark text-white py-1">
              <TbLogin2 /> Logout Time
            </th>
            <th className="bg-dark text-white py-1">Total Break</th>
            <th className="bg-dark text-white py-1">Total Login</th>
            <th className="bg-dark text-white py-1">Status</th>
            <th className="bg-dark text-white py-1 text-center">Mark</th>
            <th className="bg-dark text-white py-1 text-center">Break Count</th>
            <th className="bg-dark text-white py-1 text-center"></th>
            {/* Add more fields as needed */}
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((user) => {
            console.log(user); // Log user object to inspect its structure
            const mark = getAttendanceMark(user);
            return (
              <tr key={user.userId}>
                <td className="fw-bold">{user.empID}</td>
                <td className="fw-bold text-success">{user.FirstName}</td>
                <td className="text-uppercase">
                  {user.attendance ? user.attendance.loginTime[0] : "N/A"}
                </td>
                <td className="text-uppercase">
                  {user.attendance
                    ? user.attendance.logoutTime[
                        user.attendance.logoutTime.length - 1
                      ]
                    : "N/A"}
                </td>
                {/* <td>{user.attendance ? user.attendance.totalBrake : 'N/A'}</td> */}
                <td>
                  {calculatetotalBrake(
                    user.attendance ? user.attendance.totalBrake : null
                  )}
                </td>
                <td>
                  {calculateTotalLoginTime(
                    user.attendance ? user.attendance.loginTimeMs[0] : null,
                    user.attendance
                      ? user.attendance.logoutTimeMs[
                          user.attendance.logoutTimeMs.length - 1
                        ]
                      : null
                  )}
                </td>
                {/* <td>{calculateTotalLoginTime(
                                    user.attendance ? user.attendance.loginTimeMs[0] : null,
                                    user.attendance ? user.attendance.logoutTimeMs[user.attendance.logoutTimeMs.length - 1] : null,
                                    user.attendance ? user.attendance.totalBreak : 0 // Pass total break time here
                                )}</td> */}
                <td>{user.attendance ? user.attendance.status : "N/A"}</td>
                <td className="text-center">
                  <span
                    style={{ fontSize: ".8rem" }}
                    className={`py-1 px-3 rounded-5 shadow-sm fw-bold ${
                      mark === "Present"
                        ? "bg-success text-white"
                        : mark === "Late"
                        ? "bg-info text-white"
                        : mark === "Half Day"
                        ? "bg-warning text-white"
                        : "bg-danger text-white"
                    }`}
                  >
                    {mark}
                  </span>
                </td>
                <td className="text-center">
                  {user.attendance ? user.attendance.breakTime.length : "N/A"}
                </td>
                <td style={{ zIndex: "1" }} className="text-center">
                  <button
                    onMouseEnter={() => setActiveCategory(user)}
                    onMouseLeave={() => setActiveCategory(null)}
                    className=" btn p-0 fw-bold fs-5 position-relative"
                  >
                    <AiOutlineMore />{" "}
                    <span
                      style={{
                        display: activeCategory === user ? "flex" : "none"
                      }}
                    >
                      <Link
                        to="/hr/viewAttenDance"
                        style={{
                          position: "absolute",
                          whiteSpace: "pre",
                          right: "70%",
                          bottom: "-100%",
                          zIndex: "5"
                        }}
                        className="shadow p-2 fs-6"
                      >
                        Detailed
                      </Link>
                    </span>
                  </button>{" "}
                </td>
                {/* Add more cells for additional fields */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
};

export default TodaysAttendance;
