import React, { useState, useEffect } from "react";
import "./PositionTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import {
  Button,
  Table,
} from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const PositionTable = ({ updateTotalPositions, onAddPosition, onEditPosition }) => {
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

  return (
    <div style={{ height: "100vh", width: "100%", scrollbarWidth: "thin" }} className="p-4">
      <div className="d-flex justify-between mb-3">
        <div>
          <h6 style={{ color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)" }} className="fw-bold my-auto"> Position Details<span className="text-warning"> ( {positionData.length} ) </span>  </h6>
        </div>
        <Button className="my-auto shadow-sm" variant="primary" onClick={onAddPosition}>
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Create Position
        </Button>
      </div>
      <div id="clear-both" />
      <Table className="table">
        <thead>
          <tr>
            <th
              style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
              className="py-1"
            >
              Company
            </th>
            <th
              style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
              className="py-1"
            >
              Position
            </th>
            <th
              style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
              className="py-1 text-end"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {positionData.map((data, index) => (
            <tr key={index}>
              <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize">{data.company[0].CompanyName}</td>
              <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize">{data.PositionName}</td>
              <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>
                <div className="d-flex wrap-nowrap justify-content-end gap-3">
                  <button
                    onClick={() => onEditPosition(data)}
                    style={{ cursor: "pointer" }}
                    title="Update"
                    className="btn btn-outline-primary py-1"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onPositionDelete(data._id)}
                    style={{ cursor: "pointer" }}
                    title="Delete"
                    className="btn btn-outline-danger py-1"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {loading && <RingLoader css={override} size={150} />}
    </div>
  );
};

export default PositionTable;
