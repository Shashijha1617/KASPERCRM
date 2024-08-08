import React, { useEffect, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import axios from "axios";
import BASE_URL from "../../../Pages/config/config";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { FaPlus } from "react-icons/fa";
import SearchLight from "../../../img/Attendance/SearchLight.svg";

const DocumentTable = (props) => {
  const [showDownloadbtn, setShowDownloadbtn] = useState(null);
  const [documents, setDocuments] = useState([]);
  const { darkMode } = useTheme();
  let email;
  if (props.data) {
    email = props.data["Email"];
  } else {
    email = localStorage.getItem("Email");
  }

  useEffect(() => {
    fetchDocuments();
  }, [props.table === true]);

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
    <div className="container-fluid py-2">
      <div>
        <div className="d-flex justify-content-between">
          <h6
            style={{
              color: darkMode
                ? "var(--primaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
            }}
            className="my-auto"
          >
            Uploaded Documents ( {documents.length} )
          </h6>

          <div className="py-1">
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
              onClick={props.onAddDocument}
            >
              <FaPlus />
              <span className="d-none d-md-flex">Upload Documents</span>
            </button>
          </div>
        </div>

        <div
          className="mt-2"
          style={{
            overflow: "hidden auto",
            height: "100%",
            scrollbarWidth: "thin",
          }}
        >
          {documents.length > 0 ? (
            <div className="row mx-2 pb-3 column-gap-4 row-gap-4">
              {documents.reverse().map((data, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setShowDownloadbtn(index)}
                  onMouseLeave={() => setShowDownloadbtn(null)}
                  className="d-flex flex-column gap-2 px-2 text-capitalize py-1 shadow"
                  style={{
                    height: "190px",
                    width: "250px",
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--secondaryDashMenuColor)",
                    border: "none",
                  }}
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
                      boxShadow:
                        "0 0 10px 1px rgba(192, 185, 185, 0.758) inset",
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
                        gap: "1rem",
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
                        cursor: "pointer",
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
                          : "var( --primaryDashMenuColor)",
                      }}
                      className="m-0"
                    >
                      {data.title}
                    </p>{" "}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                height: "65vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                wordSpacing: "5px",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              <img
                style={{
                  height: "auto",
                  width: "200px",
                }}
                src={SearchLight}
                alt="img"
              />
              <p
                className="text-center w-75 mx-auto"
                style={{
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var( --primaryDashMenuColor)",
                }}
              >
                Details not available please upload documents
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentTable;
