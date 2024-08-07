import React, { useState, useEffect } from "react";
import "./AdminProjectBidFormEdit.css";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const AdminProjectBidFormEdit = ({
  editData,
  onProjectBidEditUpdate,
  onFormEditClose,
}) => {
  const [portalsInfo, setPortalsInfo] = useState([]);
  const { darkMode } = useTheme();
  const [projectTitleData, setProjectTitleData] = useState(
    editData["ProjectTitle"]
  );
  const [projectURLData, setProjectURLData] = useState(editData["ProjectURL"]);
  const [projectDescriptionData, setProjectDescriptionData] = useState(
    editData["ProjectDesc"]
  );
  const [estimatedTimeData, setEstimatedTimeData] = useState(
    editData["EstimatedTime"]
  );
  const [estimatedCostData, setEstimatedCostData] = useState(
    editData["EstimatedCost"]
  );
  const [remarkData, setRemarkData] = useState(editData["Remark"]);

  useEffect(() => {
    loadPortalsInfo();
  }, []);

  const loadPortalsInfo = () => {
    axios
      .get(`${BASE_URL}/api/admin/portal`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        const activePortals = response.data.filter(
          (data) => data["Status"] == 1
        );
        setPortalsInfo(activePortals);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container-fluid py-3">
      <div className="my-auto">
        <h5
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "600",
          }}
          className="m-0"
        >
          Edit Project Bid Details
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
        >
          You can edit project bid details here.
        </p>
      </div>
      <form
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
        }}
        className="my-4 d-flex flex-column gap-3"
        onSubmit={(e) => onProjectBidEditUpdate(editData, e)}
      >
        <div className="row">
          <div className="col-12 col-md-6">
            <label>Project Title</label>
            <div>
              <input
                type="text"
                className="form-control rounded-0"
                placeholder="Project Title"
                name="ProjectTitle"
                required
                value={projectTitleData}
                onChange={(e) => setProjectTitleData(e.target.value)}
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
                value={projectURLData}
                onChange={(e) => setProjectURLData(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <label>Project Description</label>
          <div>
            <textarea
              className="form-control rounded-0"
              rows="3"
              required
              value={projectDescriptionData}
              onChange={(e) => setProjectDescriptionData(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label>Portals</label>
          <div>
            <select className="form-select rounded-0" name="CompanyID" required>
              {portalsInfo.map((data, index) => (
                <option
                  key={index}
                  value={data["_id"]}
                  selected={editData["portals"][0]["ID"] === data["ID"]}
                >
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
                value={estimatedTimeData}
                onChange={(e) => setEstimatedTimeData(e.target.value)}
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
                value={estimatedCostData}
                onChange={(e) => setEstimatedCostData(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <label>Resource</label>
            <div>
              <select className="form-select rounded-0" required>
                <option value="1" selected={editData["ResourceID"] == 1}>
                  Resource1
                </option>
                <option value="2" selected={editData["ResourceID"] == 2}>
                  Resource2
                </option>
                <option value="3" selected={editData["ResourceID"] == 3}>
                  Resource3
                </option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label>Status</label>
            <div>
              <select className="form-select rounded-0" required>
                <option value="1" selected={editData["Status"] == 1}>
                  Open
                </option>
                <option value="2" selected={editData["Status"] == 2}>
                  Close
                </option>
                <option value="3" selected={editData["Status"] == 3}>
                  Cancel
                </option>
                <option value="4" selected={editData["Status"] == 4}>
                  Award
                </option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <label>Remark</label>
          <div>
            <textarea
              className="form-control rounded-0"
              rows="3"
              required
              value={remarkData}
              onChange={(e) => setRemarkData(e.target.value)}
            />
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onFormEditClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectBidFormEdit;
