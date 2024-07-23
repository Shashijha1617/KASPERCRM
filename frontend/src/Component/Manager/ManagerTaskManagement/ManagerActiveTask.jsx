import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaCheck } from "react-icons/fa6";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdDeleteForever, MdOutlineAssignmentInd } from "react-icons/md";
import { Toaster, toast } from "react-hot-toast";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/esm/Table";
import { BsFiletypeDoc } from "react-icons/bs";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import { v4 as uuid } from "uuid";
import BASE_URL from "../../../Pages/config/config";
import ActiveTask from "../../../img/Task/ActiveTask.svg";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import "./TaskManagement.css";
import { HiDocumentSearch } from "react-icons/hi";
import { IoMdDoneAll } from "react-icons/io";

const ManagerActiveTask = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const name = localStorage.getItem("Name");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setIsCompleting] = useState(false);
  const [getEmployee, setGetEmployee] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [inputEmail, setInputEmail] = useState("");
  const [originalEmployeeData, setOriginalEmployeeData] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [isForwardButtonDisabled, setIsForwardButtonDisabled] = useState(true);
  const email = localStorage.getItem("Email");
  const [employeeData, setEmployeeData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [taskDepartment, setTaskDepartment] = useState("");
  const { socket } = useContext(AttendanceContext);
  const [taskName, setTaskName] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [empData, setEmpData] = useState(null);
  const { darkMode } = useTheme();
  const [flash, setFlash] = useState(false);

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/employee`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        const employeeObj = response.data;
        console.log("response", response.data);
        const emp = response.data.filter((val) => {
          return val.Email === email;
        });
        console.log(emp);
        setEmpData(emp);
        setEmployeeData(employeeObj);
        setLoading(false);
        const rowDataT = employeeObj.map((data) => {
          return {
            data,
            Email: data["Email"],
            department: data["department"][0]["DepartmentName"],
            FirstName: data["FirstName"] + "" + data["LastName"],
            ContactNo: data["ContactNo"],
            PositionName: data["position"][0]
              ? data["position"][0]["PositionName"]
              : "",
          };
        });
        console.log(rowDataT);
        setRowData(rowDataT);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const endDateTime = new Date(endDate);
    let remainingTime = endDateTime - now;

    if (remainingTime < 0) {
      // If remaining time is negative, consider it as delay
      remainingTime = Math.abs(remainingTime);
      return { delay: true, days: 0, hours: 0, minutes: 0 };
    } else {
      // Calculate remaining days, hours, minutes, and seconds
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      return { delay: false, days, hours, minutes };
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tasks`);
      // console.log(response.data)
      setTasks(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("getEmployee:", getEmployee);
  }, [getEmployee]);

  const forwordTaskToEmployee = async (taskId, dep, taskName) => {
    setTaskName(taskName);
    let filteredData = rowData.filter((val) => {
      return val.department === dep;
    });
    setRowData(filteredData);
    setTaskDepartment(dep);
    setSelectedTaskId(taskId);
    setModalShow(true);
  };

  const forwardTaskToEmployees = async (selectedTaskId) => {
    try {
      const employeeNotificationArr = [];
      for (const employee of selectedEmployees) {
        try {
          employeeNotificationArr.push(employee.Email);
          const employeeData = {
            empname: employee.FirstName,
            empemail: employee.Email,
            empdesignation: employee.PositionName,
            emptaskStatus: "Task Assigned",
          };

          await axios.post(
            `${BASE_URL}/api/tasks/${selectedTaskId}/employees`,
            {
              employees: [employeeData],
            }
          );
        } catch (error) {
          console.error(
            `Error forwarding task to ${employee.FirstName}:`,
            error.message
          );
        }
      }
      const taskId = uuid();
      console.log(empData[0].profile);
      if (empData[0].profile) {
        const employeeTaskNotification = {
          senderMail: email,
          employeesEmail: employeeNotificationArr,
          taskId,
          status: "unseen",
          message: `Task Assigned`,
          messageBy: name,
          profile: empData[0].profile.image_url,
          taskName,
          Account: 2,
          path: "newTask",
        };

        socket.emit("employeeTaskNotification", employeeTaskNotification);
      } else {
        const employeeTaskNotification = {
          senderMail: email,
          employeesEmail: employeeNotificationArr,
          taskId,
          status: "unseen",
          message: `Task Assigned`,
          messageBy: name,
          profile: null,
          taskName,
          Account: 2,
          path: "newTask",
        };

        socket.emit("employeeTaskNotification", employeeTaskNotification);
      }
      fetchData();

      setSelectedEmployees([]);
      setModalShow(false);
    } catch (error) {
      console.error("Error forwarding task:", error.message);
      toast.error("Failed to forward task. Please try again.");
    }
  };

  const completeTask = async (taskId, taskName, adminMail) => {
    try {
      setIsCompleting(true);

      const CompleteRemarks = prompt("Enter remarks to Complete Task:");

      if (CompleteRemarks === null) {
        setIsCompleting(false);
        return;
      }

      await axios.put(`${BASE_URL}/api/tasks/${taskId}`, {
        status: "Completed",
        comment: CompleteRemarks,
      });

      toast.success("Task completed successfully!");
      if (empData[0].profile) {
        const data = {
          taskId,
          status: "unseen",
          path: "taskstatus",
          senderMail: email,
          taskName,
          message: `Task Completed`,
          messageBy: name,
          profile: empData[0].profile.image_url,
          adminMail,
          Account: 1,
          taskStatus: "completed",
        };
        socket.emit("adminTaskNotification", data);
      } else {
        const data = {
          taskId,
          status: "unseen",
          path: "taskstatus",
          senderMail: email,
          taskName,
          message: `Task Completed`,
          messageBy: name,
          profile: null,
          adminMail,
          Account: 1,
          taskStatus: "completed",
        };
        socket.emit("adminTaskNotification", data);
      }

      fetchData();
    } catch (error) {
      console.error("Error completing task:", error.message);
      toast.error("Failed to complete task. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue === "") {
      setGetEmployee(originalEmployeeData);
    } else {
      const filteredEmployees = originalEmployeeData.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchValue) ||
          employee.email.toLowerCase().includes(searchValue) ||
          employee.designation.toLowerCase().includes(searchValue)
      );

      setGetEmployee(filteredEmployees);
    }
  };

  const handleInputChange = (e) => {
    setInputEmail(e.target.value);
  };

  const removeSelectedEmployee = (email) => {
    setSelectedEmployees(
      selectedEmployees.filter((employee) => employee.Email !== email)
    );
  };

  const addSelectedEmployee = (employee) => {
    const isChecked = selectedEmployees.some(
      (emp) => emp.Email === employee.Email
    );

    if (isChecked) {
      setSelectedEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.Email !== employee.Email)
      );
    } else {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
    if (selectedEmployees.length < 0) {
      setIsForwardButtonDisabled(true);
    } else {
      setIsForwardButtonDisabled(false); // Disable the button when there is at least one selected employee
    }

    setInputEmail("");
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedEmployees(selectAll ? [] : [...rowData]);
  };

  const calculateProgress = (task) => {
    const totalEmployees =
      task.employees.length -
      task.employees.filter((emp) => emp.emptaskStatus === "Rejected").length;
    const completedTasks = task.employees.filter(
      (emp) => emp.emptaskStatus === "Completed"
    ).length;
    return (completedTasks / totalEmployees) * 100;
  };

  const calculateTotalActiveTasks = () => {
    return tasks.filter(
      (task) => task.status === "Pending" && task.managerEmail === email
    ).length;
  };

  useEffect(() => {
    getPdf();
  }, []);
  const getPdf = async () => {
    const result = await axios.get(`${BASE_URL}/api/getTask`);
    console.log(result.data.data);
    setAllImage(result.data.data);
  };
  const showPdf = (id) => {
    let require =
      allImage &&
      allImage.filter((val) => {
        return val._id === id;
      });
    console.log(require[0].pdf);
    window.open(`${BASE_URL}/${require[0].pdf}`, "_blank", "noreferrer");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFlash((prevFlash) => !prevFlash);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="p-4"
    >
      <div
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
        }}
      >
        <h5 style={{ fontWeight: "600" }} className="p-0 m-0 text-uppercase">
          Active Task (
          {
            tasks.filter(
              (task) => task.status === "Pending" && task.managerEmail === email
            ).length
          }
          )
        </h5>
        <p className="p-0 m-0">You can view all active tasks here!</p>
      </div>

      {loading && (
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-grow text-primary" role="status"></div>
          <span className="text-primary fw-bold">Loading...</span>
        </div>
      )}

      {error && <p className="text-danger">{error}</p>}

      <div
        className="mt-2 pt-2  pb-3"
        style={{
          overflowY: "auto",
          maxHeight: "80vh",
          backgroundColor: darkMode
            ? "var(--primaryDashMenuColor)"
            : "var(--primaryDashColorDark)",
        }}
      >
        {tasks.filter(
          (task) => task.status === "Assigned" && task.managerEmail === email
        ).length > 0 ? (
          tasks
            .filter(
              (task) => task.status === "Pending" && task.managerEmail === email
            )
            .map((task, index) => (
              <details
                className="border   position-relative mt-3 fs-4  mx-3"
                key={task.id}
              >
                <summary
                  style={{
                    height: "fit-content",
                    minHeight: "3.5rem",
                    background:
                      "linear-gradient(165deg,#11009E, #700B97, 90%, #C84B31)",
                  }}
                  className="d-flex justify-content-between align-items-center pt-3 my-auto rounded-0 form-control text-white"
                >
                  <div className="d-flex justify-content-center gap-1 flex-column">
                    <h5 className="m-0 p-0">
                      # Task {index + 1} : {task.Taskname}
                    </h5>

                    <p style={{ fontSize: ".8rem" }} className="m-0  p-0">
                      Createor: {task.managerEmail}
                    </p>
                  </div>
                  <div
                    style={{ position: "absolute", top: "-10px", left: "20px" }}
                    className="fw-bold bg-white rounded-5 px-3 text-primary fs-6 d-flex justify-content-center aline-center flex-column"
                  >
                    {task.department}
                  </div>
                  <div className="d-flex gap-2 RemainingTimeHandel justify-content-between ">
                    {calculateRemainingTime(task.endDate).delay ? (
                      <div>
                        <div className="text-center d-none">
                          <div className="form-control fw-bold p-0">
                            {calculateRemainingTime(task.endDate).days}
                          </div>
                          <div>Day</div>
                        </div>
                        <h5
                          className={`btn btn-danger p-1 my-auto px-3 fw-bold ${
                            flash ? "flash" : ""
                          }`}
                        >
                          Late
                        </h5>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div
                          className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                          style={{
                            boxShadow: "0 0 5px 2px gray inset",
                            height: "30px",
                            minWidth: "30px",
                          }}
                        >
                          {calculateRemainingTime(task.endDate).days}{" "}
                        </div>{" "}
                        <div>Day</div>
                      </div>
                    )}
                    {calculateRemainingTime(task.endDate).delay ? (
                      <div className="text-center d-none">
                        <div
                          className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                          style={{
                            boxShadow: "0 0 5px 2px gray inset",
                            height: "30px",
                            minWidth: "30px",
                          }}
                        >
                          {calculateRemainingTime(task.endDate).hours}{" "}
                        </div>{" "}
                        <div>Min</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div
                          className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                          style={{
                            boxShadow: "0 0 5px 2px gray inset",
                            height: "30px",
                            minWidth: "30px",
                          }}
                        >
                          {calculateRemainingTime(task.endDate).hours}{" "}
                        </div>{" "}
                        <div>Hrs</div>
                      </div>
                    )}
                    {calculateRemainingTime(task.endDate).delay ? (
                      <div className="text-center d-none">
                        <div
                          className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                          style={{
                            boxShadow: "0 0 5px 2px gray inset",
                            height: "30px",
                            minWidth: "30px",
                          }}
                        >
                          {calculateRemainingTime(task.endDate).minutes}{" "}
                        </div>{" "}
                        <div>Min</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div
                          className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                          style={{
                            boxShadow: "0 0 5px 2px gray inset",
                            height: "30px",
                            minWidth: "30px",
                          }}
                        >
                          {calculateRemainingTime(task.endDate).minutes}{" "}
                        </div>{" "}
                        <div>Min</div>
                      </div>
                    )}
                  </div>
                </summary>
                <div
                  style={{ position: "relative" }}
                  className="row p-1 my-2 mx-0 rounded"
                >
                  <div
                    style={{
                      height: "fit-content",
                      backgroundColor: darkMode
                        ? "var(--primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                    }}
                    className=""
                  >
                    <div
                      style={{ height: "fit-content" }}
                      className="text-start fs-6"
                    >
                      <h6 className="fw-bold">Task Discription</h6>
                      <div className="row justify-between">
                        <div className="col-11">{task.description}</div>
                        <div
                          className="col-1 d-flex"
                          style={{
                            width: "6rem",
                            height: "6rem",
                            borderRadius: "50%",
                          }}
                        >
                          <CircularProgressbar
                            className="fw-bold"
                            value={calculateProgress(task)}
                            text={`${calculateProgress(task).toFixed(0)}%`}
                            styles={buildStyles({
                              pathColor: "#28a745",
                              textColor: "#28a745",
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      style={{ height: "fit-content" }}
                      className="row d-flex pt-3 mx-1 justify-content-between"
                    >
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-12 col-sm-6 col-md-2"
                      >
                        Task Durations <br /> <span>{task.duration} days</span>{" "}
                      </p>
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-12 col-sm-6 col-md-2"
                      >
                        122112
                      </p>
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-12 col-sm-6 col-md-2"
                      >
                        Start Date <br />{" "}
                        <span>
                          {new Date(task.startDate).toLocaleDateString()}
                        </span>
                      </p>
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-12 col-sm-6 col-md-2"
                      >
                        End Date <br />{" "}
                        <span>
                          {new Date(task.endDate).toLocaleDateString()}
                        </span>
                      </p>
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-12 col-sm-6 col-md-2"
                      >
                        <span>
                          Task Status <br /> {task.status}
                        </span>
                      </p>
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-12 col-sm-6 col-md-2"
                      >
                        <span>
                          Remarks <br /> {task.comment}
                        </span>
                      </p>
                    </div>

                    <div
                      style={{ height: "fit-content" }}
                      className="row d-flex pt-3 rounded mx-1 justify-content-between"
                    >
                      <h6 className="fw-bold m-0 p-0 my-1">
                        Forwarded Members Status
                      </h6>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>S. No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Designation</th>
                            <th>Task Status</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {task.employees.map((taskemp, i) => (
                            <tr key={i}>
                              <td
                                style={{
                                  backgroundColor:
                                    taskemp.emptaskStatus === "Completed"
                                      ? "rgba(25, 201, 84, 0.436)"
                                      : taskemp.emptaskStatus === "Rejected"
                                      ? "rgba(214, 92, 44, 0.636)"
                                      : "inherit",
                                }}
                              >
                                {i + 1}
                              </td>
                              <td
                                style={{
                                  backgroundColor:
                                    taskemp.emptaskStatus === "Completed"
                                      ? "rgba(25, 201, 84, 0.436)"
                                      : taskemp.emptaskStatus === "Rejected"
                                      ? "rgba(214, 92, 44, 0.636)"
                                      : "inherit",
                                }}
                              >
                                {taskemp.empname}
                              </td>
                              <td
                                style={{
                                  backgroundColor:
                                    taskemp.emptaskStatus === "Completed"
                                      ? "rgba(25, 201, 84, 0.436)"
                                      : taskemp.emptaskStatus === "Rejected"
                                      ? "rgba(214, 92, 44, 0.636)"
                                      : "inherit",
                                }}
                              >
                                {taskemp.empemail}
                              </td>
                              <td
                                style={{
                                  backgroundColor:
                                    taskemp.emptaskStatus === "Completed"
                                      ? "rgba(25, 201, 84, 0.436)"
                                      : taskemp.emptaskStatus === "Rejected"
                                      ? "rgba(214, 92, 44, 0.636)"
                                      : "inherit",
                                }}
                              >
                                {taskemp.empdesignation}
                              </td>
                              <td
                                style={{
                                  backgroundColor:
                                    taskemp.emptaskStatus === "Completed"
                                      ? "rgba(25, 201, 84, 0.436)"
                                      : taskemp.emptaskStatus === "Rejected"
                                      ? "rgba(214, 92, 44, 0.636)"
                                      : "inherit",
                                }}
                              >
                                {taskemp.emptaskStatus}
                              </td>
                              <td
                                style={{
                                  backgroundColor:
                                    taskemp.emptaskStatus === "Completed"
                                      ? "rgba(25, 201, 84, 0.436)"
                                      : taskemp.emptaskStatus === "Rejected"
                                      ? "rgba(214, 92, 44, 0.636)"
                                      : "inherit",
                                }}
                              >
                                {taskemp.empTaskComment}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    <div
                      style={{ height: "fit-content" }}
                      className="d-flex  pt-3 rounded mx-1 justify-content-between"
                    >
                      <button
                        className="btn btn-primary rounded-5 d-flex justify-center aline-center gap-2"
                        onClick={() =>
                          forwordTaskToEmployee(
                            task._id,
                            task.department,
                            task.Taskname
                          )
                        }
                      >
                        <MdOutlineAssignmentInd />{" "}
                        <span className="d-none d-md-flex">Forward Task</span>
                      </button>
                      <button
                        className="btn btn-warning rounded-5 d-flex justify-center aline-center gap-2"
                        onClick={() => showPdf(task._id)}
                      >
                        <HiDocumentSearch />{" "}
                        <span className="d-none d-md-flex">
                          View attachment
                        </span>
                      </button>
                      <button
                        className="btn btn-success rounded-5 d-flex justify-center aline-center gap-2"
                        onClick={() =>
                          completeTask(task._id, task.adminMail, task.Taskname)
                        }
                        disabled={calculateProgress(task) !== 100}
                      >
                        <IoMdDoneAll />
                        <span className="d-none d-md-flex">Complete Task</span>
                      </button>
                    </div>
                  </div>
                </div>
              </details>
            ))
        ) : (
          <div
            className="d-flex flex-column gap-3 align-items-center justify-content-center"
            style={{ height: "80vh" }}
          >
            <img
              style={{ width: "30%", height: "auto" }}
              src={ActiveTask}
              alt=""
            />
            <p>Sorry, there are no tasks assigned yet.</p>
          </div>
        )}
      </div>

      <Modal
        fullscreen={true}
        show={modalShow}
        onHide={() => setModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Forward Task to Employees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <form className="d-flex col-8 flex-column gap-3">
              <input
                className="w-100 py-1 px-2 rounded-5 border"
                type="search"
                name=""
                placeholder="Search..."
                id=""
                value={inputEmail}
                onChange={(e) => {
                  handleInputChange(e);
                  handleSearch(e);
                }}
              />
              <div>
                <div className=" p-2">
                  {" "}
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    onChange={toggleSelectAll}
                    checked={selectAll}
                  />{" "}
                  <span>Select All</span>
                </div>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Designation</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rowData.map((row, index) => (
                      <tr key={index}>
                        <th scope="row">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onChange={() => addSelectedEmployee(row)}
                            checked={selectedEmployees.some(
                              (emp) => emp.Email === row.Email
                            )}
                          />
                        </th>
                        <td>{row.FirstName}</td>
                        <td>{row.Email}</td>
                        <td>{row.ContactNo}</td>
                        <td>{row.PositionName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </form>
            <div className="d-flex flex-column col-4 gap-2 ">
              <div
                className="row form-control d-flex pt-3 rounded mx-1 justify-content-between"
                style={{ height: "fit-content" }}
              >
                <div>
                  <span className="fw-bold ">Selected Employees:</span>
                  {selectedEmployees.map((employee, index) => (
                    <div key={index} className="d-flex">
                      <span
                        style={{
                          boxShadow: "-3px 3px 5px rgba(204, 201, 201, 0.767)",
                          width: "fit-content",
                        }}
                        className="selected-employee-email d-flex btn gap-2 aline-center  btn-light py-1 px-2 m-1"
                        onClick={() => removeSelectedEmployee(employee.Email)}
                      >
                        {employee.FirstName} - {employee.PositionName}
                        <span className="text-danger d-none">
                          <MdDeleteForever />
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn  btn-primary "
                onClick={() => forwardTaskToEmployees(selectedTaskId)}
                disabled={isForwardButtonDisabled}
              >
                Forward Task to Employees
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setModalShow(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManagerActiveTask;
