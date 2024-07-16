// *********************************************************************************************************
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BsFiletypeDoc } from "react-icons/bs";
import { Table } from "react-bootstrap";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const EmployeeNewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const { darkMode } = useTheme();

  const id = localStorage.getItem("_id");

  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/personal-info/${id}`,
          {
            headers: {
              authorization: localStorage.getItem("token") || ""
            }
          }
        );
        setEmail(response.data.Email);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadPersonalInfoData();
  }, []);

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const endDateTime = new Date(endDate);
    let remainingTime = endDateTime - now;

    if (remainingTime < 0) {
      // If remaining time is negative, consider it as delay
      remainingTime = Math.abs(remainingTime);
      return { delay: true, days: 0, hours: 0, minutes: 0 };
    } else {
      // Calculate remaining days, hours, minutes, and seconds
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      return { delay: false, days, hours, minutes };
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Count of different task statuses for the current employee
  const acceptedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Accepted"
    )
  ).length;

  const rejectedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Rejected"
    )
  ).length;

  const completedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Completed"
    )
  ).length;

  const pendingTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) => taskemp.empemail === email && task.status === "Pending"
    )
  ).length;

  const notAssignedButNotAcceptedTasksCount = tasks.filter(
    (task) =>
      !task.employees.some((taskemp) => taskemp.empemail === email) &&
      task.employees.every((taskemp) => taskemp.emptaskStatus !== "Accepted")
  ).length;

  const assignedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email && taskemp.emptaskStatus === "Task Assigned"
    )
  ).length;

  const notAcceptedAssignedTasksCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email &&
        taskemp.emptaskStatus === "Task Assigned" &&
        taskemp.emptaskStatus !== "Accepted"
    )
  ).length;

  const acceptedTasksNotCompletedOnTimeCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email &&
        taskemp.emptaskStatus === "Accepted" &&
        calculateRemainingTime(task.endDate).delay
    )
  ).length;

  const assignedTasksNotAcceptedOnTimeCount = tasks.filter((task) =>
    task.employees.some(
      (taskemp) =>
        taskemp.empemail === email &&
        taskemp.emptaskStatus === "Task Assigned" &&
        calculateRemainingTime(task.endDate).delay
    )
  ).length;

  return (
    <div>
      {/* ... (unchanged) */}
      <h1 className="fs-3 fw-bolder text-uppercase ">
        🌟New Task ({tasks.length})
      </h1>

      {/* <p>Accepted Tasks Count: {acceptedTasksCount}</p>
      <p>Rejected Tasks Count: {rejectedTasksCount}</p>
      <p>Completed Tasks Count: {completedTasksCount}</p>
      <p>Pending Tasks Count: {pendingTasksCount}</p> */}
      <p>
        Not Assigned but Not Accepted Tasks Count:{" "}
        {notAssignedButNotAcceptedTasksCount}
      </p>

      <p>Assigned Tasks Count: {assignedTasksCount}</p>
      <p>Not Accepted Assigned Tasks Count: {notAcceptedAssignedTasksCount}</p>

      <p>
        Accepted Tasks Not Completed On Time Count:{" "}
        {acceptedTasksNotCompletedOnTimeCount}
      </p>
      <p>
        Assigned Tasks Not Accepted On Time Count:{" "}
        {assignedTasksNotAcceptedOnTimeCount}
      </p>

      {/* ... (unchanged) */}
    </div>
  );
};

export default EmployeeNewTask;

// *************************************************************************
