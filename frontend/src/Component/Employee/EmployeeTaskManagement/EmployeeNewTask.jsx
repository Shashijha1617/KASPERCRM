import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Table from "react-bootstrap/Table";
import { BsFiletypeDoc } from "react-icons/bs";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import BASE_URL from "../../../Pages/config/config";
import { IoIosChatboxes, IoMdAttach, IoMdEye } from "react-icons/io";
import { v4 as uuid } from "uuid";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

const EmployeeNewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const empMail = localStorage.getItem("Email");
  const { darkMode } = useTheme();
  const { socket } = useContext(AttendanceContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [empData, setEmpData] = useState(null);
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const name = localStorage.getItem("Name");
  const id = localStorage.getItem("_id");

  useEffect(() => {
    const loadPersonalInfoData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/personal-info/` + id,
          {
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          }
        );
        setEmpData(response.data);
        setEmail(response.data.Email);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Error fetching personal info. Please try again later.");
      }
    };

    loadPersonalInfoData();
  }, [id]);

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

  const acceptTask = async (taskId, empEmail, task) => {
    try {
      const empRemarks = prompt("Enter remarks for accepting the task:");

      if (empRemarks === null) {
        return;
      }

      await axios.put(`${BASE_URL}/api/tasks/${taskId}/employees/${empEmail}`, {
        emptaskStatus: "Accepted",
        empTaskComment: empRemarks,
      });

      toast.success("Task accepted successfully!");
      const employeeNotificationArr = task.employees.map((val) => {
        if (val.emptaskStatus !== "Rejected" && val.empemail !== email) {
          return val.empemail;
        }
      });
      console.log(empData);
      if (empData.profile) {
        const employeeTaskNotification = {
          senderMail: empMail,
          employeesEmail: [...employeeNotificationArr, task.managerEmail],
          taskId,
          status: "unseen",
          taskName: task.Taskname,
          message: `Task Accepted`,
          messageBy: name,
          profile: empData.profile.image_url,
          taskStatus: "Accepted",
          Account: 3,
          path: "activeTask",
        };

        socket.emit("employeeTaskUpdateNotification", employeeTaskNotification);
      } else {
        const employeeTaskNotification = {
          senderMail: empMail,
          employeesEmail: [...employeeNotificationArr, task.managerEmail],
          taskId,
          status: "unseen",
          taskName: task.Taskname,
          message: `Task Accepted`,
          messageBy: name,
          profile: null,
          taskStatus: "Accepted",
          Account: 3,
          path: "activeTask",
        };

        socket.emit("employeeTaskUpdateNotification", employeeTaskNotification);
      }

      fetchData();
    } catch (error) {
      console.error("Error accepting task:", error.message);
      toast.error("Failed to accept task. Please try again.");
    }
  };

  const rejectTask = async (taskId, empEmail, task) => {
    try {
      const empRemarks = prompt("Enter remarks for rejecting the task:");

      if (empRemarks === null) {
        return;
      }

      await axios.put(`${BASE_URL}/api/tasks/${taskId}/employees/${empEmail}`, {
        emptaskStatus: "Rejected",
        empTaskComment: empRemarks,
      });

      toast.success("Task rejected successfully!");
      if (empData.profile) {
        const employeeTaskNotification = {
          senderMail: empMail,
          employeesEmail: [task.managerEmail],
          taskId,
          status: "unseen",
          taskName: task.Taskname,
          message: `Task Rejected`,
          messageBy: name,
          profile: empData.profile.image_url,
          taskStatus: "Rejected",
          Account: 3,
          path: "activeTask",
        };
        socket.emit("employeeTaskUpdateNotification", employeeTaskNotification);
      } else {
        const employeeTaskNotification = {
          senderMail: empMail,
          employeesEmail: [task.managerEmail],
          taskId,
          status: "unseen",
          taskName: task.Taskname,
          message: `Task Rejected`,
          messageBy: name,
          profile: null,
          taskStatus: "Rejected",
          Account: 3,
          path: "activeTask",
        };
        socket.emit("employeeTaskUpdateNotification", employeeTaskNotification);
      }
      fetchData();
    } catch (error) {
      console.error("Error rejecting task:", error.message);
      toast.error("Failed to reject task. Please try again.");
    }
  };

  const completeTask = async (taskId, empEmail, task) => {
    try {
      const empRemarks = prompt("Enter remarks for completing the task:");

      if (empRemarks === null) {
        return;
      }

      await axios.put(`${BASE_URL}/api/tasks/${taskId}/employees/${empEmail}`, {
        emptaskStatus: "Completed",
        empTaskComment: empRemarks,
      });

      toast.success("Task completed successfully!");
      const employeeNotificationArr = task.employees.map((val) => {
        if (val.emptaskStatus !== "Rejected" && val.empemail !== email) {
          return val.empemail;
        }
      });
      if (empData.profile) {
        const employeeTaskNotification = {
          senderMail: empMail,
          employeesEmail: [...employeeNotificationArr, task.managerEmail],
          taskId,
          status: "unseen",
          taskName: task.Taskname,
          taskStatus: "Completed",
          message: `Task Completed`,
          messageBy: name,
          profile: empData.profile.image_url,
          Account: 3,
          path: "activeTask",
        };
        socket.emit("employeeTaskUpdateNotification", employeeTaskNotification);
      } else {
        const employeeTaskNotification = {
          senderMail: empMail,
          employeesEmail: [...employeeNotificationArr, task.managerEmail],
          taskId,
          status: "unseen",
          taskName: task.Taskname,
          taskStatus: "Completed",
          message: `Task Completed`,
          messageBy: name,
          profile: null,
          Account: 3,
          path: "activeTask",
        };
        socket.emit("employeeTaskUpdateNotification", employeeTaskNotification);
      }
      fetchData();
    } catch (error) {
      console.error("Error completing task:", error.message);
      toast.error("Failed to complete task. Please try again.");
    }
  };

  const totalTaskAssigned = tasks.filter(
    (task) =>
      task.status === "Pending" &&
      task.employees.some((taskemp) => taskemp.empemail === email)
  ).length;

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  return (
    <div className="container-fluid py-2">
      <TittleHeader
        numbers={totalTaskAssigned}
        title={"New Task"}
        message={"You can view all new task here."}
      />
      {loading && (
        <div
          style={{ width: "100%", height: "100%" }}
          className="d-flex align-center gap-2"
        >
          <div
            className="spinner-grow bg-primary"
            style={{ width: "1rem", height: "1rem" }}
            role="status"
          ></div>
          <span className="text-primary fw-bold">Loading...</span>
        </div>
      )}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !tasks.length && (
        <p className="text-danger">Data not available.</p>
      )}
      <div className="row mx-auto">
        {email &&
          tasks
            .filter(
              (task) =>
                task.status === "Pending" &&
                task.employees.some((taskemp) => taskemp.empemail === email)
            )
            .reverse()
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
                          <h6 className="fw-bold">Project Members</h6>
                          <Table>
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
                              {email &&
                                task.employees
                                  .filter(
                                    (taskemp) => taskemp.empemail === email
                                  )
                                  .map((taskemp, i) => (
                                    <tr key={i}>
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
                                        className="text-capitalize"
                                      >
                                        {taskemp.empname}
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
                                        {taskemp.empemail}
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
                                        {taskemp.empdesignation}
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
                                        {taskemp.emptaskStatus}{" "}
                                      </td>
                                      <td
                                        style={{
                                          maxWidth: "10rem",
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
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
                                        {taskemp.empTaskComment}
                                      </td>
                                    </tr>
                                  ))}
                            </tbody>
                          </Table>
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
                          {email &&
                            task.employees
                              .filter((taskemp) => taskemp.empemail === email)
                              .map((taskemp, i) => (
                                <div className="d-flex align-items-center gap-2">
                                  <button
                                    className="btn btn-primary py-1"
                                    onClick={() =>
                                      acceptTask(
                                        task._id,
                                        taskemp.empemail,
                                        task
                                      )
                                    }
                                    disabled={
                                      taskemp.emptaskStatus === "Accepted" ||
                                      taskemp.emptaskStatus === "Rejected" ||
                                      taskemp.emptaskStatus === "Completed"
                                    }
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn  py-1 btn-danger"
                                    onClick={() =>
                                      rejectTask(
                                        task._id,
                                        taskemp.empemail,
                                        task
                                      )
                                    }
                                    disabled={
                                      taskemp.emptaskStatus === "Accepted" ||
                                      taskemp.emptaskStatus === "Rejected" ||
                                      taskemp.emptaskStatus === "Completed"
                                    }
                                  >
                                    Reject
                                  </button>
                                  <button
                                    className="btn py-1 btn-success"
                                    onClick={() =>
                                      completeTask(
                                        task._id,
                                        taskemp.empemail,
                                        task
                                      )
                                    }
                                    disabled={
                                      taskemp.emptaskStatus === "Completed"
                                    }
                                  >
                                    Complete
                                  </button>
                                </div>
                              ))}
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

export default EmployeeNewTask;
