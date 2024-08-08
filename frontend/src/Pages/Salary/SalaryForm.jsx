import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Col } from "react-bootstrap";
import { TbReportMoney } from "react-icons/tb";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import TittleHeader from "../TittleHeader/TittleHeader";

const SalaryForm = (props) => {
  const [employeeData, setEmployeeData] = useState([]);
  const { darkMode } = useTheme();
  const [formValues, setFormValues] = useState({
    BasicSalary: "",
    HRASalary: "",
    MAllowance: "",
    SpecialAllowance: "",
    otherAllowance: "",
    LeaveDeduct: "",
    PFDeduct: "",
    BankName: "",
    AccountNo: "",
    ReAccountNo: "",
    AccountHolderName: "",
    IFSCcode: "",
    TaxDeduction: "",
    totalSalary: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };
      // Calculate total salary whenever form values change
      const totalSalary = calculateTotalSalary(updatedValues);
      return { ...updatedValues, totalSalary };
    });
  };

  const calculateTotalSalary = (values) => {
    const {
      BasicSalary,
      HRASalary,
      MAllowance,
      SpecialAllowance,
      otherAllowance,
      LeaveDeduct,
      PFDeduct,
      TaxDeduction,
    } = values;
    return (
      parseFloat(BasicSalary || 0) +
      parseFloat(HRASalary || 0) +
      parseFloat(MAllowance || 0) +
      parseFloat(SpecialAllowance || 0) +
      parseFloat(otherAllowance || 0) -
      parseFloat(PFDeduct || 0) -
      parseFloat(LeaveDeduct || 0) -
      parseFloat(TaxDeduction || 0)
    ).toFixed(2);
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-2"
    >
      <TittleHeader
        title={"Add Salary Details"}
        message={"You can add salary details of the employee."}
      />
      <Form
        id="form"
        onSubmit={props.onSalarySubmit}
        style={{ width: "fit-content" }}
        className=" w-100 row  row-gap-3 py-4 mb-5"
      >
        <div className="col-12 col-md-6 col-lg-4">
          <label>Select Employee</label>
          <div>
            <Form.Control
              className="rounded-0"
              as="select"
              name="employeeId"
              onChange={handleChange}
              required
            >
              <option value="" disabled selected>
                Select your option
              </option>
              {employeeData.map((data, index) => (
                <option key={index} value={data["_id"]}>
                  {data["empID"] + " " + data["LastName"]}
                </option>
              ))}
            </Form.Control>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <label>Basic Salary</label>
          <div>
            <Form.Control
              className="rounded-0"
              type="number"
              name="BasicSalary"
              placeholder="Basic Salary"
              value={formValues.BasicSalary}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <label>House Rent Allowance (H.R.A.) </label>
          <div>
            <Form.Control
              className="rounded-0"
              type="number"
              name="HRASalary"
              placeholder="H.R.A"
              value={formValues.HRASalary}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>Medical Allowance</label>
          <div>
            <Form.Control
              className="rounded-0"
              type="number"
              name="MAllowance"
              placeholder="Medical Allowance"
              value={formValues.MAllowance}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>Special Allowance</label>
          <div>
            <Form.Control
              className="rounded-0"
              type="number"
              name="SpecialAllowance"
              placeholder="Special Allowance"
              value={formValues.SpecialAllowance}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>Other Allowance </label>
          <div>
            <Form.Control
              className="rounded-0"
              type="number"
              name="otherAllowance"
              placeholder="Other Allowance"
              value={formValues.otherAllowance}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>Leave Deduct </label>
          <div>
            <Form.Control
              className="rounded-0"
              type="number"
              name="LeaveDeduct"
              placeholder="Leave Deduct"
              value={formValues.LeaveDeduct}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>PF Deduct </label>
          <div>
            <Form.Control
              className="rounded-0"
              type="number"
              name="PFDeduct"
              placeholder="PF Deduct"
              value={formValues.PFDeduct}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>Bank Name</label>
          <div>
            <Form.Control
              className="rounded-0"
              type="text"
              name="BankName"
              placeholder="Bank Name"
              value={formValues.BankName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>Account No</label>
          <div>
            <Form.Control
              className="rounded-0"
              type="text"
              name="AccountNo"
              placeholder="Account No"
              value={formValues.AccountNo}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>Re-Enter Account No</label>
          <div>
            <Form.Control
              className="rounded-0"
              type="text"
              name="ReAccountNo"
              placeholder="Re-Enter Account No"
              value={formValues.ReAccountNo}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>Account Holder Name</label>
          <div>
            <Form.Control
              className="rounded-0"
              type="text"
              name="AccountHolderName"
              placeholder="Account Holder Name"
              value={formValues.AccountHolderName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>IFSC Code</label>
          <div>
            <Form.Control
              className="rounded-0"
              type="text"
              name="IFSCcode"
              placeholder="IFSC Code"
              value={formValues.IFSCcode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>Tax Deduction</label>
          <div>
            <Form.Control
              className="rounded-0"
              type="number"
              name="TaxDeduction"
              placeholder="Tax Deduction"
              value={formValues.TaxDeduction}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label>Total Earning</label>
          <div>
            <Form.Control
              className="rounded-0"
              type="number"
              name="totalSalary"
              placeholder="Total Earning"
              value={formValues.totalSalary}
              readOnly // Make this field read-only since it's calculated
            />
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Button className="btn btn-primary" type="submit">
            Submit
          </Button>
          <Button
            className="btn btn-danger"
            type="reset"
            onClick={props.onFormClose}
          >
            cancel
          </Button>
        </div>
        <div
          className="form-group col-12 col-md-6 col-12 col-md-6"
          id="form-cancel-button"
        ></div>
      </Form>
    </div>
  );
};

export default SalaryForm;
