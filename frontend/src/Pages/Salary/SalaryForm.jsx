import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config/config";
import { MdDoneAll, MdOutlineCancel } from "react-icons/md";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
const SalaryForm = (props) => {
  const [employeeData, setEmployeeData] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    const loadEmployeeInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/employee`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        });
        setEmployeeData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadEmployeeInfo();
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="my-auto px-2">
        <h5
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "600",
          }}
          className="m-0"
        >
          Add Salary Details
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="m-0"
        >
          You can create employee salary here.
        </p>
      </div>
      <form
        id="form"
        onSubmit={props.onSalarySubmit}
        style={{ color: "var(--primaryDashMenuColor)", width: "fit-content" }}
        className="w-100 row mx-auto py-4 mb-5"
      >
        <div className="form-group col-12 col-md-6">
          <lable
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
          >
            Select Employee
          </lable>
          <div className="form-input p-0 ">
            <select className="rounded-0 form-select" as="select" required>
              <option value="" disabled selected>
                Select your option
              </option>
              {employeeData.map((data, index) => (
                <option key={index} value={data["_id"]}>
                  {data["empID"] +
                    " - " +
                    data["FirstName"] +
                    " " +
                    data["LastName"]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <lable
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
          >
            Basic Salary
          </lable>
          <div className="form-input p-0">
            <input
              className="form-control rounded-0"
              type="number"
              placeholder="Basic Salary"
              required
            />
          </div>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <lable
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
          >
            Bank Name
          </lable>
          <div className="form-input p-0">
            <input
              className="form-control rounded-0"
              type="text"
              placeholder="Bank Name"
              required
            />
          </div>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <lable
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
          >
            Account No
          </lable>
          <div className="form-input p-0">
            <input
              className="form-control rounded-0"
              type="text"
              placeholder="Account No"
              required
            />
          </div>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <lable
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
          >
            Re-Enter Account No
          </lable>
          <div className="form-input p-0">
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Re-Enter Account No"
              required
            />
          </div>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <lable
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
          >
            Account Holder Name
          </lable>
          <div className="form-input p-0">
            <input
              className="form-control rounded-0"
              type="text"
              placeholder="Account Holder Name"
              required
            />
          </div>
        </div>

        <div className="form-group col-12 col-md-6">
          <lable
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
          >
            IFSC Code
          </lable>
          <div className="form-input p-0">
            <input
              className="form-control rounded-0"
              type="text"
              placeholder="IFSC Code"
              required
            />
          </div>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <lable
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
          >
            Tax Deduction
          </lable>
          <div className="form-input p-0">
            <input
              className="form-control rounded-0"
              type="number"
              placeholder="Basic Salary"
              required
            />
          </div>
        </div>

        <div className=" d-flex align-items-center gap-3">
          <button className="btn btn-primary" type="submit">
            <MdDoneAll /> Submit
          </button>
          <button
            className="btn btn-danger"
            type="reset"
            onClick={props.onFormClose}
          >
            <MdOutlineCancel /> cancel
          </button>
        </div>
        <div
          className="form-group col-12 col-md-6 col-12 col-md-6"
          id="form-cancel-button"
        ></div>
      </form>
    </div>
  );
};

export default SalaryForm;
