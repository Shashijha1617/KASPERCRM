import React, { useState } from "react";
import "./LeaveApplicationHR.css";
import axios from "axios";
import LeaveApplicationHRTable from "./LeaveApplicationHRTablecopy.jsx";
import LeaveApplicationHRFormEdit from "./LeaveApplicationHRFormEditcopy.jsx";

const LeaveApplicationHR = (props) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  const handleLeaveApplicationHRSubmit = (event) => {
    event.preventDefault();
    console.log("id", event.target[0].value, event.target[1].value);
    setTable(true);

    let body = {
      Leavetype: event.target[0].value,
      FromDate: event.target[1].value,
      ToDate: event.target[2].value,
      Status: event.target[3].value,
      Reasonforleave: event.target[4].value,
    };
    axios
      .post(`${BASE_URL}/api/leave-application-hr/` + props.data["_id"], body, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((res) => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddLeaveApplicationHR = () => {
    console.log("clicked1");
    setTable(false);
  };

  const handleEditLeaveApplicationHR = (e) => {
    console.log(e);
    console.log("clicked6");
    setEditForm(true);
    setEditData(e);
    // Assuming setEditFormGender is not used in the rest of your component
    // setEditFormGender(e["Gender"]);
  };

  const handleFormClose = () => {
    console.log("clicked1");
    setTable(true);
  };

  const handleEditFormClose = () => {
    console.log("clicked5");
    setEditForm(false);
  };

  const handleLeaveApplicationHREditUpdate = (info, newInfo) => {
    newInfo.preventDefault();
    console.log("zero data", newInfo.target[0].value);
    let body = {
      Status: newInfo.target[3].value,
    };
    console.log("update", body);
    axios
      .put(`${BASE_URL}/api/leave-application-hr/` + info["_id"], body, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
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

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <LeaveApplicationHRFormEdit
            onLeaveApplicationHREditUpdate={handleLeaveApplicationHREditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <LeaveApplicationHRTable
            onAddLeaveApplicationHR={handleAddLeaveApplicationHR}
            onEditLeaveApplicationHR={handleEditLeaveApplicationHR}
            data={props.data}
          />
        )
      ) : (
        <div></div>
        // Uncomment the following code if needed
        // <LeaveApplicationHRForm
        //   onLeaveApplicationHRSubmit={handleLeaveApplicationHRSubmit}
        //   onFormClose={handleFormClose}
        //   onGenderChange={handleAddFormGenderChange}
        // />
      )}
    </React.Fragment>
  );
};

export default LeaveApplicationHR;
