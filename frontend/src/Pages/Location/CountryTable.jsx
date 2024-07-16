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
import { AiFillDelete } from "react-icons/ai";
import BASE_URL from "../config/config";
const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const CountryTable = (props) => {
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  const renderButton = (params) => (
    <FontAwesomeIcon
      icon={faTrash}
      onClick={() => onCountryDelete(params.data.data["_id"])}
    />
  );

  const renderEditButton = (params) => (
    <FontAwesomeIcon
      icon={faEdit}
      onClick={() => props.onEditCountry(params.data.data)}
    />
  );

  const columnDefs = [
    {
      headerName: "Country",
      field: "CountryName",
      sortable: true
    },
    {
      headerName: "",
      field: "edit",
      filter: false,
      width: 30,
      cellRendererFramework: renderEditButton
    },
    {
      headerName: "",
      field: "delete",
      filter: false,
      width: 30,
      cellRendererFramework: renderButton
    }
  ];

  const defaultColDef = {
    resizable: true,
    width: 1180,
    filter: "agTextColumnFilter"
  };

  const getRowHeight = () => 35;

  const loadCountryData = useCallback(() => {
    axios
      .get(`${BASE_URL}/api/country`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        setCountryData(response.data);
        setLoading(false);
        const rowDataT = response.data.map((data) => ({
          data,
          CountryName: data["CountryName"]
        }));
        setRowData(rowDataT);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    loadCountryData();
  }, [loadCountryData]);

  const onCountryDelete = (id) => {
    if (window.confirm("Are you sure to delete this record ? ")) {
      axios
        .delete(`${BASE_URL}/api/country/${id}`, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
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

  return (
    <div className="container-fluid mb-5">
      <div style={{ position: 'sticky', top: '0' }} className="d-flex justify-between aline-items-start mb-3">
        <h6 style={{ color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)" }} className="fw-bold my-auto"> Country Details<span className="text-warning"> ( {countryData.length} ) </span>  </h6>
        <Button
          variant="primary"
          id="add-button"
          onClick={props.onAddCountry}
        >
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Add
        </Button>
      </div>


      <div id="clear-both" />
      {!loading ? (
        <div
          style={{
            overflow: "auto",
            height: "75vh",
            width: "100%",
            scrollbarWidth: "thin",
            position: 'relative'
          }}
        >         <table className="table">
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
                  className="py-1 text-end"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {countryData.map((items, index) => (
                <tr key={index}>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>{items.CountryName}</td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-end">
                    <button
                      onClick={() => props.onEditCountry(items)}
                      style={{
                        zIndex: "1",
                        cursor: "pointer",
                      }}
                      className="btn btn-outline-primary py-1"
                    >
                      <FaRegEdit /> Edit </button>
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

export default CountryTable;
