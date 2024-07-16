import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Col } from "react-bootstrap";
import { TbUsersPlus } from "react-icons/tb";
import BASE_URL from "../config/config";

const EmployeeForm = (props) => {
  const [roleData, setRoleData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [filterManagerData, setFilterManagerData] = useState([]);
  const [filterHrData, setFilterHrData] = useState([]);
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
          authorization: localStorage.getItem("token") || ""
        }
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
              empID: data["empID"]
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
          authorization: localStorage.getItem("token") || ""
        }
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
          authorization: localStorage.getItem("token") || ""
        }
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
          authorization: localStorage.getItem("token") || ""
        }
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
    <div className="container-fluid">
      <h4
        style={{ position: "sticky", top: "-.5rem", zIndex: "5" }}
        className="text-muted d-flex gap-2 align-items-center bg-light py-3 text-capitalize fw-bold"
      >
        <TbUsersPlus />
        Create New Employee
      </h4>
      <div className="row">
        <div className="col-4"></div>
        <div className="col-8">
          {" "}
          <Form
            id="form"
            onSubmit={props.onEmployeeSubmit}
            className=" d-flex flex-column p-2 mb-5 rounded shadow-sm "
            encType="multipart/form-data"
          >
            <div
              style={{ letterSpacing: ".1rem" }}
              className="d-flex w-100 fw-bold text-muted flex-column rounded "
            >
              <div className="row row-gap-1 ">
                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Email
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control type="email" placeholder="Email" />
                  </Col>
                </div>

                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Password
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control type="password" placeholder="Password" />
                  </Col>
                </div>

                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Account access
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control
                      as="select"
                      onBlur={(e) => managerFilterHandler(e.target.value)}
                    >
                      <option value="1">Admin</option>
                      <option value="2">HR</option>
                      <option value="3">Employee</option>
                      <option value="4">Manager</option>
                    </Form.Control>
                  </Col>
                </div>

                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Role
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control as="select" name="role">
                      <option disabled selected>
                        Select your option
                      </option>
                      {roleData.map((data, index) => (
                        <option key={index} value={data["_id"]}>
                          {data["RoleName"]}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </div>
                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label as="legend" column sm={12}>
                    Gender
                  </Form.Label>
                  <Col className="my-1" sm={12}>
                    <Form.Check
                      inline
                      type="radio"
                      label="Male"
                      value="male"
                      name="gender"
                      onChange={props.onGenderChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Female"
                      value="female"
                      name="gender"
                      onChange={props.onGenderChange}
                    />
                  </Col>
                </div>
                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    First Name
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control type="text" placeholder="First Name" />
                  </Col>
                </div>
                {/* <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Middle Name
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control type="text" placeholder="Middle Name" />
                  </Col>
                </div> */}
                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Last Name
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control type="text" placeholder="Last Name" />
                  </Col>
                </div>
                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    DOB
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control type="date" placeholder="DOB" />
                  </Col>
                </div>
                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Contact No
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control type="text" placeholder="Contact No " />
                  </Col>
                </div>
                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Department
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control as="select" name="department">
                      <option value="" disabled selected>
                        Select your option
                      </option>
                      {departmentData.map((data, index) => (
                        <option key={index} value={data["_id"]}>
                          {data["DepartmentName"]}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </div>
                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Position
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control as="select" name="position">
                      <option value="" disabled selected>
                        Select your option
                      </option>
                      {positionData.map((data, index) => (
                        <option key={index} value={data["_id"]}>
                          {data["PositionName"]}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </div>
                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Date Of Joining
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control type="date" placeholder="Date Of Joining" />
                  </Col>
                </div>
                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Profile Image
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control type="file" />
                  </Col>
                </div>

                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Reporting Manager
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control as="select" name="role">
                      <option selected>Select your option</option>
                      {filterManagerData.map((data, index) => (
                        <option key={index} value={data["Email"]}>
                          {data["Email"]}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </div>
                <div className="form-group col-12 col-md-6 p-0">
                  <Form.Label column sm={12}>
                    Reporting Hr
                  </Form.Label>
                  <Col sm={12} className="form-input">
                    <Form.Control as="select" name="role">
                      <option selected>Select your option</option>
                      {filterHrData.map((data, index) => (
                        <option key={index} value={data.Email}>
                          {data.Email}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </div>
                <div
                  className="form-group col-12 d-flex  gap-5"
                  id="form-submit-button"
                >
                  <Button
                    className="mx-2 px-5 rounded-5 fw-bold"
                    style={{
                      backgroundColor: "var(--primaryDashColorDark)",
                      color: "var(--primaryDashMenuColor)",
                      border: "none",
                      outline: "none"
                    }}
                    type="submit"
                  >
                    Submit
                  </Button>
                  <button
                    className="mx-2 px-5 fw-bold rounded-5 "
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      outline: "none"
                    }}
                    type="reset"
                    onClick={props.onFormClose}
                  >
                    cancel
                  </button>
                </div>
                <div
                  className="form-group col-12 col-md-6 p-0"
                  id="form-cancel-button"
                ></div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>

    // <div className="registration-page py-4 ">
    //   <h2 className="text-center text-black text-uppercase fw-bold my-4">
    //     Add New Employee
    //   </h2>

    //   <Form
    //     id="form"
    //     onSubmit={props.onEmployeeSubmit}
    //     className="container d-flex flex-column m-10 empForm"
    //     encType="multipart/form-data"
    //   >
    //     <div className="d-flex w-100 flex-column gap-6 rounded ">
    //       <div style={{ padding: "80px" }} className="row row-gap-3 ">
    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Email
    //           </Form.Label>

    //           <Col sm={10} className="form-input">
    //             <Form.Control type="email" placeholder="Email" />
    //           </Col>
    //         </div>

    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Password
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control type="password" placeholder="Password" />
    //           </Col>
    //         </div>

    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Account access
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control
    //               as="select"
    //               onBlur={(e) => managerFilterHandler(e.target.value)}
    //             >
    //               <option value="1">Admin</option>
    //               <option value="2">HR</option>
    //               <option value="3">Employee</option>
    //               <option value="4">Manager</option>
    //             </Form.Control>
    //           </Col>
    //         </div>

    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Role
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control as="select" name="role">
    //               <option disabled selected>
    //                 Select your option
    //               </option>
    //               {roleData.map((data, index) => (
    //                 <option key={index} value={data["_id"]}>
    //                   {data["RoleName"]}
    //                 </option>
    //               ))}
    //             </Form.Control>
    //           </Col>
    //         </div>
    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label as="legend" column sm={6}>
    //             Gender
    //           </Form.Label>
    //           <Col sm={10}>
    //             <Form.Check
    //               inline
    //               type="radio"
    //               label="Male"
    //               value="male"
    //               name="gender"
    //               onChange={props.onGenderChange}
    //             />
    //             <Form.Check
    //               inline
    //               type="radio"
    //               label="Female"
    //               value="female"
    //               name="gender"
    //               onChange={props.onGenderChange}
    //             />
    //           </Col>
    //         </div>
    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             First Name
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control type="text" placeholder="First Name" />
    //           </Col>
    //         </div>
    //         {/* <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Middle Name
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control type="text" placeholder="Middle Name" />
    //           </Col>
    //         </div> */}
    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Last Name
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control type="text" placeholder="Last Name" />
    //           </Col>
    //         </div>
    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             DOB
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control type="date" placeholder="DOB" />
    //           </Col>
    //         </div>
    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Contact No
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control type="text" placeholder="Contact No " />
    //           </Col>
    //         </div>
    //         {/* <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Employee Code
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control
    //               type="text"
    //               placeholder="Employee Code"

    //             />
    //           </Col>
    //         </div> */}
    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Department
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control as="select" name="department">
    //               <option value="" disabled selected>
    //                 Select your option
    //               </option>
    //               {departmentData.map((data, index) => (
    //                 <option key={index} value={data["_id"]}>
    //                   {data["DepartmentName"]}
    //                 </option>
    //               ))}
    //             </Form.Control>
    //           </Col>
    //         </div>

    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Position
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control as="select" name="position">
    //               <option value="" disabled selected>
    //                 Select your option
    //               </option>
    //               {positionData.map((data, index) => (
    //                 <option key={index} value={data["_id"]}>
    //                   {data["PositionName"]}
    //                 </option>
    //               ))}
    //             </Form.Control>
    //           </Col>
    //         </div>
    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Date Of Joining
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control type="date" placeholder="Date Of Joining" />
    //           </Col>
    //         </div>

    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Profile Image
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control type="file" />
    //           </Col>
    //         </div>
    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Reporting Manager
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control as="select" name="role">
    //               <option selected>Select your option</option>
    //               {filterManagerData.map((data, index) => (
    //                 <option key={index} value={data["Email"]}>
    //                   {data["Email"]}
    //                 </option>
    //               ))}
    //             </Form.Control>
    //           </Col>
    //         </div>
    //         <div className="form-group col-12 col-md-6">
    //           <Form.Label column sm={6}>
    //             Reporting Hr
    //           </Form.Label>
    //           <Col sm={10} className="form-input">
    //             <Form.Control as="select" name="role">
    //               <option selected>Select your option</option>
    //               {filterHrData.map((data, index) => (
    //                 <option key={index} value={data.Email}>
    //                   {data.Email}
    //                 </option>
    //               ))}
    //             </Form.Control>
    //           </Col>
    //         </div>

    //         {/* <div className="form-group col-12 col-md-6">
    //         <label>
    //           Terminate Date
    //         </label>
    //         <Col sm={10} className="form-input">
    //           <Form.Control
    //             type="date"
    //             placeholder="Terminate Date"
    //           />
    //         </Col>
    //       </div> */}

    //         <div
    //           className="form-group col-12 d-flex  gap-5"
    //           id="form-submit-button"
    //         >
    //           <Button className="mx-3" type="submit">
    //             Submit
    //           </Button>
    //           <Button className="mx-3" type="reset" onClick={props.onFormClose}>
    //             cancel
    //           </Button>
    //         </div>
    //         <div
    //           className="form-group col-12 col-md-6"
    //           id="form-cancel-button"
    //         ></div>
    //       </div>
    //     </div>
    //   </Form>
    // </div>
  );
};

export default EmployeeForm;
