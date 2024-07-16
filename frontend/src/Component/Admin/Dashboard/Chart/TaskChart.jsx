// EmployeeChart.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import "./chart.css";
import { FaChartLine } from "react-icons/fa6";
import BASE_URL from "../../../../Pages/config/config";

const TaskChart = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/employee`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setDepartmentData(
            response.data.map(
              (data) => data["department"][0]?.DepartmentName || ""
            )
          );
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadTaskData = async () => {
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
    loadEmployeeData();
    loadTaskData();
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

  const countLateAndOnTimeTasks = () => {
    const lateTasksCount = tasks.filter(
      (task) =>
        task.status === "Pending" && calculateRemainingTime(task.endDate).delay
    ).length;

    const onTimeTasksCount = tasks.filter(
      (task) =>
        task.status === "Pending" && !calculateRemainingTime(task.endDate).delay
    ).length;

    return { lateTasksCount, onTimeTasksCount };
  };

  const departmentCounts = {};
  departmentData.forEach((department) => {
    departmentCounts[department] = (departmentCounts[department] || 0) + 1;
  });

  const taskStatusCounts = {
    Total: tasks.length,
    Assigned: tasks.filter((tasks) => tasks.status === "Assigned").length,
    ActiveTask: tasks.filter((task) => task.status === "Assigned").length,
    canceled: tasks.filter((task) => task.status === "Cancelled").length,
    Completed: tasks.filter((task) => task.status === "Completed").length,
    overdue: tasks.filter(
      (task) =>
        task.status === "Assigned" && calculateRemainingTime(task.endDate).delay
    ).length,

    onTime: tasks.filter(
      (task) =>
        task.status === "Assigned" &&
        !calculateRemainingTime(task.endDate).delay
    ).length

    // Rejected: tasks.filter((task) => task.status === "Rejected").length,
    // Active: tasks.filter((task) => task.status === "Pending").length,
    // Overdue: tasks.filter(
    //   (task) =>
    //     task.status === "Pending" && calculateRemainingTime(task.endDate).delay
    // ).length,
    // Ontime: tasks.filter(
    //   (task) =>
    //     task.status === "Pending" && !calculateRemainingTime(task.endDate).delay
    // ).length
  };

  const chartData = {
    series: [
      {
        name: "Total Employee",
        data: Object.values(departmentCounts)
      }
    ],
    options: {
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "40%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: Object.keys(departmentCounts),
        title: {
          text: "Department Wise Employee"
        }
      },
      yaxis: {
        title: {
          text: "Number of Employee"
        }
      },

      fill: {
        opacity: 1,
        colors: ["rgb(100, 150, 200)"] // Change bar colors
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return " " + val + "";
          }
        },
        markers: {
          colors: "yellow"
        }
      }
    }
  };
  const taskStatusChartData = {
    options: {
      chart: {
        id: "task-status-chart",
        type: "bar"
      },
      fill: {
        colors: ["var(--primaryDashColorDark)"]
      },
      xaxis: {
        categories: Object.keys(taskStatusCounts),
        title: {
          text: "Task Status"
        }
      },
      yaxis: {
        title: {
          text: "Number of Tasks"
        }
      }
    },
    series: [
      {
        name: "Task Status",
        data: Object.values(taskStatusCounts)
      }
    ]
  };

  return (
    <div style={{ height: "fit-content" }} className="ChartCard p-2 pb-0">
      <div className="ChartHeader">
        <h6
          style={{
            width: "fit-content",
            boxShadow: "0 0 10px 1px rgba(0,0,0,.2) inset",
            color: "var(--primaryDashColorDark)"
          }}
          className="fw-bolder d-flex px-3 rounded-5 py-1"
        >
          Task Progress Report
        </h6>
      </div>
      <div className="chartBody">
        <Chart
          options={taskStatusChartData.options}
          series={taskStatusChartData.series}
          type="bar"
          height="340px"
        />
      </div>
    </div>
  );
};

export default TaskChart;
