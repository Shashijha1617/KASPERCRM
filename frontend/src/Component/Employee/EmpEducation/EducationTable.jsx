import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";

import InnerDashContainer from "../../InnerDashContainer";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const EducationTable = (props) => {
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    const loadEducationData = () => {
      axios
        .get(
          "http://localhost:4000/api/education/" + localStorage.getItem("_id"),
          {
            headers: {
              authorization: localStorage.getItem("token") || ""
            }
          }
        )
        .then((response) => {
          const educationObj = response.data;
          console.log("response", response.data);
          setEducationData(educationObj);
          setLoading(false);

          const rowDataT = educationObj.education.map((data) => ({
            data,
            SchoolUniversity: data["SchoolUniversity"],
            Degree: data["Degree"],
            Grade: data["Grade"],
            PassingOfYear: data["PassingOfYear"]
          }));

          setRowData(rowDataT);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    loadEducationData();
  }, [localStorage.getItem("_id")]);
  // [props.data["_id"]]);

  const onEducationDelete = (e1, e2) => {
    console.log(e1, e2);
    if (window.confirm("Are you sure to delete this record? ")) {
      axios
        .delete(`http://localhost:4000/api/education/${e1}/${e2}`, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        })
        .then(() => {
          educationData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const renderButton = (params) => {
    console.log(params);
    if (props.back) {
      return <React.Fragment />;
    }
    return (
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() =>
          onEducationDelete(props.data["_id"], params.data.data["_id"])
        }
      />
    );
  };

  const renderEditButton = (params) => {
    console.log(params);
    if (props.back) {
      return <React.Fragment />;
    }
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => props.onEditEducation(params.data.data)}
      />
    );
  };

  return (
    <div className="container-fluid">
      <InnerDashContainer>
        <div className="d-flex justify-content-between my-2">
          <h6 style={{ color: darkMode ? 'var(--primaryDashColorDark)' : "var(--primaryDashMenuColor)", }} className="fw-bold my-auto">Employee Educational Details <span className="text-warning"> ( {rowData.length} ) </span>
            {props.back
              ? "of " + props.data["FirstName"] + " " + props.data["LastName"]
              : ""}
          </h6>

          <div className="py-1">
            <Button variant="primary" onClick={props.onAddEducation}>
              <FontAwesomeIcon icon={faPlus} id="plus-icon" />
              Add Details
            </Button>
          </div>
        </div>

        <div id="clear-both" />

        {!loading ? (
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th
                    style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                  >
                    School/University
                  </th>
                  <th
                    style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                  >
                    Degree
                  </th>
                  <th
                    style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                  >
                    Grade
                  </th>
                  <th
                    style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                  >
                    Passing Year
                  </th>
                  <th
                    style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-end"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rowData.map((items, index) => (
                  <tr key={index}>
                    <td
                      style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize"
                    >
                      {items.SchoolUniversity}
                    </td>
                    <td
                      style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize"
                    >
                      {items.Degree}
                    </td>
                    <td
                      style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize"
                    >
                      {items.Grade}
                    </td>
                    <td
                      style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize"
                    >
                      {items.PassingOfYear}
                    </td>
                    <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize text-end" >
                      <button
                        onClick={() => props.onEditEducation(items.data)}
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
          </div>
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
      </InnerDashContainer>
    </div>
  );
};

export default EducationTable;
