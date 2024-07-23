import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { Button } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import Position from "../../img/Position/Position.svg";
import { AiOutlinePlusCircle } from "react-icons/ai";

const AdminCompanyTable = (props) => {
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/company`, {
        headers: { authorization: localStorage.getItem("token") || "" },
      })
      .then((response) => {
        setCompanyData(response.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const onCompanyDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      axios
        .delete(`${BASE_URL}/api/company/${id}`, {
          headers: { authorization: localStorage.getItem("token") || "" },
        })
        .then(() =>
          setCompanyData(companyData.filter((item) => item._id !== id))
        )
        .catch((err) => console.log(err));
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
            Company Details ({companyData.length})
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className=" m-0"
          >
            You can see all Company list here
          </p>
        </div>
        <button
          className="btn btn-primary gap-1 d-flex  my-auto align-items-center justify-content-center"
          onClick={props.onAddCompany}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex">Create Company</span>
        </button>
      </div>

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
        {companyData.length > 0 ? (
          <table className="table" style={{ fontSize: ".9rem" }}>
            <thead>
              <tr>
                <th style={rowHeadStyle}>Company Name</th>
                <th style={rowHeadStyle}>Address</th>
                <th style={rowHeadStyle}>Country</th>
                <th style={rowHeadStyle}>State</th>
                <th style={rowHeadStyle}>City</th>
                <th style={rowHeadStyle}>Postal Code</th>
                <th style={rowHeadStyle}>Website</th>
                <th style={rowHeadStyle}>Email</th>
                <th style={rowHeadStyle}>Contact Person</th>
                <th style={rowHeadStyle}>Contact No</th>
                <th style={rowHeadStyle}>Fax No</th>
                <th style={rowHeadStyle}>Pan No</th>
                <th style={rowHeadStyle}>GST No</th>
                <th style={rowHeadStyle}>CIN No</th>
                <th style={rowHeadStyle}>Edit</th>
                <th style={rowHeadStyle}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {companyData.map((item) => (
                <tr key={item._id}>
                  <td style={rowBodyStyle}>{item.CompanyName}</td>
                  <td style={rowBodyStyle}>{item.Address}</td>
                  <td style={rowBodyStyle}>
                    {item.city[0].state[0].country[0].CountryName}
                  </td>
                  <td style={rowBodyStyle}>
                    {item.city[0].state[0].StateName}
                  </td>
                  <td style={rowBodyStyle}>{item.city[0].CityName}</td>
                  <td style={rowBodyStyle}>{item.PostalCode}</td>
                  <td style={rowBodyStyle}>{item.Website}</td>
                  <td style={rowBodyStyle}>{item.Email}</td>
                  <td style={rowBodyStyle}>{item.ContactPerson}</td>
                  <td style={rowBodyStyle}>{item.ContactNo}</td>
                  <td style={rowBodyStyle}>{item.FaxNo}</td>
                  <td style={rowBodyStyle}>{item.PanNo}</td>
                  <td style={rowBodyStyle}>{item.GSTNo}</td>
                  <td style={rowBodyStyle}>{item.CINNo}</td>
                  <td style={rowBodyStyle}>
                    <button
                      style={{
                        cursor: "pointer",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var( --primaryDashMenuColor)",
                      }}
                      className="btn  d-flex gap-3 align-items-center"
                      onClick={() => props.onEditCompany(item)}
                    >
                      <FontAwesomeIcon icon={faEdit} />{" "}
                      <span className="d-none d-md-flex">Edit</span>
                    </button>
                  </td>
                  <td style={rowBodyStyle}>
                    <button
                      style={{
                        cursor: "pointer",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var( --primaryDashMenuColor)",
                      }}
                      className="btn  d-flex gap-3 align-items-center"
                      onClick={() => onCompanyDelete(item._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />{" "}
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
              Company not created yet, to create new role click on "+ Create
              Company" button.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCompanyTable;
