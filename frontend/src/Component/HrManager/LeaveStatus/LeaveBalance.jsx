import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
import axios from "axios";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";

const LeaveBalance = () => {
  const [leaveBalance, setLeaveBalance] = useState([]);
  const id = localStorage.getItem("_id");
  const { darkMode } = useTheme();

  useEffect(() => {
    axios
      .post("http://localhost:4000/api/getLeave", { id })
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
    <div className="container-fluid py-">
      <TittleHeader
        title={"Leaves Balance"}
        message={"You can see all new leave balances here."}
      />

      <div className="d-flex flex-wrap justify-content-between gap-2 my-2">
        {leaveBalance.length > 0 ? (
          <div className="row  w-100">
            {" "}
            {leaveBalance.map(({ leaveType, balance, totalBalance }) => (
              <div
                key={leaveType}
                className="card-body col-6 col-md-3 col-lg-2 rounded-2 p-1"
              >
                <div
                  style={{
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--secondaryDashMenuColor)",
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                  }}
                  className="p-3"
                >
                  <div className="d-flex justify-content-between">
                    <p className="">
                      {leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}
                    </p>
                  </div>
                  <h6
                    style={{ fontWeight: "400" }}
                    className="card-text text-center mb-4"
                  >
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
                        className="progress-bar bg-primary"
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
          </div>
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
