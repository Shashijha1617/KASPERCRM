import React, { useState, useEffect } from "react";
import "./AdminPortalTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import SearchLight from "../../img/Attendance/SearchLight.svg";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const AdminPortalTable = ({ onAddPortal, onEditPortal }) => {
  const { darkMode } = useTheme();
  const [portalData, setPortalData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPortalData = () => {
    axios
      .get(`${BASE_URL}/api/admin/portal`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        const data = response.data.map((item) => ({
          ...item,
          Status: item.Status === 1 ? "enabled" : "disabled",
        }));
        setPortalData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onPortalDelete = (id) => {
    if (
      window.confirm(
        "Are you sure to delete this record? It will delete all projects related to this portal."
      )
    ) {
      axios
        .delete(`${BASE_URL}/api/admin/portal/${id}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then(() => {
          loadPortalData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

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
    <div className="container-fluid py-2">
      <div className="d-flex justify-between align-items-start ">
        <div className="my-auto">
          <h5
            style={{
              color: darkMode
                ? "var(--primaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
              fontWeight: "600",
            }}
          >
            Portal Details ( {portalData.length} )
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--primaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
          >
            You can view and create new portal here.
          </p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center  gap-2 justify-content-center"
          variant="primary"
          id="add-button"
          onClick={onAddPortal}
        >
          <FaPlus />
          <span className="d-none d-md-flex">Add new Details</span>
        </button>
      </div>
      <div id="clear-both" />

      {!loading ? (
        <div
          style={{ minHeight: "76vh", maxHeight: "76vh", overflow: "auto" }}
          className="border"
        >
          {" "}
          {portalData.length > 0 ? (
            <table
              className="table table-striped"
              style={{ fontSize: ".9rem" }}
            >
              <thead>
                <tr>
                  <th style={rowHeadStyle}>S. No.</th>
                  <th style={rowHeadStyle}>Portal</th>
                  <th style={rowHeadStyle}>Status</th>
                  <th className="text-end" style={rowHeadStyle}>
                    Edit
                  </th>
                  <th className="text-end" style={rowHeadStyle}>
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {portalData.map((item, index) => (
                  <tr key={index}>
                    <td style={rowBodyStyle}>{index + 1}</td>
                    <td style={rowBodyStyle}>{item.PortalName}</td>
                    <td style={rowBodyStyle}>
                      <span
                        className={
                          item.Status === "enabled"
                            ? "border border-success py-1 px-1 rounded-5 text-capitalize"
                            : "border border-danger py-1 px-1 rounded-5 text-capitalize"
                        }
                      >
                        {" "}
                        {item.Status}
                      </span>
                    </td>
                    <td style={rowBodyStyle}>
                      <button
                        className="btn btn-primary d-flex align-items-center rounded-5  ms-auto  gap-2 justify-content-center"
                        onClick={() => onEditPortal(item)}
                      >
                        <FaEdit />
                        <span className="d-none d-md-flex">Edit</span>
                      </button>
                    </td>
                    <td style={rowBodyStyle}>
                      <button
                        className="btn btn-primary d-flex align-items-center rounded-5 ms-auto gap-2 justify-content-center"
                        onClick={() => onPortalDelete(item._id)}
                      >
                        <FaTrash />
                        <span className="d-none d-md-flex">Delete</span>
                      </button>
                    </td>
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
                Portal not found. click on "+ add new details" to create new
                portal.
              </p>
            </div>
          )}
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

export default AdminPortalTable;
