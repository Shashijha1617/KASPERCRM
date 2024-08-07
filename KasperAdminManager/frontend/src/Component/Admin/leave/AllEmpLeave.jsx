import React, { useState, useEffect } from "react";
import axios from "axios";
import { css } from "@emotion/react";

import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { RingLoader } from "react-spinners";
import profileImg from "../../../img/profile.jpg";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import SearchLight from "../../../img/Attendance/SearchLight.svg";

const AllEmpLeaves = (props) => {
  const [leaveApplicationHRData, setLeaveApplicationHRData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/getAllLeave`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        const leaveApplicationHRObj = response.data;
        setLeaveApplicationHRData(leaveApplicationHRObj);
        setLoading(false);
        console.log(leaveApplicationHRObj);

        const rowDataT = leaveApplicationHRObj.map((data) =>
          data.profile !== null
            ? {
                empID: data.empID,
                Name: data.FirstName + " " + data.LastName,
                Leavetype: data.Leavetype,
                sickLeave: data.sickLeave,
                paidLeave: data.paidLeave,
                casualLeave: data.casualLeave,
                paternityLeave: data.paternityLeave,
                maternityLeave: data.maternityLeave,
                profilePic: data.profile.image_url,
              }
            : {
                empID: data.empID,
                Name: data.FirstName + " " + data.LastName,
                Leavetype: data.Leavetype,
                sickLeave: data.sickLeave,
                paidLeave: data.paidLeave,
                casualLeave: data.casualLeave,
                paternityLeave: data.paternityLeave,
                maternityLeave: data.maternityLeave,
                profilePic: null,
              }
        );
        console.log(rowDataT);
        setRowData(rowDataT);
        setFilteredData(rowDataT);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const filtered = rowData.filter((item) =>
      item.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery]);

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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center py-3">
        <TittleHeader
          title={"Consolidated Leaves Balance"}
          message={
            "You can view consolidated leave balances of the employee here."
          }
        />
        <div className="searchholder p-0 d-flex position-relative">
          <input
            style={{ height: "100%", width: "100%", paddingLeft: "10%" }}
            className="form-control border rounded-0 py-2"
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div id="clear-both" />
      {!loading ? (
        <div
          style={{
            minHeight: "80vh",
            maxHeight: "80vh",
            overflow: "auto",
            width: "100%",
          }}
          className="mb-2 px-1 border"
        >
          {filteredData.length > 0 ? (
            <table className="table" style={{ fontSize: ".9rem" }}>
              <thead>
                <tr>
                  <th style={rowHeadStyle}>Profile</th>
                  <th style={rowHeadStyle}>Employee Name</th>
                  <th style={rowHeadStyle}>Emp ID</th>

                  <th style={rowHeadStyle}>Sick Leave</th>
                  <th style={rowHeadStyle}>Paid Leave</th>
                  <th style={rowHeadStyle}>Casual Leave</th>
                  <th style={rowHeadStyle}>Paternity Leave</th>
                  <th style={rowHeadStyle}>Maternity Leave</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((data, index) => (
                  <tr key={index}>
                    <td style={rowBodyStyle}>
                      <img
                        src={data.profilePic || profileImg}
                        alt="Profile"
                        style={{
                          height: "35px",
                          width: "35px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td style={rowBodyStyle}>{data.Name}</td>
                    <td style={rowBodyStyle}>{data.empID}</td>
                    <td style={rowBodyStyle}>{data.sickLeave}</td>
                    <td style={rowBodyStyle}>{data.paidLeave}</td>
                    <td style={rowBodyStyle}>{data.casualLeave}</td>
                    <td style={rowBodyStyle}>{data.paternityLeave}</td>
                    <td style={rowBodyStyle}>{data.maternityLeave}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                height: "80vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                wordSpacing: "5px",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              <img
                style={{
                  height: "auto",
                  width: "20%",
                }}
                src={SearchLight}
                alt="img"
              />
              <p
                className="text-center w-75 mx-auto"
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var( --primaryDashMenuColor)",
                }}
              >
                User not found.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div id="loading-bar">
          <RingLoader size={50} color="#0000ff" loading={true} />
        </div>
      )}
    </div>
  );
};

export default AllEmpLeaves;
