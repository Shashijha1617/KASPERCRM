import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Col } from "react-bootstrap";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const SalaryFormEdit = (props) => {
  const [salaryData, setSalaryData] = useState([]);
  const { darkMode } = useTheme();

  const initialSalary = props.editData.salary[0];
  const [formData, setFormData] = useState({
    BasicSalary: initialSalary.BasicSalary,
    BankName: initialSalary.BankName,
    AccountNo: initialSalary.AccountNo,
    ReAccountNo: initialSalary.AccountNo,
    AccountHolderName: initialSalary.AccountHolderName,
    IFSCcode: initialSalary.IFSCcode,
    TaxDeduction: initialSalary.TaxDeduction,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
    <div className="container-fluid py-3">
      <div className="my-auto px-3 mb-2">
        <h5
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "600",
          }}
          className="m-0"
        >
          Edit Salary Details
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="m-0"
        >
          You can edit employee salary here.
        </p>
      </div>
      <Form onSubmit={(e) => props.onSalaryEditUpdate(props.editData, e)}>
        <div className="row row-gap-3 p-3">
          <Form.Group as={Col} md="6" controlId="selectSalary">
            <Form.Label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Select Salary
            </Form.Label>
            <Form.Control className="rounded-0" as="select" required disabled>
              {salaryData.map((data, index) => (
                <option
                  key={index}
                  value={data._id}
                  selected={props.editData._id === data._id}
                  disabled
                >
                  {`${data.FirstName} ${data.LastName}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {[
            { label: "Basic Salary", name: "BasicSalary", type: "number" },
            { label: "Bank Name", name: "BankName", type: "text" },
            { label: "Account No", name: "AccountNo", type: "text" },
            { label: "Re-Enter Account No", name: "ReAccountNo", type: "text" },
            {
              label: "Account Holder Name",
              name: "AccountHolderName",
              type: "text",
            },
            { label: "IFSC Code", name: "IFSCcode", type: "text" },
            { label: "Tax Deduction", name: "TaxDeduction", type: "number" },
          ].map((field, index) => (
            <Form.Group as={Col} md="6" controlId={field.name} key={index}>
              <Form.Label
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}
              >
                {field.label}
              </Form.Label>
              <Form.Control
                type={field.type}
                placeholder={field.label}
                name={field.name}
                className="rounded-0"
                required
                value={formData[field.name]}
                onChange={handleInputChange}
              />
            </Form.Group>
          ))}

          <div
            className="form-group col-12 d-flex gap-5"
            id="form-submit-button"
          >
            <Button className="btn-primary" type="submit">
              Submit
            </Button>
            <Button
              className="btn-danger"
              type="button"
              onClick={props.onFormClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SalaryFormEdit;
