import React, { useState, useEffect } from "react";
import axios from "axios";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const LeaveDataComponent = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/approved-leave-application-emp`
        );
        const filteredData = response.data.filter((leave) => {
          const toDate = new Date(leave.ToDate);
          const today = new Date();
          return toDate <= today;
        });
        setLeaveData(filteredData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const rowHeadStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
    border: "none",
    position: "sticky",
    top: "0rem",
    zIndex: "100",
  };

  const rowBodyStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--primaryDashMenuColor)",
    border: "none",
  };
  return (
    <div
      style={{
        background: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="p-3 py-3 shadow"
    >
      <h6 className="mb-3">Leave List</h6>
      <div style={{ maxHeight: "15rem", overflow: "hidden" }}>
        {leaveData.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th style={rowHeadStyle}>Employee Name</th>
                <th style={rowHeadStyle} className="text-end">
                  From
                </th>
                <th style={rowHeadStyle} className="text-end">
                  To
                </th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((leave) => (
                <tr key={leave._id}>
                  <td style={rowBodyStyle}>
                    {leave.employee.length > 0
                      ? `${leave.employee[0].FirstName} ${leave.employee[0].LastName}`
                      : "N/A"}
                  </td>
                  <td style={rowBodyStyle} className="text-end">
                    {getFormattedDate(leave.FromDate)}
                  </td>
                  <td style={rowBodyStyle} className="text-end">
                    {getFormattedDate(leave.ToDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>No Leave</>
        )}
      </div>
    </div>
  );
};

export default LeaveDataComponent;
