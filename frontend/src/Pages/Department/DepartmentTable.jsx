import React, { useState, useEffect } from "react";
import "./DepartmentTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
const DepartmentTable = ({ onAddDepartment, onEditDepartment }) => {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    loadDepartmentData();
  }, []);

  const loadDepartmentData = () => {
    axios
      .get(`${BASE_URL}/api/department`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        setDepartmentData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDepartmentDelete = (id) => {
    if (window.confirm("Are you sure to delete this record ? ")) {
      axios
        .delete(`${BASE_URL}/api/department/${id}`, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        })
        .then(() => {
          loadDepartmentData();
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.status === 403) {
            window.alert(err.response.data);
          }
        });
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-between align-items-start mb-3">
        <div className="my-auto">
          <h6
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)"
            }}
            className="fw-bold my-auto"
          >
            {" "}
            Department Details{" "}
            <span className="text-warning">
              {" "}
              ( {departmentData.length} ){" "}
            </span>{" "}
          </h6>
        </div>
        <Button
          className="my-auto"
          variant="primary shadow-sm"
          onClick={onAddDepartment}
        >
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Create Department
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th
              style={{
                verticalAlign: "middle",
                whiteSpace: "pre",
                background: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var( --secondaryDashMenuColor)",
                border: "none"
              }}
              className="py-1"
            >
              Company
            </th>
            <th
              style={{
                verticalAlign: "middle",
                whiteSpace: "pre",
                background: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var( --secondaryDashMenuColor)",
                border: "none"
              }}
              className="py-1"
            >
              Department
            </th>
            <th
              style={{
                verticalAlign: "middle",
                whiteSpace: "pre",
                background: darkMode
                  ? "var(--primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)",
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var( --secondaryDashMenuColor)",
                border: "none"
              }}
              className="py-1"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {departmentData.map((items, index) => (
            <tr key={index}>
              <td
                style={{
                  verticalAlign: "middle",
                  whiteSpace: "pre",
                  background: darkMode
                    ? "var( --secondaryDashMenuColor)"
                    : "var(----secondaryDashMenuColor)",
                  color: darkMode
                    ? "var(----secondaryDashMenuColor)"
                    : "var( --primaryDashMenuColor)",
                  border: "none"
                }}
                className="text-capitalize"
              >
                {items.company[0].CompanyName}
              </td>
              <td
                style={{
                  verticalAlign: "middle",
                  whiteSpace: "pre",
                  background: darkMode
                    ? "var( --secondaryDashMenuColor)"
                    : "var(----secondaryDashMenuColor)",
                  color: darkMode
                    ? "var(----secondaryDashMenuColor)"
                    : "var( --primaryDashMenuColor)",
                  border: "none"
                }}
                className="text-capitalize"
              >
                {items.DepartmentName}
              </td>
              <td
                style={{
                  verticalAlign: "middle",
                  whiteSpace: "pre",
                  background: darkMode
                    ? "var( --secondaryDashMenuColor)"
                    : "var(----secondaryDashMenuColor)",
                  color: darkMode
                    ? "var(----secondaryDashMenuColor)"
                    : "var( --primaryDashMenuColor)",
                  border: "none"
                }}
              >
                <div className="d-flex wrap-nowrap justify-content-end gap-3">
                  <span
                    onClick={() => onEditDepartment(items)}
                    style={{ cursor: "pointer" }}
                    title="Update"
                    className="text-primary d-flex align-items-center gap-2 px-4 shadow-sm rounded-5"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Edit</span>
                  </span>
                  <span
                    onClick={() => onDepartmentDelete(items._id)}
                    style={{ cursor: "pointer" }}
                    title="Delete"
                    className="text-danger d-flex align-items-center gap-2 px-4 shadow-sm rounded-5"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Delete</span>
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default DepartmentTable;
