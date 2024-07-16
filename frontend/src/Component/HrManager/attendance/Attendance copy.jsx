import React, { useEffect, useContext } from "react";
import axios from "axios";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";

function SetLog() {
  // const [employees, setEmployees] = useState([]);
  // const [selectedEmployee, setSelectedEmployee] = useState("");
  // const [attencenceID, setAttencenceID] = useState("");
  // const [message, setMessage] = useState("");

  const {
    employees,
    setEmployees,
    selectedEmployee,
    setSelectedEmployee,
    attencenceID,
    setAttencenceID,
    message,
    setMessage
  } = useContext(AttendanceContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/employee", {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
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
    try {
      const response = await axios.get(
        `http://localhost:4000/api/attendance/${employeeID}`
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
        setMessage("Please select a user");
        return;
      }

      const currentTime = new Date().toLocaleTimeString();
      await axios.post(`http://localhost:4000/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        loginTime: [currentTime],
        status: "login"
      });
      setMessage("Login time recorded successfully");
    } catch (error) {
      console.error("Error recording login time:", error);
      setMessage("Error recording login time");
    }
  };

  const handleLogout = async () => {
    try {
      if (!selectedEmployee) {
        setMessage("Please select an employee");
        return;
      }

      const currentTime = new Date().toLocaleTimeString();
      await axios.post(`http://localhost:4000/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        logoutTime: [currentTime],
        status: "logout"
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

      const currentTime = new Date().toLocaleTimeString();
      const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);

      await axios.post(`http://localhost:4000/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        ResumeTime: [currentTime],
        resumeTimeMS: [currentTimeMs],
        status: "resume"
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

      const currentTime = new Date().toLocaleTimeString();
      const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);

      await axios.post(`http://localhost:4000/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        breakTime: [currentTime],
        breakTimeMs: [currentTimeMs],
        status: "break"
      });
      setMessage("Break time recorded successfully");
    } catch (error) {
      console.error("Error recording break time:", error);
      setMessage("Error recording break time");
    }
  };

  console.log(employees);

  return (
    <div className="App row">
      <h1 className="text-center text-uppercase my-3">Attendance System</h1>
      <div
        className="form-control d-flex  gap-3 p-3 m-3"
        style={{ height: "fit-content" }}
      >
        <select
          className="form-select mx-2 w-25 "
          onChange={(e) => handleUserChange(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.FirstName}
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

export default SetLog;
