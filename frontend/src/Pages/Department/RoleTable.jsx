import React, { useState, useEffect } from "react";
import "./RoleTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const RoleTable = (props) => {
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme()

  useEffect(() => {
    loadRoleData();
  }, []);

  const loadRoleData = () => {
    axios
      .get(`${BASE_URL}/api/role`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        const data = response.data;
        setRoleData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onRoleDelete = (id) => {
    if (window.confirm("Are you sure to delete this record ? ")) {
      axios
        .delete(`${BASE_URL}/api/role/${id}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then((res) => {
          loadRoleData();
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
          if (err.response.status === 403) {
            window.alert(err.response.data);
          }
        });
    }
  };

  return (
    <div
      style={{ height: "100vh", width: "100%", scrollbarWidth: "thin" }}
      className="p-4"
    >
      <div className="d-flex justify-between aline-items-start mb-3">
        <div className=" my-auto">
          <h6 style={{ color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)" }} className="fw-bold my-auto"> Role Details  <span className="text-warning"> ( {roleData.length} ) </span>  </h6>
        </div>

        <Button
          variant="primary"
          className="my-auto shadow-sm"
          onClick={props.onAddRole}
        >
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Create Role
        </Button>
      </div>
      <div id="clear-both" />
      {!loading ? (
        <table className="table">
          <thead>
            <tr>
              <th
                style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
                className="py-1"
              >
                Company
              </th>
              <th
                style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
                className="py-1"
              >
                Role
              </th>
              <th
                style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
                className="py-1 text-end"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {roleData.map((data, index) => (
              <tr key={index}>
                <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize">
                  {data["company"][0]["CompanyName"]}
                </td>
                <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }} className="text-capitalize">{data["RoleName"]}</td>
                <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>
                  <div className="d-flex wrap-nowrap justify-content-end gap-3">
                    <button
                      onClick={() => props.onEditRole(data)}
                      style={{ cursor: "pointer" }}
                      title="Update"
                      className="btn py-1 btn-outline-primary"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onRoleDelete(data["_id"])}
                      style={{ cursor: "pointer" }}
                      title="Delete"
                      className="btn py-1 btn-outline-danger"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span>Delete</span>
                    </button>
                  </div>
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
  );
};

export default RoleTable;
