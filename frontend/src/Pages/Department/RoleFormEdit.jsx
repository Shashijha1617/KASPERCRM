import React, { useState, useEffect } from "react";
import { Form, Button, div, Row } from "react-bootstrap";
import axios from "axios";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const RoleForm = (props) => {
  const [roleData, setRoleData] = useState(props.editData["RoleName"]);
  const [companyInfo, setCompanyInfo] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const { darkMode } = useTheme();
  useEffect(() => {
    const loadCompanyInfo = () => {
      axios
        .get(`${BASE_URL}/api/company`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then((response) => {
          setCompanyData(response.data);
          setCompanyInfo(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    loadCompanyInfo();
  }, []);

  const handleRoleChange = (e) => {
    setRoleData(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onRoleEditUpdate(
      props.editData,
      e.target[0].value,
      e.target[1].value
    );
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <h5>Edit Role Details</h5>
      <div>
        <form className="d-flex flex-column gap-3 mt-3" onSubmit={handleSubmit}>
          <div>
            <label>Company</label>
            <div className="form-input">
              <select
                className="form-select"
                as="select"
                name="country"
                required
              >
                <option value="" disabled selected>
                  Select your option
                </option>
                {companyData.map((data, index) => (
                  <option
                    key={index}
                    value={data["_id"]}
                    selected={
                      props.editData["company"][0]["_id"] === data["_id"]
                    }
                  >
                    {data["CompanyName"]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label>Role</label>
            <div className="form-input">
              <input
                className="form-control rounded-0"
                type="Text"
                placeholder="Role"
                name="RoleName"
                required
                value={roleData}
                onChange={handleRoleChange}
              />
            </div>
          </div>

          <div className="d-flex gap-3">
            <button className="btn btn-primary" type="submit">
              Update
            </button>{" "}
            <button
              className="btn btn-danger"
              type="reset"
              onClick={props.onFormEditClose}
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
