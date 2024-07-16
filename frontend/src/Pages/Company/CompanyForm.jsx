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
          authorization: localStorage.getItem("token") || ""
        }
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
          authorization: localStorage.getItem("token") || ""
        }
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
          authorization: localStorage.getItem("token") || ""
        }
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
    <Form.Group as={Row}>
      <Form.Label column sm={2}>
        {label}
      </Form.Label>
      <Col sm={10}>
        <Form.Control type={type} placeholder={label} name={name} required />
      </Col>
    </Form.Group>
  );

  const renderFormTextarea = (label, name) => (
    <Form.Group as={Row}>
      <Form.Label column sm={2}>
        {label}
      </Form.Label>
      <Col sm={10}>
        <Form.Control as="textarea" rows="3" placeholder={label} name={name} required />
      </Col>
    </Form.Group>
  );

  const renderFormSelect = (label, name, data, onChange) => (
    <Form.Group as={Row}>
      <Form.Label column sm={2}>
        {label}
      </Form.Label>
      <Col sm={10}>
        <Form.Control as="select" name={name} onChange={onChange} required>
          <option value="" disabled selected>Select your option</option>
          {data.map((item, index) => (
            <option key={index} value={item["_id"]}>
              {item[name + "Name"]}
            </option>
          ))}
        </Form.Control>
      </Col>
    </Form.Group>
  );

  return (
    <div style={{
      color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)",
    }}>
      <div className="
      container-fluid p-3 py-4">
        <h5 className="my-3">Add Company Details</h5>
        <Form className="d-flex flex-column gap-3" onSubmit={props.onCompanySubmit}>
          {renderFormInput("Company Name", "CompanyName", "text")}
          {renderFormTextarea("Address", "address")}
          {renderFormSelect("Country", "country", countryData, onCountryChange)}
          {renderFormSelect("State", "state", filteredStateData, onStateChange)}
          {renderFormSelect("City", "city", filteredCityData)}
          {renderFormInput("PostalCode", "PostalCode", "number")}
          {renderFormInput("Website", "Website", "text")}
          {renderFormInput("Email", "Email", "email")}
          {renderFormInput("Contact Person", "ContactPerson", "text")}
          {renderFormInput("Contact No", "ContactNo", "text")}
          {renderFormInput("FaxNo", "FaxNo", "text")}
          {renderFormInput("PanCard No", "PanNo", "text")}
          {renderFormInput("GSTNo", "GSTNo", "text")}
          {renderFormInput("CINNo", "CINNo", "text")}
          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit" className="form-submit-button">Submit</Button>
              <Button type="reset" className="form-cancel-button" onClick={props.onFormClose}>Cancel</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default CompanyForm;
