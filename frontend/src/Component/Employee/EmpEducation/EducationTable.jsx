import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { FaPlus, FaRegEdit, FaTrash } from "react-icons/fa";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import SearchLight from "../../../img/Attendance/SearchLight.svg";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import OverLayToolTip from "../../../Utils/OverLayToolTip";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const EducationTable = (props) => {
  let id;
  if (props.data) {
    id = props.data["_id"];
  } else {
    id = localStorage.getItem("_id");
  }
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    const loadEducationData = () => {
      axios
        .get(`${BASE_URL}/api/education/` + id, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
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
            PassingOfYear: data["PassingOfYear"],
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
        .delete(`${BASE_URL}/api/education/${e1}/${e2}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
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

  const rowHeadStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
    border: "none",
    position: "sticky",
    top: "0rem",
    zIndex: "100",
  };

  const rowBodyStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--primaryDashMenuColor)",
    border: "none",
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between my-2">
        <TittleHeader
          title={" Educational Details"}
          numbers={rowData.length}
          message={"You can view education details here."}
        />

        <div className="py-1">
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
            onClick={props.onAddEducation}
          >
            <FaPlus />
            <span className="d-none d-md-flex">Add Details</span>
          </button>
        </div>
      </div>

      <div id="clear-both" />

      {loading && (
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

      <div>
        {rowData.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th style={rowHeadStyle}>School/University</th>
                <th style={rowHeadStyle}>Degree</th>
                <th style={rowHeadStyle}>Grade</th>
                <th style={rowHeadStyle}>Passing Year</th>
                <th style={rowHeadStyle} className="text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData.map((items, index) => (
                <tr key={index}>
                  <td style={rowBodyStyle} className="text-capitalize">
                    {items.SchoolUniversity}
                  </td>
                  <td style={rowBodyStyle} className="text-capitalize">
                    {items.Degree}
                  </td>
                  <td style={rowBodyStyle} className="text-capitalize">
                    {items.Grade}
                  </td>
                  <td style={rowBodyStyle} className="text-capitalize">
                    {items.PassingOfYear}
                  </td>
                  <td style={rowBodyStyle}>
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <OverLayToolTip
                        onClick={() => props.onEditEducation(items.data)}
                        tooltip={"Edit"}
                        icon={<FaRegEdit className="text-primary" />}
                      />
                      <OverLayToolTip
                        onClick={() => props.onEducationDelete(items.data)}
                        tooltip={"Delete"}
                        icon={<FaTrash className="text-danger" />}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                width: "30%",
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
              Details not available Please add.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationTable;
