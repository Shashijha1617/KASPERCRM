import React, { useState, useEffect } from "react";
import "./DepartmentForm.css";
import axios from "axios";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const DepartmentForm = ({
  editData,
  onDepartmentEditUpdate,
  onFormEditClose,
}) => {
  const [departmentData, setDepartmentData] = useState(
    editData["DepartmentName"]
  );
  const [companyData, setCompanyData] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = () => {
    axios
      .get(`${BASE_URL}/api/company`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setCompanyData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    setDepartmentData(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDepartmentEditUpdate(editData, e);
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
      <h5>Edit Department Details</h5>

      <div>
        <form className="d-flex flex-column gap-3 mt-3" onSubmit={handleSubmit}>
          <div>
            <label>Company</label>
            <div>
              <select
                className="form-select rounded-0"
                as="select"
                name="company"
                required
                defaultValue={editData["company"][0]["_id"]}
              >
                <option value="" disabled>
                  Select your option
                </option>
                {companyData.map((data) => (
                  <option key={data["_id"]} value={data["_id"]}>
                    {data["CompanyName"]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label>Department</label>
            <div>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="Department"
                name="DepartmentName"
                required
                value={departmentData}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary " type="submit">
              Update
            </button>
            <button
              className="btn btn-danger "
              type="reset"
              onClick={onFormEditClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
