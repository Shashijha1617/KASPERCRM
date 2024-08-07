import React, { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import axios from "axios";
import "./LeaveApplicationEmpForm.css";
import LeaveImg from "./Leave.svg";
import InnerDashContainer from "../../InnerDashContainer";
import BASE_URL from "../../../Pages/config/config";
import { useLocation } from "react-router-dom";
const LeaveApplicationEmpForm = (props) => {
  const id = localStorage.getItem("_id");
  const [empData, setEmpData] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: ""
  });
  const [leaveType, setLeaveType] = useState("");
  const [addManager, setAddManager] = useState("");
  const [leaveCount, setLeaveCount] = useState(null);
  const [aditionalManager, setAditionalManager] = useState([]);
  const email = localStorage.getItem("Email");
  const location = useLocation();

  const status = location.pathname.split("/")[1];

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        console.log(response.data);
        setEmpData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadManagersData = () => {
    axios
      .post(`${BASE_URL}/api/managersList`, { status, email })
      .then((response) => {
        console.log(response.data);
        setAditionalManager(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    axios
      .post(`${BASE_URL}/api/particularLeave`, {
        id
      })
      .then((response) => {
        console.log(response.data);
        setLeaveBalance(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    loadEmployeeData();
    loadManagersData();
  }, []);

  const handleInputChange = (e) => {
    setLeaveCount(leaveBalance[0][e.target.value]);
    setLeaveType(e.target.value);
  };

  function dateDifference(date1, date2) {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    if (secondDate < firstDate) {
      alert("please select proper date");
      return;
    }
    const differenceInTime = secondDate.getTime() - firstDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.abs(differenceInDays);
  }

  const differenceCalculator = (e) => {
    let requiredLeave = dateDifference(formData.startDate, e.target.value);

    if (requiredLeave === undefined) return;
    if (leaveCount < requiredLeave + 1) {
      alert("leave balance is low");
      return;
    }
    setFormData((prev) => ({ ...prev, endDate: e.target.value }));
  };

  const deductLeave = (e) => {
    e.preventDefault();
    let requiredLeave = dateDifference(formData.startDate, formData.endDate);
    if (requiredLeave === undefined) return;
    if (leaveCount < requiredLeave + 1) {
      alert("leave balance is low");
      return;
    }
    const totalLeaveRequired = requiredLeave + 1;
    axios
      .post(`${BASE_URL}/api/deductLeave`, {
        id,
        email,
        leaveType,
        totalLeaveRequired
      })
      .then((response) => {
        alert("leave applied");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(aditionalManager);
  return (
    <InnerDashContainer>
      {leaveBalance === null ? (
        <>
          <h1>No leave found</h1>
        </>
      ) : (
        <div style={{ overflow: "auto" }} className="row">
          <div className="col-5">
            <img style={{ width: "130%" }} src={LeaveImg} alt="" />
          </div>
          <div className="col-6">
            <form
              className="text-white shadow bg-dark px-3 py-4 rounded row"
              onSubmit={(e) => (
                deductLeave(e), props.onLeaveApplicationEmpSubmit(e)
              )}
            >
              <h4 className="fw-bolder text-white mb-5">
                Create Leave Request
              </h4>

              <div className="mb-3 col-12">
                <label htmlFor="leaveType" className="form-label">
                  Select Leave Type
                </label>
                <select
                  className="form-select"
                  id="leaveType"
                  name="leaveType"
                  value={leaveType}
                  onChange={handleInputChange}
                  required
                >
                  {empData.length > 0 && empData.Gender === "male" ? (
                    <>
                      <option value="" disabled selected>
                        -- Select --
                      </option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Paid Leave">Paid Leave</option>
                      <option value="Paternity Leave">Paternity Leave</option>
                    </>
                  ) : (
                    <>
                      <option value="" disabled selected>
                        -- Select --
                      </option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Paid Leave">Paid Leave</option>

                      <option value="Maternity Leave">Maternity Leave</option>
                    </>
                  )}
                </select>
              </div>
              <div className="mb-3 col-12">
                <label htmlFor="leaveType" className="form-label">
                  Available {leaveType}
                </label>
                <select
                  className="form-select"
                  id="leaveStatus"
                  name="leaveStatus"
                >
                  <option value="1" selected>
                    {leaveCount}
                  </option>
                </select>
              </div>
              <div className="mb-3 col-6">
                <label htmlFor="startDate" className="form-label">
                  Start Date:
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-3 col-6">
                <label htmlFor="endDate" className="form-label">
                  End Date:
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={differenceCalculator}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="manager" className="form-label">
                  Reporting Manager:
                </label>
                <input
                  className="form-control"
                  id="manager"
                  name="manager"
                  value={empData.reportManager}
                  // onChange={handleInputChange}
                  required
                  disabled
                  placeholder={empData.reportManager}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="hr" className="form-label">
                  Reporting Hr:
                </label>
                <input
                  className="form-control"
                  id="hr"
                  name="hr"
                  value={empData.reportHr}
                  // onChange={handleInputChange}
                  required
                  disabled
                  placeholder={empData.reportHr}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="manager" className="form-label">
                  Additional Manager:
                </label>
                <select
                  className="form-select"
                  id="leaveType"
                  name="leaveType"
                  value={addManager}
                  onChange={(e) => setAddManager(e.target.value)}
                >
                  <option value="" disabled selected>
                    -- Select --
                  </option>
                  {aditionalManager.map((val) => {
                    return <option value={val.Email}>{val.Email}</option>;
                  })}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="reason" className="form-label">
                  Reason:
                </label>
                <textarea
                  className="form-control"
                  id="reason"
                  name="reason"
                  // value={formData.reason}
                  // onChange={handleInputChange}
                  required
                  placeholder="Please mention the reason for leave"
                />
              </div>

              <div className="row mt-3 mx-1 justify-content-between">
                <button
                  type="submit"
                  className="btn btn-primary col-5"
                  // onClick={deductLeave}
                >
                  Submit
                </button>
                <button
                  type="reset"
                  className="btn btn-danger col-5"
                  onClick={props.onFormClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </InnerDashContainer>
  );
};

export default LeaveApplicationEmpForm;
