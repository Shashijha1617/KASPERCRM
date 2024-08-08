import React, { useState, useEffect } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { LuSearch } from "react-icons/lu";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { MdNearbyError } from "react-icons/md";
import BASE_URL from "../../../Pages/config/config";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import LeaveLight from "../../../img/Leave/LeaveLight.svg";

const LeaveApplicationHRTable = (props) => {
  const location = useLocation();
  const routeChecker = location.pathname.split("/")[1];
  console.log(routeChecker);
  const [leaveApplicationHRData, setLeaveApplicationHRData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { darkMode } = useTheme();
  const email = localStorage.getItem("Email");
  const formatDate = (dateString) => {
    if (!dateString) return;
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
        console.log(response);
        setLeaveApplicationHRData(leaveApplicationHRObj);
        setLoading(false);

        const rowDataT = leaveApplicationHRObj.map((data) => {
          return {
            data,
            empID: data?.empID,
            FirstName: data?.FirstName,
            LastName: data?.LastName,
            Name: data?.FirstName + " " + data?.LastName,
            Leavetype: data?.Leavetype,
            FromDate: formatDate(data["FromDate"]?.slice(0, 10)),
            ToDate: formatDate(data["ToDate"]?.slice(0, 10)),
            Days: calculateDays(data?.FromDate, data?.ToDate),
            Reasonforleave: data?.Reasonforleave,
            CreatedOn: formatDate(data?.createdOn?.slice(0, 10)),
            Status: status(data?.Status),
            updatedBy: data?.updatedBy,
            reasonOfRejection: data?.reasonOfRejection,
          };
        });
        console.log(rowDataT);
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
    (data) => data.Status === "Approved"
  ).length;

  return (
    <div className="container-fluid">
      {/* <div className="d-flex flex-column justify-between"> */}
      <div className="d-flex justify-content-between aline-items-center">
        <TittleHeader
          title={" Approved Leaves"}
          numbers={approvedLeaves}
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
        {/* </div> */}
      </div>

      <div id="clear-both" />
      {loading && (
        <div id="loading-bar">
          <RingLoader
            sizeUnit={"px"}
            size={50}
            color={"#0000ff"}
            loading={true}
          />
        </div>
      )}
      <div>
        <div
          className="border border-1 border-dark"
          style={{ overflow: "auto", maxHeight: "80vh", minHeight: "80vh" }}
        >
          {filteredData.length > 0 ? (
            <table className="table" style={{ fontSize: ".9rem" }}>
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
                  >
                    Leave Type
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
                    Start Date
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
                    End Date
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
                    Created On
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
                    Days
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
                    Remarks
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
                    Status
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
                    Updated By
                  </th>
                  {/* <th
                    style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
                  >
                    Status Remarks
                  </th> */}
                  {/* 
                  <th
                    style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
                  >
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {filteredData
                  .filter((e) => e.Status == "Approved")
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
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            height: "35px",
                            width: "35px",
                            borderRadius: "50%",
                            backgroundColor: "#ccc",
                            color: "white",
                            fontWeight: "bold",
                            overflow: "hidden",
                            objectFit: "cover",
                          }}
                        >
                          {data?.FirstName?.[0]}
                          {data?.LastName?.[0]}
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
                      >
                        <span>{data.Name}</span>
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
                      >
                        {data.CreatedOn}
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
                          fontSize: ".8rem",
                        }}
                        className="py-1  "
                      >
                        <span className="text-white bg-success shadow-sm px-2 py-0 rounded-5">
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
                      {/* <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="py-1">{data.reasonOfRejection}</td> */}

                      {/* <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="py-1"> */}
                      {/* <div
                          className="d-flex gap-3 py-2"
                          style={{ cursor: "pointer" }}
                        > */}
                      {/* <p title="Update" className="m-auto text-primary">
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
                      {/* </div> */}
                      {/* </td> */}
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
                  width: "25%",
                }}
                src={LeaveLight}
                alt="img"
              />
              <p
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var( --primaryDashMenuColor)",
                }}
              >
                No approve leaves found here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationHRTable;
