import React, { useState } from "react";
import "./AdminProjectBid.css";
import axios from "axios";
import AdminProjectBidTable from "./AdminProjectBidTable.jsx";
import AdminProjectBidForm from "./AdminProjectBidForm.jsx";
import AdminProjectBidFormEdit from "./AdminProjectBidFormEdit.jsx";
import BASE_URL from "../../Pages/config/config.js";

const AdminProjectBid = () => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  const handleProjectBidSubmit = (event) => {
    event.preventDefault();
    console.log("id", event.target[0].value, event.target[1].value);
    setTable(true);

    let body = {
      ProjectTitle: event.target[0].value,
      ProjectURL: event.target[1].value,
      ProjectDesc: event.target[2].value,
      Portal_ID: event.target[3].value,
      EstimatedTime: event.target[4].value,
      EstimatedCost: event.target[5].value,
      ResourceID: event.target[6].value,
      Status: event.target[7].value,
      Remark: event.target[8].value,
    };

    axios
      .post(`${BASE_URL}/api/admin/project-bid`, body, {
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

  const handleAddProjectBid = () => {
    console.log("clicked1");
    setTable(false);
  };

  const handleEditProjectBid = (e) => {
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

  const handleProjectBidEditUpdate = (info, editInfo) => {
    let body = {
      ProjectTitle: editInfo.target[0].value,
      ProjectURL: editInfo.target[1].value,
      ProjectDesc: editInfo.target[2].value,
      Portal_ID: editInfo.target[3].value,
      EstimatedTime: editInfo.target[4].value,
      EstimatedCost: editInfo.target[5].value,
      ResourceID: editInfo.target[6].value,
      Status: editInfo.target[7].value,
      Remark: editInfo.target[8].value,
    };
    console.log("update", body);
    axios
      .put(`${BASE_URL}/api/admin/project-bid/` + info["_id"], body, {
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
          <AdminProjectBidFormEdit
            onProjectBidEditUpdate={handleProjectBidEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <AdminProjectBidTable
            onAddProjectBid={handleAddProjectBid}
            onEditProjectBid={handleEditProjectBid}
          />
        )
      ) : (
        <AdminProjectBidForm
          onProjectBidSubmit={handleProjectBidSubmit}
          onFormClose={handleFormClose}
        />
      )}
    </React.Fragment>
  );
};

export default AdminProjectBid;
