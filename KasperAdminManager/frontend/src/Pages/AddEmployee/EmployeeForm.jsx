import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Col } from "react-bootstrap";
import { TbUsersPlus } from "react-icons/tb";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { MdOutlineCancel, MdOutlineDoneAll } from "react-icons/md";

const EmployeeForm = (props) => {
  const [roleData, setRoleData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [filterManagerData, setFilterManagerData] = useState([]);
  const [filterHrData, setFilterHrData] = useState([]);
  const { darkMode } = useTheme();
  useEffect(() => {
    loadRoleInfo();
    loadPositionInfo();
    loadDepartmentInfo();
    loadEmployeeData();
  }, []);
  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/employee`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRowData([]);
          response.data.forEach((data) => {
            let temp = {
              Email: data["Email"],
              Account:
                data["Account"] === 1
                  ? 1
                  : data["Account"] === 2
                  ? 2
                  : data["Account"] === 3
                  ? 3
                  : data["Account"] === 4
                  ? 4
                  : "",
              FirstName: data["FirstName"],
              LastName: data["LastName"],
              empID: data["empID"],
            };

            // Use set function to update state
            setRowData((prevData) => [...prevData, temp]);
          });
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadRoleInfo = () => {
    axios
      .get(`${BASE_URL}/api/role`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setRoleData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadPositionInfo = () => {
    axios
      .get(`${BASE_URL}/api/position`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setPositionData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadDepartmentInfo = () => {
    axios
      .get(`${BASE_URL}/api/department`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setDepartmentData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const managerFilterHandler = (value) => {
    console.log(value);
    if (+value === 2 || +value === 4 || +value === 1) {
      const data = rowData.filter((val) => {
        return +val.Account === 1;
      });

      setFilterManagerData(data);
    } else if (+value === 3) {
      const data = rowData.filter((val) => {
        return +val.Account === 4;
      });

      setFilterManagerData(data);
    }
    const hrData = rowData.filter((val) => {
      return val.Account === 2;
    });
    setFilterHrData(hrData);
  };
  console.log(filterHrData);
  return (
    <div className="container-fluid py-3">
      <div className="my-auto">
        <h5
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "600",
          }}
          className="m-0"
        >
          Create New Employee
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="m-0"
        >
          You can create new user here.
        </p>
      </div>

      <div className="container-fluid">
        <form
          onSubmit={props.onEmployeeSubmit}
          className=" row mt-3 m-0"
          encType="multipart/form-data"
        >
          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Email
            </label>
            <div className="form-input">
              <input
                className="form-control rounded-0"
                type="email"
                placeholder="Email"
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Password
            </label>
            <div className="form-input">
              <input
                className="form-control rounded-0"
                type="password"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Account access
            </label>
            <div className="form-input">
              <select
                className="form-select rounded-0"
                as="select"
                onBlur={(e) => managerFilterHandler(e.target.value)}
              >
                <option value="1">Admin</option>
                <option value="2">HR</option>
                <option value="3">Employee</option>
                <option value="4">Manager</option>
              </select>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Role
            </label>
            <div className="form-input">
              <select className="form-select rounded-0" as="select" name="role">
                <option disabled selected>
                  Select your option
                </option>
                {roleData.map((data, index) => (
                  <option key={index} value={data["_id"]}>
                    {data["RoleName"]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Gender
            </label>
            <div className="d-flex align-items-center gap-2">
              <Form.Check
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}
                className="d-flex align-items-center gap-2"
                inline
                type="radio"
                label="Male"
                value="male"
                name="gender"
                onChange={props.onGenderChange}
              />
              <Form.Check
                inline
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}
                className="d-flex align-items-center gap-2"
                type="radio"
                label="Female"
                value="female"
                name="gender"
                onChange={props.onGenderChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              First Name
            </label>
            <div className="form-input">
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="First Name"
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Last Name
            </label>
            <div className="form-input">
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              DOB
            </label>
            <div className="form-input">
              <input
                className="form-control rounded-0"
                type="date"
                placeholder="DOB"
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Contact No
            </label>
            <div className="form-input">
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="Contact No "
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Department
            </label>
            <div className="form-input">
              <select
                className="form-select rounded-0"
                as="select"
                name="department"
              >
                <option value="" disabled selected>
                  Select your option
                </option>
                {departmentData.map((data, index) => (
                  <option key={index} value={data["_id"]}>
                    {data["DepartmentName"]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Position
            </label>
            <div className="form-input">
              <select
                className="form-select rounded-0"
                as="select"
                name="position"
              >
                <option value="" disabled selected>
                  Select your option
                </option>
                {positionData.map((data, index) => (
                  <option key={index} value={data["_id"]}>
                    {data["PositionName"]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Date Of Joining
            </label>
            <div className="form-input">
              <input
                className="form-control rounded-0"
                type="date"
                placeholder="Date Of Joining"
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Profile Image
            </label>
            <div className="form-input">
              <input className="form-control rounded-0" type="file" />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Reporting Manager
            </label>
            <div className="form-input">
              <select className="form-select rounded-0" as="select" name="role">
                <option selected>Select your option</option>
                {filterManagerData.map((data, index) => (
                  <option key={index} value={data["Email"]}>
                    {data["Email"]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
            >
              Reporting Hr
            </label>
            <div className="form-input">
              <select className="form-select rounded-0" as="select" name="role">
                <option selected>Select your option</option>
                {filterHrData.map((data, index) => (
                  <option key={index} value={data.Email}>
                    {data.Email}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            className="form-group col-12 d-flex  gap-5"
            id="form-submit-button"
          >
            <button
              className="btn btn-primary"
              style={{
                backgroundColor: "var(--primaryDashColorDark)",
                color: "var(--primaryDashMenuColor)",
                border: "none",
                outline: "none",
              }}
              type="submit"
            >
              <MdOutlineDoneAll /> Submit
            </button>
            <button
              className="btn btn-danger"
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                outline: "none",
              }}
              type="reset"
              onClick={props.onFormClose}
            >
              <MdOutlineCancel /> cancel
            </button>
          </div>
          <div
            className="col-12 col-md-6 col-lg-4"
            id="form-cancel-button"
          ></div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
