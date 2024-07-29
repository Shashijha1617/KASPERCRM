import React, { useState, useEffect } from "react";
import "./RoleForm.css";
import { Form, Button, Row } from "react-bootstrap";
import axios from "axios";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const RoleForm = (props) => {
  const [companyInfo, setCompanyInfo] = useState([]);
  const { darkMode } = useTheme();

  const loadCompanyInfo = () => {
    axios
      .get(`${BASE_URL}/api/company`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setCompanyInfo(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadCompanyInfo();
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
      <h5>Add Role Details</h5>
      <div>
        <form
          className="d-flex flex-column gap-3 mt-3"
          onSubmit={props.onRoleSubmit}
        >
          <div>
            <label>Company</label>
            <div>
              <select
                className="rounded-0 form-select"
                as="select"
                name="country"
                required
              >
                <option value="" disabled selected>
                  Select your option
                </option>
                {companyInfo.map((data, index) => (
                  <option key={index} value={data["_id"]}>
                    {data["CompanyName"]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label>Role</label>
            <div>
              <input
                className="rounded-0 form-control"
                type="Text"
                placeholder="Role"
                name="Role"
                required
              />
            </div>
          </div>

          <div className="d-flex gap-3">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
            <button
              className="btn btn-danger"
              type="reset"
              onClick={props.onFormClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;
