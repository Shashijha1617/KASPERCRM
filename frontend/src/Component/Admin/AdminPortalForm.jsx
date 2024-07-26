import React, { useState } from "react";
import "./AdminPortalForm.css";
import { Form, Button, div, Row } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const AdminPortalForm = ({ onPortalSubmit, onStatusChange, onFormClose }) => {
  const [status, setStatus] = useState("");
  const { darkMode } = useTheme();

  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const rowHeadStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenudivor)"
      : "var(--primaryDashdivorDark)",
    color: darkMode
      ? "var(--primaryDashdivorDark)"
      : "var(--secondaryDashMenudivor)",
    border: "none",
    position: "sticky",
    top: "0rem",
    zIndex: "100",
  };

  const rowBodyStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--secondaryDashMenudivor)"
      : "var(--secondaryDashdivorDark)",
    color: darkMode
      ? "var(--secondaryDashdivorDark)"
      : "var(--primaryDashMenudivor)",
    border: "none",
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
          Add Portal Details
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
        >
          You can add new portal here.
        </p>
      </div>
      <form
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
        }}
        className="my-4 d-flex flex-column gap-3"
        onSubmit={onPortalSubmit}
      >
        <div>
          <label>Portal</label>
          <div>
            <input
              className="form-control rounded-0"
              type="text"
              placeholder="Please enter portal name"
              name="Portal"
              required
            />
          </div>
        </div>

        <div>
          <label>Status</label>
          <div className="d-flex align-items-center gap-2">
            <Form.Check
              className="d-flex align-items-center gap-2 text-capitalize"
              inline
              type="radio"
              label="enable"
              value="1"
              name="status"
              onChange={onStatusChange}
              required
            />
            <Form.Check
              className="d-flex align-items-center gap-2 text-capitalize"
              inline
              type="radio"
              label="disable"
              value="0"
              name="status"
              onChange={onStatusChange}
              required
            />
          </div>
        </div>

        <div className="d-flex  align-items-center gap-2">
          <button
            className="btn-primary btn d-flex align-items-center justify-content-center gap-2"
            type="submit"
          >
            Submit
          </button>
          <button
            className="btn-danger btn d-flex align-items-center justify-content-center gap-2"
            type="reset"
            onClick={onFormClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPortalForm;
