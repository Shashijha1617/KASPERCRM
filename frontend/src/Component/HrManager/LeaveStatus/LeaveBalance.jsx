import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
const LeaveBalance = () => {
  const [leaveBalance, setLeaveBalance] = useState([]);
  const email = localStorage.getItem("Email");
  const { darkMode } = useTheme();

  useEffect(() => {
    axios
      .post(`${BASE_URL}/api/getLeave`, { email })
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const leaveType = Object.keys(item)[0];
          const totalLeaveType = Object.keys(item)[1];
          return {
            leaveType: leaveType.replace(/([A-Z])/g, " $1").trim(),
            balance: item[leaveType],
            totalBalance: item[totalLeaveType],
          };
        });
        setLeaveBalance(formattedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const calculatePercentage = (used, total) => {
    if (total === 0) return 0;
    const percentage = (used / total) * 100;
    return Math.round(percentage) || 0;
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between aline-items-center">
        <div className="my-auto">
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
              fontWeight: "600",
            }}
            className="m-0 p-0 "
          >
            Leaves Balance
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className="m-0 p-0 "
          >
            You can see all new leave balances here.
          </p>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-between gap-2 my-2">
        {leaveBalance.length > 0 ? (
          <>
            {" "}
            {leaveBalance.map(({ leaveType, balance, totalBalance }) => (
              <div
                key={leaveType}
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                  background: darkMode
                    ? "var(--primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                  minWidth: "250px",
                }}
                className="card-body rounded-2"
              >
                <div className="d-flex justify-content-between">
                  <p className="fw-bold ">
                    {leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}
                  </p>
                </div>
                <h6 className="card-text text-center fs-4 fw-bold">
                  {totalBalance - balance} Out of / {totalBalance}
                </h6>
                <div>
                  <p className="p-0 m-0 text-end" style={{ fontSize: ".8rem" }}>
                    {calculatePercentage(totalBalance - balance, totalBalance)}%
                    of 100%
                  </p>
                  <div style={{ height: "6px" }} className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${calculatePercentage(
                          totalBalance - balance,
                          totalBalance
                        )}%`,
                      }}
                      aria-valuenow={25}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="d-flex flex-wrap justify-content-between gap-2 my-2">
            <div
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
                background: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                minWidth: "250px",
              }}
              className="card-body border rounded-1"
            >
              <div className="d-flex justify-content-between gap-3">
                <p className="fw-bold ">Sick Leave</p>
              </div>
              <h5 className="card-text fw-bold">You Have ( 0 ) Leaves </h5>
            </div>
            <div
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
                background: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                minWidth: "250px",
              }}
              className="card-body border rounded-1"
            >
              <div className="d-flex justify-content-between gap-3">
                <p className="fw-bold ">Paid Leave</p>
              </div>
              <h5 className="card-text fw-bold">You Have ( 0 ) Leaves </h5>
            </div>
            <div
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
                background: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                minWidth: "250px",
              }}
              className="card-body border rounded-1"
            >
              <div className="d-flex justify-content-between gap-3">
                <p className="fw-bold ">Casual Leave</p>
              </div>
              <h5 className="card-text fw-bold">You Have ( 0 ) Leaves </h5>
            </div>
            <div
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
                background: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                minWidth: "250px",
              }}
              className="card-body border rounded-1"
            >
              <div className="d-flex justify-content-between gap-3">
                <p className="fw-bold ">Paternity Leave</p>
              </div>
              <h5 className="card-text fw-bold">You Have ( 0 ) Leaves </h5>
            </div>
            <div
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
                background: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                minWidth: "250px",
              }}
              className="card-body border rounded-1"
            >
              <div className="d-flex justify-content-between gap-3">
                <p className="fw-bold ">Maternity Leave</p>
              </div>
              <h5 className="card-text fw-bold">You Have ( 0 ) Leaves </h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveBalance;
