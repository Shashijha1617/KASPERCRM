import React, { useState, useEffect } from "react";
import "./CityTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import BASE_URL from "../config/config";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const CityTable = ({ onAddCity, onEditCity }) => {
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();


  useEffect(() => {
    loadCityData();
  }, []);

  const loadCityData = () => {
    axios
      .get(`${BASE_URL}/api/city`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        const cityObj = response.data;
        console.log("response", response.data);
        setCityData(response.data);
        setLoading(false);

        const rowDataT = cityObj.map((data) => ({
          data,
          CountryName: data.state[0].country[0].CountryName,
          StateName: data.state[0].StateName,
          CityName: data.CityName,
        }));

        setRowData(rowDataT);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onCityDelete = (id) => {
    if (window.confirm("Are you sure to delete this record ? ")) {
      axios
        .delete(`${BASE_URL}/api/city/${id}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then(() => {
          loadCityData();
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
    <div className="p-4">
      <div className="d-flex justify-between align-items-start mb-3">
        <div className="my-auto">
          <h6 style={{ color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)" }} className="fw-bold my-auto"> City Details<span className="text-warning"> ( {cityData.length} ) </span>  </h6>
        </div>

        <Button
          variant="primary"
          className="my-auto"
          id="add-button"
          onClick={onAddCity}
        >
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Add new City
        </Button>
      </div>
      <div id="clear-both" />

      {!loading ? (
        <table className="table">
          <thead>
            <tr style={{ position: 'sticky', top: '0' }}>
              <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }} className="py-1">Country</th>
              <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }} className="py-1">State</th>
              <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }} className="py-1">City</th>
              <th style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }} className="py-1 text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {cityData.map((items, index) => (
              <tr className="text-capitalize" key={index}>
                <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>{items.state[0].country[0].CountryName}</td>
                <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>{items.state[0].StateName}</td>
                <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>{items.CityName}</td>
                <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-end"><button
                  onClick={onEditCity}
                  style={{
                    zIndex: "1",
                    cursor: "pointer"
                  }}
                  className="btn btn-outline-primary py-1 mr-2"
                >
                  <FaRegEdit /> Edit
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default CityTable;
