import React, { useState, useEffect, useCallback } from "react";
import "./StateTable.css";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const StateTable = (props) => {
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  const loadStateData = useCallback(() => {
    axios
      .get(`${BASE_URL}/api/state`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        const stateObj = response.data;
        setStateData(stateObj);
        setLoading(false);
        const rowDataT = stateObj.map((data) => ({
          data,
          CountryName: data["country"][0]["CountryName"],
          StateName: data["StateName"],
        }));
        setRowData(rowDataT);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    loadStateData();
  }, [loadStateData]);

  const onStateDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      axios
        .delete(`${BASE_URL}/api/state/${id}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then(() => {
          loadStateData();
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.status === 403) {
            window.alert(err.response.data);
          } else {
            window.alert("An error occurred while deleting the record.");
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
            State Details ({stateData.length})
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className="m-0"
          >
            You can see all states list here.
          </p>
        </div>
        <button
          className="btn btn-primary gap-1 d-flex my-auto align-items-center justify-content-center"
          onClick={props.onAddState}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex"> Add State</span>
        </button>
      </div>

      <div id="clear-both"></div>

      {!loading ? (
        <div
          className="border border-1 border-dark"
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            overflow: "auto",
            maxHeight: "80vh",
            position: "relative",
          }}
        >
          <table className="table" style={{ fontSize: ".9rem" }}>
            <thead>
              <tr style={{ position: "sticky", top: "0" }}>
                <th style={rowHeadStyle}>Country</th>
                <th style={rowHeadStyle}>State</th>
                <th className="text-end" style={rowHeadStyle}>
                  Edit
                </th>
                <th className="text-end" style={rowHeadStyle}>
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((items, index) => (
                <tr key={index}>
                  <td style={rowBodyStyle} className="text-uppercase">
                    {items.country[0].CountryName}
                  </td>
                  <td style={rowBodyStyle} className="text-uppercase">
                    {items.StateName}
                  </td>
                  <td style={rowBodyStyle} className="text-uppercase">
                    <button
                      onClick={() => props.onEditState(items)}
                      style={{
                        cursor: "pointer",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                      }}
                      className="btn ms-auto d-flex gap-3 align-items-center"
                    >
                      <FaRegEdit />
                      <span className="d-none d-md-flex">Edit</span>
                    </button>
                  </td>
                  <td style={rowBodyStyle} className="text-uppercase">
                    <button
                      onClick={() => onStateDelete(items._id)}
                      style={{
                        cursor: "pointer",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                      }}
                      className="btn ms-auto d-flex gap-3 align-items-center"
                    >
                      <AiOutlineDelete />
                      <span className="d-none d-md-flex">Delete</span>
                    </button>
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

export default StateTable;
