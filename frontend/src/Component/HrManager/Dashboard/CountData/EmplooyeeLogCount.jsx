import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import Chart from "react-apexcharts";
import BASE_URL from "../../../../Pages/config/config";

const EmployeeLogCount = (props) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "donut",
    },
    labels: ["Logged In", "Logged Out", "Inactive"],

    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        donut: {
          size: "50%",
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "radial",
        shadeIntensity: 0.5,
        gradientToColors: ["#8af054", "#f21606", "#eecd27"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      show: false,
    },
    colors: ["#75ff2b", "#fd4c40", "#fddb31"],
    dataLabels: {
      enabled: true,
    },
    legend: {
      show: true,
      labels: {
        colors: darkMode ? "black" : "white",
      },
      position: "top",
    },
  });

  const [chartSeries, setChartSeries] = useState([]);

  const loadEmployeeData = () => {
    axios
      .get(`http://localhost:4000/api/employee`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEmployeeData(response.data);
          setLoading(false);

          setRowData([]);

          response.data.forEach((data) => {
            let temp = {
              data,
              Email: data["Email"],
              Password: data["Password"],
              Account:
                data["Account"] === 1
                  ? "Admin"
                  : data["Account"] === 2
                  ? "HR"
                  : data["Account"] === 3
                  ? "Employee"
                  : data["Account"] === 4
                  ? "Manager"
                  : "",
              RoleName: data["role"][0] ? data["role"][0]["RoleName"] : "",
              FirstName: data["FirstName"],
              MiddleName: data["MiddleName"],
              LastName: data["LastName"],
              DOB: data["DOB"].slice(0, 10),
              ContactNo: data["ContactNo"],
              empID: data["empID"],
              DepartmentName: data["department"][0]
                ? data["department"][0]["DepartmentName"]
                : "",
              PositionName: data["position"][0]
                ? data["position"][0]["PositionName"]
                : "",
              DateOfJoining: data["DateOfJoining"].slice(0, 10),
              loginStatus: data["loginStatus"],
            };

            setRowData((prevData) => [...prevData, temp]);
          });
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

  useEffect(() => {
    const loggedInCount = rowData.filter(
      (data) => data.loginStatus === "loggedIn"
    ).length;
    const loggedOutCount = rowData.filter(
      (data) => data.loginStatus === "loggedOut"
    ).length;
    const inactiveCount = rowData.filter(
      (data) =>
        data.loginStatus !== "loggedOut" && data.loginStatus !== "loggedIn"
    ).length;

    setChartSeries([loggedInCount, loggedOutCount, inactiveCount]);
  }, [rowData]);

  return (
    <div
      style={{
        height: "220px",
        background: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="ChartCard shadow p-2 "
    >
      <div></div>
      <h6
        style={{
          width: "fit-content",
          boxShadow: "0 0 10px 1px rgba(0,0,0,.2) inset",
        }}
        className="fw-bolder d-flex px-3 rounded-5 py-1"
      >
        Login Status{" "}
      </h6>
      <Chart
        width="100%"
        height="335px"
        options={chartOptions}
        series={chartSeries}
        type="donut"
      />
    </div>
  );
};

export default EmployeeLogCount;
