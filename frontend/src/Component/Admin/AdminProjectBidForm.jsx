import React, { useState, useEffect } from "react";
import "./AdminProjectBidForm.css";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const AdminProjectBidForm = ({ onProjectBidSubmit, onFormClose }) => {
  const [status, setStatus] = useState("");
  const [portalsInfo, setPortalsInfo] = useState([]);
  const { darkMode } = useTheme();
  let portalsData = [];

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const loadPortalsInfo = () => {
    axios
      .get(`${BASE_URL}/api/admin/portal`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        portalsData = response.data.filter((data) => data.Status === 1);
        setPortalsInfo(portalsData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadPortalsInfo();
  }, []);

  return (
    <div className="container-fluid py-3">
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
          Add Project Bid Details
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="m-0"
        >
          You can create new bid here.
        </p>
      </div>

      <form
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
        }}
        className="my-4 d-flex flex-column gap-3"
        onSubmit={onProjectBidSubmit}
      >
        <div className="row">
          <div className="col-12 col-md-6">
            <label>Project Title</label>
            <div>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="Project Title"
                name="ProjectTitle"
                required
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label>Project URL</label>
            <div>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="Project URL"
                name="ProjectURL"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <label>Project Description</label>
          <div>
            <textarea
              placeholder="Please enter description of the project"
              className="form-control rounded-0"
              rows="3"
              required
            />
          </div>
        </div>
        <div>
          <label>Portals</label>
          <div>
            <select className="form-select rounded-0" name="CompanyID" required>
              {portalsInfo.map((data) => (
                <option key={data["_id"]} value={data["_id"]}>
                  {data["PortalName"]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <label>Estimated Time</label>
            <div>
              <input
                className="form-control rounded-0"
                type="number"
                placeholder="Estimated Time"
                name="EstimatedTime"
                required
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label>Estimated Cost</label>
            <div>
              <input
                className="form-control rounded-0"
                type="number"
                placeholder="Estimated Cost"
                name="EstimatedCost"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          {" "}
          <div className="col-12 col-md-6">
            <label>Resource</label>
            <div>
              <select className="form-select rounded-0" required>
                <option value="1">Resource1</option>
                <option value="2">Resource2</option>
                <option value="3">Resource3</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label>Status</label>
            <div>
              <select className="form-select rounded-0" required>
                <option value="1">Open</option>
                <option value="2">Close</option>
                <option value="3">Cancel</option>
                <option value="4">Award</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <label>Remark</label>
          <div>
            <textarea
              placeholder="Please enter remarks, if any"
              className="form-control rounded-0"
              rows="3"
              required
            />
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onFormClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectBidForm;
