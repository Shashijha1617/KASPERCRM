import React, { useEffect, useState } from "react";
import "./WelcomeBoard.css";
import axios from "axios";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import HrAttendance from "../../Component/HrManager/attendance/Attendance";
import BASE_URL from "../config/config";

const WelcomeBoard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const { darkMode } = useTheme();

  const id = localStorage.getItem("_id");

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)"
      }}
      className="d-flex align-items-center shadow rounded-3 m-0 justify-content-center p-2"
    >
      {employeeData && (
        <div className="d-flex gap-2 justify-content-between flex-column align-items-center ">
          <h4 className="my-auto">
            Welcome Back,{" "}
            <span className="fw-bolder text-capitalize">
              {employeeData.FirstName} {employeeData.LastName}
            </span>{" "}
            👋
          </h4>
          <HrAttendance />
        </div>
      )}
    </div>
  );
};

export default WelcomeBoard;
