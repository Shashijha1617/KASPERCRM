import React, { useState, useEffect } from "react";
import "./LeaveApplicationHRTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import BASE_URL from "../../Pages/config/config";
import {
  Form,
  Button,
  Col,
  Row,
  Table,
  Dropdown,
  DropdownButton
} from "react-bootstrap";

// *************csv & pdf **************//
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
// *************csv & pdf **************//

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const LeaveApplicationHRTable = (props) => {
  const [leaveApplicationHRData, setLeaveApplicationHRData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState("");
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [rowData, setRowData] = useState([]);

  // ...

  let leaveApplicationHRObj = [];
  let rowDataT = [];

  const loadLeaveApplicationHRData = () => {
    axios
      .get(`${BASE_URL}/api/leave-application-hr/`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        leaveApplicationHRObj = response.data;
        console.log("response", response.data);
        setLeaveApplicationHRData(response.data);
        setLoading(false);

        rowDataT = [];

        leaveApplicationHRObj.map((data) => {
          let temp = {
            data,
            empID:
              data["employee"] &&
              data["employee"][0] &&
              data["employee"][0]["empID"],
            Name:
              data["employee"] &&
              data["employee"][0] &&
              data["employee"][0]["FirstName"] +
                " " +
                data["employee"][0]["LastName"],
            Leavetype: data["Leavetype"],
            FromDate: data["FromDate"].slice(0, 10),
            ToDate: data["ToDate"].slice(0, 10),
            Reasonforleave: data["Reasonforleave"],
            Status: status(data["Status"])
          };

          rowDataT.push(temp);
        });

        setRowData(rowDataT);

        setTotalLeaves(response.data.length);
        props.updateTotalLeaves(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ...

  const onLeaveApplicationHRDelete = (e1, e2) => {
    console.log(e1, e2);
    if (window.confirm("Are you sure to delete this record? ") == true) {
      axios
        .delete(`${BASE_URL}/api/leave-application-hr/` + e1 + "/" + e2, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
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
    window.confirm("Are you sure to download Leave record? ");
    const { rowData } = this.state;
    // Set A4 landscape dimensions
    const pdfWidth = 297; // A4 width in mm
    const pdfHeight = 210; // A4 height in mm
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [pdfWidth, pdfHeight]
    });

    doc.setFontSize(18);
    doc.text("Employee Leave Details", pdfWidth / 2, 15, "center");
    const headers = [
      "Emp Id",
      "Leave Type",
      "Start Date",
      "End Date",
      "Remarks",
      "Status"
    ];
    const data = rowData.map((row) => [
      row.empID,
      row.Leavetype,
      row.FromDate,
      row.ToDate,
      row.Reasonforleave,
      row.Status,

      "" // Action column - you can customize this based on your requirements
    ]);
    doc.setFontSize(12);
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25
    });

    doc.save("leaveApplication_data.pdf");
  };

  useEffect(() => {
    loadLeaveApplicationHRData();
  }, []);

  const renderButton = (params) => {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() =>
          onLeaveApplicationHRDelete(
            params.data.data["employee"][0]["_id"],
            params.data.data["_id"]
          )
        }
      />
    );
  };

  const renderEditButton = (params) => {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => props.onEditLeaveApplicationHR(params.data.data)}
      />
    );
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
    const { rowData, sortColumn, sortDirection } = this.state;
    let newSortDirection = "asc";

    if (sortColumn === columnName && sortDirection === "asc") {
      newSortDirection = "desc";
    }

    const sortedData = [...rowData];

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

    setRowData(sortedData);
    setSortColumn(columnName);
    setSortDirection(newSortDirection);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-between">
        <h3 className="fw-bold text-muted">Leave Request ({totalLeaves})</h3>

        <button
          className="btn px-3 d-flex justify-center  aline-center gap-2"
          onClick={exportToPDF}
        >
          <BsFillFileEarmarkPdfFill className="text-danger fs-4" />
          <p className="my-auto fs-5 fw-bold">PDF</p>
        </button>
      </div>

      <div id="clear-both" />
      {!loading ? (
        <div
          className="mt-3"
          style={{
            overflow: "auto",
            height: "85vh",
            width: "100%",
            scrollbarWidth: "thin"
          }}
        >
          <table className="table table-striped">
            <thead>
              <tr>
                <th
                  style={{
                    cursor: "pointer",
                    background: "linear-gradient(#1D267D, #2F58CD)",
                    color: "white"
                  }}
                  onClick={() => sortData("empID")}
                >
                  Employee ID {renderSortIcon("empID")}
                </th>
                <th
                  style={{
                    cursor: "pointer",
                    background: "linear-gradient(#1D267D, #2F58CD)",
                    color: "white"
                  }}
                  onClick={() => sortData("Name")}
                >
                  Emp Name {renderSortIcon("Name")}
                </th>
                <th
                  style={{
                    cursor: "pointer",
                    background: "linear-gradient(#1D267D, #2F58CD)",
                    color: "white"
                  }}
                  onClick={() => sortData("Leavetype")}
                >
                  Leave Type {renderSortIcon("Leavetype")}
                </th>
                <th
                  s
                  style={{
                    cursor: "pointer",
                    background: "linear-gradient(#1D267D, #2F58CD)",
                    color: "white"
                  }}
                  onClick={() => sortData("FromDate")}
                >
                  Start Date {renderSortIcon("FromDate")}
                </th>
                <th
                  style={{
                    cursor: "pointer",
                    background: "linear-gradient(#1D267D, #2F58CD)",
                    color: "white"
                  }}
                  onClick={() => sortData("ToDate")}
                >
                  End Date {renderSortIcon("ToDate")}
                </th>
                <th
                  style={{
                    cursor: "pointer",
                    background: "linear-gradient(#1D267D, #2F58CD)",
                    color: "white"
                  }}
                  onClick={() => sortData("Status")}
                >
                  Status {renderSortIcon("Status")}
                </th>
                <th
                  style={{
                    cursor: "pointer",
                    background: "linear-gradient(#1D267D, #2F58CD)",
                    color: "white"
                  }}
                  onClick={() => sortData("Reasonforleave")}
                >
                  Remarks {renderSortIcon("Reasonforleave")}
                </th>
                <th
                  style={{
                    background: "linear-gradient(#1D267D, #2F58CD)",
                    color: "white",
                    textAlign: "center"
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData.map((data, index) => (
                <tr key={index}>
                  <td className="text-uppercase py-1">{data.empID}</td>
                  <td className="py-1">{data.Name}</td>
                  <td className="py-1">{data.Leavetype}</td>
                  <td className="py-1">{data.FromDate}</td>
                  <td className="py-1">{data.ToDate}</td>
                  <td className="py-1">{data.Status}</td>
                  <td className="py-1">{data.Reasonforleave}</td>
                  <td className="py-1">
                    <div
                      className="d-flex gap-3 py-2"
                      style={{ cursor: "pointer" }}
                    >
                      <p title="Update" className="m-auto text-primary">
                        <FontAwesomeIcon
                          className="m-auto"
                          icon={faEdit}
                          onClick={() =>
                            props.onEditLeaveApplicationHR(data.data)
                          }
                        />
                      </p>
                      <p title="Delete" className="m-auto text-danger">
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
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
