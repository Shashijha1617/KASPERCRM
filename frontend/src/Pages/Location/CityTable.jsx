import React, { useState, useEffect } from "react";
import "./CityTable.css";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { FaEdit, FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import BASE_URL from "../config/config";
import OverLayToolTip from "../../Utils/OverLayToolTip";
import { IoTrashBin } from "react-icons/io5";

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
        setCityData(cityObj);
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
    if (window.confirm("Are you sure to delete this record?")) {
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
            City Details ({cityData.length})
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className="m-0"
          >
            You can see all city's list here.
          </p>
        </div>
        <button
          className="btn btn-primary gap-1 d-flex my-auto align-items-center justify-content-center"
          onClick={onAddCity}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex">Add City</span>
        </button>
      </div>
      <div id="clear-both" />

      {!loading ? (
        <table className="table">
          <thead>
            <tr style={{ position: "sticky", top: "0" }}>
              <th style={rowHeadStyle}>Country</th>
              <th style={rowHeadStyle}>State</th>
              <th style={rowHeadStyle}>City</th>
              <th style={rowHeadStyle} className="text-end">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {cityData.map((items, index) => (
              <tr className="text-capitalize" key={index}>
                <td style={rowBodyStyle}>
                  {items.state[0].country[0].CountryName}
                </td>
                <td style={rowBodyStyle}>{items.state[0].StateName}</td>
                <td style={rowBodyStyle}>{items.CityName}</td>
                <td className="text-end" style={rowBodyStyle}>
                <OverLayToolTip
                      style={{ color: darkMode ? "black" : "white" }}
                      icon={<FaEdit />}
                      onClick={() => onEditCity(items)}
                      tooltip={"Edit City"}
                    />
                    <OverLayToolTip
                      style={{ color: darkMode ? "black" : "white" }}
                      icon={<IoTrashBin />}
                      onClick={() => onCityDelete(items._id)}
                      tooltip={"Delete City"}
                    />
                  
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
