import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Col } from "react-bootstrap";
import "./EmployeeFormEdit.css";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { MdOutlineCancel, MdOutlineDoneAll } from "react-icons/md";

const EmployeeFormEdit = (props) => {
  const [roleData, setRoleData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const { darkMode } = useTheme();
  const [filterManagerData, setFilterManagerData] = useState([
    { Email: props.editData["reportManager"] },
  ]);
  const [filterHrData, setFilterHrData] = useState([
    {
      Email: props.editData["reportHr"],
    },
  ]);
  const [rowData, setRowData] = useState([]);

  const [genderData, setGenderData] = useState(props.editData["Gender"]);
  const [status, setStatus] = useState(props.editData["status"]);
  const [emailData, setEmailData] = useState(props.editData["Email"]);
  const [firstNameData, setFirstNameData] = useState(
    props.editData["FirstName"]
  );
  // const [middleNameData, setMiddleNameData] = useState(
  //   props.editData["MiddleName"]
  // );
  const [lastNameData, setLastNameData] = useState(props.editData["LastName"]);
  const [dobData, setDobData] = useState(props.editData["DOB"].slice(0, 10));
  const [contactNoData, setContactNoData] = useState(
    props.editData["ContactNo"]
  );
  const [profile, setProfile] = useState(props.editData["profile"]);
  const [employeeCodeData, setEmployeeCodeData] = useState(
    props.editData["EmployeeCode"]
  );
  const [dateOfJoiningData, setDateOfJoiningData] = useState(
    props.editData["DateOfJoining"].slice(0, 10)
  );
  const [reportManager, setreportManagerData] = useState([
    props.editData["reportManager"],
  ]);
  const [reportHr, setreportHrData] = useState([props.editData["reportHr"]]);
  console.log(reportManager);
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
    if (+value === 2 || +value === 4 || +value === 1) {
      const data = rowData.filter((val) => {
        return +val.Account === 1 && props.editData.Email !== val.Email;
      });
      console.log(data);
      setFilterManagerData(data);
    } else if (+value === 3) {
      const data = rowData.filter((val) => {
        return +val.Account === 4 && props.editData.Email !== val.Email;
      });
      console.log(data);

      setFilterManagerData(data);
    }
    const hrData = rowData.filter((val) => {
      return val.Account === 2 && props.editData.Email !== val.Email;
    });
    console.log(hrData);

    setFilterHrData(hrData);
  };
  console.log(filterHrData);

  const onEmailDataChange = (e) => {
    setEmailData(e.target.value);
  };

  const onFirstNameDataChange = (e) => {
    setFirstNameData(e.target.value);
  };

  // const onMiddleNameDataChange = (e) => {
  //   setMiddleNameData(e.target.value);
  // };

  const onLastNameDataChange = (e) => {
    setLastNameData(e.target.value);
  };

  const onContactNoDataChange = (e) => {
    setContactNoData(e.target.value);
  };

  const onEmployeeCodeDataChange = (e) => {
    setEmployeeCodeData(e.target.value);
  };

  const onGenderChange = (e) => {
    setGenderData(e.target.value);
    props.onGenderChange(e);
  };

  const onDOBDataChange = (e) => {
    setDobData(e.target.value);
  };

  const onDateOfJoiningDataChange = (e) => {
    setDateOfJoiningData(e.target.value);
  };
  const onreportManagerChange = (e) => {
    setreportManagerData(e.target.value);
  };
  const onreportHrChange = (e) => {
    setreportHrData(e.target.value);
  };

  const onProfileDataChange = (e) => {
    setProfile(e.target.files[0]);
  };

  const onFormSubmit = (e) => {
    props.onEmployeeEditUpdate(props.editData, e);
  };

  const onFormClose = () => {
    props.onFormEditClose();
  };
  const onStatusChange = (e) => {
    console.log(e.target.value);
    setStatus(e.target.value);
    props.onStatusChange(e);
  };
  console.log(roleData);

  const DarkandLightColor = {
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
  };

  return (
    <div className="container-fluid py-3">
      <div className="my-auto">
        <h5 style={DarkandLightColor} className="m-0 fw-bold">
          Edit Employee Details
        </h5>
        <p style={DarkandLightColor} className="m-0">
          You can edit user details here.
        </p>
      </div>
      <Form
        className="mt-3"
        onSubmit={(e) => props.onEmployeeEditUpdate(props.editData, e)}
      >
        <div className="d-flex w-100 flex-column gap-2 rounded ">
          <div className="row row-gap-3 ">
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Email</label>
              <div className="form-input">
                <input
                  className="form-control rounded-0"
                  type="email"
                  placeholder="Email"
                  required
                  value={emailData}
                  disabled
                  onChange={(value) => onEmailDataChange(value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Account access</label>
              <div className="form-input">
                <select
                  className="form-select rounded-0"
                  as="select"
                  required
                  onBlur={(e) => managerFilterHandler(e.target.value)}
                >
                  <option value="1" selected={props.editData["Account"] == 1}>
                    Admin
                  </option>
                  <option value="2" selected={props.editData["Account"] == 2}>
                    HR
                  </option>
                  <option value="3" selected={props.editData["Account"] == 3}>
                    Employee
                  </option>
                  <option value="4" selected={props.editData["Account"] == 4}>
                    Manager
                  </option>
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Role</label>
              <div className="form-input">
                <select className="form-select rounded-0" name="role">
                  <option disabled selected>
                    Select your option
                  </option>
                  {roleData.map((data, index) => (
                    <option
                      key={index}
                      value={data["_id"]}
                      selected={props.editData["role"][0]["_id"] == data["_id"]}
                    >
                      {data["RoleName"]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Gender</label>
              <div className="d-flex align-items-center gap-2">
                <Form.Check
                  style={DarkandLightColor}
                  className="d-flex align-items-center gap-2"
                  inline
                  type="radio"
                  label="Male"
                  value="male"
                  name="gender"
                  onChange={onGenderChange}
                  checked={genderData == "male"}
                  required
                />
                <Form.Check
                  style={DarkandLightColor}
                  className="d-flex align-items-center gap-2"
                  inline
                  type="radio"
                  label="Female"
                  value="female"
                  name="gender"
                  onChange={onGenderChange}
                  checked={genderData == "female"}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>First Name</label>
              <div className="form-input">
                <input
                  className="form-control rounded-0"
                  type="text"
                  placeholder="First Name"
                  required
                  value={firstNameData}
                  onChange={(value) => onFirstNameDataChange(value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Last Name</label>
              <div className="form-input">
                <input
                  className="form-control rounded-0"
                  type="text"
                  placeholder="Last Name"
                  required
                  value={lastNameData}
                  onChange={(value) => onLastNameDataChange(value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>DOB</label>
              <div className="form-input">
                <input
                  className="form-control rounded-0"
                  type="date"
                  placeholder="DOB"
                  required
                  //   value={this.props.editData["DOB"].slice(0, 10)}
                  value={dobData}
                  onChange={(value) => onDOBDataChange(value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Contact No</label>
              <div className="form-input">
                <input
                  className="form-control rounded-0"
                  type="text"
                  placeholder="Contact No "
                  required
                  maxLength={10}
                  min={0}
                  value={contactNoData}
                  onChange={(value) => onContactNoDataChange(value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Department</label>
              <div className="form-input">
                <select
                  className="form-select rounded-0"
                  name="department"
                  required
                >
                  <option value="" disabled selected>
                    Select your option
                  </option>
                  {departmentData.map((data, index) => (
                    <option
                      key={index}
                      value={data["_id"]}
                      selected={
                        props.editData["department"][0]["_id"] == data["_id"]
                      }
                    >
                      {data["DepartmentName"]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Position</label>
              <div className="form-input">
                <select
                  className="form-select rounded-0"
                  name="position"
                  required
                >
                  <option value="" disabled selected>
                    Select your option
                  </option>
                  {positionData.map((data, index) => (
                    <option
                      key={index}
                      value={data["_id"]}
                      selected={
                        props.editData["position"][0]["_id"] == data["_id"]
                      }
                    >
                      {data["PositionName"]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Date Of Joining</label>
              <div className="form-input">
                <input
                  className="form-control rounded-0"
                  type="date"
                  placeholder="Date Of Joining"
                  required
                  // value={this.props.editData["DateOfJoining"].slice(0, 10)}
                  value={dateOfJoiningData}
                  onChange={(value) => onDateOfJoiningDataChange(value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Profile Image</label>
              <div className="form-input">
                <input
                  className="form-control rounded-0"
                  type="file"
                  //  value={profile}
                  //  onChange={(value) => onProfileDataChange(value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Reporting Manager</label>
              <div className="form-input">
                <select className="form-select rounded-0" name="manager">
                  <option disabled selected>
                    Select your option
                  </option>

                  {filterManagerData.map((data, index) => (
                    <option
                      key={index}
                      value={data["Email"]}
                      selected={props.editData["reportManager"]}
                    >
                      {data["Email"]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Reporting Hr</label>
              <div className="form-input">
                <select className="form-select rounded-0" name="hr">
                  <option disabled selected>
                    Select your option
                  </option>
                  {filterHrData.map((data, index) => (
                    <option
                      key={index}
                      value={data["Email"]}
                      selected={props.editData["reportHr"]}
                    >
                      {data["Email"]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label style={DarkandLightColor}>Status</label>
              <div className="d-flex align-items-center gap-2">
                <Form.Check
                  style={DarkandLightColor}
                  className="d-flex align-items-center gap-2"
                  inline
                  type="radio"
                  label="active"
                  value="active"
                  name="status"
                  onChange={onStatusChange}
                  checked={status == "active"}
                  required
                />
                <Form.Check
                  style={DarkandLightColor}
                  className="d-flex align-items-center gap-2"
                  inline
                  type="radio"
                  label="Inactive"
                  value="Inactive"
                  name="status"
                  onChange={onStatusChange}
                  checked={status == "Inactive"}
                  required
                />
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-primary" type="submit">
                <MdOutlineDoneAll /> Submit
              </button>
              <button
                className="btn btn-danger"
                type="reset"
                onClick={onFormClose}
              >
                <MdOutlineCancel /> cancel
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EmployeeFormEdit;
