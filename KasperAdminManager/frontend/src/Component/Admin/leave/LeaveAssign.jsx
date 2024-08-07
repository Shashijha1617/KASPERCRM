import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const LeaveAssign = () => {
  const [empData, setEmpData] = useState([]);
  const [formData, setFormData] = useState({
    employees: [],
    sickLeave: "",
    paidLeave: "",
    casualLeave: "",
    paternityLeave: "",
    maternityLeave: "",
  });
  const { darkMode } = useTheme();

  const id = localStorage.getItem("_id");

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/employee`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        const employees = response.data
          .filter((val) => {
            return (
              (val.Account === 2 || val.Account === 4) &&
              val.status === "active"
            );
          })
          .map((employee) => ({
            value: employee.Email,
            label: employee.Email,
          }));
        setEmpData([
          { value: "select_all", label: "Select All" },
          ...employees,
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "" || (Number(value) >= 0 && !isNaN(value))) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "select_all")) {
      setFormData({
        ...formData,
        employees: empData.filter((option) => option.value !== "select_all"),
      });
    } else {
      setFormData({
        ...formData,
        employees: selectedOptions,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    axios
      .post(`${BASE_URL}/api/assignLeave`, formData)
      .then((response) => {
        alert("Leave Assign Successfully");
        setFormData({
          employees: [],
          sickLeave: "",
          paidLeave: "",
          casualLeave: "",
          paternityLeave: "",
          maternityLeave: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: "400px",
      overflowY: "auto",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <TittleHeader
        title={"Leave Assignment Form"}
        message={"You can assign leaves to the selected employee"}
      />

      <form className="my-2 " onSubmit={handleSubmit}>
        <div className="row  row row-gap-3">
          <div className="col-12">
            <label htmlFor="employees" className="form-label">
              Select Employees
            </label>
            <Select
              id="employees"
              name="employees"
              value={formData.employees}
              onChange={handleSelectChange}
              options={empData}
              isMulti
              closeMenuOnSelect={false}
              isClearable
              styles={customStyles}
              menuPlacement="bottom"
              menuPortalTarget={document.body}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <label htmlFor="sickLeave" className="form-label">
              Sick Leave
            </label>
            <input
              type="number"
              className="form-control py-3"
              id="sickLeave"
              name="sickLeave"
              value={formData.sickLeave}
              placeholder="0"
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <label htmlFor="paidLeave" className="form-label">
              Paid Leave
            </label>
            <input
              type="number"
              className="form-control"
              id="paidLeave"
              name="paidLeave"
              value={formData.paidLeave}
              placeholder="0"
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <label htmlFor="casualLeave" className="form-label">
              Casual Leave
            </label>
            <input
              type="number"
              className="form-control"
              id="casualLeave"
              name="casualLeave"
              placeholder="0"
              value={formData.casualLeave}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <label htmlFor="paternityLeave" className="form-label">
              Paternity Leave
            </label>
            <input
              type="number"
              className="form-control"
              id="paternityLeave"
              name="paternityLeave"
              placeholder="0"
              value={formData.paternityLeave}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <label htmlFor="maternityLeave" className="form-label">
              Maternity Leave
            </label>
            <input
              type="number"
              className="form-control"
              id="maternityLeave"
              name="maternityLeave"
              placeholder="0"
              value={formData.maternityLeave}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
        <button type="submit" className=" my-3 btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LeaveAssign;
