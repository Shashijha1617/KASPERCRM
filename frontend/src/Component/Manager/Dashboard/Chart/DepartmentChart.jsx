import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./chart.css";
import axios from "axios";
import BASE_URL from "../../../../Pages/config/config";

const DepartmentChart = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartOption, setChartOption] = useState({
    options: {
      labels: [],
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
    series: []
  });

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
        labels: labels,
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
      series: series
    });
  };

  useEffect(() => {
    updateChartOptions();
  }, [departmentData]);

  return (
    <>
      <div className="ChartCard shadow-sm ">
        <div className="ChartHeader">
          <h5 className="fw-bolder d-flex gap-3">Employee By Department</h5>
        </div>
        <Chart
          options={chartOption.options}
          series={chartOption.series}
          type="donut"
          width="100%"
          height="100%"
        />
      </div>
    </>
  );
};

export default DepartmentChart;
