import React, { useState, useEffect } from "react";
import "./CompanyForm.css";
import axios from "axios";
import BASE_URL from "../config/config";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const CompanyForm = (props) => {
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [filteredStateData, setFilteredStateData] = useState([]);
  const [filteredCityData, setFilteredCityData] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    loadCountryInfo();
    loadStateInfo();
    loadCityInfo();
  }, []);

  const loadCountryInfo = () => {
    axios
      .get(`${BASE_URL}/api/country`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setCountryData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadStateInfo = () => {
    axios
      .get(`${BASE_URL}/api/state`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setStateData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadCityInfo = () => {
    axios
      .get(`${BASE_URL}/api/city`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setCityData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onCountryChange = (e) => {
    const currentCountry = e.target.value;
    const filteredState = stateData.filter(
      (data) => data["country"][0]["_id"] === currentCountry
    );
    setFilteredStateData(filteredState);
    setFilteredCityData([]);
  };

  const onStateChange = (e) => {
    const currentState = e.target.value;
    const filteredCity = cityData.filter(
      (data) => data["state"][0]["_id"] === currentState
    );
    setFilteredCityData(filteredCity);
  };

  const renderFormInput = (label, name, type) => (
    <div className="col-12 col-md-6">
      <label>{label}</label>
      <div>
        <input
          className="form-control rounded-0"
          type={type}
          placeholder={label}
          name={name}
          required
        />
      </div>
    </div>
  );

  const renderFormTextarea = (label, name) => (
    <div className="col-12 col-md-6 ">
      <label>{label}</label>
      <div>
        <input
          className="form-control rounded-0"
          as="textarea"
          rows="3"
          placeholder={label}
          name={name}
          required
        />
      </div>
    </div>
  );

  const renderFormSelect = (label, name, data, onChange) => (
    <div className="col-12 col-md-6 ">
      <label>{label}</label>
      <div>
        <select
          className="form-select rounded-0"
          name={name}
          onChange={onChange}
          required
        >
          <option value="" disabled selected>
            Select your option
          </option>
          {data.map((item, index) => (
            <option key={index} value={item["_id"]}>
              {item[name + "Name"]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
    >
      <div
        className="
      container-fluid p-3 py-4"
      >
        <h5 className="my-3">Add Company Details</h5>
        <Form className="row row-gap-3" onSubmit={props.onCompanySubmit}>
          {renderFormInput("Company Name", "Company Name", "text")}
          {renderFormTextarea("Address", "address")}
          {renderFormSelect("Country", "country", countryData, onCountryChange)}
          {renderFormSelect("State", "state", filteredStateData, onStateChange)}
          {renderFormSelect("City", "city", filteredCityData)}
          {renderFormInput("Postal Code", "Postal Code", "number")}
          {renderFormInput("Website", "Website", "text")}
          {renderFormInput("Email", "Email", "email")}
          {renderFormInput("Contact Person", "Contact Person", "text")}
          {renderFormInput("Contact No", "Contact No", "text")}
          {renderFormInput("Fax No", "Fax No", "text")}
          {renderFormInput("Pan Card No", "Pan No", "text")}
          {renderFormInput("GST No", "GST No", "text")}
          {renderFormInput("CIN No", "CIN No", "text")}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="reset"
              className="btn btn-danger"
              onClick={props.onFormClose}
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CompanyForm;
