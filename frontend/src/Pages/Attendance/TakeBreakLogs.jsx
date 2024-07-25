import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import Moment from "moment";
import BASE_URL from "../config/config";
import toast from "react-hot-toast";
import { FaComputerMouse } from "react-icons/fa6";
import { PiCoffeeFill } from "react-icons/pi";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";

function TakeBreakLogs(props) {
  const [empName, setEmpName] = useState(null);
  const [empIDs, setEmpIDs] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/employee/` + localStorage.getItem("_id"),
          {
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          }
        );
        setEmployees(response.data);

        const attendanceResponse = await axios.get(
          `${BASE_URL}/api/attendance/` + localStorage.getItem("_id"),
          {
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          }
        );
        const lastEntry =
          attendanceResponse.data[attendanceResponse.data.length - 1];
        if (lastEntry) {
          setLoggedIn(lastEntry.status === "login");
          setOnBreak(lastEntry.status === "break");
        }
      } catch (error) {
        console.error("Error fetching employees or attendance data:", error);
      }
    };

    fetchUsers();
  }, [props.data]);

  const user = attendanceData.find((entry) => entry.userId === empIDs);
  console.log(user);

  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/personal-info/` + localStorage.getItem("_id"),
          {
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          }
        );
        setEmpName(response.data.FirstName);
        setEmpIDs(response.data.empID);
      } catch (error) {
        console.error("Error fetching personal info:", error);
      }
    };

    loadPersonalInfoData();
  }, [props.data]);

  const employeeLookup = employees.reduce((acc, employee) => {
    acc[employee.FirstName] = employee;
    return acc;
  }, {});

  const handleAction = async (action) => {
    if (!empName) {
      setMessage("Please select an employee");
      return;
    }

    const employee = employeeLookup[empName];
    if (!employee) {
      setMessage("Employee not found");
      return;
    }

    const attencenceID = employee.attendanceObjID;
    const selectedEmployee = employee._id;
    const currentTime = Moment().format("HH:mm:ss");
    const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);

    try {
      const statusMapping = {
        login: {
          status: "login",
          loginTime: [currentTime],
        },
        logout: {
          status: "logout",
          logoutTime: [currentTime],
        },
        break: {
          status: "break",
          breakTime: [currentTime],
          breakTimeMs: [currentTimeMs],
        },
        resume: {
          status: "login",
          ResumeTime: [currentTime],
          resumeTimeMS: [currentTimeMs],
        },
      };

      await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        ...statusMapping[action],
      });

      setMessage(
        `${
          action.charAt(0).toUpperCase() + action.slice(1)
        } time recorded successfully`
      );
      toast.success(
        `${
          action.charAt(0).toUpperCase() + action.slice(1)
        } time recorded successfully`
      );

      if (action === "login") setLoggedIn(true);
      if (action === "logout") setLoggedIn(false);
      if (action === "break") setOnBreak(true);
      if (action === "resume") setOnBreak(false);
    } catch (error) {
      setMessage(`Error recording ${action} time`);
      toast.error(`Error recording ${action} time`);
    }
  };

  return (
    <div className="App row gap-2">
      <div style={{ alignItems: "center" }} className="d-flex gap-2">
        {!onBreak && (
          <button
            className="btn btn-warning d-flex align-items-center justify-content-center gap-2"
            onClick={() => handleAction("break")}
          >
            <PiCoffeeFill className="my-auto fs-5" /> Take a Break
          </button>
        )}
        {onBreak && (
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
            onClick={() => handleAction("resume")}
          >
            <FaComputerMouse className="my-auto fs-5" /> Break Over
          </button>
        )}
      </div>
    </div>
  );
}

export default TakeBreakLogs;
