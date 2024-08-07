import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Dropdown, DropdownButton } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { LuSearch } from "react-icons/lu";
import { MdNearbyError } from "react-icons/md";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import BASE_URL from "../../../Pages/config/config";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const LeaveApplicationHRTable = (props) => {
  const location = useLocation();
  const routeChecker = location.pathname.split("/")[1];
  console.log(routeChecker);
  const [leaveApplicationHRData, setLeaveApplicationHRData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { darkMode } = useTheme();
  const email = localStorage.getItem("Email");

  const loadLeaveApplicationHRData = () => {
    axios
      .post(
        `${BASE_URL}/api/leave-application-hr/`,
        routeChecker === "hr" ? { hr: email } : { manager: email },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((response) => {
        const leaveApplicationHRObj = response.data;
        setLeaveApplicationHRData(leaveApplicationHRObj);
        setLoading(false);

        const rowDataT = leaveApplicationHRObj.map((data) => {
          return {
            data,
            empID: data?.empID,
            Name: data?.FirstName + " " + data?.LastName,
            Leavetype: data?.Leavetype,
            FromDate: data?.FromDate?.slice(0, 10),
            ToDate: data?.ToDate?.slice(0, 10),
            Days: calculateDays(data?.FromDate, data?.ToDate),
            Reasonforleave: data?.Reasonforleave,
            Status: status(data?.Status),
            updatedBy: data?.updatedBy,
            reasonOfRejection: data?.reasonOfRejection,
          };
        });

        setRowData(rowDataT);
        setFilteredData(rowDataT);
        props.updateTotalLeaves(leaveApplicationHRObj.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadLeaveApplicationHRData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery]);

  const filterData = () => {
    const filtered = rowData.filter((item) => {
      return item.Name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredData(filtered);
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both start and end dates
    return diffDays;
  };

  const onLeaveApplicationHRDelete = (e1, e2) => {
    if (window.confirm("Are you sure to delete this record? ")) {
      axios
        .delete(`${BASE_URL}/api/leave-application-hr/` + e1 + "/" + e2, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then((res) => {
          loadLeaveApplicationHRData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const exportToPDF = () => {
    if (window.confirm("Are you sure to download Leave record? ")) {
      const pdfWidth = 297; // A4 width in mm
      const pdfHeight = 210; // A4 height in mm
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      doc.setFontSize(18);
      doc.text("Employee Leave Details", pdfWidth / 2, 15, "center");
      const headers = [
        "Emp Id",
        "Leave Type",
        "Start Date",
        "End Date",
        "Remarks",
        "Days",
        "Status",
      ];
      const data = filteredData.map((row) => [
        row.empID,
        row.Leavetype,
        row.FromDate,
        row.ToDate,
        row.Days,
        row.Reasonforleave,
        row.Status,

        "", // Action column - you can customize this based on your requirements
      ]);
      doc.setFontSize(12);
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 25,
      });

      doc.save("leaveApplication_data.pdf");
    }
  };

  const status = (s) => {
    if (s == 1) {
      return "Pending";
    }
    if (s == 2) {
      return "Approved";
    }
    if (s == 3) {
      return "Rejected";
    }
  };

  const renderSortIcon = (field) => {
    if (sortColumn === field) {
      return sortDirection === "asc" ? "▴" : "▾";
    }
    return null;
  };

  const sortData = (columnName) => {
    let newSortDirection = "asc";

    if (sortColumn === columnName && sortDirection === "asc") {
      newSortDirection = "desc";
    }

    const sortedData = [...filteredData];

    sortedData.sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];

      let comparison = 0;

      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      return sortDirection === "desc" ? comparison * -1 : comparison;
    });

    setFilteredData(sortedData);
    setSortColumn(columnName);
    setSortDirection(newSortDirection);
  };

  const approvedLeaves = filteredData.filter(
    (data) => data.Status === "Rejected"
  ).length;

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column justify-between">
        <div className="d-flex justify-content-between aline-items-center">
          <TittleHeader
            numbers={approvedLeaves}
            title={"Rejected Leaves"}
            message={"You can view all rejected leaves here"}
          />
          <div className="d-flex gap-2 justify-content-between py-3">
            <button
              className="btn btn-danger rounded-0 shadow-sm d-flex justify-center  aline-center gap-2"
              onClick={exportToPDF}
            >
              <BsFillFileEarmarkPdfFill />
              <p className="my-auto fs-6">PDF</p>
            </button>
            <div className="searchholder p-0 d-flex  position-relative">
              <input
                style={{
                  height: "100%",
                  width: "100%",
                  paddingLeft: "15%",
                }}
                className="form-control border-0 rounded-0"
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <LuSearch
                style={{ position: "absolute", top: "30%", left: "5%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div id="clear-both" />
      {!loading ? (
        <div>
          <div
            style={{
              maxHeight: "80vh",
              minHeight: "80vh",
              overflow: "auto",
              position: "relative",
            }}
            className="table-responsive border"
          >
            <table className="table">
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    style={{
                      verticalAlign: "middle",
                      whiteSpace: "pre",
                      background: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                      color: darkMode
                        ? "var(--primaryDashColorDark)"
                        : "var( --secondaryDashMenuColor)",
                      border: "none",
                    }}
                    onClick={() => sortData("empID")}
                  >
                    Employee Name
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
                        : "var( --secondaryDashMenuColor)",
                      border: "none",
                    }}
                    onClick={() => sortData("Leavetype")}
                  >
                    Emp ID
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
                        : "var( --secondaryDashMenuColor)",
                      border: "none",
                    }}
                    onClick={() => sortData("Leavetype")}
                  >
                    Leave Type {renderSortIcon("Leavetype")}
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
                        : "var( --secondaryDashMenuColor)",
                      border: "none",
                    }}
                    onClick={() => sortData("FromDate")}
                  >
                    Start Date {renderSortIcon("FromDate")}
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
                        : "var( --secondaryDashMenuColor)",
                      border: "none",
                    }}
                    onClick={() => sortData("ToDate")}
                  >
                    End Date {renderSortIcon("ToDate")}
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
                        : "var( --secondaryDashMenuColor)",
                      border: "none",
                    }}
                    onClick={() => sortData("Days")}
                  >
                    Days {renderSortIcon("Days")}
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
                        : "var( --secondaryDashMenuColor)",
                      border: "none",
                    }}
                    onClick={() => sortData("Reasonforleave")}
                  >
                    Remarks {renderSortIcon("Reasonforleave")}
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
                        : "var( --secondaryDashMenuColor)",
                      border: "none",
                    }}
                    onClick={() => sortData("Status")}
                  >
                    Status {renderSortIcon("Status")}
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
                        : "var( --secondaryDashMenuColor)",
                      border: "none",
                    }}
                  >
                    Updaed By
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
                        : "var( --secondaryDashMenuColor)",
                      border: "none",
                    }}
                    onClick={() => sortData("Reasonforleave")}
                  >
                    Status Remarks {renderSortIcon("Reasonforleave")}
                  </th>
                  {/* <th
                    style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
                  >
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData
                    .filter((e) => e.Status == "Rejected")
                    .map((data, index) => (
                      <tr className="text-capitalize" key={index}>
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
                          className="py-1"
                        >
                          <div
                            style={{ maxWidth: "fit-content" }}
                            className="d-flex align-items-center gap-2"
                          >
                            <div
                              className=""
                              style={{ height: "35px", width: "35px" }}
                            >
                              <img
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  borderRadius: "50%",
                                  overflow: "hidden",
                                  objectFit: "cover",
                                }}
                                src={
                                  data?.data?.profile?.image_url
                                    ? data?.data?.profile?.image_url
                                    : "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
                                }
                                alt=""
                              />
                            </div>
                            <span>{data.Name}</span>
                          </div>
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
                          className="py-1"
                        ></td>
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
                          className="py-1"
                        >
                          <span>{data.empID}</span>
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
                          className="py-1"
                        >
                          {data.Leavetype}
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
                          className="py-1"
                        >
                          {data.FromDate}
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
                          className="py-1"
                        >
                          {data.ToDate}
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
                          className="py-1"
                        >
                          {data.Days}
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
                          className="py-1"
                        >
                          {data.Reasonforleave}
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
                          <span className="border border-danger  px-2 py-1 rounded-5">
                            {data.Status}
                          </span>
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
                          className="py-1"
                        >
                          {data.updatedBy}
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
                          className="py-1"
                        >
                          {data.reasonOfRejection}
                        </td>
                        {/* <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="py-1">
                        <div
                          className="d-flex gap-3 py-2"
                          style={{ cursor: "pointer" }}
                        >
                          <p title="Update" className="m-auto text-white">
                            <FontAwesomeIcon
                              className="m-auto"
                              icon={faEdit}
                              onClick={() =>
                                props.onEditLeaveApplicationHR(data.data)
                              }
                            />
                          </p> */}
                        {/* <p title="Delete" className="m-auto text-danger">
                          <FontAwesomeIcon
                            className="m-auto"
                            icon={faTrash}
                            onClick={() =>
                              onLeaveApplicationHRDelete(
                                data.data["employee"][0]["_id"],
                                data.data["_id"]
                              )
                            }
                          />
                        </p> */}
                        {/* </div>
                      </td> */}
                      </tr>
                    ))
                ) : (
                  <div
                    style={{
                      height: "30vh",
                      width: "94%",
                      position: "absolute",
                    }}
                    className="d-flex flex-column justify-content-center align-items-center gap-1"
                  >
                    <span className="fw-bolder " style={{ fontSize: "2rem" }}>
                      <MdNearbyError
                        className="text-danger"
                        style={{ fontSize: "2.3rem" }}
                      />{" "}
                      OOPS!
                    </span>
                    <h6 className="p-0 m-0">Record not found.</h6>
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div id="loading-bar">
          <RingLoader
            css={override}
            sizeUnit={"px"}
            size={50}
            color={"#0000ff"}
            loading={true}
          />
        </div>
      )}
    </div>
  );
};

export default LeaveApplicationHRTable;
