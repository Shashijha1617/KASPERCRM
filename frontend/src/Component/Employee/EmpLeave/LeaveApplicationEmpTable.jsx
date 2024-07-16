import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button, Table } from "react-bootstrap";
import InnerDashContainer from "../../InnerDashContainer";
import BASE_URL from "../../../Pages/config/config";

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

  const loadLeaveApplicationEmpData = () => {
    axios
      .get(`${BASE_URL}/api/leave-application-emp/${props.data["_id"]}`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
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
              reasonOfRejection: data["reasonOfRejection"]
            };
          }
        );

        setRowData(newRowsData);

        props.updateTotalLeaves(newRowsData.length);
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
            authorization: localStorage.getItem("token") || ""
          }
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
  }, [props.leaveRequestDone]);

  // const getTotalLeaveCount = () => {
  //   // Check if leaveApplicationEmpData is defined before accessing its properties
  //   return leaveApplicationEmpData && leaveApplicationEmpData.leaveApplication
  //     ? leaveApplicationEmpData.leaveApplication.length
  //     : 0;
  // };
  // // In LeaveApplicationEmpTable component
  // useEffect(() => {
  //   if (typeof props.updateTotalEmployeeLeave !== "function") {
  //     console.error("updateTotalEmployeeLeave is not a function");
  //   }
  // }, [props.updateTotalEmployeeLeave]);
  console.log(rowData);
  return (
    <InnerDashContainer>
      <h2 id="role-title"> Leave Application</h2>
      <Button
        variant="primary"
        id="add-button"
        onClick={props.onAddLeaveApplicationEmp}
      >
        <FontAwesomeIcon icon={faPlus} id="plus-icon" />
        Add
      </Button>

      <div id="clear-both" />
      {!loading ? (
        <div>
          <Table className="table">
            <thead>
              <tr>
                <th
                  style={{
                    background: "var(--primaryDashColorDark)",
                    color: "var(--primaryDashMenuColor)"
                  }}
                >
                  Leave Type
                </th>
                <th
                  style={{
                    background: "var(--primaryDashColorDark)",
                    color: "var(--primaryDashMenuColor)"
                  }}
                >
                  Start Date
                </th>
                <th
                  style={{
                    background: "var(--primaryDashColorDark)",
                    color: "var(--primaryDashMenuColor)"
                  }}
                >
                  End Date
                </th>
                <th
                  style={{
                    background: "var(--primaryDashColorDark)",
                    color: "var(--primaryDashMenuColor)"
                  }}
                >
                  Remarks
                </th>
                <th
                  style={{
                    background: "var(--primaryDashColorDark)",
                    color: "var(--primaryDashMenuColor)"
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    background: "var(--primaryDashColorDark)",
                    color: "var(--primaryDashMenuColor)"
                  }}
                >
                  Updated By
                </th>
                <th
                  style={{
                    background: "var(--primaryDashColorDark)",
                    color: "var(--primaryDashMenuColor)"
                  }}
                >
                  Reason of Rejection
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData.map((data, index) => (
                <tr key={index}>
                  <td>{data.Leavetype}</td>
                  <td>{data.FromDate}</td>
                  <td>{data.ToDate}</td>
                  <td>{data.Reasonforleave}</td>
                  <td>{status(data.Status)}</td>
                  <td>{data.updatedBy}</td>
                  <td>{data.reasonOfRejection}</td>
                </tr>
              ))}
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
    </InnerDashContainer>
  );
};

export default LeaveApplicationEmpTable;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import { RingLoader } from "react-spinners";
// import { css } from "@emotion/core";
// import { Button, Table } from "react-bootstrap";
// import InnerDashContainer from "../../InnerDashContainer";
// import BASE_URL from "../../../Pages/config/config";

// const override = css`
//   display: block;
//   margin: 0 auto;
//   margin-top: 45px;
//   border-color: red;
// `;

// const LeaveApplicationEmpTable = (props) => {
//   const [leaveApplicationEmpData, setLeaveApplicationEmpData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [rowData, setRowData] = useState([]);
//   const userId = props.data && props.data._id;

//   const loadLeaveApplicationEmpData = () => {
//     axios
//       .get(`${BASE_URL}/api/leave-application-emp/${props.data["_id"]}`, {
//         headers: {
//           authorization: localStorage.getItem("token") || ""
//         }
//       })
//       .then((response) => {
//         const leaveApplicationEmpObj = response.data;
//         console.log("response", response.data);
//         setLeaveApplicationEmpData(response.data);
//         setLoading(false);

//         const newRowsData = leaveApplicationEmpObj.leaveApplication.map(
//           (data) => {
//             return {
//               data,
//               Leavetype: data["Leavetype"],
//               FromDate: data["FromDate"].slice(0, 10),
//               ToDate: data["ToDate"].slice(0, 10),
//               Reasonforleave: data["Reasonforleave"],
//               Status: data["Status"]
//             };
//           }
//         );

//         setRowData(newRowsData);

//         props.updateTotalLeaves(newRowsData.length);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const onLeaveApplicationEmpDelete = (e1, e2) => {
//     console.log(e1, e2);
//     if (window.confirm("Are you sure to delete this record? ")) {
//       axios
//         .delete(`${BASE_URL}/api/leave-application-emp/${e1}/${e2}`, {
//           headers: {
//             authorization: localStorage.getItem("token") || ""
//           }
//         })
//         .then((res) => {
//           loadLeaveApplicationEmpData();
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   };

//   const status = (s) => {
//     if (s == 1) {
//       return "Pending";
//     }
//     if (s == 2) {
//       return "Approved";
//     }
//     if (s == 3) {
//       return "Rejected";
//     }
//     return "Unknown Status";
//   };

//   const onEdit = (data) => {
//     if (data["Status"] === 1) {
//       props.onEditLeaveApplicationEmp(data);
//     } else {
//       window.alert(
//         "You cannot edit the application after it's approved or rejected"
//       );
//     }
//   };

//   useEffect(() => {
//     loadLeaveApplicationEmpData();
//   }, [props.leaveRequestDone]);

//   // const getTotalLeaveCount = () => {
//   //   // Check if leaveApplicationEmpData is defined before accessing its properties
//   //   return leaveApplicationEmpData && leaveApplicationEmpData.leaveApplication
//   //     ? leaveApplicationEmpData.leaveApplication.length
//   //     : 0;
//   // };
//   // // In LeaveApplicationEmpTable component
//   // useEffect(() => {
//   //   if (typeof props.updateTotalEmployeeLeave !== "function") {
//   //     console.error("updateTotalEmployeeLeave is not a function");
//   //   }
//   // }, [props.updateTotalEmployeeLeave]);

//   return (
//     <InnerDashContainer>
//       <h2 id="role-title"> Leave Application</h2>
//       <Button
//         variant="primary"
//         id="add-button"
//         onClick={props.onAddLeaveApplicationEmp}
//       >
//         <FontAwesomeIcon icon={faPlus} id="plus-icon" />
//         Add
//       </Button>

//       <div id="clear-both" />
//       {!loading ? (
//         <div>
//           <Table className="table">
//             <thead>
//               <tr>
//                 <th
//                   style={{
//                     background: "var(--primaryDashColorDark)",
//                     color: "var(--primaryDashMenuColor)"
//                   }}
//                 >
//                   Leave Type
//                 </th>
//                 <th
//                   style={{
//                     background: "var(--primaryDashColorDark)",
//                     color: "var(--primaryDashMenuColor)"
//                   }}
//                 >
//                   Start Date
//                 </th>
//                 <th
//                   style={{
//                     background: "var(--primaryDashColorDark)",
//                     color: "var(--primaryDashMenuColor)"
//                   }}
//                 >
//                   End Date
//                 </th>
//                 <th
//                   style={{
//                     background: "var(--primaryDashColorDark)",
//                     color: "var(--primaryDashMenuColor)"
//                   }}
//                 >
//                   Remarks
//                 </th>
//                 <th
//                   style={{
//                     background: "var(--primaryDashColorDark)",
//                     color: "var(--primaryDashMenuColor)"
//                   }}
//                 >
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {rowData.map((data, index) => (
//                 <tr key={index}>
//                   <td>{data.Leavetype}</td>
//                   <td>{data.FromDate}</td>
//                   <td>{data.ToDate}</td>
//                   <td>{data.Reasonforleave}</td>
//                   <td>{status(data.Status)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       ) : (
//         <div id="loading-bar">
//           <RingLoader
//             css={override}
//             sizeUnit={"px"}
//             size={50}
//             color={"#0000ff"}
//             loading={true}
//           />
//         </div>
//       )}
//     </InnerDashContainer>
//   );
// };

// export default LeaveApplicationEmpTable;
