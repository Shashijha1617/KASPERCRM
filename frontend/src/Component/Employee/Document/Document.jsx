import React, { useState } from "react";
import axios from "axios";
import DocumentTable from "./DocumentTable.jsx";
import DocumentForm from "./DocumentForm.jsx";
import DocumentFormEdit from "./DocumentFormEdit.jsx";
import BASE_URL from "../../../Pages/config/config.js";

const Document = (props) => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("number", number);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {
      await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      // Clear form fields and files after successful upload
      setTitle("");

      setNumber("");
      setFiles([]);
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleAddDocument = () => {
    console.log("clicked1");
    setTable(false);
  };

  const handleEditDocument = (e) => {
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

  const handleDocumentEditUpdate = (info, newInfo) => {
    newInfo.preventDefault();
    console.log("zero data", newInfo.target[0].value);
    let body = {
      CompanyName: newInfo.target[0].value,
      Designation: newInfo.target[1].value,
      FromDate: newInfo.target[2].value,
      ToDate: newInfo.target[3].value
    };
    console.log("update", body);
    axios
      .put(`${BASE_URL}/api/work-experience/` + info["_id"], body, {
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
          <DocumentFormEdit
            onDocumentEditUpdate={handleDocumentEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <DocumentTable
            onAddDocument={handleAddDocument}
            onEditDocument={handleEditDocument}
            data={props.data}
            back={props.back}
          />
        )
      ) : (
        <DocumentForm
          onDocumentSubmit={handleDocumentSubmit}
          onFormClose={handleFormClose}
          onGenderChange={handleAddFormGenderChange}
        />
      )}
    </React.Fragment>
  );
};

export default Document;
