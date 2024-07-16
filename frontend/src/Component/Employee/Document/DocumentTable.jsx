import React, { useEffect, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { Button } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import BASE_URL from "../../../Pages/config/config";
import InnerDashContainer from "../../InnerDashContainer";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const DocumentTable = (props) => {
  const [showDownloadbtn, setShowDownloadbtn] = useState(null);
  const [documents, setDocuments] = useState([]);
  const { darkMode } = useTheme();
  const email = localStorage.getItem("Email");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/documents`, { email });
     
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      await axios.delete(`${BASE_URL}/delete-document/${documentId}`);
      fetchDocuments(); // Fetch documents again after deletion
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const confirmDelete = (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(documentId);
    }
  };



  return (
    <InnerDashContainer>
      <div>
        <h2 id="role-title">
          <h6
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)"
            }}
            className="fw-bold my-auto"
          >
            Uploaded Documents Details{" "}
            <span className="text-warning"> ( {documents.length} ) </span>
          </h6>
        </h2>
        <Button variant="primary" id="add-button" onClick={props.onAddDocument}>
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Add Document
        </Button>
        <hr />
        <div
          style={{
            overflow: "hidden auto",
            height: "27rem",
            scrollbarWidth: "thin"
          }}
        >
          <div className="row mx-2 pb-3 column-gap-4 row-gap-4">
            {documents.reverse().map((data, index) => (
              <div
                key={index}
                onMouseEnter={() => setShowDownloadbtn(index)}
                onMouseLeave={() => setShowDownloadbtn(null)}
                className="d-flex flex-column gap-2 rounded px-2 py-1 shadow"
                style={{ height: "190px", width: "250px" }}
              >
                <div
                  style={{
                    height: "150px",
                    width: "100%",
                    overflow: "hidden",
                    background: `url(${data.files})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    opacity: "85%",
                    boxShadow: "0 0 10px 1px rgba(192, 185, 185, 0.758) inset"
                  }}
                  className="m-auto position-relative "
                >
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      position: "absolute",
                      top: "0",
                      left: "0",
                      background: darkMode
                        ? "var( --secondaryDashMenuColor)"
                        : "var(--secondaryDashColorDark)",
                      color: darkMode
                        ? "var(--secondaryDashColorDark)"
                        : "var( --primaryDashMenuColor)",
                      display: showDownloadbtn === index ? "flex" : "none",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "1rem"
                    }}
                  >
                    <a
                      target="_blank"
                      href={data.files}
                      style={{ height: "40px", width: "40px" }}
                      className="btn p-0 btn bg-white text-primary shadow d-flex"
                      rel="noopener noreferrer"
                    >
                      <IoEye className="m-auto fs-4" />
                    </a>
                    <a
                      href={data.files[0]}
                      download={data.files[0]}
                      style={{ height: "40px", width: "40px" }}
                      className="btn p-0 btn bg-white text-primary shadow d-flex"
                    >
                      <IoMdDownload className="m-auto fs-4" />
                    </a>
                  </div>
                  <div
                    style={{
                      height: "30px",
                      width: "30px",
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      opacity: "100%",
                      cursor: "pointer"
                    }}
                    className="d-flex shadow-sm text-danger"
                    onClick={() => confirmDelete(data._id)}
                  >
                    <MdDelete style={{ fontSize: "35px" }} />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <p
                    style={{
                      fontSize: ".9rem",
                      color: darkMode
                        ? "var(--secondaryDashColorDark)"
                        : "var( --primaryDashMenuColor)"
                    }}
                    className="fw-bold m-0"
                  >
                    {data.title}
                  </p>{" "}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </InnerDashContainer>
  );
};

export default DocumentTable;
