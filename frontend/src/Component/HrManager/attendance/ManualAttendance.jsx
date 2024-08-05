import React, { useEffect, useContext } from "react";
import axios from "axios";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import BASE_URL from "../../../Pages/config/config";
import Moment from "moment";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import toast from "react-hot-toast";

function ManualAttendance() {
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

  const { darkMode } = useTheme();

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
  }, [selectedEmployee]);

  const handleUserChange = (employeeID) => {
    const selectedEmployee = employees.find(
      (employee) => employee._id === employeeID
    );

    if (selectedEmployee) {
      setAttencenceID(selectedEmployee.attendanceObjID);
      setSelectedEmployee(employeeID);
      console.log(
        "Selected Employee Attendance Object ID:",
        selectedEmployee.attendanceObjID
      );
      getMessage(employeeID);
    }
  };

  const getMessage = async (employeeID) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/attendance/${employeeID}`
      );
      const lastEntry = response.data[response.data.length - 1];

      if (lastEntry) {
        setMessage(`Status: ${lastEntry.years[0].months[0].dates[0].status}`);
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
      const formattedCurrentTime = currentTime.toLocaleTimeString();

      await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        loginTime: [currentTime],
        loginTimeMs: [currentTimeMs],
        status: "login",
      });
      toast.success(
        `Login time recorded successfully at ${formattedCurrentTime}`
      );
    } catch (error) {
      toast.error("Error recording login time");
    }
  };

  const handleLogout = async () => {
    try {
      if (!selectedEmployee) {
        setMessage("Please select an employee");
        return;
      }

      const currentTime = new Date();
      const formattedCurrentTime = currentTime.toLocaleTimeString(); // Converts to local time string
      const currentTimeMs = Math.round(currentTime.getTime());

      await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: currentTime.getFullYear(),
        month: currentTime.getMonth() + 1,
        date: currentTime.getDate(),
        logoutTime: [currentTime],
        logoutTimeMs: [currentTimeMs],
        status: "Logout",
      });

      toast.success("Logout time recorded successfully");
      setMessage(
        `Logout time recorded successfully at ${formattedCurrentTime}`
      );
    } catch (error) {
      // console.error("Error recording logout time:", error);
      toast.error("Error recording logout time");
      setMessage("Error recording logout time");
    }
  };

  const handleResume = async () => {
    try {
      if (!selectedEmployee) {
        setMessage("Please select an employee");
        return;
      }

      const currentTime = new Date();
      const formattedCurrentTime = currentTime.toLocaleTimeString();
      const URcurrentTimeMs = currentTime.getTime();
      const currentTimeMs = Math.round(URcurrentTimeMs);

      await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: currentTime.getFullYear(),
        month: currentTime.getMonth() + 1,
        date: currentTime.getDate(),
        ResumeTime: [currentTime],
        resumeTimeMS: [currentTimeMs],
        status: "Login",
      });

      toast.success("Resumed time recorded successfully");
      setMessage(
        `Resumed time recorded successfully at ${formattedCurrentTime}`
      );
    } catch (error) {
      setMessage("Error recording resume time");
      toast.error("Error recording resume time");
    }
  };

  const handleBreak = async () => {
    try {
      if (!selectedEmployee) {
        setMessage("Please select an employee");
        return;
      }

      const currentTime = new Date();
      const formattedCurrentTime = currentTime.toLocaleTimeString();
      const URcurrentTimeMs = currentTime.getTime();
      const currentTimeMs = Math.round(URcurrentTimeMs);

      await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: currentTime.getFullYear(),
        month: currentTime.getMonth() + 1,
        date: currentTime.getDate(),
        breakTime: [currentTime],
        breakTimeMs: [currentTimeMs],
        status: "Break",
      });

      toast.success("Break time recorded successfully");
      setMessage(`Break time recorded successfully at ${formattedCurrentTime}`);
    } catch (error) {
      toast.error("Error recording break time");
      setMessage("Error recording break time");
    }
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <TittleHeader
        title={"Manual Attendance"}
        message={
          "You can mark manual attendance of the employee whan facing any technical issue."
        }
      />
      <div className="d-flex flex-column my-2 gap-3">
        <select
          className="form-select rounded-0"
          onChange={(e) => handleUserChange(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.empID} {employee.FirstName}
            </option>
          ))}
        </select>
        {selectedEmployee && (
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
        )}
      </div>

      {!selectedEmployee && (
        <p
          style={{ width: "fit-content" }}
          className="m-0 p-0 px-3 my-3 border border-danger"
        >
          Please select employee to mark attendance.
        </p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default ManualAttendance;
