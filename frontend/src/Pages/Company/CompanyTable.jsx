import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { Button } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";

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
        .then(() => setCompanyData(companyData.filter((item) => item._id !== id)))
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-between align-items-start mb-3">
        <h6
          style={{
            color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)",
          }}
          className="fw-bold my-auto"
        >
          Company Details <span className="text-warning">({companyData.length})</span>
        </h6>
        <Button
          className="my-auto"
          variant="primary shadow-sm"
          onClick={props.onAddCompany}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Create Company
        </Button>
      </div>

      {!loading ? (
        <div className="pr-5 pr-sm-0" style={{ height: "75vh", overflow: "auto", maxWidth: "100%" }}>
          <table className="table">
            <thead>
              <tr>
                {["Company Name", "Address", "Country", "State", "City", "Postal Code", "Website", "Email", "Contact Person", "Contact No", "Fax No", "Pan No", "GST No", "CIN No", "Edit", "Delete"].map((header, index) => (
                  <th key={index} style={{ background: darkMode ? "var(--primaryDashMenuColor)" : "var(--primaryDashColorDark)", color: darkMode ? "var(--primaryDashColorDark)" : "var(--secondaryDashMenuColor)", border: "none" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companyData.map((item) => (
                <tr key={item._id}>
                  <td style={{ border: "none" }}>{item.CompanyName}</td>
                  <td style={{ border: "none" }}>{item.Address}</td>
                  <td style={{ border: "none" }}>{item.city[0].state[0].country[0].CountryName}</td>
                  <td style={{ border: "none" }}>{item.city[0].state[0].StateName}</td>
                  <td style={{ border: "none" }}>{item.city[0].CityName}</td>
                  <td style={{ border: "none" }}>{item.PostalCode}</td>
                  <td style={{ border: "none" }}>{item.Website}</td>
                  <td style={{ border: "none" }}>{item.Email}</td>
                  <td style={{ border: "none" }}>{item.ContactPerson}</td>
                  <td style={{ border: "none" }}>{item.ContactNo}</td>
                  <td style={{ border: "none" }}>{item.FaxNo}</td>
                  <td style={{ border: "none" }}>{item.PanNo}</td>
                  <td style={{ border: "none" }}>{item.GSTNo}</td>
                  <td style={{ border: "none" }}>{item.CINNo}</td>
                  <td style={{ border: "none" }}>
                    <button className="btn btn-outline-primary" onClick={() => props.onEditCompany(item)}>
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                  </td>
                  <td style={{ border: "none" }}>
                    <button className="btn btn-outline-danger" onClick={() => onCompanyDelete(item._id)}>
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <RingLoader size={50} color={"#0000ff"} loading={true} />
        </div>
      )}
    </div>
  );
};

export default AdminCompanyTable;
