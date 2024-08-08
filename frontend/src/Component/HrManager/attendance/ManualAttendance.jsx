import React, { useEffect, useContext } from "react";
import axios from "axios";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import BASE_URL from "../../../Pages/config/config";
import Moment from "moment";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";

function ManualAttendance() {
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
  console.log(message);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/employee`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        });

        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserChange = (employeeID) => {
    const selectedEmployee = employees.find(
      (employee) => employee._id === employeeID
    );

    if (selectedEmployee) {
      setAttencenceID(selectedEmployee.attendanceObjID);
      setSelectedEmployee(employeeID);
      getMessage(employeeID);
    }
  };

  const getMessage = async (employeeID) => {
    console.log(employeeID);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/attendance/${employeeID}`
      );

      const lastEntry = response.data.filter(
        (val) => val.employeeObjID._id === employeeID
      )[0];

      const year = lastEntry.years;
      const month = year[year.length - 1].months;

      const day = month[month.length - 1].dates;
      const status = day[day.length - 1].status;
      console.log(status);

      if (lastEntry) {
        setMessage(`Status: ${status}`);
      } else {
        setMessage("");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const handleLogin = async () => {
    try {
      if (!selectedEmployee) {
        setMessage("Please select an employee");
        return;
      }
      const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
      const currentTime = Moment().format("HH:mm:ss");

      await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        loginTime: [currentTime],
        loginTimeMs: [currentTimeMs],
        status: "login",
      });
      alert("Login time recorded successfully");
    } catch (error) {
      console.error("Error recording login time:", error);
      alert("Error recording login time");
    }
  };

  const handleLogout = async () => {
    try {
      if (!selectedEmployee) {
        setMessage("Please select an employee");
        return;
      }

      const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
      const currentTime = Moment().format("HH:mm:ss");
      await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        logoutTime: [currentTime],
        logoutTimeMs: [currentTimeMs],
        status: "Logout",
      });
      setMessage("Logout time recorded successfully");
    } catch (error) {
      console.error("Error recording logout time:", error);
      setMessage("Error recording logout time");
    }
  };

  const handleResume = async () => {
    try {
      if (!selectedEmployee) {
        setMessage("Please select an employee");
        return;
      }

      const currentTime = Moment().format("HH:mm:ss");
      const URcurrentTimeMs = new Date().getTime();
      const currentTimeMs = Math.round(URcurrentTimeMs);

      await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        ResumeTime: [currentTime],
        resumeTimeMS: [currentTimeMs],
        status: "Login",
      });

      setMessage("Resumed time recorded successfully");
    } catch (error) {
      console.error("Error recording resume time:", error);
      setMessage("Error recording resume time");
    }
  };

  const handleBreak = async () => {
    try {
      if (!selectedEmployee) {
        setMessage("Please select an employee");
        return;
      }

      const currentTime = Moment().format("HH:mm:ss");
      const URcurrentTimeMs = new Date().getTime();
      const currentTimeMs = Math.round(URcurrentTimeMs);

      await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        breakTime: [currentTime],
        breakTimeMs: [currentTimeMs],
        status: "Break",
      });
      setMessage("Break time recorded successfully");
    } catch (error) {
      console.error("Error recording break time:", error);
      setMessage("Error recording break time");
    }
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

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-2"
    >
      <TittleHeader
        title={"Employee Manual Attendance"}
        message={
          "You can create manual attendance of employee in case of technical issue."
        }
      />
      <div className="my-3 d-flex flex-column gap-3">
        <select
          className="form-select  rounded-0"
          onChange={(e) => handleUserChange(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.empID} {employee.FirstName}
            </option>
          ))}
        </select>
        <div className="d-flex gap-3">
          <button className="btn btn-success" onClick={handleLogin}>
            Login
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
          <div className="d-flex gap-3">
            <button className="btn btn-warning" onClick={handleBreak}>
              Break
            </button>
            <button className="btn btn-primary" onClick={handleResume}>
              Resume
            </button>
          </div>
        </div>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ManualAttendance;
