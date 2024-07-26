import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";

const DailyAttendChart = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const { darkMode } = useTheme();
  const [statusCounts, setStatusCounts] = useState({
    Present: 0,
    Late: 0,
    "Half Day": 0,
    Absent: 0,
  });

  const [chartOption, setChartOption] = useState({
    options: {
      labels: ["Late", "Present", "Half Day", "Absent"],
      colors: [
        "var(--basecolor)",
        "var(--basecolor)",
        "var(--basecolor)",
        "var(--basecolor)",
      ],
      legend: {
        show: true,
        labels: {
          color: darkMode ? "black" : "white",
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: "Total",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                },
              },
            },
          },
        },
      },
    },
    series: [
      statusCounts.Late,
      statusCounts.Present,
      statusCounts["Half Day"],
      statusCounts.Absent,
    ],
  });

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

  const Today = () => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date()
      .toLocaleDateString(undefined, options)
      .split("/")
      .reverse()
      .join("-");
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  let dayCurrent = today.getDay();

  console.log("Today's Date:", `${dd}-${mm}-${yyyy}`);
  console.log("Day of the Week:", dayCurrent);

  useEffect(() => {
    const counts = attendanceData.reduce(
      (acc, user) => {
        const mark = getAttendanceMark(user);
        acc[mark]++;
        return acc;
      },
      { Late: 0, Present: 0, "Half Day": 0, Absent: 0 }
    );

    setStatusCounts(counts);
  }, [attendanceData]);

  useEffect(() => {
    setChartOption({
      options: {
        labels: ["Late", "Present", "Half Day", "Absent"],
        colors: [
          "var(--basecolor)",
          "var(--basecolor)",
          "var(--basecolor)",
          "var(--basecolor)",
        ],
        legend: {
          position: "bottom",
          show: true,
          labels: {
            color: darkMode ? "black" : "white",
          },
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                },
              },
            },
          },
        },
      },
      series: [
        statusCounts.Late,
        statusCounts.Present,
        statusCounts["Half Day"],
        statusCounts.Absent,
      ],
    });
  }, [statusCounts]);

  const getAttendanceMark = (user) => {
    const loginTime = user.attendance && user.attendance.loginTime[0];
    if (loginTime) {
      const [loginHour, loginMinute] = loginTime.split(":").map(Number);
      if (loginHour > 9 || (loginHour === 9 && loginMinute >= 45)) {
        return "Half Day";
      } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
        return "Late";
      }
    }
    return loginTime ? "Present" : "Absent";
  };

  const status = (s) => {
    if (s == 0) return "Sunday";
    if (s == 1) return "Monday";
    if (s == 2) return "Tuesday";
    if (s == 3) return "Wednesday";
    if (s == 4) return "Thursday";
    if (s == 5) return "Friday";
    if (s == 6) return "Saturday";
  };

  return (
    <div>
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
        <div
          style={{
            background: darkMode
              ? "var(--primaryDashMenuColor)"
              : "var(--primaryDashColorDark)",
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
          }}
          className="ChartHeader"
        >
          <div
            style={{
              background: darkMode
                ? "var(--primaryDashMenuColor)"
                : "var(--primaryDashColorDark)",
              color: darkMode
                ? "var(--primaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
            className="ChartHeader d-flex justify-content-between p-2"
          >
            <h6
              style={{
                width: "fit-content",
              }}
              className="d-flex px-3 rounded-5 py-1"
            >
              Today's Attendance{" "}
            </h6>
            <span className="m-0 p-0 fs-6 text-center my-auto shadow-sm rounded-5 px-2">
              <span>{dd}</span>-<span>{mm}</span>-<span>{yyyy}</span>
            </span>
          </div>
        </div>
        <Chart
          options={chartOption.options}
          series={chartOption.series}
          type="pie"
          width="100%"
          height="320px"
        />
      </div>
    </div>
  );
};

export default DailyAttendChart;
