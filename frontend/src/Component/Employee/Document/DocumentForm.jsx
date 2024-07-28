import React, { useState } from "react";
import styled from "styled-components";
import { FiUploadCloud } from "react-icons/fi";
import axios from "axios";
import BASE_URL from "../../../Pages/config/config";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const DropArea = styled.div`
  background-position: center;
  background-size: cover;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  text-align: center;
  overflow: hidden;
`;

const DocumentUploadForm = (props) => {
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("Email");
  const { darkMode } = useTheme();

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("number", number);
    formData.append("email", email);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data); // Log the response from the backend
      // Clear form fields and files after successful upload
      setTitle("");
      setNumber("");
      setFiles([]);
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFiles([...files, file]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles([...files, ...selectedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container-fluid">
      <form onSubmit={handleDocumentSubmit}>
        <h6 className="mb-4"
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
        >
          Upload Your Documents
        </h6>
        <div style={{ height: "100%" }}>
          <div
            style={{ height: "100%" }}
          >
            <div className="row gap-4">
              <div className="col-12 ">
                <label>
                  Document Title
                </label>
                <input
                  required
                  className="form-control w-100"
                  placeholder="Please Enter Document Title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="" >
                  Document Number
                </label>
                <input
                  required
                  className="form-control w-100"
                  placeholder="Please Enter Document Number"
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
            </div>

            <div
              style={{ overflow: "hidden" }}
              className="my-2 position-relative rounded-2 d-flex"
            >
              <DropArea
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{ cursor: "pointer" }}
                className="mx-auto w-100 d-flex flex-column justify-content-center align-items-center"
              >
                <input
                  onChange={handleFileChange}
                  className="rounded-5 opacity-0"
                  style={{
                    minHeight: "100%",
                    minWidth: "100%",
                    position: "absolute",
                    cursor: "pointer",
                  }}
                  type="file"
                  multiple
                  name=""
                  id=""
                />
                <FiUploadCloud
                  style={{ cursor: "pointer" }}
                  className="fs-1 text-primary"
                />
                <span
                  style={{ cursor: "pointer" }}
                  className="fw-bold text-primary"
                >
                  Drag file or Select file{" "}
                </span>
              </DropArea>
            </div>

            {loading && (
              <div className="d-flex justify-content-center my-3">
                <ClipLoader color="#fff" loading={loading} size={35} />
              </div>
            )}
            <div className=" d-flex align-items-center gap-2 mt-3 mx-1 justify-content-between">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                Submit
              </button>
              <button
                type="reset"
                className="btn btn-danger"
                onClick={props.onFormClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocumentUploadForm;
