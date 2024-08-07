import React from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import holidayImage from "../../img/holidayImage.svg";

const LeaveTable = ({
  filteredHolidays,
  searchTerm,
  setSearchTerm,
  filterYear,
  setFilterYear,
  filterMonth,
  setFilterMonth,
}) => {
  const { darkMode } = useTheme();

  const padChar = (pad) => {
    return String(pad).padStart(2, "0");
  };

  const GetFullMonth = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Check if the input month is valid
    if (month < 1 || month > 12) {
      return "Invalid month"; // or you could throw an error
    }

    // Return the corresponding month name
    return months[month - 1];
  };

  return (
    <div className="mb-5 pb-5">
      <div style={{ position: "sticky", top: "0" }}>
        <h6
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="fw-bold my-auto"
        >
          Holiday List{" "}
          <span className="text-warning"> ( {filteredHolidays.length} ) </span>
        </h6>
        <div
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="d-flex gap-2 py-3 align-items-center justify-content-between"
        >
          <div>
            <label htmlFor="">Search</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Search holiday..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <div>
              <label htmlFor="">Month</label>
              <input
                type="number"
                className="form-control rounded-0"
                placeholder="Month"
                min={1}
                max={12}
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Year</label>
              <input
                type="number"
                className="form-control rounded-0"
                placeholder="Year"
                value={filterYear}
                min={1900}
                max={2100}
                onChange={(e) => setFilterYear(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border border-1 " style={{ maxHeight: "62vh" }}>
        {filteredHolidays.length > 0 ? (
          <table className="table" style={{ fontSize: ".9rem" }}>
            <thead>
              <tr>
                <th
                  style={{
                    verticalAlign: "middle",
                    whiteSpace: "pre",
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--secondaryDashMenuColor)",
                    border: "none",
                  }}
                  className="py-2"
                >
                  Date
                </th>
                <th
                  style={{
                    verticalAlign: "middle",
                    whiteSpace: "pre",
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--secondaryDashMenuColor)",
                    border: "none",
                  }}
                  className="py-2"
                >
                  Name
                </th>
                <th
                  style={{
                    verticalAlign: "middle",
                    whiteSpace: "pre",
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--secondaryDashMenuColor)",
                    border: "none",
                  }}
                  className="py-2"
                >
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHolidays.map((holiday, index) => (
                <tr key={index}>
                  <td
                    style={{
                      verticalAlign: "middle",
                      whiteSpace: "pre",
                      background: darkMode
                        ? "var( --secondaryDashMenuColor)"
                        : "var(----secondaryDashMenuColor)",
                      color: darkMode
                        ? "var(----secondaryDashMenuColor)"
                        : "var( --primaryDashMenuColor)",
                      border: "none",
                    }}
                  >
                    {padChar(holiday.holidayDate)}/
                    {padChar(holiday.holidayMonth)}/{holiday.holidayYear}
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                      whiteSpace: "pre",
                      background: darkMode
                        ? "var( --secondaryDashMenuColor)"
                        : "var(----secondaryDashMenuColor)",
                      color: darkMode
                        ? "var(----secondaryDashMenuColor)"
                        : "var( --primaryDashMenuColor)",
                      border: "none",
                    }}
                  >
                    {holiday.holidayName}
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                      whiteSpace: "pre",
                      background: darkMode
                        ? "var( --secondaryDashMenuColor)"
                        : "var(----secondaryDashMenuColor)",
                      color: darkMode
                        ? "var(----secondaryDashMenuColor)"
                        : "var( --primaryDashMenuColor)",
                      border: "none",
                    }}
                  >
                    {holiday.holidayType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            style={{
              verticalAlign: "middle",
              whiteSpace: "pre",
              color: darkMode
                ? "var(--secondaryDashMenuColor)"
                : "var(--primaryDashMenuColor)",
              border: "none",
            }}
            className="d-flex gap-2 py-5 flex-column justify-content-center align-items-center"
          >
            <img
              style={{ height: "100%", width: "50%" }}
              src={holidayImage}
              alt=""
            />
            <p
              style={{
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
              }}
              className="p-0 m-0"
            >
              No holiday available this month of {GetFullMonth(filterMonth)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveTable;
