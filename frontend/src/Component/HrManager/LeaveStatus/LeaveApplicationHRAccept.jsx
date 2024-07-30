import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { LuSearch } from "react-icons/lu";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { MdNearbyError } from "react-icons/md";
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
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { darkMode } = useTheme();
  const email = localStorage.getItem("Email");
  const formatDate = (dateString) => {
    const dateParts = dateString.split("-");
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  };

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
        setLoading(false);

        const rowDataT = leaveApplicationHRObj.map((data) => {
          return {
            data,
            empID: data?.empID,
            Name: data?.FirstName + " " + data?.LastName,
            Leavetype: data?.Leavetype,
            FromDate: formatDate(data["FromDate"]?.slice(0, 10)),
            ToDate: formatDate(data["ToDate"]?.slice(0, 10)),
            Days: calculateDays(data?.FromDate, data?.ToDate),
            Reasonforleave: data?.Reasonforleave,
            CreatedOn: formatDate(data?.createdOn?.slice(0, 10)),
            Status: status(data?.Status),
            updatedBy: data?.updatedBy,
            // reasonOfRejection: data?.reasonOfRejection,
          };
        });
        setRowData(rowDataT);
        setFilteredData(rowDataT);
        // props.updateTotalLeaves(leaveApplicationHRObj.length);
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
        "Days",
        "Remarks",
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
    (data) => data.Status === "Approved"
  ).length;

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

  console.log(filteredData);
  console.log("==========================");

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column justify-between">
        <div className="d-flex justify-content-between aline-items-center">
          <TittleHeader
            numbers={approvedLeaves}
            title={"Approved Leaves"}
            message={"You can view all approved leaves here."}
          />
          <div className="d-flex gap-2 justify-content-between py-3">
            <button
              className="btn btn-danger shadow-sm d-flex justify-center rounded-0  aline-center gap-2"
              onClick={exportToPDF}
            >
              <BsFillFileEarmarkPdfFill />
              <p className="my-auto fs-6 fw-bold">PDF</p>
            </button>
            <div className="searchholder p-0 d-flex  position-relative">
              <input
                style={{
                  height: "100%",
                  width: "100%",
                  paddingLeft: "15%",
                }}
                className="form-control border rounded-0 "
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
              minHeight: "80vh",
              maxHeight: "80vh",
              overflow: "auto",
              position: "relative",
            }}
            className="table-responsive border"
          >
            <table className="table" style={{ fontSize: ".9rem" }}>
              <thead>
                <tr>
                  <th style={rowHeadStyle} onClick={() => sortData("empID")}>
                    Employee Name
                  </th>
                  <th style={rowHeadStyle}>Emp ID</th>
                  <th style={rowHeadStyle}>Leave Type</th>
                  <th style={rowHeadStyle}>Start Date</th>
                  <th style={rowHeadStyle}>End Date</th>
                  <th style={rowHeadStyle}>Created On</th>
                  <th style={rowHeadStyle}>Days</th>
                  <th style={rowHeadStyle}>Remarks</th>
                  <th style={rowHeadStyle}>Status</th>
                  <th style={rowHeadStyle}>Updated By</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData
                    .filter((e) => e.Status == "Approved")
                    .map((data, index) => (
                      <tr className="text-capitalize" key={index}>
                        <td style={rowBodyStyle}>
                          <div className="d-flex aline-center gap-2">
                            <div style={{ height: "35px", width: "35px" }}>
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
                        <td style={rowBodyStyle}>
                          <span>{data.empID}</span>
                        </td>
                        <td style={rowBodyStyle}>{data.Leavetype}</td>
                        <td style={rowBodyStyle}>{data.FromDate}</td>
                        <td style={rowBodyStyle}>{data.ToDate}</td>
                        <td style={rowBodyStyle}>{data.CreatedOn}</td>
                        <td style={rowBodyStyle}>{data.Days}</td>
                        <td style={rowBodyStyle}>{data.Reasonforleave}</td>
                        <td style={rowBodyStyle}>
                          <span className="border border-success px-2 py-1 rounded-5">
                            {data.Status}
                          </span>
                        </td>
                        <td style={rowBodyStyle}>{data.updatedBy}</td>
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
