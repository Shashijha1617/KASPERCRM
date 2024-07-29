import React, { useState, useEffect, useCallback } from "react";
import "./CountryTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import { AiOutlinePlusCircle } from "react-icons/ai";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const CountryTable = (props) => {
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  const loadCountryData = useCallback(() => {
    axios
      .get(`${BASE_URL}/api/country`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setCountryData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    loadCountryData();
  }, [loadCountryData]);

  const onCountryDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      axios
        .delete(`${BASE_URL}/api/country/${id}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then(() => {
          loadCountryData();
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response.status === 403) {
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
            Country Details ({countryData.length})
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className=" m-0"
          >
            You can see all country list here.
          </p>
        </div>
        <button
          className="btn btn-primary gap-1 d-flex  my-auto align-items-center justify-content-center"
          onClick={props.onAddCountry}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex">Add Country</span>
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
              <th className="text-end" style={rowHeadStyle}>
                Edit
              </th>
              <th className="text-end" style={rowHeadStyle}>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {countryData.map((item, index) => (
              <tr key={index}>
                <td style={rowBodyStyle}>{item.CountryName}</td>
                <td style={rowBodyStyle}>
                  <span
                    onClick={() => props.onEditCountry(item)}
                    style={{ cursor: "pointer", width: "fit-content" }}
                    className="border border-primary px-2 py-1 text-primary  ms-auto d-flex gap-3 align-items-center"
                  >
                    <FaRegEdit /> <span className="d-none d-md-flex">Edit</span>
                  </span>
                </td>
                <td style={rowBodyStyle}>
                  <span
                    onClick={() => onCountryDelete(item._id)}
                    style={{ cursor: "pointer", width: "fit-content" }}
                    className="border border-danger px-2 py-1 text-danger  ms-auto d-flex gap-3 align-items-center"
                  >
                    <FontAwesomeIcon icon={faTrash} />{" "}
                    <span className="d-none d-md-flex">Delete</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CountryTable;
