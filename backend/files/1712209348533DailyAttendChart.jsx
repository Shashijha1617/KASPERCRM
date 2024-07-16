import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";

const DailyAttendChart = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    Present: 0,
    Late: 0,
    "Half Day": 0,
    Absent: 0
  });

  const [chartOption, setChartOption] = useState({
    options: {
      labels: ["Late", "Present", "Half Day", "Absent"],
      colors: ["#FFC764", "#00FFAB", "#FF884B", "#F65A83"],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true
              }
            }
          }
        }
      }
    },
    series: [
      statusCounts.Late,
      statusCounts.Present,
      statusCounts["Half Day"],
      statusCounts.Absent
    ]
  });

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/todays-attendance"
        );
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
        colors: ["#FFC764", "#00FFAB", "#FF884B", "#F65A83"],
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true
                }
              }
            }
          }
        }
      },
      series: [
        statusCounts.Late,
        statusCounts.Present,
        statusCounts["Half Day"],
        statusCounts.Absent
      ]
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
    if (s == 0) {
      return "Sunday";
    }
    if (s == 1) {
      return "Monday";
    }
    if (s == 2) {
      return "Tuesday";
    }
    if (s == 3) {
      return "Wednedsy";
    }
    if (s == 4) {
      return "Thrusday";
    }
    if (s == 5) {
      return "Friday";
    }
    if (s == 6) {
      return "Saturday";
    }
  };

  return (
    <div>
      <div className="ChartCard shadow-sm ">
        <div className="ChartHeader">
          <div className="d-flex justify-content-between ">
            <h4 className="fw-bolder my-auto text-white ">
              Today's Attendance
            </h4>
            <span className="p-0 fw-bolder fs-6 text-muted d-flex flex-column ">
              <span className="m-0 p-0 fs-6 text-center bg-white shadow-sm rounded-5 px-2">
                {" "}
                <span className="fw-bold">{dd}</span>-
                <span className="fw-bold">{mm}</span>-
                <span className="fw-bold">{yyyy}</span>
              </span>
              {/* <span className="text-uppercase m-0 p-0 text-primary fs-4 text-center">
                {status(dayCurrent)}
              </span> */}
            </span>
          </div>
        </div>
        <Chart
          options={chartOption.options}
          series={chartOption.series}
          type="donut"
          width="100%"
          height="300px"
        />
      </div>
    </div>
  );
};

export default DailyAttendChart;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Chart from "react-apexcharts";

// const DailyAttendChart = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [statusCounts, setStatusCounts] = useState({
//     Present: 0,
//     Late: 0,
//     "Half Day": 0,
//     Absent: 0
//   });

//   const [chartOption, setChartOption] = useState({
//     options: {
//       labels: ["Present", "Late", "Half Day", "Absent"],
//       colors: ["#008000", "#FFA500", "#FFD700", "#FF0000"],
//       plotOptions: {
//         pie: {
//           donut: {
//             labels: {
//               show: true,
//               total: {
//                 show: true
//               }
//             }
//           }
//         }
//       }
//     },
//     series: [
//       statusCounts.Present,
//       statusCounts.Late,
//       statusCounts["Half Day"],
//       statusCounts.Absent
//     ]
//   });

//   useEffect(() => {
//     const fetchAttendanceData = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:4000/api/todays-attendance"
//         );
//         setAttendanceData(response.data);
//       } catch (error) {
//         console.error("Error fetching today's attendance data:", error);
//       }
//     };

//     fetchAttendanceData();
//   }, []);

//   useEffect(() => {
//     const counts = attendanceData.reduce(
//       (acc, user) => {
//         const mark = getAttendanceMark(user);
//         acc[mark]++;
//         return acc;
//       },
//       { Present: 0, Late: 0, "Half Day": 0, Absent: 0 }
//     );

//     setStatusCounts(counts);
//   }, [attendanceData]);

//   const getAttendanceMark = (user) => {
//     const loginTime = user.attendance && user.attendance.loginTime[0];
//     if (loginTime) {
//       const [loginHour, loginMinute] = loginTime.split(":").map(Number);
//       if (loginHour > 9 || (loginHour === 9 && loginMinute > 45)) {
//         return "Half Day";
//       } else if (loginHour > 9 || (loginHour === 9 && loginMinute > 30)) {
//         return "Late";
//       }
//     }
//     return loginTime ? "Present" : "Absent";
//   };

//   return (
//     <div>
//       {/* <div className="donut-chart">
//           <ReactApexChart
//             options={{
//               labels: ["Present", "Late", "Half Day", "Absent"],
//               colors: ["#008000", "#FFA500", "#FFD700", "#FF0000"]
//             }}
//             series={[
//               statusCounts.Present,
//               statusCounts.Late,
//               statusCounts["Half Day"],
//               statusCounts.Absent

//             ]}
//             type="donut"
//             height={300}
//           />
//         </div> */}

//       <div className="ChartCard shadow-sm ">
//         <div className="ChartHeader">
//           <h5 className="fw-bolder d-flex gap-3">Employee By Department</h5>
//         </div>
//         <Chart
//           options={chartOption.options}
//           series={chartOption.series}
//           type="donut"
//           width="100%"
//           height="300px"
//         />
//       </div>
//     </div>
//   );
// };

// export default DailyAttendChart;
