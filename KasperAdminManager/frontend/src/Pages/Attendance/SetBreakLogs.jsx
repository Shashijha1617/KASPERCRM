import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import Moment from "moment";
import BASE_URL from "../config/config";
import toast from "react-hot-toast";
import { MdCoffee, MdMouse } from "react-icons/md";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const SetBreakLogs = (props) => {
  const [empName, setEmpName] = useState(null);
  const { darkMode } = useTheme();
  const {
    employees,
    setEmployees,
    selectedEmployee,
    setSelectedEmployee,
    attencenceID,
    setAttencenceID,
    message,
    setMessage,
  } = useContext(AttendanceContext);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    loadPersonalInfoData();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/employee/${props.data["_id"]}`,
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const loadPersonalInfoData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/personal-info/${props.data["_id"]}`,
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      );
      setEmpName(response.data.FirstName);
    } catch (error) {
      console.error("Error fetching personal info:", error);
    }
  };

  const handleUserChange = (employeeID) => {
    const selectedEmployee = employees.find(
      (employee) => employee._id === employeeID
    );
    if (selectedEmployee) {
      setAttencenceID(selectedEmployee.attendanceObjID);
      setSelectedEmployee(employeeID);
      fetchMessage(employeeID);
    }
  };

  const fetchMessage = async (employeeID) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/attendance/${employeeID}`
      );
      const lastEntry = response.data[response.data.length - 1];
      setMessage(
        lastEntry
          ? `Status: ${lastEntry.years[0].months[0].dates[0].status}`
          : ""
      );
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleAttendanceAction = async (actionType, statusType) => {
    const employeeData = employees.find((val) => val.FirstName === empName);
    if (!employeeData) {
      setMessage("Please select a user");
      return;
    }

    const { attendanceObjID, _id } = employeeData;
    const currentTime = Moment().format("HH:mm:ss");

    try {
      await axios.post(`${BASE_URL}/api/attendance/${attendanceObjID}`, {
        employeeId: _id,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        [actionType]: [currentTime],
        status: statusType,
      });
      setMessage(`${statusType} time recorded successfully`);
      toast.success(`${statusType} time recorded successfully`);
    } catch (error) {
      setMessage(`Error recording ${statusType} time`);
      toast.error(`Error recording ${statusType} time`);
      console.error(`Error recording ${statusType} time:`, error);
    }
  };

  const handleLogin = () => handleAttendanceAction("loginTime", "login");
  const handleLogout = () => handleAttendanceAction("logoutTime", "logout");
  const handleResume = () => handleAttendanceAction("resumeTime", "resume");
  const handleBreak = () => handleAttendanceAction("breakTime", "break");

  return (
    <div className="d-flex gap-3" style={{ height: "fit-content" }}>
      <div className="d-flex gap-3">
        <button
          title="Break"
          className="btn btn-warning d-flex align-items-center gap-2"
          onClick={handleBreak}
        >
          <MdCoffee /> <span className="d-none d-md-flex">Break</span>
        </button>
        <button
          title="Resume"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleResume}
        >
          <MdMouse /> <span className="d-none d-md-flex">Resume</span>
        </button>
      </div>
    </div>
  );
};

export default SetBreakLogs;
