import React, { useState, useEffect } from "react";
import "./AdminProjectBidTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const AdminProjectBidTable = (props) => {
  const [projectBidData, setProjectBidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  const loadProjectBidData = () => {
    axios
      .get(`${BASE_URL}/api/admin/project-bid`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        const projectBidData = response.data;
        setProjectBidData(projectBidData);
        setLoading(false);
        setError(null);

        const rowData = projectBidData.map((data) => ({
          data,
          ProjectTitle: data["ProjectTitle"],
          PortalName: data["portals"][0]["PortalName"],
          ProjectURL: data["ProjectURL"],
          EstimatedTime: data["EstimatedTime"],
          EstimatedCost: data["EstimatedCost"],
          Remark: data["Remark"],
        }));

        setRowData(rowData);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
        setError("Error loading data.");
      });
  };

  const onProjectBidDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      axios
        .delete(`${BASE_URL}/api/admin/project-bid/${id}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then(() => {
          loadProjectBidData();
        })
        .catch((err) => {
          console.error("Error deleting record:", err);
        });
    }
  };

  useEffect(() => {
    loadProjectBidData();
  }, []);

  const renderSortIcon = (field) => {
    if (sortColumn === field) {
      return sortDirection === "asc" ? "▴" : "▾";
    }
    return null;
  };

  const sortData = (columnName) => {
    let newSortDirection = sortDirection === "asc" ? "desc" : "asc";

    const sortedData = [...rowData].sort((a, b) => {
      const valueA = String(a[columnName]).toLowerCase();
      const valueB = String(b[columnName]).toLowerCase();

      return newSortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    setRowData(sortedData);
    setSortColumn(columnName);
    setSortDirection(newSortDirection);
  };

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
    <div className="container-fluid py-3">
      <div className="d-flex justify-between align-items-start mb-3">
        <div className="my-auto">
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
              fontWeight: "600",
            }}
            className="m-0"
          >
            Bidding Details
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className="m-0"
          >
            You can see all your bids here.
          </p>
        </div>
        <button
          className="btn btn-primary gap-1 d-flex my-auto align-items-center justify-content-center"
          onClick={props.onAddProjectBid}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex">Add Bid</span>
        </button>
      </div>
      <div id="clear-both" />

      {loading && (
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
      <div
        style={{
          maxWidth: "100%",
          minHeight: "76vh",
          maxHeight: "76vh",
          overflow: "auto",
        }}
        className="border"
      >
        <table className="table table-striped" style={{ fontSize: ".9rem" }}>
          <thead>
            <tr>
              <th style={rowHeadStyle} onClick={() => sortData("ProjectTitle")}>
                S. No {renderSortIcon("ProjectTitle")}
              </th>
              <th style={rowHeadStyle} onClick={() => sortData("ProjectTitle")}>
                Project Title {renderSortIcon("ProjectTitle")}
              </th>
              <th style={rowHeadStyle} onClick={() => sortData("PortalName")}>
                Portal {renderSortIcon("PortalName")}
              </th>
              <th style={rowHeadStyle} onClick={() => sortData("ProjectURL")}>
                Project URL {renderSortIcon("ProjectURL")}
              </th>
              <th
                style={rowHeadStyle}
                onClick={() => sortData("EstimatedTime")}
              >
                Estimated Time {renderSortIcon("EstimatedTime")}
              </th>
              <th
                style={rowHeadStyle}
                onClick={() => sortData("EstimatedCost")}
              >
                Estimated Cost {renderSortIcon("EstimatedCost")}
              </th>
              <th style={rowHeadStyle} onClick={() => sortData("Remark")}>
                Remark {renderSortIcon("Remark")}
              </th>
              <th style={rowHeadStyle} onClick={() => sortData("Remark")}>
                Edit {renderSortIcon("Remark")}
              </th>
              <th style={rowHeadStyle} onClick={() => sortData("Remark")}>
                Delete {renderSortIcon("Remark")}
              </th>
            </tr>
          </thead>
          <tbody>
            {projectBidData.map((items, index) => (
              <tr key={index}>
                <td style={rowBodyStyle}>{index + 1}</td>
                <td style={rowBodyStyle}>{items.ProjectTitle}</td>
                <td style={rowBodyStyle}>{items.portals[0].PortalName}</td>
                <td style={rowBodyStyle}>
                  <a
                    href={items.ProjectURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {items.ProjectURL}
                  </a>
                </td>
                <td style={rowBodyStyle}>{items.EstimatedTime}</td>
                <td style={rowBodyStyle}>{items.EstimatedCost}</td>
                <td style={rowBodyStyle}>{items.Remark}</td>
                <td style={rowBodyStyle}>
                  <button
                    className="btn btn-primary d-flex align-items-center rounded-5  ms-auto  gap-2 justify-content-center"
                    onClick={() => props.onEditProjectBid(items)}
                  >
                    {" "}
                    <FaEdit /> <span className="">Edit</span>
                  </button>
                </td>
                <td style={rowBodyStyle}>
                  <button
                    className="btn btn-danger d-flex align-items-center rounded-5  ms-auto  gap-2 justify-content-center"
                    onClick={() => onProjectBidDelete(items._id)}
                  >
                    {" "}
                    <FaTrash /> <span className="">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProjectBidTable;
