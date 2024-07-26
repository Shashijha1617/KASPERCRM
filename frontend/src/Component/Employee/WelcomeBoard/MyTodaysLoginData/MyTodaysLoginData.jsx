import React, { useEffect, useState } from "react";
import { MdCoffee } from "react-icons/md";
import { RiLoginCircleFill, RiLogoutCircleFill } from "react-icons/ri";
import { BsFillBriefcaseFill } from "react-icons/bs";
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
    return <div>Loading...</div>; // or any other loading indicator
  }
  function convertMinutesToHoursAndMinutes(minutes) {
    var hours = Math.floor(minutes / 60);
    var remainingMinutes = minutes % 60;

    return hours + " Hrs " + remainingMinutes + " Min";
  }
  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--secondaryDashColorDark)",
      }}
      className="row justify-content-between row-gap-3 container-fluid my-3 mx-auto"
    >
      <div
        className="col-6 col-lg-3  row rounded-2 py-2"
        style={{ height: "5rem", background: "var(--basecolor)" }}
      >
        <div className="col-md-8 col-12">
          <span>Login </span>
          <p className="m-0">{attendanceData.loginTime}</p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center  fs-2">
          <RiLoginCircleFill />
        </div>
      </div>
      <div
        className="col-6 col-lg-3 row rounded-2 py-2"
        style={{ height: "5rem", background: "var(--basecolor)" }}
      >
        <div className="col-md-8 col-12">
          <span>Total Break</span>
          <p className="m-0">
            {convertMinutesToHoursAndMinutes(attendanceData.totalBrake)}
          </p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center fs-2">
          <MdCoffee />
        </div>
      </div>
      <div
        className="col-6 col-lg-3 row rounded-2 py-2"
        style={{ height: "5rem", background: "var(--basecolor)" }}
      >
        <div className="col-md-8 col-12">
          <span>Total Working</span>
          <p className="m-0">
            {convertMinutesToHoursAndMinutes(attendanceData.totalLoginTime)}
          </p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center  fs-2">
          <BsFillBriefcaseFill />
        </div>
      </div>
      <div
        className="col-6 col-lg-3 row rounded-2 py-2"
        style={{ height: "5rem", background: "var(--basecolor)" }}
      >
        <div className="col-md-8 col-12">
          <span>Logout</span>
          <p className="m-0">{attendanceData.logoutTime}</p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center  fs-2">
          <RiLogoutCircleFill />
        </div>
      </div>
    </div>
  );
};

export default MyTodaysLoginData;
