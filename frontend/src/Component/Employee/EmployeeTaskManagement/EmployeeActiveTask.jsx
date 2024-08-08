import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { toast } from "react-hot-toast";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdOutlineAssignmentInd,
  MdOutlineCancel,
} from "react-icons/md";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";
import { IoIosChatboxes, IoMdDoneAll } from "react-icons/io";
import { RiAttachmentLine } from "react-icons/ri";
const EmployeeActiveTask = () => {
  const { setMessageData } = useContext(AttendanceContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [allImage, setAllImage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { darkMode } = useTheme();
  const history = useHistory();
  const email = localStorage.getItem("Email");
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

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
      setTasks(response.data);
      let fildata = response.data.filter(
        (task) =>
          task.status === "Pending" &&
          task.employees.some(
            (taskemp) => taskemp.empemail === email && taskemp === "Accepted"
          )
      );
      console.log(fildata);
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

  const askStatus = async (taskId) => {
    // Implement the logic to ask for task status (e.g., open a modal or show a notification)
  };
  const AcceptTask = async (taskId) => {
    try {
      setIsAccepted(true);

      // Prompt the user for cancellation remarks
      const cancellationRemarks = prompt("Enter remarks for Accept Task:");

      if (cancellationRemarks === null) {
        // If the user clicks Cancel in the prompt, do nothing
        setIsAccepted(false);
        return;
      }

      // Update the task status to "Cancelled" in the database
      await axios.put(`${BASE_URL}/api/tasks/${taskId}`, {
        status: "Pending",
        comment: cancellationRemarks,
      });

      // Display success notification
      toast.success("Task canceled successfully!");

      // Update the UI by fetching the latest tasks
      fetchData();
    } catch (error) {
      console.error("Error canceling task:", error.message);
      toast.error("Failed to cancel task. Please try again.");
    } finally {
      setIsAccepted(false);
    }
  };
  const RejectTask = async (taskId) => {
    try {
      setIsRejected(true);
      const RejectRemarks = prompt("Enter remarks for Reject Task:");

      if (RejectRemarks === null) {
        setIsRejected(false);
        return;
      }

      await axios.put(`${BASE_URL}/api/tasks/${taskId}`, {
        status: "Rejected",
        comment: RejectRemarks,
      });

      toast.success("Task Rejected");

      fetchData();
    } catch (error) {
      console.error("Error Rejecting task:", error.message);
      toast.error("Failed to Reject task. Please try again.");
    } finally {
      setIsRejected(false);
    }
  };
  const completeTask = async (taskId) => {
    try {
      setIsCompleting(true);

      // Prompt the user for cancellation remarks
      const CompleteRemarks = prompt("Enter remarks to Complete Task:");

      if (CompleteRemarks === null) {
        // If the user clicks Cancel in the prompt, do nothing
        setIsCompleting(false);
        return;
      }

      // Update the task status to "Cancelled" in the database
      await axios.put(`${BASE_URL}/api/tasks/${taskId}`, {
        status: "Completed",
        comment: CompleteRemarks,
      });

      // Display success notification
      toast.success("Task canceled successfully!");

      // Update the UI by fetching the latest tasks
      fetchData();
    } catch (error) {
      console.error("Error canceling task:", error.message);
      toast.error("Failed to cancel task. Please try again.");
    } finally {
      setIsCanceling(false);
    }
  };
  //   const navigateEmpHandler=(task)=>{
  //     console.log(task)
  // const taskId = task._id;
  // const managerEmail = task.managerEmail;
  // let to = task.employees.filter((val)=>{
  //   return val.empemail !==email
  // }).map((val)=> val.empemail)
  // to = [...to, managerEmail]
  // if(to.length>0){
  // setMessageData({taskId, to})
  //     history.push("/employee/emp_manager")
  // }

  //   }

  const navigateEmpHandler = (task) => {
    console.log(task);
    const taskId = task._id;
    const managerEmail = task.managerEmail;
    let to = task.employees
      .filter((val) => {
        return val.empemail !== email;
      })
      .map((val) => val.empemail);
    to = [...to, managerEmail];
    if (to.length > 0) {
      setMessageData({ taskId, to });
      history.push("/employee/emp_manager");
    }
  };

  const showPdf = (id) => {
    const require = allImage?.find((val) => val._id === id);
    if (require) {
      window.open(`${BASE_URL}/${require.pdf}`, "_blank", "noreferrer");
    }
  };

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  return (
    <div className="container-fluid py-2">
      <TittleHeader
        numbers={
          tasks.filter(
            (task) =>
              task.status === "Pending" &&
              task.employees.some(
                (taskemp) =>
                  taskemp.empemail === email &&
                  taskemp.emptaskStatus === "Accepted"
              )
          ).length
        }
        title={"Active Task"}
        message={"You can view all your active task here."}
      />
      {loading && (
        <div
          style={{ width: "100%", height: "100%" }}
          className="d-flex aline-center gap-2"
        >
          <div
            className="spinner-grow bg-primary"
            style={{ width: "1rem", height: "1rem" }}
            role="status"
          ></div>

          <span className="text-primary fw-bold">Loading...</span>
        </div>
      )}

      <div className="row mx-auto">
        {tasks
          .filter(
            (task) =>
              task.status === "Pending" &&
              task.employees.some(
                (taskemp) =>
                  taskemp.empemail === email &&
                  taskemp.emptaskStatus === "Accepted"
              )
          )
          .map((task, index) => (
            <div
              key={task._id}
              style={{
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--secondaryDashMenuColor)",
              }}
              className="col-12 col-md-6 col-lg-4 p-2"
            >
              <div
                style={{
                  border: !darkMode
                    ? "1px solid var(--primaryDashMenuColor)"
                    : "1px solid var(--secondaryDashColorDark)",
                }}
                className="task-hover-effect p-2"
              >
                <div className="d-flex align-items-center justify-content-between">
                  <h5>{task.Taskname}</h5>
                  <button className="btn btn-primary">{task.status}</button>
                </div>
                <hr />
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      style={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      src="https://www.portalcidade.news/wp-content/uploads/2021/11/email-logo.jpg"
                      alt=""
                    />
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
                  <h6>Task Description</h6>
                  <span>{task.description}</span>
                </div>
                <div>
                  <div style={{ width: "100%", overflow: "auto" }}>
                    <h6>Task Details</h6>
                    <table className="table">
                      <thead>
                        <tr>
                          <th
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --primaryDashMenuColor)"
                                : "var(--primaryDashColorDark)",
                              color: darkMode
                                ? "var(--primaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            Task Durations
                          </th>
                          <th
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --primaryDashMenuColor)"
                                : "var(--primaryDashColorDark)",
                              color: darkMode
                                ? "var(--primaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            Manager Email
                          </th>
                          <th
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --primaryDashMenuColor)"
                                : "var(--primaryDashColorDark)",
                              color: darkMode
                                ? "var(--primaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            Start Date
                          </th>
                          <th
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --primaryDashMenuColor)"
                                : "var(--primaryDashColorDark)",
                              color: darkMode
                                ? "var(--primaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            End Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --secondaryDashMenuColor)"
                                : "var(--secondaryDashColorDark)",
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            {task.duration} days
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --secondaryDashMenuColor)"
                                : "var(--secondaryDashColorDark)",
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            {task.managerEmail}
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --secondaryDashMenuColor)"
                                : "var(--secondaryDashColorDark)",
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            {new Date(task.startDate)
                              .toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              .replace(",", "")}
                          </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              whiteSpace: "pre",
                              background: darkMode
                                ? "var( --secondaryDashMenuColor)"
                                : "var(--secondaryDashColorDark)",
                              color: darkMode
                                ? "var(--secondaryDashColorDark)"
                                : "var( --primaryDashMenuColor)",
                              border: "none",
                            }}
                          >
                            {new Date(task.endDate)
                              .toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              .replace(",", "")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
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
                    <div>
                      <div className="d-flex flex-column my-2">
                        <h6>Remarks</h6>
                        <span>{task.comment}</span>
                      </div>
                      <hr />
                      <div style={{ width: "100%", overflow: "auto" }}>
                        <h6>Project Members</h6>
                        <table className="table">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  verticalAlign: "middle",
                                  whiteSpace: "pre",
                                  background: darkMode
                                    ? "var( --primaryDashMenuColor)"
                                    : "var(--primaryDashColorDark)",
                                  color: darkMode
                                    ? "var(--primaryDashColorDark)"
                                    : "var( --primaryDashMenuColor)",
                                  border: "none",
                                }}
                              >
                                S. No
                              </th>
                              <th
                                style={{
                                  verticalAlign: "middle",
                                  whiteSpace: "pre",
                                  background: darkMode
                                    ? "var( --primaryDashMenuColor)"
                                    : "var(--primaryDashColorDark)",
                                  color: darkMode
                                    ? "var(--primaryDashColorDark)"
                                    : "var( --primaryDashMenuColor)",
                                  border: "none",
                                }}
                              >
                                Name
                              </th>
                              <th
                                style={{
                                  verticalAlign: "middle",
                                  whiteSpace: "pre",
                                  background: darkMode
                                    ? "var( --primaryDashMenuColor)"
                                    : "var(--primaryDashColorDark)",
                                  color: darkMode
                                    ? "var(--primaryDashColorDark)"
                                    : "var( --primaryDashMenuColor)",
                                  border: "none",
                                }}
                              >
                                Email
                              </th>
                              <th
                                style={{
                                  verticalAlign: "middle",
                                  whiteSpace: "pre",
                                  background: darkMode
                                    ? "var( --primaryDashMenuColor)"
                                    : "var(--primaryDashColorDark)",
                                  color: darkMode
                                    ? "var(--primaryDashColorDark)"
                                    : "var( --primaryDashMenuColor)",
                                  border: "none",
                                }}
                              >
                                Designation
                              </th>
                              <th
                                style={{
                                  verticalAlign: "middle",
                                  whiteSpace: "pre",
                                  background: darkMode
                                    ? "var( --primaryDashMenuColor)"
                                    : "var(--primaryDashColorDark)",
                                  color: darkMode
                                    ? "var(--primaryDashColorDark)"
                                    : "var( --primaryDashMenuColor)",
                                  border: "none",
                                }}
                              >
                                Task Status
                              </th>
                              <th
                                style={{
                                  verticalAlign: "middle",
                                  whiteSpace: "pre",
                                  background: darkMode
                                    ? "var( --primaryDashMenuColor)"
                                    : "var(--primaryDashColorDark)",
                                  color: darkMode
                                    ? "var(--primaryDashColorDark)"
                                    : "var( --primaryDashMenuColor)",
                                  border: "none",
                                }}
                              >
                                Remarks
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {task.employees
                              .filter(
                                (taskemp) =>
                                  taskemp.emptaskStatus === "Accepted" ||
                                  taskemp.emptaskStatus === "Completed"
                              )
                              .map((taskemp, i) => (
                                <tr key={i}>
                                  <td
                                    style={{
                                      backgroundColor:
                                        taskemp.emptaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : darkMode
                                          ? "var( --secondaryDashMenuColor)"
                                          : "var(--secondaryDashColorDark)",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var( --primaryDashMenuColor)",
                                      border: "none",
                                    }}
                                  >
                                    {i + 1}
                                  </td>
                                  <td
                                    style={{
                                      backgroundColor:
                                        taskemp.emptaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : darkMode
                                          ? "var( --secondaryDashMenuColor)"
                                          : "var(--secondaryDashColorDark)",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var( --primaryDashMenuColor)",
                                      border: "none",
                                    }}
                                    className="text-capitalize"
                                  >
                                    {taskemp.empname}
                                  </td>
                                  <td
                                    style={{
                                      backgroundColor:
                                        taskemp.emptaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : darkMode
                                          ? "var( --secondaryDashMenuColor)"
                                          : "var(--secondaryDashColorDark)",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var( --primaryDashMenuColor)",
                                      border: "none",
                                    }}
                                  >
                                    {taskemp.empemail}
                                  </td>
                                  <td
                                    style={{
                                      backgroundColor:
                                        taskemp.emptaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : darkMode
                                          ? "var( --secondaryDashMenuColor)"
                                          : "var(--secondaryDashColorDark)",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var( --primaryDashMenuColor)",
                                      border: "none",
                                    }}
                                  >
                                    {taskemp.empdesignation}
                                  </td>
                                  <td
                                    style={{
                                      backgroundColor:
                                        taskemp.emptaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : darkMode
                                          ? "var( --secondaryDashMenuColor)"
                                          : "var(--secondaryDashColorDark)",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var( --primaryDashMenuColor)",
                                      border: "none",
                                    }}
                                  >
                                    {taskemp.emptaskStatus}
                                  </td>
                                  <td
                                    style={{
                                      backgroundColor:
                                        taskemp.emptaskStatus === "Completed"
                                          ? "rgba(25, 201, 84, 0.436)"
                                          : darkMode
                                          ? "var( --secondaryDashMenuColor)"
                                          : "var(--secondaryDashColorDark)",
                                      color: darkMode
                                        ? "var(--secondaryDashColorDark)"
                                        : "var( --primaryDashMenuColor)",
                                      border: "none",
                                    }}
                                  >
                                    {taskemp.empTaskComment}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
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
                      <div className="d-flex flex-column gap-2 my-2">
                        Action
                        <div className="d-flex gap-3">
                          <button
                            className="btn btn-success d-flex justify-center aline-center gap-2"
                            onClick={() => {
                              navigateEmpHandler(task);
                            }}
                          >
                            <IoIosChatboxes />{" "}
                            <span className="d-none d-md-flex">Chat</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EmployeeActiveTask;
