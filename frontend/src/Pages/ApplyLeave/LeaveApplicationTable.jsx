import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button, Table } from "react-bootstrap";
import InnerDashContainer from "../../Component/InnerDashContainer";
import BASE_URL from "../config/config";

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
      .get(
        `${BASE_URL}/api/leave-application-man/` + localStorage.getItem("_id"),
        {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
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
              reasonOfRejection: data["reasonOfRejection"]
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
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between py-2">
        <h4 className="fw-bold my-auto"> Leave Application</h4>
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
                  reason for rejection
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
    </div>
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
// import InnerDashContainer from "../../Component/InnerDashContainer";
// import BASE_URL from "../config/config";
// import { useTheme } from "../../Context/TheamContext/ThemeContext";
// import Pagination from "../../Utils/Pagination";

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
//   const { darkMode } = useTheme();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   const formatDate = (dateString) => {
//     const dateParts = dateString.split("-");
//     return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
//   };

//   const loadLeaveApplicationEmpData = () => {
//     axios
//       .get(
//         `${BASE_URL}/api/leave-application-man/` + localStorage.getItem("_id"),
//         {
//           headers: {
//             authorization: localStorage.getItem("token") || ""
//           }
//         }
//       )
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
//               FromDate: formatDate(data["FromDate"]?.slice(0, 10)),
//               ToDate: formatDate(data["ToDate"]?.slice(0, 10)),
//               Reasonforleave: data["Reasonforleave"],
//               Status: data["Status"],
//               CreatedOn: formatDate(data?.createdOn?.slice(0, 10)),
//               Days: calculateDays(data?.FromDate, data?.ToDate)
//             };
//           }
//         );

//         setRowData(newRowsData);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const calculateDays = (startDate, endDate) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const diffTime = Math.abs(end - start);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//     return diffDays;
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
//   }, []);

//   const handlePaginationNext = () => {
//     setCurrentPage((prevPage) => prevPage + 1);
//   };

//   const handlePaginationPrev = () => {
//     setCurrentPage((prevPage) => prevPage - 1);
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = rowData.slice(indexOfFirstItem, indexOfLastItem);

//   const pageNumbers = [];
//   for (let i = 1; i <= Math.ceil(rowData.length / itemsPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between py-2">
//         <h6 style={{ color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)" }} className="fw-bold my-auto">  Leave Application</h6>
//         <Button
//           variant="primary"
//           id="add-button"
//           onClick={props.onAddLeaveApplicationEmp}
//         >
//           <FontAwesomeIcon icon={faPlus} id="plus-icon" />
//           Apply Leave
//         </Button>
//       </div>

//       <div id="clear-both" />
//       {!loading ? (
//         <div>
//           <div
//             style={{ minHeight: "68vh", maxHeight: "68vh", overflow: 'auto', position: 'relative' }}
//             className="table-responsive p-2 mb-3"
//           >
//             <Table className="table">
//               <thead>
//                 <tr>
//                   <th
//                     style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
//                   >
//                     Leave Type
//                   </th>
//                   <th
//                     style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
//                   >
//                     Start Date
//                   </th>
//                   <th
//                     style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
//                   >
//                     End Date
//                   </th>
//                   <th
//                     style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
//                   >
//                     Created Date
//                   </th>
//                   <th
//                     style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
//                   >
//                     Days
//                   </th>
//                   <th
//                     style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
//                   >
//                     Leave Remarks
//                   </th>
//                   <th
//                     style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
//                   >
//                     Status
//                   </th>
//                   <th
//                     style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
//                   >
//                     Updated By
//                   </th>
//                   <th
//                     style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var( --secondaryDashMenuColor)", border: 'none' }}
//                   >
//                     Status Remark
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.map((data, index) => (
//                   <tr key={index}>
//                     <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>{data.Leavetype}</td>
//                     <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>{data.FromDate}</td>
//                     <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>{data.ToDate}</td>
//                     <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>{data.CreatedOn}</td>
//                     <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>{data.Days}</td>
//                     <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none' }}>{data.Reasonforleave}</td>
//                     <td style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var( --secondaryDashMenuColor)" : 'var(----secondaryDashMenuColor)', color: darkMode ? 'var(----secondaryDashMenuColor)' : "var( --primaryDashMenuColor)", border: 'none', fontSize: '.8rem', }} > <span className={`py-0 px-3 text-center text-white rounded-5 shadow-sm ${status(data.Status) === "Approved"
//                       ? "bg-success"
//                       : status(data.Status) === "Pending"
//                         ? "bg-warning"
//                         : "bg-danger"}`}>{status(data.Status)} </span></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>

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
//     </div>
//   );
// };

// export default LeaveApplicationEmpTable;
