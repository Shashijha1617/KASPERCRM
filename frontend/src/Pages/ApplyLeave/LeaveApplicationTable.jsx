import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button, Table } from "react-bootstrap";
import InnerDashContainer from "../../Component/InnerDashContainer";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const LeaveApplicationEmpTable = (props) => {
  const [leaveApplicationEmpData, setLeaveApplicationEmpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const userId = props.data && props.data._id;

  const { darkMode } = useTheme();

  const loadLeaveApplicationEmpData = () => {
    axios
      .get(
        `${BASE_URL}/api/leave-application-man/` + localStorage.getItem("_id"),
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((response) => {
        const leaveApplicationEmpObj = response.data;
        console.log("response", response.data);
        setLeaveApplicationEmpData(response.data);
        setLoading(false);

        const newRowsData = leaveApplicationEmpObj.leaveApplication.map(
          (data) => {
            return {
              data,
              Leavetype: data["Leavetype"],
              FromDate: data["FromDate"].slice(0, 10),
              ToDate: data["ToDate"].slice(0, 10),
              Reasonforleave: data["Reasonforleave"],
              Status: data["Status"],
              updatedBy: data["updatedBy"],
              reasonOfRejection: data["reasonOfRejection"],
            };
          }
        );

        setRowData(newRowsData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onLeaveApplicationEmpDelete = (e1, e2) => {
    console.log(e1, e2);
    if (window.confirm("Are you sure to delete this record? ")) {
      axios
        .delete(`${BASE_URL}/api/leave-application-emp/${e1}/${e2}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then((res) => {
          loadLeaveApplicationEmpData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const status = (s) => {
    if (s == 1) {
      return "Pending";
    }
    if (s == 2) {
      return "Approved";
    }
    if (s == 3) {
      return "Rejected";
    }
    return "Unknown Status";
  };

  const onEdit = (data) => {
    if (data["Status"] === 1) {
      props.onEditLeaveApplicationEmp(data);
    } else {
      window.alert(
        "You cannot edit the application after it's approved or rejected"
      );
    }
  };

  useEffect(() => {
    loadLeaveApplicationEmpData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between py-2">
        <div>
          <h5 style={{ fontWeight: "600" }} className=" m-0">
            Your Leave Application ( {rowData.length} )
          </h5>
          <p className="m-0">You can see your applied leaves here</p>
        </div>
        <Button
          variant="primary"
          id="add-button"
          onClick={props.onAddLeaveApplicationEmp}
        >
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Apply Leave
        </Button>
      </div>

      <div id="clear-both" />
      {!loading ? (
        <div
          className="border border-1 border-dark"
          style={{ overflow: "auto", maxHeight: "80vh" }}
        >
          <Table className="table">
            <thead>
              <tr>
                <th
                  style={{
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    border: "none",
                    whiteSpace: "pre",
                  }}
                >
                  Leave Type
                </th>
                <th
                  style={{
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    border: "none",
                    whiteSpace: "pre",
                  }}
                >
                  Start Date
                </th>
                <th
                  style={{
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    border: "none",
                    whiteSpace: "pre",
                  }}
                >
                  End Date
                </th>
                <th
                  style={{
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    border: "none",
                    whiteSpace: "pre",
                  }}
                >
                  Remarks
                </th>
                <th
                  style={{
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    border: "none",
                    whiteSpace: "pre",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    border: "none",
                    whiteSpace: "pre",
                  }}
                >
                  Update By
                </th>
                <th
                  style={{
                    background: darkMode
                      ? "var(--primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    color: darkMode
                      ? "var(--primaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    border: "none",
                    whiteSpace: "pre",
                  }}
                >
                  Reason for Rejection
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData.map((data, index) => {
                const rowBodyStyle = {
                  position: "sticky",
                  top: "0",
                  verticalAlign: "middle",
                  background: darkMode
                    ? "var(--secondaryDashMenuColor)"
                    : "var(--secondaryDashColorDark)",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                };

                return (
                  <tr key={index}>
                    <td style={rowBodyStyle}>{data.Leavetype}</td>
                    <td style={rowBodyStyle}>{data.FromDate}</td>
                    <td style={rowBodyStyle}>{data.ToDate}</td>
                    <td style={rowBodyStyle}>{data.Reasonforleave}</td>
                    <td style={rowBodyStyle}>{status(data.Status)}</td>
                    <td style={rowBodyStyle}>{data.updatedBy}</td>
                    <td style={rowBodyStyle}>{data.reasonOfRejection}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
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

export default LeaveApplicationEmpTable;
