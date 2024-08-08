import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaCheck } from "react-icons/fa6";
import {
  IoChatbubble,
  IoChatbubbles,
  IoCheckmarkDone,
  IoCheckmarkDoneCircleSharp,
  IoCheckmarkDoneSharp,
} from "react-icons/io5";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdDeleteForever,
  MdOutlineAssignmentInd,
  MdOutlineCancel,
} from "react-icons/md";
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
import { IoIosSend, IoMdDoneAll } from "react-icons/io";
import { RiArrowDropDownLine, RiAttachmentLine } from "react-icons/ri";
import { PiInfoLight } from "react-icons/pi";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import AvatarGroup from "../../../Pages/AvatarGroup/AvatarGroup";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import OverLayToolTip from "../../../Utils/OverLayToolTip";
import { AiFillFilePpt, AiFillFileWord } from "react-icons/ai";

const ManagerActiveTask = () => {
  const history = useHistory();
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
  // const { socket } = useContext(AttendanceContext);
  const [taskName, setTaskName] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [empData, setEmpData] = useState(null);
  const { darkMode } = useTheme();
  const [flash, setFlash] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewDetsils, setViewDetails] = useState(false);
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const { socket, setMessageData } = useContext(AttendanceContext);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  const calculateRemainingTime = (endDate) => {
    const now = currentTime;
    const endDateTime = new Date(endDate);
    let remainingTime = endDateTime - now;

    if (remainingTime < 0) {
      return { delay: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    } else {
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      return { delay: false, days, hours, minutes, seconds };
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

  const forwordTaskToEmployee = async (taskId, dep, taskName, task) => {
    console.log(task);
    setTaskName(taskName);

    const employeeEmails = task.employees.map((emp) => emp.empemail);

    let filteredData = rowData.filter((val) => {
      return (
        val.department === dep &&
        !employeeEmails.includes(val.Email) &&
        val.Email !== email &&
        (val.data.reportHr || val.data.reportManager) &&
        val.data.Account !== 4
      );
    });
    setRowData(filteredData);
    setTaskDepartment(dep);
    setSelectedTaskId(taskId);
    setModalShow(true);
  };

  console.log(tasks);

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

  const images = [
    "https://i.pinimg.com/originals/07/33/ba/0733ba760b29378474dea0fdbcb97107.png",
    "https://th.bing.com/th/id/OIP.JOHFjMBnZGE-SOXzMSxdRwAAAA?w=402&h=467&rs=1&pid=ImgDetMain",
    "https://www.uscareerinstitute.edu/images/accounting-AAS-outcomes.jpg",
    "https://localist-images.azureedge.net/photos/43897493381666/square_300/51e7610f317e68641dedf4c24787c5056937a657.jpg",
    "https://drscdn.500px.org/photo/81956917/q%3D80_m%3D1000/v2?sig=fa09099be5e5d95d537e9656700fc1f56e29f00fd5dcccc8241aca59e4a60632",
    "https://www.tejgaoncollege.edu.bd/wp-content/uploads/2022/04/Tanjida-Akter.jpg",
  ];

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
    padding: ".5rem",
  };

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const navigateHandler = (taskId, to) => {
    setMessageData({ taskId, to: [to], name });
    history.push("/manager/admin_manager");
  };
  const navigateEmpHandler = (task) => {
    console.log(task);
    const taskId = task._id;
    const to = task.employees
      .filter((val) => {
        return val.emptaskStatus !== "Task Assigned";
      })
      .map((val) => val.empemail);

    if (to.length > 0) {
      setMessageData({ taskId, to, name });
      history.push("/manager/emp_manager");
    }
  };

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

      <div className="row  mx-auto text-white">
        {tasks.filter(
          (task) => task.status === "Pending" && task.managerEmail === email
        ).length > 0 ? (
          tasks
            .filter(
              (task) => task.status === "Pending" && task.managerEmail === email
            )
            .map((task, index) => (
              <div
                key={task.id}
                style={{
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}
                className="col-12 col-md-6 col-lg-4  p-2 "
              >
                <div
                  style={{
                    border: !darkMode
                      ? "1px solid var(--primaryDashMenuColor)"
                      : "1px solid var(--secondaryDashColorDark)",
                  }}
                  className=" task-hover-effect p-2"
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="text-capitalize">{task.Taskname}</h5>
                    <button className="btn btn-info text-capitalize">
                      {task.status}
                    </button>
                  </div>
                  <hr />
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        style={{
                          height: "30px",
                          width: "30px",
                          borderRadius: "50%",
                        }}
                        src="https://rihodjango.pixelstrap.net/riho/rihoapp/static/assets/images/user/3.jpg"
                        alt=""
                      />{" "}
                      <span>{task.adminMail}</span>
                    </div>
                    <span
                      style={{
                        border: darkMode
                          ? "1px solid var(--primaryDashColorDark)"
                          : "1px solid var(--primaryDashMenuColor)",
                      }}
                      className="px-2 py-1 text-center"
                    >
                      {task.department}
                    </span>
                  </div>
                  <hr />
                  <div className="my-3 d-flex flex-column gap-1">
                    Task Description
                    <span className="text-capitalize">{task.description}</span>
                  </div>
                  <hr />
                  <div>
                    <div className="d-flex align-items-start justify-content-between">
                      <span className="d-flex flex-column">
                        <span className="d-flex align-items-center gap-2">
                          Task Duration{" "}
                          <span style={{ position: "relative" }}>
                            {" "}
                            <PiInfoLight />{" "}
                          </span>
                        </span>{" "}
                        <span style={{ width: "fit-content" }}>
                          {task.duration} days
                        </span>
                      </span>
                      <span className="d-flex flex-column">
                        Start Date{" "}
                        <span style={{ width: "fit-content" }}>
                          {getFormattedDate(task.startDate)}
                        </span>
                      </span>
                      <span className="d-flex flex-column">
                        {" "}
                        End Date{" "}
                        <span style={{ width: "fit-content" }}>
                          {getFormattedDate(task.endDate)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div style={{ maxWidth: "100%" }}>
                    <div className="d-flex align-items-center justify-content-between my-3">
                      {/* <AvatarGroup images={images} /> */}
                      <div
                        className="d-flex"
                        style={{
                          width: "4rem",
                          height: "4rem",
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
                    <span
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setTimeinfo("name")}
                      onMouseLeave={() => setTimeinfo(false)}
                      onClick={() => toggleTaskDetails(task._id)}
                    >
                      {expandedTaskId === task._id ? (
                        <span>
                          View Less <MdArrowDropUp className="fs-4" />
                        </span>
                      ) : (
                        <span>
                          {" "}
                          View Details <MdArrowDropDown className="fs-4" />
                        </span>
                      )}
                    </span>
                  </div>
                  {expandedTaskId === task._id && (
                    <>
                      {" "}
                      <div
                        style={{
                          maxWidth: "100%",
                          overflow: "auto",
                        }}
                      >
                        <table striped bordered hover>
                          <thead>
                            <tr>
                              <th style={rowHeadStyle}>S. No </th>
                              <th style={rowHeadStyle}> Name</th>
                              <th style={rowHeadStyle}> Email</th>
                              <th style={rowHeadStyle}> Designation</th>
                              <th style={rowHeadStyle}> Task Status</th>
                              <th style={rowHeadStyle}> Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {task.employees.map((taskemp, i) => (
                              <tr key={i}>
                                <td
                                  style={{
                                    verticalAlign: "middle",
                                    whiteSpace: "pre",
                                    backgroundColor:
                                      taskemp.emptaskStatus === "Completed"
                                        ? "rgba(25, 201, 84, 0.436)"
                                        : taskemp.emptaskStatus === "Rejected"
                                        ? "rgba(214, 92, 44, 0.636)"
                                        : "inherit",
                                    color: darkMode
                                      ? "var(--secondaryDashColorDark)"
                                      : "var(--primaryDashMenuColor)",
                                    border: "none",
                                    padding: ".5rem",
                                  }}
                                >
                                  {i + 1}
                                </td>
                                <td
                                  style={{
                                    verticalAlign: "middle",
                                    whiteSpace: "pre",
                                    backgroundColor:
                                      taskemp.emptaskStatus === "Completed"
                                        ? "rgba(25, 201, 84, 0.436)"
                                        : taskemp.emptaskStatus === "Rejected"
                                        ? "rgba(214, 92, 44, 0.636)"
                                        : "inherit",
                                    color: darkMode
                                      ? "var(--secondaryDashColorDark)"
                                      : "var(--primaryDashMenuColor)",
                                    border: "none",
                                    padding: ".5rem",
                                  }}
                                >
                                  {taskemp.empname}
                                </td>
                                <td
                                  style={{
                                    verticalAlign: "middle",
                                    whiteSpace: "pre",
                                    backgroundColor:
                                      taskemp.emptaskStatus === "Completed"
                                        ? "rgba(25, 201, 84, 0.436)"
                                        : taskemp.emptaskStatus === "Rejected"
                                        ? "rgba(214, 92, 44, 0.636)"
                                        : "inherit",
                                    color: darkMode
                                      ? "var(--secondaryDashColorDark)"
                                      : "var(--primaryDashMenuColor)",
                                    border: "none",
                                    padding: ".5rem",
                                  }}
                                >
                                  {taskemp.empemail}
                                </td>
                                <td
                                  style={{
                                    verticalAlign: "middle",
                                    whiteSpace: "pre",
                                    backgroundColor:
                                      taskemp.emptaskStatus === "Completed"
                                        ? "rgba(25, 201, 84, 0.436)"
                                        : taskemp.emptaskStatus === "Rejected"
                                        ? "rgba(214, 92, 44, 0.636)"
                                        : "inherit",
                                    color: darkMode
                                      ? "var(--secondaryDashColorDark)"
                                      : "var(--primaryDashMenuColor)",
                                    border: "none",
                                    padding: ".5rem",
                                  }}
                                >
                                  {taskemp.empdesignation}
                                </td>
                                <td
                                  style={{
                                    verticalAlign: "middle",
                                    whiteSpace: "pre",
                                    backgroundColor:
                                      taskemp.emptaskStatus === "Completed"
                                        ? "rgba(25, 201, 84, 0.436)"
                                        : taskemp.emptaskStatus === "Rejected"
                                        ? "rgba(214, 92, 44, 0.636)"
                                        : "inherit",
                                    color: darkMode
                                      ? "var(--secondaryDashColorDark)"
                                      : "var(--primaryDashMenuColor)",
                                    border: "none",
                                    padding: ".5rem",
                                  }}
                                >
                                  {taskemp.emptaskStatus}
                                </td>
                                <td
                                  style={{
                                    verticalAlign: "middle",
                                    whiteSpace: "pre",
                                    backgroundColor:
                                      taskemp.emptaskStatus === "Completed"
                                        ? "rgba(25, 201, 84, 0.436)"
                                        : taskemp.emptaskStatus === "Rejected"
                                        ? "rgba(214, 92, 44, 0.636)"
                                        : "inherit",
                                    color: darkMode
                                      ? "var(--secondaryDashColorDark)"
                                      : "var(--primaryDashMenuColor)",
                                    border: "none",
                                    padding: ".5rem",
                                  }}
                                >
                                  {taskemp.empTaskComment}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="d-flex flex-column my-2">
                        Remarks
                        <span>{task.comment}</span>
                      </div>
                      <hr />
                      <span className="d-flex flex-column gap-1">
                        <h6>Time Left</h6>
                        <span>
                          <div
                            style={{
                              display:
                                expandedTaskId === task._id ? "flex" : "none",
                            }}
                          >
                            <div className="d-flex gap-2 justify-content-between">
                              {calculateRemainingTime(task.endDate).delay ? (
                                <div className="">
                                  <span className=" rounded-5 border border-danger  my-auto  p-1 px-2">
                                    Please finish the task as soon as you can,
                                    as it's running late.
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <div className="text-center">
                                    <div
                                      className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                      style={{
                                        boxShadow: "0 0 5px 2px gray inset",
                                        height: "30px",
                                        minWidth: "30px",
                                      }}
                                    >
                                      {
                                        calculateRemainingTime(task.endDate)
                                          .days
                                      }
                                    </div>
                                    <div>Day</div>
                                  </div>
                                  <div className="text-center">
                                    <div
                                      className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                      style={{
                                        boxShadow: "0 0 5px 2px gray inset",
                                        height: "30px",
                                        minWidth: "30px",
                                      }}
                                    >
                                      {
                                        calculateRemainingTime(task.endDate)
                                          .hours
                                      }
                                    </div>
                                    <div>Hrs</div>
                                  </div>
                                  <div className="text-center">
                                    <div
                                      className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                      style={{
                                        boxShadow: "0 0 5px 2px gray inset",
                                        height: "30px",
                                        minWidth: "30px",
                                      }}
                                    >
                                      {
                                        calculateRemainingTime(task.endDate)
                                          .minutes
                                      }
                                    </div>
                                    <div>Min</div>
                                  </div>
                                  <div className="text-center">
                                    <div
                                      className="d-flex px-1 bg-white text-black align-items-center justify-content-center"
                                      style={{
                                        boxShadow: "0 0 5px 2px gray inset",
                                        height: "30px",
                                        minWidth: "30px",
                                      }}
                                    >
                                      {
                                        calculateRemainingTime(task.endDate)
                                          .seconds
                                      }
                                    </div>
                                    <div>Sec</div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </span>
                      </span>
                      <hr />
                      {/* <div className="d-flex flex-column gap-2 my-2">
                        Action
                        <div className="d-flex gap-3  just">
                          <button
                            onClick={() =>
                              forwordTaskToEmployee(
                                task._id,
                                task.department,
                                task.Taskname
                              )
                            }
                            className="btn btn-primary  py-1"
                          >
                            <MdOutlineAssignmentInd /> Forword Task
                          </button>
                          <button
                            onClick={() => showPdf(task._id)}
                            className="btn btn-secondary py-1"
                          >
                            <RiAttachmentLine /> Attachment
                          </button>
                          <button
                            onClick={() => showPdf(task._id)}
                            className="btn btn-secondary py-1"
                          >
                            Update Admin
                          </button>
                          <button
                            onClick={() => navigateEmpHandler(task)}
                            className="btn btn-secondary py-1"
                          >
                            update Emp
                          </button>
                          <button
                            onClick={() =>
                              completeTask(
                                task._id,
                                task.adminMail,
                                task.Taskname
                              )
                            }
                            disabled={calculateProgress(task) !== 100}
                            className="btn btn-success py-1"
                          >
                            <IoCheckmarkDone /> Complete
                          </button>
                        </div>
                      </div> */}
                      <div
                        style={{ height: "fit-content" }}
                        className="d-flex rounded mx-1 justify-content-between"
                      >
                        {" "}
                        <OverLayToolTip
                          icon={<IoIosSend className="fs-4 text-success" />}
                          onClick={() =>
                            forwordTaskToEmployee(
                              task._id,
                              task.department,
                              task.Taskname,
                              task
                            )
                          }
                          tooltip={"Forward Task"}
                        />
                        <OverLayToolTip
                          icon={<AiFillFilePpt className="fs-4 text-danger" />}
                          onClick={() => showPdf(task._id)}
                          tooltip={"Attachment"}
                        />
                        <OverLayToolTip
                          icon={<IoChatbubble className="fs-4 text-primary " />}
                          onClick={() =>
                            navigateHandler(task._id, task.adminMail)
                          }
                          tooltip={"Ask Admin"}
                        />
                        {task.employees.length > 0 &&
                        task.employees.filter((val) => {
                          return val.emptaskStatus !== "Task Assigned";
                        }).length > 0 ? (
                          <OverLayToolTip
                            icon={
                              <IoChatbubbles className="fs-4 text-primary " />
                            }
                            onClick={() => navigateEmpHandler(task)}
                            tooltip={"Ask Team"}
                          />
                        ) : (
                          <></>
                        )}
                        <OverLayToolTip
                          icon={
                            <IoCheckmarkDoneCircleSharp className="fs-4 text-success" />
                          }
                          onClick={() =>
                            completeTask(
                              task._id,
                              task.adminMail,
                              task.Taskname
                            )
                          }
                          tooltip={"Complete Task"}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
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

      {loading && (
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-grow text-primary" role="status"></div>
          <span className="text-primary fw-bold">Loading...</span>
        </div>
      )}

      {error && <p className="text-danger">{error}</p>}
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
