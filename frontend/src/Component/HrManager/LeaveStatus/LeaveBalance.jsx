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
    if (total === 0) return 0; // Prevent division by zero
    const percentage = (used / total) * 100;
    return Math.round(percentage) || 0; // Use '|| 0' to handle NaN results by returning 0
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
                style={{
                  boxShadow: "2px 2px 8px 2px black",
                  minWidth: "250px",
                }}
                key={leaveType}
                className=" border-0 rounded shadow-sm bg-white"
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold text-primary">
                      {leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}
                    </p>
                  </div>
                  <h6 className="card-text text-center fs-4 fw-bold">
                    {totalBalance - balance} Out of / {totalBalance}
                  </h6>
                  <div>
                    <p
                      className="p-0 m-0 text-end"
                      style={{ fontSize: ".8rem" }}
                    >
                      {calculatePercentage(
                        totalBalance - balance,
                        totalBalance
                      )}
                      % of 100%
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
              </div>
            ))}
          </>
        ) : (
          <>
            <h4 className="fw-bold text-muted my-auto pl-4">
              No Leave Record Found
            </h4>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaveBalance;
