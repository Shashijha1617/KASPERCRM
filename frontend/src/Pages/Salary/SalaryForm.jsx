import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Col } from "react-bootstrap";
import SalaryImage from "./SalaryImage.svg"
import { TbReportMoney } from "react-icons/tb";
import BASE_URL from "../config/config";
const SalaryForm = (props) => {
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    const loadEmployeeInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/employee`, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        });
        setEmployeeData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadEmployeeInfo();
  }, []);

  return (

    <div className="container-fluid">
      <h4 style={{ position: 'sticky', top: '-.5rem', zIndex: '5' }} className="text-muted d-flex gap-2 align-items-center bg-light py-3 text-capitalize fw-bold">
        <TbReportMoney /> Add Salary Details
      </h4>
      <Form
        id="form"
        onSubmit={props.onSalarySubmit}
        style={{ color: 'var(--primaryDashMenuColor)', width: 'fit-content' }}
        className=" fw-bold w-100 row mx-auto py-4 mb-5"
      >

        <div className="form-group col-12 col-md-6 py-2">
          <Form.Label className="text-black">
            Select Employee
          </Form.Label>
          <Col className="form-input p-0 ">
            <Form.Control as="select" required>
              <option value="" disabled selected>
                Select your option
              </option>
              {employeeData.map((data, index) => (
                <option key={index} value={data["_id"]}>
                  {data["empID"] + data["FirstName"] +
                    " " +
                    data["MiddleName"] +
                    " " +
                    data["LastName"]}
                </option>
              ))}
            </Form.Control>
          </Col>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <Form.Label className="text-black">
            Basic Salary
          </Form.Label>
          <Col className="form-input p-0">
            <Form.Control
              type="number"
              placeholder="Basic Salary"
              required
            />
          </Col>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <Form.Label className="text-black">
            Bank Name
          </Form.Label>
          <Col className="form-input p-0">
            <Form.Control type="text" placeholder="Bank Name" required />
          </Col>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <Form.Label className="text-black">
            Account No
          </Form.Label>
          <Col className="form-input p-0">
            <Form.Control type="text" placeholder="Account No" required />
          </Col>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <Form.Label className="text-black">
            Re-Enter Account No
          </Form.Label>
          <Col className="form-input p-0">
            <Form.Control
              type="text"
              placeholder="Re-Enter Account No"
              required
            />
          </Col>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <Form.Label className="text-black">
            Account Holder Name
          </Form.Label>
          <Col className="form-input p-0">
            <Form.Control
              type="text"
              placeholder="Account Holder Name"
              required
            />
          </Col>
        </div>

        <div className="form-group col-12 col-md-6">
          <Form.Label className="text-black">
            IFSC Code
          </Form.Label>
          <Col className="form-input p-0">
            <Form.Control type="text" placeholder="IFSC Code" required />
          </Col>
        </div>

        <div className="form-group col-12 col-md-6 ">
          <Form.Label className="text-black">
            Tax Deduction
          </Form.Label>
          <Col className="form-input p-0">
            <Form.Control
              type="number"
              placeholder="Basic Salary"
              required
            />
          </Col>
        </div>

        <div
          className="form-group row mx-auto d-flex justify-content-between m-auto"
          id="form-submit-button"
        >
          <Button className="col-5  rounded-5 fw-bold" style={{ backgroundColor: 'var(--primaryDashColorDark)', color: 'var(--primaryDashMenuColor)', border: 'none', outline: 'none' }} type="submit">
            Submit
          </Button>
          <Button className="col-5  rounded-5 fw-bold" style={{ backgroundColor: 'red', color: 'white', border: 'none', outline: 'none' }} type="reset" onClick={props.onFormClose}>
            cancel
          </Button>
        </div>
        <div
          className="form-group col-12 col-md-6 col-12 col-md-6"
          id="form-cancel-button"
        ></div>
      </Form></div>
  );
};

export default SalaryForm;
