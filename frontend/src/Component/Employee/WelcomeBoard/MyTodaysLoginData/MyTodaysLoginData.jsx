import React, { useEffect, useState } from "react";
import {
  MdOutlineFreeBreakfast,
  MdWorkHistory,
  MdWorkOutline,
} from "react-icons/md";
import {
  RiLoginCircleLine,
  RiLogoutBoxRFill,
  RiLogoutCircleRLine,
} from "react-icons/ri";
import axios from "axios";
import BASE_URL from "../../../../Pages/config/config";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import { PiCoffeeFill } from "react-icons/pi";
import { FaUserClock } from "react-icons/fa";
import { ImExit } from "react-icons/im";
const MyTodaysLoginData = (props) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [empName, setEmpName] = useState(null);
  const { darkMode } = useTheme();

  const employeeId = localStorage.getItem("_id");
  console.log(empName);

  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/personal-info/` + employeeId,
          {
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          }
        );
        console.log(response.data.FirstName);
        setEmpName(response.data.FirstName);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadPersonalInfoData();
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Fetch today's attendance data for the employee
        const response = await fetch(
          `${BASE_URL}/api/employee/${employeeId}/today-attendance`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, [employeeId]);

  if (!attendanceData) {
    return <div>Loading...</div>;
  }
  function convertMinutesToHoursAndMinutes(minutes) {
    var hours = Math.floor(minutes / 60);
    var remainingMinutes = minutes % 60;

    return hours + " Hrs " + remainingMinutes + " Min";
  }

  const labelData = [
    {
      icon: <FaUserClock className="text-success" />,
      title: "Login",
      data: attendanceData.loginTime,
    },
    {
      icon: <PiCoffeeFill className="text-warning" />,
      title: "Total Break",
      data: convertMinutesToHoursAndMinutes(attendanceData.totalBrake),
    },
    {
      icon: <MdWorkHistory className="text-primary" />,
      title: "Total Working",
      data: convertMinutesToHoursAndMinutes(attendanceData.totalLoginTime),
    },
    {
      icon: <ImExit className="text-danger" />,
      title: "Logout",
      data: attendanceData.logoutTime
        ? attendanceData.logoutTime
        : "Not Logged out",
    },
  ];

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="row justify-content-between rounded-0 row-gap-3 container-fluid my-2 mx-auto"
    >
      {labelData.map((item, index) => (
        <Labels
          style={{
            background: darkMode
              ? "var(--primaryDashMenuColor)"
              : "var(--primaryDashColorDark)",
            // border: darkMode ? "1px solid black" : "1px solid white",
            height: "5rem",
          }}
          TytleStyle={"text-primary"}
          key={index}
          icon={item.icon}
          title={item.title}
          data={item.data}
        />
      ))}
    </div>
  );
};

export default MyTodaysLoginData;

const Labels = ({ title, data, icon, style, TytleStyle }) => {
  return (
    <div
      className="col-6 col-lg-3 shadow-sm rounded-2 justify-content-between row py-2"
      style={style}
    >
      <div className="col-8 my-auto">
        <span
          className={TytleStyle}
          style={{ fontSize: "1.2rem", fontWeight: "500" }}
        >
          {title}
        </span>
        <p className="m-0">{data}</p>
      </div>
      <div className="col-2 d-flex align-items-center justify-content-center m-auto fs-2">
        {icon}
      </div>
    </div>
  );
};
