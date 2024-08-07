import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Col } from "react-bootstrap";
import BASE_URL from "../config/config";
import TittleHeader from "../TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const SalaryFormEdit = (props) => {
  const [salaryData, setSalaryData] = useState([]);
  const { darkMode } = useTheme();

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
  const [HRASalaryData, setHRASalaryData] = useState(
    props.editData["salary"][0]["HRASalary"]
  );
  const [MAllowanceData, setMAllowanceData] = useState(
    props.editData["salary"][0]["MAllowance"]
  );
  const [SpecialAllowanceData, setSpecialAllowanceData] = useState(
    props.editData["salary"][0]["SpecialAllowance"]
  );
  const [otherAllowanceData, setotherAllowanceData] = useState(
    props.editData["salary"][0]["otherAllowance"]
  );
  const [LeaveDeductData, setLeaveDeductData] = useState(
    props.editData["salary"][0]["LeaveDeduct"]
  );
  const [PFDeductData, setPFDeductData] = useState(
    props.editData["salary"][0]["PFDeduct"]
  );
  const [totalSalaryData, settotalSalaryData] = useState(
    props.editData["salary"][0]["totalSalary"]
  );

  const onHRASalaryDataChange = (e) => {
    setHRASalaryData(e.target.value);
  };
  const onMAllowanceDataChange = (e) => {
    setMAllowanceData(e.target.value);
  };
  const onSpecialAllowanceDataChange = (e) => {
    setSpecialAllowanceData(e.target.value);
  };
  const onotherAllowanceDataChange = (e) => {
    setotherAllowanceData(e.target.value);
  };
  const onLeaveDeductDataChange = (e) => {
    setLeaveDeductData(e.target.value);
  };
  const onPFDeductDataChange = (e) => {
    setPFDeductData(e.target.value);
  };
  const ontotalSalaryDataChange = (e) => {
    settotalSalaryData(e.target.value);
  };
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
          authorization: localStorage.getItem("token") || "",
        },
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
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-2"
    >
      <TittleHeader
        title={"Edit Salary Details"}
        message={"You can edit salary details of the employee."}
      />
      <Form
        className="my-2"
        id="form"
        onSubmit={(e) => props.onSalaryEditUpdate(props.editData, e)}
      >
        <div className="row row-gap-3 ">
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Select Employee
            </label>
            <div>
              <Form.Control className="rounded-0" as="select" required disabled>
                {salaryData.map((data, index) => (
                  <option
                    key={index}
                    value={data["_id"]}
                    selected={props.editData["_id"] === data["_id"]}
                    disabled
                  >
                    {`${data["FirstName"]} ${data["LastName"]}`}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Basic Salary
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="number"
                placeholder="Basic Salary"
                required
                value={BasicSalaryData}
                onChange={onBasicSalaryDataChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              House Rent Allowance (H.R.A.){" "}
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="number"
                placeholder=" House Rent Allowance"
                required
                value={HRASalaryData}
                onChange={onHRASalaryDataChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Medical Allowance{" "}
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="number"
                placeholder=" Medical Allowance"
                required
                value={MAllowanceData}
                onChange={onMAllowanceDataChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Special Allowance
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="number"
                placeholder=" Special Allowance"
                required
                value={SpecialAllowanceData}
                onChange={onSpecialAllowanceDataChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Other Allowance
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="number"
                placeholder="Other Allowance"
                required
                value={otherAllowanceData}
                onChange={onotherAllowanceDataChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Leave Deduct{" "}
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="number"
                placeholder="Leave Deduct"
                required
                value={LeaveDeductData}
                onChange={onLeaveDeductDataChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              PF Deduct
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="number"
                placeholder=" PF Deduct"
                required
                value={PFDeductData}
                onChange={onPFDeductDataChange}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Bank Name
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="text"
                placeholder="Bank Name"
                required
                value={BankNameData}
                onChange={onBankNameDataChange}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Account No
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="text"
                placeholder="Account No"
                required
                value={AccountNoData}
                onChange={onAccountNoDataChange}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Re-Enter Account No
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="text"
                placeholder="Re-Enter Account No"
                required
                value={ReAccountNoData}
                onChange={onReAccountNoDataChange}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Account Holder Name
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="text"
                placeholder="Account Holder Name"
                required
                value={AccountHolderNameData}
                onChange={onAccountHolderNameDataChange}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              IFSC Code
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="text"
                placeholder="IFSC Code"
                required
                value={IFSCcodeData}
                onChange={onIFSCcodeDataChange}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Tax Deduction
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="number"
                placeholder="Basic Salary"
                required
                value={TaxDeductionData}
                onChange={onTaxDeductionDataChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label column sm={6}>
              Total Salary
            </label>
            <div>
              <Form.Control
                className="rounded-0"
                type="number"
                placeholder=" Total Salary"
                required
                value={totalSalaryData}
                onChange={ontotalSalaryDataChange}
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
            <button
              className="btn btn-danger"
              type="reset"
              onClick={props.onFormEditClose}
            >
              cancel
            </button>
          </div>
          <div
            className="col-12 col-md-6 col-lg-4"
            id="form-cancel-button"
          ></div>
        </div>
      </Form>
    </div>
  );
};

export default SalaryFormEdit;
