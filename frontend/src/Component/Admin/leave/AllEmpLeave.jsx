import React, { useState, useEffect } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import Pagination from "../../../Utils/Pagination";
import { RingLoader } from "react-spinners";
import profileImg from "../../../img/profile.jpg"
import BASE_URL from "../../../Pages/config/config";
const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const AllEmpLeaves = (props) => {
  const [leaveApplicationHRData, setLeaveApplicationHRData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { darkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/getAllLeave`, {
      headers: {
        authorization: localStorage.getItem("token") || ""
      }
    }).then((response) => {
    const leaveApplicationHRObj = response.data;
      setLeaveApplicationHRData(leaveApplicationHRObj);
      setLoading(false);
      console.log(leaveApplicationHRObj)

      const rowDataT = leaveApplicationHRObj.map(data => (
        data.profile!==null?
        {
        empID: data.empID,
        Name: data.FirstName + " " + data.LastName,
        Leavetype: data.Leavetype,
        sickLeave: data.sickLeave,
        paidLeave: data.paidLeave,
        casualLeave: data.casualLeave,
        paternityLeave: data.paternityLeave,
        maternityLeave: data.maternityLeave,
        profilePic: data.profile.image_url
      }:  {
        empID: data.empID,
        Name: data.FirstName + " " + data.LastName,
        Leavetype: data.Leavetype,
        sickLeave: data.sickLeave,
        paidLeave: data.paidLeave,
        casualLeave: data.casualLeave,
        paternityLeave: data.paternityLeave,
        maternityLeave: data.maternityLeave,
        profilePic: null
      }));
      console.log(rowDataT)
      setRowData(rowDataT);
      setFilteredData(rowDataT);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    const filtered = rowData.filter(item => item.Name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredData(filtered);
  }, [searchQuery]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center py-3">
        <h6 style={{ color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)" }} className="fw-bold my-auto">
          Leaves Request
        </h6>
        <div className="searchholder p-0 d-flex position-relative">
          <input
            style={{ height: "100%", width: "100%", paddingLeft: "15%" }}
            className="form-control border rounded-0"
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div id="clear-both" />
      {!loading ? (
        <div>
          <table className="table" style={{ fontSize: ".9rem" }}>
            <thead>
              <tr>
                <th style={{textAlign:"center"}}>Profile</th>
                <th style={{textAlign:"center"}}>Employee Name</th>
                <th style={{textAlign:"center"}}>Emp ID</th>

                <th style={{textAlign:"center"}}>Sick Leave</th>
                <th style={{textAlign:"center"}}>Paid Leave</th>
                <th style={{textAlign:"center"}}>Casual Leave</th>
                <th style={{textAlign:"center"}}>Paternity Leave</th>
                <th style={{textAlign:"center"}}>Maternity Leave</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data, index) => (
                <tr key={index}>
                  <td style={{textAlign:"center"}}>
                    <img
                      src={data.profilePic || profileImg}
                      alt="Profile"
                      style={{
                        height: "35px",
                        width: "35px",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                    />
                  </td>
                  <td style={{textAlign:"center"}}>{data.Name}</td>
                  <td style={{textAlign:"center"}}>{data.empID}</td>
                  <td style={{textAlign:"center"}}>{data.sickLeave}</td>
                  <td style={{textAlign:"center"}}>{data.paidLeave}</td>
                  <td style={{textAlign:"center"}}>{data.casualLeave}</td>
                  <td style={{textAlign:"center"}}>{data.paternityLeave}</td>
                  <td style={{textAlign:"center"}}>{data.maternityLeave}</td>
                </tr>
              ))}
            </tbody>
          </table>
       
        </div>
      ) : (
        <div id="loading-bar">
          <RingLoader size={50} color="#0000ff" loading={true} />
        </div>
      )}
    </div>
  );
};

export default AllEmpLeaves;
