import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import BASE_URL from "../../../../Pages/config/config";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import { AttendanceContext } from "../../../../Context/AttendanceContext/AttendanceContext";
import "./chart.css";

const EmpTaskChart = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = localStorage.getItem("Email");
  const { darkMode } = useTheme();
  const { socket } = useContext(AttendanceContext);

  const loadTaskData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tasks`);
      // Filter tasks related to the current user
      const userTasks = response.data.filter(task => task.managerEmail === email);
      setTasks(userTasks);
      setError(null);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaskData();
  }, []);

  useEffect(() => {
    socket.on("taskNotificationReceived", loadTaskData);
    return () => {
      socket.off("taskNotificationReceived", loadTaskData);
    };
  }, [socket]);

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const endDateTime = new Date(endDate);
    let remainingTime = endDateTime - now;

    if (remainingTime < 0) {
      remainingTime = Math.abs(remainingTime);
      return { delay: true, days: 0, hours: 0, minutes: 0 };
    } else {
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      return { delay: false, days, hours, minutes };
    }
  };

  const taskStatusCounts = {
    Total: tasks.length,
    New: tasks.filter(task => task.status === "Assigned").length,
    Completed: tasks.filter(task => task.status === "Completed").length,
    Rejected: tasks.filter(task => task.status === "Rejected").length,
    Canceled: tasks.filter(task => task.status === "Cancelled").length,
    Active: tasks.filter(task => task.status === "Pending").length,
    Overdue: tasks.filter(task =>
      task.status === "Pending" && calculateRemainingTime(task.endDate).delay
    ).length,
    Ontime: tasks.filter(task =>
      task.status === "Pending" && !calculateRemainingTime(task.endDate).delay
    ).length,
  };

  const taskStatusChartData = {
    options: {
      chart: {
        id: "task-status-chart",
        type: "bar",
      },
      xaxis: {
        categories: Object.keys(taskStatusCounts),
        title: {
          text: "Number of Tasks",
          style: {
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "normal",
          },
        },
        labels: {
          style: {
            colors: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          },
        },
      },
      yaxis: {
        title: {
          text: "Task Status",
          style: {
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "normal",
          },
        },
        labels: {
          style: {
            colors: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          },
        },
      },
      title: {
        text: "Task Status Chart",
        style: {
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
          fontWeight: "normal",
        },
      },
      
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "50%",
          borderRadius: 5,
          colors: {
            ranges: [
              {
                from: 0,
                to: 100,
                color: "var(--basecolor)",
              },
            ],
            backgroundBarColors: ["var(--basecolorTransparent)"],
          },
        },
      },
      
      colors: darkMode
        ? ["var(--primaryDashColorDark)"]
        : ["var(--secondaryDashMenuColor)"],
    },
    series: [
      {
        name: "Task Status",
        data: Object.values(taskStatusCounts),
      },
    ],
  };

  return (
    <div
      style={{
        background: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
          height:'fit-content'
      }}
      className=" rounded-0 shadow py-0 px-3 pt-3"
    >
      <div className="chartBody">
        <Chart
          options={taskStatusChartData.options}
          series={taskStatusChartData.series}
          type="bar"
          height="308px"
        />
      </div>
    </div>
  );
};

export default EmpTaskChart;
