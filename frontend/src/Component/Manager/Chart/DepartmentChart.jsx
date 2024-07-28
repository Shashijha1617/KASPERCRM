import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./chart.css";
import axios from "axios";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const DepartmentChart = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const { darkMode } = useTheme();

  const [chartOption, setChartOption] = useState({
    options: {
      labels: [],
      colors: [
        "var(--basecolor)",
        "var(--basecolor)",
        "var(--basecolor)",
        "var(--basecolor)",
        "var(--basecolor)",
        "var(--basecolor)",
      ],
      title: {
        text: "Departments Chart",
        style: {
          color: darkMode ?  "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
          fontWeight: "normal",
        },
      },
      legend: {
        position: "bottom",
        labels: {
          colors: darkMode ? [
            "var(--primaryDashMenuColor)",
            "var(--primaryDashMenuColor)",
            "var(--primaryDashMenuColor)",
            "var(--primaryDashMenuColor)",
            "var(--primaryDashMenuColor)",
            "var(--primaryDashMenuColor)",
          ] : [
            "var(--primaryDashColorDark)",
            "var(--primaryDashColorDark)",
            "var(--primaryDashColorDark)",
            "var(--primaryDashColorDark)",
            "var(--primaryDashColorDark)",
            "var(--primaryDashColorDark)",
          ],
        },
        markers: {
          fillColors: [
            "var(--basecolor)",
            "var(--basecolor)",
            "var(--basecolor)",
            "var(--basecolor)",
            "var(--basecolor)",
            "var(--basecolor)",
          ],
        },
      },
      fill: {
        colors: [
          "var(--basecolor)",
          "var(--basecolor)",
          "var(--basecolor)",
          "var(--basecolor)",
          "var(--basecolor)",
          "var(--basecolor)",
        ],
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                color: "white",
              },
            },
          },
        },
      },
      tooltip: {
        theme: "dark",
        style: {
          backgroundColor: "var(--basecolor)",
          color: "white",
        },
      },
    },
    series: [],
  });

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/employee`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
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

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const updateChartOptions = () => {
    const departmentCounts = {};
    departmentData.forEach((department) => {
      departmentCounts[department] = (departmentCounts[department] || 0) + 1;
    });

    const labels = Object.keys(departmentCounts);
    const series = labels.map((label) => departmentCounts[label]);

    setChartOption({
      options: {
        ...chartOption.options,
        labels: labels,
      },
      series: series,
    });
  };

  useEffect(() => {
    updateChartOptions();
  }, [departmentData]);

  useEffect(() => {
    setChartOption((prevOptions) => ({
      ...prevOptions,
      options: {
        ...prevOptions.options,
        title: {
          text: "Departments Chart",
          style: {
            color: darkMode ?  "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
            fontWeight: "normal",
          },
        },
        legend: {
          ...prevOptions.options.legend,
          labels: {
            colors: darkMode ? [
              "var(--primaryDashColorDark)",
              "var(--primaryDashColorDark)",
              "var(--primaryDashColorDark)",
              "var(--primaryDashColorDark)",
              "var(--primaryDashColorDark)",
              "var(--primaryDashColorDark)",
            ] : [
              "var(--primaryDashMenuColor)",
              "var(--primaryDashMenuColor)",
              "var(--primaryDashMenuColor)",
              "var(--primaryDashMenuColor)",
              "var(--primaryDashMenuColor)",
              "var(--primaryDashMenuColor)",
            ],
          },
          markers: {
            fillColors: [
              "var(--basecolor)",
              "var(--basecolor)",
              "var(--basecolor)",
              "var(--basecolor)",
              "var(--basecolor)",
              "var(--basecolor)",
            ],
          },
        },
      },
    }));
  }, [darkMode]);

  return (
    <div
      style={{
        height: "fit-content",
        background: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="ChartCard p-2 shadow"
    >
      <Chart
        options={chartOption.options}
        series={chartOption.series}
        type="pie"
        width="100%"
        height="352px"
      />
    </div>
  );
};

export default DepartmentChart;
