import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import "./SalaryTable.css";
import { LuSearch } from "react-icons/lu";
import { GrFormPrevious } from "react-icons/gr";
import { MdNearbyError } from "react-icons/md";
import { IoTrashBin } from "react-icons/io5";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import { FaEdit } from "react-icons/fa";
const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const AdminSalaryTable = (props) => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const { darkMode } = useTheme();

  const loadSalaryData = () => {
    axios
      .get(`${BASE_URL}/api/salary`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        const salaryObj = response.data;
        console.log("response", response.data);
        setSalaryData(response.data);
        setLoading(false);

        const rowDataT = salaryObj.map((data) => ({
          data,
          empID: data["empID"],
          EmployeeName: `${data["FirstName"]} ${data["LastName"]}`,
          PositionName: data["position"][0]["PositionName"],
          BasicSalary: data["salary"][0]["BasicSalary"],
          BankName: data["salary"][0]["BankName"],
          AccountNo: data["salary"][0]["AccountNo"],
          AccountHolderName: data["salary"][0]["AccountHolderName"],
          IFSCcode: data["salary"][0]["IFSCcode"],
          TaxDeduction: data["salary"][0]["TaxDeduction"],
        }));

        setSalaryData(rowDataT);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSalaryDelete = (e) => {
    console.log(e);
    if (window.confirm("Are you sure to delete this record? ")) {
      axios
        .delete(`${BASE_URL}/api/salary/${e}`, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then((res) => {
          loadSalaryData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    loadSalaryData();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const sortedAndFilteredData = salaryData
    .slice()
    .filter((item) =>
      item.EmployeeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handlePaginationNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Calculate index of the last and first item for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAndFilteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Generate array of page numbers
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(sortedAndFilteredData.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const rowHeadStyle = {
    cursor: "pointer",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
    border: "none",
    position: "sticky",
    top: "-10px",
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
    <div>
      <div
        style={{
          background: darkMode
            ? "var(--secondaryDashMenuColor)"
            : "var(--secondaryDashColorDark)",
          color: darkMode
            ? "var(--secondaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
        }}
        className=" row mx-auto mb-3 py-1 mt-2"
      >
        <div className="my-auto d-flex justify-content-between">
          <h5 className="my-auto text-capitalize">Salary Details</h5>

          <div className="d-flex gap-2 justify-content-between py-1">
            <div className="searchholder p-0 d-flex  position-relative">
              <input
                style={{
                  height: "100%",
                  width: "100%",
                  paddingLeft: "15%",
                }}
                className="form-control pr-0 border border-primary border-2"
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <LuSearch
                className="text-black"
                style={{ position: "absolute", top: "30%", left: "5%" }}
              />
            </div>
            <Button
              className="my-auto d-flex gap-1 my-auto"
              id="add-button"
              onClick={props.onAddSalary}
            >
              + <span className="d-none d-sm-block">Add Salary</span>
            </Button>
          </div>
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

      <div className="row m-auto container-fluid">
        <div
          style={{
            minHeight: "70vh",
            maxHeight: "70vh",
            overflow: "auto",
            width: "100%",
          }}
          className="mb-2 px-1 border"
        >
          {currentItems.length > 0 ? (
            <table
              className="table table-striped"
              style={{ fontSize: ".9rem" }}
            >
              <thead>
                <tr style={{ position: "sticky", top: "0", zIndex: "3" }}>
                  <th
                    style={rowHeadStyle}
                    className="py-2 px-0 text-center fw-normal border-0"
                  >
                    Profile
                  </th>
                  <th style={rowHeadStyle} className="py-2 fw-normal  border-0">
                    Name
                  </th>
                  <th style={rowHeadStyle} className="py-2 fw-normal border-0">
                    Emp ID
                  </th>
                  <th style={rowHeadStyle} className="py-2 fw-normal border-0">
                    Designation
                  </th>
                  <th style={rowHeadStyle} className="py-2 fw-normal border-0">
                    Salary
                  </th>
                  <th style={rowHeadStyle} className="py-2 fw-normal border-0">
                    Bank Name
                  </th>
                  <th style={rowHeadStyle} className="py-2 fw-normal border-0">
                    Account No
                  </th>
                  <th style={rowHeadStyle} className="py-2 fw-normal border-0">
                    Account Holder Name
                  </th>
                  <th style={rowHeadStyle} className="py-2 fw-normal border-0">
                    IFSC Code
                  </th>
                  <th style={rowHeadStyle} className="py-2 fw-normal border-0">
                    Tax Deduction
                  </th>
                  <th
                    style={rowHeadStyle}
                    className="py-2 fw-normal text-center border-0"
                  >
                    Edit
                  </th>
                  <th
                    style={rowHeadStyle}
                    className="py-2 fw-normal text-center border-0"
                  >
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr className="stickey-top" key={index}>
                    <td
                      style={rowBodyStyle}
                      className="text-capitalize px-0 py-1 border-0"
                    >
                      <div className="d-flex flex-nowrap gap-2">
                        <div
                          className="mx-auto"
                          style={{ height: "35px", width: "35px" }}
                        >
                          <img
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: "50%",
                              overflow: "hidden",
                              objectFit: "cover",
                            }}
                            src={
                              item?.data?.profile?.image_url
                                ? item?.data?.profile?.image_url
                                : "https://a.storyblok.com/f/191576/1200x800/215e59568f/round_profil_picture_after_.webp"
                            }
                            alt=""
                          />
                        </div>
                      </div>
                    </td>
                    <td style={rowBodyStyle} className=" border-0">
                      {item.EmployeeName}
                    </td>
                    <td style={rowBodyStyle} className=" border-0">
                      {item.empID}
                    </td>
                    <td style={rowBodyStyle} className=" border-0">
                      {item.PositionName}
                    </td>
                    <td style={rowBodyStyle} className=" border-0">
                      {item.BasicSalary}
                    </td>
                    <td
                      style={rowBodyStyle}
                      className="text-uppercase  border-0"
                    >
                      {item.BankName}
                    </td>
                    <td
                      style={rowBodyStyle}
                      className="text-uppercase border-0"
                    >
                      {item.AccountNo}
                    </td>
                    <td
                      style={rowBodyStyle}
                      className="text-capitalize border-0"
                    >
                      {item.AccountHolderName}
                    </td>
                    <td
                      style={rowBodyStyle}
                      className="text-uppercase border-0"
                    >
                      {item.IFSCcode}
                    </td>
                    <td style={rowBodyStyle} className="border-0">
                      {item.TaxDeduction}
                    </td>
                    <td style={rowBodyStyle} className="border-0">
                      <div className="d-flex  gap-3 justify-content-around">
                        <button
                          style={{
                            background: darkMode
                              ? "var(--secondaryDashMenuColor)"
                              : "var(--secondaryDashColorDark)",
                            color: darkMode
                              ? "var(--secondaryDashColorDark)"
                              : "var(--primaryDashMenuColor)",
                          }}
                          className="btn"
                          onClick={() => props.onEditSalary(item.data)}
                        >
                          <FaEdit /> Edit
                        </button>
                      </div>
                    </td>
                    <td style={rowBodyStyle} className="border-0">
                      <div className="d-flex  gap-3 justify-content-around">
                        <button
                          style={{
                            background: darkMode
                              ? "var(--secondaryDashMenuColor)"
                              : "var(--secondaryDashColorDark)",
                            color: darkMode
                              ? "var(--secondaryDashColorDark)"
                              : "var(--primaryDashMenuColor)",
                          }}
                          className="btn"
                          onClick={() => onSalaryDelete(item.data._id)}
                        >
                          <IoTrashBin /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>No Data Found</>
          )}
        </div>
        <div className="container-fluid p-2 px-3 d-flex justify-content-between stickey-bottom">
          <Button
            className="d-flex gap-2"
            onClick={handlePaginationPrev}
            disabled={currentPage === 1}
          >
            <GrFormPrevious className="my-auto" /> Previous
          </Button>
          <div className="pagination d-flex flex-nowrap gap-2">
            {pageNumbers.map((number) => (
              <Button
                key={number}
                style={{
                  backgroundColor: currentPage === number ? "active" : "white",
                  border: "none",
                  color: "gray",
                }}
                onClick={() => setCurrentPage(number)}
                className={currentPage === number ? "active" : ""}
              >
                {number}
              </Button>
            ))}
          </div>
          <Button
            onClick={handlePaginationNext}
            className="d-flex gap-3"
            disabled={indexOfLastItem >= sortedAndFilteredData.length}
          >
            <span className="">Next</span>{" "}
            <GrFormPrevious className="my-auto" style={{ rotate: "180deg" }} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSalaryTable;
