import React, { useState } from "react";
import axios from "axios";
import FamilyInfoTable from "./FamilyInfoTable.jsx";
import FamilyInfoForm from "./FamilyInfoForm.jsx";
import FamilyInfoFormEdit from "./FamilyInfoFormEdit.jsx";
import BASE_URL from "../../../Pages/config/config.js";

const FamilyInfo = (props) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  const handleFamilyInfoSubmit = (event) => {
    event.preventDefault();
    console.log("id", event.target[0].value, event.target[1].value);
    setTable(true);

    let body = {
      Name: event.target[0].value,
      Relationship: event.target[1].value,
      DOB: event.target[2].value,
      Occupation: event.target[3].value
      // parentMobile: event.target[4].value
    };

    axios
      .post(`${BASE_URL}/api/family-info/` + props.data["_id"], body, {
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
  };

  const handleAddFamilyInfo = () => {
    console.log("clicked1");
    setTable(false);
  };

  const handleEditFamilyInfo = (e) => {
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

  const handleFamilyInfoEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();
    console.log("zero data", newInfo.target[0].value);
    let body = {
      Name: newInfo.target[0].value,
      Relationship: newInfo.target[1].value,
      DOB: newInfo.target[2].value,
      Occupation: newInfo.target[3].value
      // parentMobile: newInfo.target[4].value
    };

    console.log("update", body);

    axios
      .put(`${BASE_URL}/api/family-info/` + info["_id"], body, {
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
    <>
      {table ? (
        editForm ? (
          <FamilyInfoFormEdit
            onFamilyInfoEditUpdate={handleFamilyInfoEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <FamilyInfoTable
            onAddFamilyInfo={handleAddFamilyInfo}
            onEditFamilyInfo={handleEditFamilyInfo}
            data={props.data}
            back={props.back}
          />
        )
      ) : (
        <FamilyInfoForm
          onFamilyInfoSubmit={handleFamilyInfoSubmit}
          onFormClose={handleFormClose}
          onGenderChange={handleAddFormGenderChange}
        />
      )}
    </>
  );
};

export default FamilyInfo;
