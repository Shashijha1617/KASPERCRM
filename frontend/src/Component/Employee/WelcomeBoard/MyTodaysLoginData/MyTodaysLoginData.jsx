import React, { useEffect, useState } from "react";
import { MdOutlineFreeBreakfast, MdWorkOutline } from "react-icons/md";
import { RiLoginCircleLine, RiLogoutCircleRLine } from "react-icons/ri";
import axios from "axios";
import BASE_URL from "../../../../Pages/config/config";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
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
      icon: <RiLoginCircleLine style={{ rotate: "180deg" }} />,
      title: "Login",
      data: attendanceData.loginTime,
    },
    {
      icon: <MdOutlineFreeBreakfast />,
      title: "Total Break",
      data: convertMinutesToHoursAndMinutes(attendanceData.totalBrake),
    },
    {
      icon: <MdWorkOutline />,
      title: "Total Working",
      data: convertMinutesToHoursAndMinutes(attendanceData.totalLoginTime),
    },
    {
      icon: <RiLogoutCircleRLine />,
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
            background: darkMode ? "var(--basecolor)" : "var(--basecolor4)",
            height: "5rem",
          }}
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

const Labels = ({ title, data, icon, style }) => {
  return (
    <div className="col-6 col-lg-3 row rounded-0 py-2" style={style}>
      <div className="col-8 my-auto">
        <span>{title}</span>
        <p className="m-0">{data}</p>
      </div>
      <div className="col-4 d-flex align-items-center justify-content-center m-auto fs-2">
        {icon}
      </div>
    </div>
  );
};
