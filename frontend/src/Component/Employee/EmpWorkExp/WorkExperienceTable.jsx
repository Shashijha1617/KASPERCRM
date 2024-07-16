import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import "./WorkExperienceTable.css";
import BASE_URL from "../../../Pages/config/config.js";
import InnerDashContainer from "../../InnerDashContainer.jsx";
import { useTheme } from "../../../Context/TheamContext/ThemeContext.js";
const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const WorkExperienceTable = (props) => {
  const [workExperienceData, setWorkExperienceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  // Removed const from here
  let workExperienceObj = [];
  let rowDataT = [];

  const loadWorkExperienceData = () => {
    axios
      .get(`${BASE_URL}/api/work-experience/` + localStorage.getItem("_id"), {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        workExperienceObj = response.data;
        console.log("response", response.data);
        setWorkExperienceData(response.data);
        setLoading(false);
        rowDataT.length = 0;
        workExperienceObj.workExperience.map((data) => {
          let temp = {
            data,
            CompanyName: data["CompanyName"],
            Designation: data["Designation"],
            FromDate: data["FromDate"].slice(0, 10),
            ToDate: data["ToDate"].slice(0, 10)
          };

          rowDataT.push(temp);
        });
        setRowData(rowDataT);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onWorkExperienceDelete = (e1, e2) => {
    console.log(e1, e2);
    if (window.confirm("Are you sure to delete this record? ") === true) {
      axios
        .delete(`${BASE_URL}/api/work-experience/` + e1 + "/" + e2, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        })
        .then((res) => {
          loadWorkExperienceData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    loadWorkExperienceData();
  }, []);

  // Corrected function declaration
  const renderButton = (params) => {
    console.log(params);
    if (props.back) {
      return <React.Fragment />;
    }
    return (
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() =>
          onWorkExperienceDelete(props.data["_id"], params.data.data["_id"])
        }
      />
    );
  };

  // Corrected function declaration
  const renderEditButton = (params) => {
    console.log(params);
    if (props.back) {
      return <React.Fragment />;
    }
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => props.onEditWorkExperience(params.data.data)}
      />
    );
  };

  return (
    <div className="container-fluid">
      <div id="table-outer-div-scroll">
        <h2 id="role-title">
          <h6 style={{ color: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)" }} className="fw-bold my-auto">Employee Work Experience Details <span className="text-warning"> ( {rowData.length} ) </span></h6>
          {props.back
            ? "of " + props.data["FirstName"] + " " + props.data["LastName"]
            : ""}
        </h2>

        {props.back ? (
          <Link to="/hr/employee">
            <Button variant="primary" id="add-button">
              Back
            </Button>
          </Link>
        ) : (
          <Button
            variant="primary"
            id="add-button"
            onClick={props.onAddWorkExperience}
          >
            <FontAwesomeIcon icon={faPlus} id="plus-icon" />
            Add Experience
          </Button>
        )}

        <div id="clear-both" />

        {!loading ? (
          <table className="table">
            <thead>
              <tr>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                >
                  Company Name
                </th>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                >
                  Designation
                </th>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                >
                  FromDate
                </th>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                >
                  ToDate
                </th>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                  className="text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData.map((items, index) => (
                <tr key={index}>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize">{items.CompanyName}</td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize">{items.Designation}</td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize">{items.FromDate}</td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize">{items.ToDate}</td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize text-end">
                    {" "}
                    <button
                      onClick={() => props.onEditWorkExperience(items.data)}
                      style={{
                        zIndex: "1",
                        cursor: "pointer"
                      }}
                      className="btn btn-outline-primary"
                    >
                      <FaRegEdit /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div id="loading-bar">
            <RingLoader
              css={override}
              sizeUnit={"px"}
              size={50}
              color={"#0000ff"}
              loading={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkExperienceTable;
