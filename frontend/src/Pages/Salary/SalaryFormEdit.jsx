

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Col } from "react-bootstrap";
import BASE_URL from "../config/config";
const SalaryFormEdit = (props) => {
  const [salaryData, setSalaryData] = useState([]);
  const [BasicSalaryData, setBasicSalaryData] = useState(
    props.editData["salary"][0]["BasicSalary"]
  );
  const [BankNameData, setBankNameData] = useState(
    props.editData["salary"][0]["BankName"]
  );
  const [AccountNoData, setAccountNoData] = useState(
    props.editData["salary"][0]["AccountNo"]
  );
  const [ReAccountNoData, setReAccountNoData] = useState(
    props.editData["salary"][0]["AccountNo"]
  );
  const [AccountHolderNameData, setAccountHolderNameData] = useState(
    props.editData["salary"][0]["AccountHolderName"]
  );
  const [IFSCcodeData, setIFSCcodeData] = useState(
    props.editData["salary"][0]["IFSCcode"]
  );
  const [TaxDeductionData, setTaxDeductionData] = useState(
    props.editData["salary"][0]["TaxDeduction"]
  );

  const onBasicSalaryDataChange = (e) => {
    setBasicSalaryData(e.target.value);
  };

  const onBankNameDataChange = (e) => {
    setBankNameData(e.target.value);
  };

  const onAccountNoDataChange = (e) => {
    setAccountNoData(e.target.value);
  };

  const onReAccountNoDataChange = (e) => {
    setReAccountNoData(e.target.value);
  };

  const onAccountHolderNameDataChange = (e) => {
    setAccountHolderNameData(e.target.value);
  };

  const onIFSCcodeDataChange = (e) => {
    setIFSCcodeData(e.target.value);
  };

  const onTaxDeductionDataChange = (e) => {
    setTaxDeductionData(e.target.value);
  };

  const loadSalaryInfo = () => {
    axios
      .get(`${BASE_URL}/api/salary`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        setSalaryData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadSalaryInfo();
  }, []);

  return (
    <React.Fragment
      style={{ height: "100vh", width: "100%" }}
      className="registration-page py-4"
    >
      {" "}
      <h2
        id="role-form-title"
        className="text-center text-black text-uppercase fw-bold my-4"
      >
        Edit Salary Details
      </h2>
      <div id="role-form-outer-div">
        <Form
          id="form"
          onSubmit={(e) => props.onSalaryEditUpdate(props.editData, e)}
        >
          <div className="d-flex w-100 flex-column gap-6 rounded ">
            <div style={{ padding: "80px" }} className="row row-gap-3 ">
              <div className="form-group col-12 col-md-6">
                <Form.Label column sm={6}>
                  Select Salary
                </Form.Label>
                <Col sm={10} className="form-input">
                  <Form.Control as="select" required disabled>
                    {salaryData.map((data, index) => (
                      <option
                        key={index}
                        value={data["_id"]}
                        selected={props.editData["_id"] === data["_id"]}
                        disabled
                      >
                        {`${data["FirstName"]} ${data["MiddleName"]} ${data["LastName"]}`}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </div>

              <div className="form-group col-12 col-md-6">
                <Form.Label column sm={6}>
                  Basic Salary
                </Form.Label>
                <Col sm={10} className="form-input">
                  <Form.Control
                    type="number"
                    placeholder="Basic Salary"
                    required
                    value={BasicSalaryData}
                    onChange={onBasicSalaryDataChange}
                  />
                </Col>
              </div>

              <div className="form-group col-12 col-md-6">
                <Form.Label column sm={6}>
                  Bank Name
                </Form.Label>
                <Col sm={10} className="form-input">
                  <Form.Control
                    type="text"
                    placeholder="Bank Name"
                    required
                    value={BankNameData}
                    onChange={onBankNameDataChange}
                  />
                </Col>
              </div>

              <div className="form-group col-12 col-md-6">
                <Form.Label column sm={6}>
                  Account No
                </Form.Label>
                <Col sm={10} className="form-input">
                  <Form.Control
                    type="text"
                    placeholder="Account No"
                    required
                    value={AccountNoData}
                    onChange={onAccountNoDataChange}
                  />
                </Col>
              </div>

              <div className="form-group col-12 col-md-6">
                <Form.Label column sm={6}>
                  Re-Enter Account No
                </Form.Label>
                <Col sm={10} className="form-input">
                  <Form.Control
                    type="text"
                    placeholder="Re-Enter Account No"
                    required
                    value={ReAccountNoData}
                    onChange={onReAccountNoDataChange}
                  />
                </Col>
              </div>

              <div className="form-group col-12 col-md-6">
                <Form.Label column sm={6}>
                  Account Holder Name
                </Form.Label>
                <Col sm={10} className="form-input">
                  <Form.Control
                    type="text"
                    placeholder="Account Holder Name"
                    required
                    value={AccountHolderNameData}
                    onChange={onAccountHolderNameDataChange}
                  />
                </Col>
              </div>

              <div className="form-group col-12 col-md-6">
                <Form.Label column sm={6}>
                  IFSC Code
                </Form.Label>
                <Col sm={10} className="form-input">
                  <Form.Control
                    type="text"
                    placeholder="IFSC Code"
                    required
                    value={IFSCcodeData}
                    onChange={onIFSCcodeDataChange}
                  />
                </Col>
              </div>

              <div className="form-group col-12 col-md-6">
                <Form.Label column sm={6}>
                  Tax Deduction
                </Form.Label>
                <Col sm={10} className="form-input">
                  <Form.Control
                    type="number"
                    placeholder="Basic Salary"
                    required
                    value={TaxDeductionData}
                    onChange={onTaxDeductionDataChange}
                  />
                </Col>
              </div>

              <div
                className="form-group col-12 d-flex  gap-5"
                id="form-submit-button"
              >
                <Button className="mx-3" type="submit">
                  Submit
                </Button>
                <Button
                  className="mx-3"
                  type="reset"
                  onClick={props.onFormClose}
                >
                  cancel
                </Button>
              </div>
              <div
                className="form-group col-12 col-md-6"
                id="form-cancel-button"
              ></div>
            </div>
          </div>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default SalaryFormEdit;
