import React, { useState, useEffect } from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { Form } from "react-bootstrap";

const AdminPortalForm = ({
  editData,
  onPortalEditUpdate,
  onStatusChange,
  onFormEditClose,
}) => {
  const [portalData, setPortalData] = useState(editData.PortalName || "");
  const [status, setStatus] = useState(editData.Status || "");
  const { darkMode } = useTheme();

  useEffect(() => {
    setPortalData(editData.PortalName);
    setStatus(editData.Status);
  }, [editData]);

  const handlePortalDataChange = (e) => {
    setPortalData(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    onStatusChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPortalEditUpdate(editData, e.target[0].value);
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
        >
          Edit Portal Details
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
        >
          You can edit portal here.
        </p>
      </div>

      <form
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
        }}
        className="my-4 d-flex flex-column gap-3"
        onSubmit={handleSubmit}
      >
        <div>
          <label>Portal</label>
          <div className="form-input">
            <input
              className="form-control rounded-0"
              type="text"
              placeholder="Portal"
              name="PortalName"
              required
              value={portalData}
              onChange={handlePortalDataChange}
            />
          </div>
        </div>

        <div>
          <lable>Status</lable>
          <div className="d-flex  align-items-center gap-3">
            <Form.Check
              className="d-flex align-items-center gap-2 text-capitalize"
              inline
              type="radio"
              label="enable"
              value="1"
              name="status"
              onChange={handleStatusChange}
              required
              checked={status === 1}
            />
            <Form.Check
              className="d-flex align-items-center gap-2 text-capitalize"
              inline
              type="radio"
              label="disable"
              value="0"
              name="status"
              onChange={handleStatusChange}
              required
              checked={status === 0}
            />
          </div>
        </div>

        <div className="d-flex  align-items-center gap-2">
          <button
            className="btn-primary btn d-flex align-items-center justify-content-center gap-2"
            type="submit"
          >
            Update
          </button>
          <button
            className="btn-danger btn d-flex align-items-center justify-content-center gap-2"
            type="reset"
            onClick={onFormEditClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPortalForm;
