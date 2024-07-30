import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import Moment from "moment";
import { PiCoffeeFill } from "react-icons/pi";
import { FaComputerMouse } from "react-icons/fa6";
import toast from "react-hot-toast";
import BASE_URL from "../../../Pages/config/config";

function HrAttendance(props) {
  const [empName, setEmpName] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  const {
    employees,
    setEmployees,
    setSelectedEmployee,
    setAttencenceID,
    setMessage,
  } = useContext(AttendanceContext);

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/employee`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        });
        let hr = response.data.filter((val) => val.Account === 2);
        setEmployees(hr);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    loadEmployeeData();
  }, []);

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
        checkLoginStatus(response.data.FirstName);
      } catch (error) {
        console.error("Error fetching personal info:", error);
      }
    };

    const checkLoginStatus = async (name) => {
      try {
        const response = await axios.get(`${BASE_URL}/api/attendance`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        });
        const userAttendance = response.data.find(
          (entry) => entry.FirstName === name
        );
        if (userAttendance) {
          const lastEntry = userAttendance.attendanceObjID.at(-1);
          if (lastEntry && lastEntry.status === "Login") {
            setLoggedIn(true);
          }
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    loadPersonalInfoData();
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
    let data = employees.filter((val) => val.FirstName === empName);
    let attencenceID = data[0].attendanceObjID;
    let selectedEmployee = data[0]._id;
    setLoggedIn(true);
    try {
      if (!empName) {
        setMessage("Please select a user");
        return;
      }
      const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
      const currentTime = Moment().format("LT");
      await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
        employeeId: selectedEmployee,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate(),
        loginTime: [currentTime],
        loginTimeMs: [currentTimeMs],
        status: "Login",
      });
      toast.success("Login time recorded successfully");
    } catch (error) {
      console.error("Error recording login time:", error);
      toast.error("Error recording login time");
    }
  };

  const handleLogout = async () => {
    setLoggedIn(false);
    let data = employees.filter((val) => val.FirstName === empName);
    let attencenceID = data[0].attendanceObjID;
    let selectedEmployee = data[0]._id;
    try {
      if (!empName) {
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
      toast.success("Logout time recorded successfully");
    } catch (error) {
      console.error("Error recording logout time:", error);
      toast.error("Error recording logout time");
    }
  };

  const handleResume = async () => {
    setOnBreak(false);
    let email = localStorage.getItem("Email");
    if (employees) {
      let data = employees.filter((val) => val.Email === email);
      let attencenceID = data[0].attendanceObjID;
      let selectedEmployee = data[0]._id;
      try {
        if (!data) {
          setMessage("Please select an employee");
          return;
        }

        const currentTime = Moment().format("HH:mm:ss");
        const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
        await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
          employeeId: selectedEmployee,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          date: new Date().getDate(),
          ResumeTime: [currentTime],
          resumeTimeMS: [currentTimeMs],
          status: "Login",
        });
        toast.success("Resumed time recorded successfully");
      } catch (error) {
        console.error("Error recording resume time:", error);
        toast.error("Error recording resume time");
      }
    }
  };

  const handleBreak = async () => {
    setOnBreak(true);
    let email = localStorage.getItem("Email");
    if (employees) {
      let data = employees.filter((val) => val.Email === email);
      let attencenceID = data[0].attendanceObjID;
      let selectedEmployee = data[0]._id;
      try {
        if (!data) {
          setMessage("Please select an employee");
          return;
        }

        const currentTime = Moment().format("HH:mm:ss");
        const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
        await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
          employeeId: selectedEmployee,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          date: new Date().getDate(),
          breakTime: [currentTime],
          breakTimeMs: [currentTimeMs],
          status: "Break",
        });
        toast.success("Break time recorded successfully");
      } catch (error) {
        console.error("Error recording break time:", error);
        toast.error("Error recording break time");
      }
    }
  };

  return (
    <div className="App row gap-2">
      <div style={{ alignItems: "center" }} className="d-flex gap-2">
        {/* {!loggedIn && (
          <button
            className="btn btn-success d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogin}
          >
            <RiLoginCircleFill className="my-auto fs-5" /> Login
          </button>
        )} */}
        {/* {loggedIn && (
          <button
            className="btn btn-danger d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
          >
            <RiLogoutCircleFill className="my-auto fs-5" /> Logout
          </button>
        )} */}
        {!onBreak && (
          <button
            className="btn btn-warning d-flex align-items-center justify-content-center gap-2"
            onClick={handleBreak}
          >
            <PiCoffeeFill className="my-auto fs-5" /> Take a Break
          </button>
        )}
        {onBreak && (
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
            onClick={handleResume}
          >
            <FaComputerMouse className="my-auto fs-5" /> Resume
          </button>
        )}
      </div>
    </div>
  );
}

export default HrAttendance;
