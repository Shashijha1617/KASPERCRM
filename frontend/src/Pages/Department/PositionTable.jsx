import React, { useState, useEffect } from "react";
import "./PositionTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Table } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import Position from "../../img/Position/Position.svg";
import BASE_URL from "../config/config";
import { AiOutlinePlusCircle } from "react-icons/ai";

const PositionTable = ({
  updateTotalPositions,
  onAddPosition,
  onEditPosition,
}) => {
  const [positionData, setPositionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    loadPositionData();
  }, []);

  const loadPositionData = () => {
    axios
      .get(`${BASE_URL}/api/position`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setPositionData(response.data);
        setLoading(false);
        // updateTotalPositions(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onPositionDelete = (id) => {
    if (window.confirm("Are you sure to delete this record ? ")) {
      axios
        .delete(`${BASE_URL}/api/position/${id}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then(() => {
          loadPositionData();
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.status === 403) {
            window.alert(err.response.data);
          }
        });
    }
  };

  const rowHeadStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var( --secondaryDashMenuColor)",
    border: "none",
    position: "sticky",
    top: "0rem",
    zIndex: "100",
  };

  const rowBodyStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var( --secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var( --primaryDashMenuColor)",
    border: "none",
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between py-2">
        <div className="my-auto">
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
              fontWeight: "600",
            }}
            className=" m-0"
          >
            Position Details ( {positionData.length} )
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className=" m-0"
          >
            You can see all position's list here
          </p>
        </div>
        <button
          className="btn btn-primary gap-1 d-flex  my-auto align-items-center justify-content-center"
          onClick={onAddPosition}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex">Create Position</span>
        </button>
      </div>

      <div id="clear-both" />
      {loading && (
        <div className="d-flex justify-content-center">
          <RingLoader size={50} color={"#0000ff"} loading={true} />
        </div>
      )}

      <div
        className="border border-1 border-dark "
        style={{
          color: darkMode
            ? "var(--secondaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
          overflow: "auto",
          maxHeight: "80vh",
          position: "relative",
        }}
      >
        {positionData.length > 0 ? (
          <Table className="table" style={{ fontSize: ".9rem" }}>
            <thead>
              <tr>
                <th style={rowHeadStyle}>Company</th>
                <th style={rowHeadStyle}>Position</th>
                <th style={rowHeadStyle} className="text-end">
                  Edit
                </th>
                <th style={rowHeadStyle} className="text-end">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {positionData.map((data, index) => (
                <tr key={index}>
                  <td style={rowBodyStyle} className="text-capitalize">
                    {data.company[0].CompanyName}
                  </td>
                  <td style={rowBodyStyle} className="text-capitalize">
                    {data.PositionName}
                  </td>
                  <td style={rowBodyStyle} className="text-capitalize">
                    <span
                      onClick={() => onEditPosition(data)}
                      title="Update"
                      style={{ cursor: "pointer", width: "fit-content" }}
                      className="border border-primary px-2 py-1 text-primary  ms-auto d-flex gap-3 align-items-center"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      <span className="d-none d-md-flex">Edit</span>
                    </span>
                  </td>
                  <td style={rowBodyStyle} className="text-capitalize">
                    <span
                      onClick={() => onPositionDelete(data._id)}
                      title="Delete"
                      style={{ cursor: "pointer", width: "fit-content" }}
                      className="border border-danger px-2 py-1 text-danger  ms-auto d-flex gap-3 align-items-center"
                    >
                      <FontAwesomeIcon icon={faTrash} />

                      <span className="d-none d-md-flex">Delete</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
              src={Position}
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
              Position not created yet, to create new role click on "+ Create
              Position" button.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionTable;
