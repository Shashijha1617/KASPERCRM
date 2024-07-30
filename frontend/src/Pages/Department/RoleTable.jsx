import React, { useState, useEffect } from "react";
import "./RoleTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import Position from "../../img/Position/Position.svg";
import BASE_URL from "../config/config";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import OverLayToolTip from "../../Utils/OverLayToolTip";
const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const RoleTable = (props) => {
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

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

  const rowHeadStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var( --secondaryDashMenuColor)",
    border: "none",
    position: "sticky",
    top: "0rem",
    zIndex: "100",
  };

  const rowBodyStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var( --secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var( --primaryDashMenuColor)",
    border: "none",
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between py-2">
        <div className="my-auto">
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
              fontWeight: "600",
            }}
            className=" m-0"
          >
            Role Details ( {roleData.length} )
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className=" m-0"
          >
            You can see all role's list here
          </p>
        </div>
        <button
          className="btn btn-primary gap-1 d-flex  my-auto align-items-center justify-content-center"
          onClick={props.onAddRole}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex">Create Role</span>
        </button>
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

      <div
        className="border border-1 border-dark "
        style={{
          color: darkMode
            ? "var(--secondaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
          overflow: "auto",
          maxHeight: "80vh",
          position: "relative",
        }}
      >
        {roleData.length > 0 ? (
          <table
            className="table"
            style={{ fontSize: ".9rem", position: "relative" }}
          >
            <thead>
              <tr>
                <th style={rowHeadStyle}>S. No.</th>
                <th style={rowHeadStyle}>Company</th>
                <th style={rowHeadStyle}>Role</th>
                <th style={rowHeadStyle} className="text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {roleData.map((data, index) => (
                <tr key={index}>
                  <td style={rowBodyStyle} className="text-capitalize">
                    {index + 1}
                  </td>
                  <td style={rowBodyStyle} className="text-capitalize">
                    {data["company"][0]["CompanyName"]}
                  </td>
                  <td style={rowBodyStyle} className="text-capitalize">
                    {data["RoleName"]}
                  </td>
                  <td style={rowBodyStyle} className="text-capitalize text-end">
                    <OverLayToolTip
                      style={{ color: darkMode ? "black" : "white" }}
                      icon={<FaEdit />}
                      onClick={() => props.onEditRole(data)}
                      tooltip={"Edit Role"}
                    />
                    <OverLayToolTip
                      style={{ color: darkMode ? "black" : "white" }}
                      icon={<IoTrashBin />}
                      onClick={() => onRoleDelete(data["_id"])}
                      tooltip={"Delete Role"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            style={{
              height: "80vh",
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
                width: "20%",
              }}
              src={Position}
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
              Role not created yet, to create new role click on "+ Create Role"
              button.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleTable;
