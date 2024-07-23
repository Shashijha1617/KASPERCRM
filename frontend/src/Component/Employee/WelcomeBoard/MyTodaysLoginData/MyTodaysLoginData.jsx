import React, { useEffect, useState } from "react";
import { MdCoffee } from "react-icons/md";
import { RiLoginCircleFill, RiLogoutCircleFill } from "react-icons/ri";
import { BsFillBriefcaseFill } from "react-icons/bs";
import axios from "axios";
import BASE_URL from "../../../../Pages/config/config";
const MyTodaysLoginData = (props) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [empName, setEmpName] = useState(null);

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
    <div className="row justify-content-between row-gap-3 container-fluid my-3 mx-auto">
      <div
        className="col-6 col-lg-3  row bg-primary rounded-2 py-2"
        style={{ height: "5rem" }}
      >
        <div className="col-md-8 col-12">
          <span className="fs-5 text-white">Login </span>
          <p className="text-white fs-5 m-0">{attendanceData.loginTime}</p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center text-white fs-1">
          <RiLoginCircleFill />
        </div>
      </div>
      <div
        className="col-6 col-lg-3 row bg-secondary rounded-2 py-2"
        style={{ height: "5rem" }}
      >
        <div className="col-md-8 col-12">
          <span className="fs-5 text-white">Total Break</span>
          <p className="text-white fs-5 m-0">
            {convertMinutesToHoursAndMinutes(attendanceData.totalBrake)}
          </p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center text-white fs-1">
          <MdCoffee />
        </div>
      </div>
      <div
        className="col-6 col-lg-3 row bg-success rounded-2 py-2"
        style={{ height: "5rem" }}
      >
        <div className="col-md-8 col-12">
          <span className="fs-5 text-white">Total Login</span>
          <p className="text-white fs-5 m-0">
            {convertMinutesToHoursAndMinutes(attendanceData.totalLoginTime)}
          </p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center text-white fs-1">
          <BsFillBriefcaseFill />
        </div>
      </div>
      <div
        className="col-6 col-lg-3 row bg-info rounded-2 py-2"
        style={{ height: "5rem" }}
      >
        <div className="col-md-8 col-12">
          <span className="fs-5 text-white">Logout</span>
          <p className="text-white fs-5 m-0">{attendanceData.logoutTime}</p>
        </div>
        <div className="col-md-4 col-12 d-none d-md-flex align-items-center justify-content-center text-white fs-1">
          <RiLogoutCircleFill />
        </div>
      </div>
    </div>
  );
};

export default MyTodaysLoginData;
