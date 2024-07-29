import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config/config";
import { Form, Button, Col, Row } from "react-bootstrap";
import "./StateForm.css";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const StateForm = ({ onStateSubmit, onFormClose }) => {
  const [countryInfo, setCountryInfo] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    const loadCountryInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/country`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        });
        setCountryInfo(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    loadCountryInfo();
  }, []);

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <h5>Add State Details</h5>
      <form className="d-flex flex-column gap-3 mt-3" onSubmit={onStateSubmit}>
        <div>
          <lable>Country</lable>
          <div>
            <select className="form-control rounded-0" name="country" required>
              <option value="" disabled selected>
                Select your option
              </option>
              {countryInfo.map((data) => (
                <option key={data["_id"]} value={data["_id"]}>
                  {data["CountryName"]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <lable>State</lable>
          <div>
            <input
              className="form-control rounded-0"
              type="text"
              placeholder="State"
              name="State"
              required
            />
          </div>
        </div>

        <div className="d-flex gap-3">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
          <button className="btn btn-danger" type="reset" onClick={onFormClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StateForm;
