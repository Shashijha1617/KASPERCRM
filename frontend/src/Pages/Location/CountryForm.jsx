import React from "react";
import "./CountryForm.css";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const CountryForm = ({ onCountrySubmit, onFormClose }) => {
  const { darkMode } = useTheme();
  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <h5>Add Country Details</h5>
      <form
        className="d-flex flex-column gap-3 mt-3"
        onSubmit={onCountrySubmit}
      >
        <div>
          <label column sm={2}>
            Country
          </label>
          <div>
            <input
              className="form-select rounded-0"
              type="text"
              placeholder="Country"
              name="Country"
              required
            />
          </div>
        </div>

        <div className="d-flex gap-2">
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

export default CountryForm;
