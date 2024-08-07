import React, { useState, useContext, useEffect } from "react";
import "./LeaveApplicationEmp.css";
import axios from "axios";
import LeaveApplicationEmpTable from "./LeaveApplicationEmpTable.jsx";
import LeaveApplicationEmpForm from "./LeaveApplicationEmpForm.jsx";
import LeaveApplicationEmpFormEdit from "./LeaveApplicationEmpFormEdit.jsx";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import { v4 as uuid } from "uuid";
import BASE_URL from "../../../Pages/config/config";

const LeaveApplicationEmp = (props) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});
  const [leaveRequestDone, setLeaveRequestDone] = useState(false);
  const [empData, setEmpData] = useState(null);
  const email = localStorage.getItem("Email");
  const name = localStorage.getItem("Name");
  const id = localStorage.getItem("_id");
  const { socket } = useContext(AttendanceContext);
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
  useEffect(() => {
    loadEmployeeData();
  }, []);
  const handleLeaveApplicationEmpSubmit = (event) => {
    console.log("hello");
    event.preventDefault();
    console.log("id", event.target[0].value, event.target[1].value);
    // setTable(true);
    let body = {
      Leavetype: event.target[0].value,
      FromDate: event.target[2].value,
      ToDate: event.target[3].value,
      Status: 1,
      managerEmail: event.target[4].value,
      hrEmail: event.target[5].value,
      aditionalManager: event.target[6].value,
      Reasonforleave: event.target[7].value,
      email
    };
    console.log(body);
    axios
      .post(
        `${BASE_URL}/api/leave-application-emp/` + props.data["_id"],
        body,
        {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        }
      )
      .then((res) => {
        setTable(false);
        setTable(true);
        setLeaveRequestDone(!leaveRequestDone);
        const taskId = uuid();
        if (empData.profile) {
          const data = {
            taskId,
            managerEmail: body.managerEmail,
            hrEmail: body.hrEmail,
            message: `Leave request`,
            messageBy: name,
            aditionalManager: body.aditionalManager,
            profile: empData.profile.image_url,
            status: "unseen",
            path: "leaveApplication"
          };
          socket.emit("leaveNotification", data);
        } else {
          const data = {
            taskId,

            message: `Leave request`,
            messageBy: name,
            aditionalManager: body.aditionalManager,
            managerEmail: body.managerEmail,
            hrEmail: body.hrEmail,

            profile: null,
            status: "unseen",
            path: "leaveApplication"
          };
          socket.emit("leaveNotification", data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddLeaveApplicationEmp = () => {
    console.log("clicked1");
    setTable(false);
  };

  const handleEditLeaveApplicationEmp = (e) => {
    console.log(e);
    console.log("clicked6");
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    console.log("clicked1");
    setTable(true);
  };

  const handleEditFormClose = () => {
    console.log("clicked5");
    setEditForm(false);
  };

  const handleLeaveApplicationEmpEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();
    console.log("zero data", newInfo.target[0].value);
    let body = {
      Leavetype: newInfo.target[0].value,
      FromDate: newInfo.target[1].value,
      ToDate: newInfo.target[2].value,
      Status: newInfo.target[3].value,
      managerEmail: newInfo.target[4].value,
      hrEmail: newInfo.target[5].value,
      Reasonforleave: newInfo.target[6].value
    };

    console.log("update", body);

    axios
      .put(`${BASE_URL}/api/leave-application-emp/` + info["_id"], body, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((res) => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        console.log(err);
      });

    setEditForm(false);
  };
  const handleAddFormGenderChange = () => {};

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <LeaveApplicationEmpFormEdit
            onLeaveApplicationEmpEditUpdate={
              handleLeaveApplicationEmpEditUpdate
            }
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <LeaveApplicationEmpTable
            onAddLeaveApplicationEmp={handleAddLeaveApplicationEmp}
            onEditLeaveApplicationEmp={handleEditLeaveApplicationEmp}
            data={props.data}
            leaveRequestDone={leaveRequestDone}
          />
        )
      ) : (
        <LeaveApplicationEmpForm
          onLeaveApplicationEmpSubmit={handleLeaveApplicationEmpSubmit}
          onFormClose={handleFormClose}
          onGenderChange={handleAddFormGenderChange}
        />
      )}
    </React.Fragment>
  );
};

export default LeaveApplicationEmp;
