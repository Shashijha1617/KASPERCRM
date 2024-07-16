import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FamilyInfoTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import BASE_URL from "../../../Pages/config/config";
import InnerDashContainer from "../../InnerDashContainer";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { FaRegEdit } from "react-icons/fa";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const FamilyInfoTable = (props) => {
  const [familyInfoData, setFamilyInfoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { darkMode } = useTheme();

  const familyInfoObj = [];

  const loadFamilyInfoData = () => {
    axios
      .get(`${BASE_URL}/api/family-info/` + localStorage.getItem("_id"), {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        familyInfoObj.push(response.data);
        console.log("response", response.data);
        setFamilyInfoData(response.data);
        setLoading(false);
        const tempRowData = response.data.familyInfo.map((data) => ({
          data,
          Name: data["Name"],
          Relationship: data["Relationship"],
          DOB: data["DOB"].slice(0, 10),
          Occupation: data["Occupation"]
        }));
        setRowData(tempRowData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFamilyInfoDelete = (e1, e2) => {
    console.log(e1, e2);
    if (window.confirm("Are you sure to delete this record? ") === true) {
      axios
        .delete(`${BASE_URL}/api/family-info/` + e1 + "/" + e2, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        })
        .then((res) => {
          loadFamilyInfoData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    loadFamilyInfoData();
  }, []);

  const renderButton = (params) => {
    console.log(params);
    if (props.back) {
      return <React.Fragment />;
    }
    return (
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() =>
          onFamilyInfoDelete(props.data["_id"], params.data.data["_id"])
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
        onClick={() => props.onEditFamilyInfo(params.data.data)}
      />
    );
  };

  return (
    <div className="container-fluid py-2 mb-5">
      <h2 id="role-title">
        <h6 style={{ color: darkMode ? 'var(--primaryDashColorDark)' : "var(--primaryDashMenuColor)", }} className="fw-bold my-auto">Employee Family Details <span className="text-warning"> ( {rowData.length} ) </span></h6>
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
          onClick={props.onAddFamilyInfo}
        >
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Add Member
        </Button>
      )}

      <div id="clear-both" />

      {!loading ? (
        <div>
          <table className="table" style={{ fontSize: '.9rem' }}>
            <thead>
              <tr>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                >
                  Name
                </th>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                >
                  Relationship
                </th>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                >
                  DOB
                </th>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                >
                  Occupation
                </th>
                <th
                  style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }}
                  className="text-end" >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData.map((items, index) => (
                <tr key={index}>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize" >{items.Name}</td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize" >{items.Relationship}</td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize" >{items.DOB}</td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize" >{items.Occupation}</td>
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(--secondaryDashColorDark)', color: darkMode ? 'var(--secondaryDashColorDark)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize text-end" >
                    {" "}
                    <button
                      onClick={() => props.onEditFamilyInfo(items.data)}
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
    </div>
  );
};

export default FamilyInfoTable;
