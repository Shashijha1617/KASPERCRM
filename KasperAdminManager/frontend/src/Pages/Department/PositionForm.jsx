import React, { useState, useEffect } from "react";
import "./PositionForm.css";
import axios from "axios";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const PositionForm = (props) => {
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

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <h5>Add Position</h5>

      <form
        className="d-flex flex-column gap-3 mt-3"
        onSubmit={props.onPositionSubmit}
      >
        <div>
          <label>Company</label>
          <div>
            <select
              className="form-select rounded-0"
              as="select"
              name="company"
              required
            >
              <option value="" disabled selected>
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
        <br />
        <div>
          <label>Position</label>
          <div>
            <input
              className="form-control rounded-0"
              type="Text"
              placeholder="Position"
              name="Position"
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
  );
};

export default PositionForm;
