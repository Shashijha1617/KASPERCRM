import React, { useState, useEffect, useCallback } from "react";
import "./StateTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
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
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        const stateObj = response.data;
        setStateData(response.data);
        setLoading(false);
        const rowDataT = stateObj.map((data) => ({
          data,
          CountryName: data["country"][0]["CountryName"],
          StateName: data["StateName"]
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
    if (window.confirm("Are you sure to delete this record ? ")) {
      axios
        .delete(`${BASE_URL}/api/state/${id}`, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        })
        .then(() => {
          loadStateData();
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 403) {
            window.alert(err.response.data);
          }
        });
    }
  };

  const renderButton = (params) => (
    <FontAwesomeIcon
      icon={faTrash}
      onClick={() => onStateDelete(params.data.data["_id"])}
    />
  );

  const renderEditButton = (params) => (
    <FontAwesomeIcon
      icon={faEdit}
      onClick={() => props.onEditState(params.data.data)}
    />
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-between align-items-start mb-3">
        <div className="my-auto">
          <h6 style={{ color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)" }} className="fw-bold my-auto"> State Details<span className="text-warning"> ( {stateData.length} ) </span>  </h6>
        </div>

        <Button
          variant="primary"
          className="my-auto"
          id="add-button"
          onClick={props.onAddState}
        >
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Add new State
        </Button>
      </div>

      <div id="clear-both"></div>

      {!loading ? (
        <div
          style={{
            overflow: "auto",
            height: "75vh",
            width: "100%",
            scrollbarWidth: "thin",
            position: 'relative'
          }}
        >        <table className="table">
            <thead>
              <tr style={{ position: 'sticky', top: '0' }}>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
                  className="py-1"
                >
                  Country
                </th>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
                  className="py-1"
                >
                  State
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
              {stateData.map((items, index) => (
                <tr key={index}>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-uppercase">
                    {items.country[0].CountryName}
                  </td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-uppercase">{items.StateName}</td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-end" >
                    <button
                      onClick={() => props.onEditState(items)}
                      style={{
                        zIndex: "1",
                        cursor: "pointer"
                      }}
                      className="btn btn-outline-primary py-1 mr-2"
                    >
                      <FaRegEdit /> Edit
                    </button>
                    <button
                      onClick={() => props.onStateDelete(items)}
                      style={{
                        zIndex: "1",
                        cursor: "pointer"
                      }}
                      className="btn btn-outline-danger py-1 ml-2"
                    >
                      <AiOutlineDelete /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>

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
