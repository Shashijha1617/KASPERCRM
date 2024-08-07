import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Table from "react-bootstrap/Table";
import { BsFiletypeDoc } from "react-icons/bs";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import BASE_URL from "../../../Pages/config/config";
import { IoMdAttach, IoMdEye } from "react-icons/io";
import { v4 as uuid } from "uuid";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const EmployeeNewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const empMail = localStorage.getItem("Email");
  const { darkMode } = useTheme();
  const { socket } = useContext(AttendanceContext);
  const [empData, setEmpData] = useState(null);

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

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const endDateTime = new Date(endDate);
    let remainingTime = endDateTime - now;

    if (remainingTime < 0) {
      remainingTime = Math.abs(remainingTime);
      return { delay: true, days: 0, hours: 0, minutes: 0 };
    } else {
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

  return (
    <div className="container-fluid">
      <h5
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
        }}
        className="fw-bolder text-uppercase py-2 mt-2 "
      >
        🌟New Task ({totalTaskAssigned}){" "}
      </h5>

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
      <div
        style={{
          overflowY: "auto",
          maxHeight: "80vh",
          scrollbarWidth: "thin",
          scrollbarGutter: "stable",
          scrollMargin: "1rem",
        }}
      >
        {email &&
          tasks
            .filter(
              (task) =>
                task.status === "Pending" &&
                task.employees.some((taskemp) => taskemp.empemail === email)
            )
            .reverse()
            .map((task, index) => (
              <details
                style={{
                  background: darkMode
                    ? "var( --primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)",
                }}
                className="p-1 position-relative fs-4 rounded mx-2 my-3"
                key={task.id}
              >
                <summary
                  style={{
                    height: "fit-content",
                    background: darkMode
                      ? "var( --primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                    position: "relative",
                  }}
                  className="d-flex flex-column justify-content-between py-4 align-center form-control"
                >
                  <div
                    style={{
                      color: darkMode
                        ? "var(--secondaryDashColorDark)"
                        : "var( --primaryDashMenuColor)",
                    }}
                    className="fs-5 d-flex justify-content-center flex-column text-capitalize"
                  >
                    #{index + 1} : {task.Taskname}
                  </div>
                  <div
                    style={{ position: "absolute", top: "-10px", left: "15px" }}
                    className="fw-bold bg-white rounded-5 border px-3 text-primary fs-6 d-flex justify-content-center align-center flex-column"
                  >
                    {task.department}
                  </div>
                  <div
                    style={{
                      color: darkMode
                        ? "var(--secondaryDashColorDark)"
                        : "var( --primaryDashMenuColor)",
                      fontSize: ".8rem",
                      position: "absolute",
                      bottom: "5px",
                    }}
                    className="d-flex gap-2 RemainingTimeHandel justify-content-start"
                  >
                    {calculateRemainingTime(task.endDate).delay ? (
                      <div>
                        <div className="text-center d-none">
                          <div className="fw-bold my-auto p-0">
                            {calculateRemainingTime(task.endDate).days}{" "}
                          </div>
                          <div>Days</div>
                        </div>
                        <h5
                          style={{ fontSize: ".8rem" }}
                          className="text-danger p-0 m-0"
                        >
                          Task is running Late
                        </h5>
                      </div>
                    ) : (
                      <div className="text-center">
                        {calculateRemainingTime(task.endDate).days} Days
                      </div>
                    )}
                    {calculateRemainingTime(task.endDate).delay ? (
                      <div className="text-center d-none">
                        {calculateRemainingTime(task.endDate).hours} Min
                      </div>
                    ) : (
                      <div className="text-center">
                        {calculateRemainingTime(task.endDate).hours} Hrs
                      </div>
                    )}
                    {calculateRemainingTime(task.endDate).delay ? (
                      <div className="text-center d-none">
                        {calculateRemainingTime(task.endDate).minutes} Min
                      </div>
                    ) : (
                      <div className="text-center">
                        and {calculateRemainingTime(task.endDate).minutes} Min
                        Remaining
                      </div>
                    )}
                  </div>
                </summary>
                <div
                  style={{
                    position: "relative",
                    background: darkMode
                      ? "var( --primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)",
                  }}
                  className="row p-1 my-2 mx-0 rounded"
                >
                  <div
                    style={{
                      height: "fit-content",
                      background: darkMode
                        ? "var( --primaryDashMenuColor)"
                        : "var(--primaryDashColorDark)",
                    }}
                    className="form-control"
                  >
                    <p
                      style={{
                        height: "fit-content",
                        background: darkMode
                          ? "var( --primaryDashMenuColor)"
                          : "var(--primaryDashColorDark)",
                        color: darkMode
                          ? "var(--primaryDashColorDark)"
                          : "var( --primaryDashMenuColor)",
                      }}
                      className="text-start fs-6 form-control border-0 "
                    >
                      <h6 className="fw-bold">Task Description</h6>{" "}
                      {task.description}
                    </p>
                    <div
                      style={{
                        height: "fit-content",
                        background: darkMode
                          ? "var( --primaryDashMenuColor)"
                          : "var(--primaryDashColorDark)",
                        color: darkMode
                          ? "var(--primaryDashColorDark)"
                          : "var( --primaryDashMenuColor)",
                      }}
                      className="row form-control d-flex pt-3 rounded mx-1 justify-content-between"
                    >
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
                              {task.status}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div
                      style={{
                        height: "fit-content",
                        background: darkMode
                          ? "var( --primaryDashMenuColor)"
                          : "var(--primaryDashColorDark)",
                        color: darkMode
                          ? "var(--primaryDashColorDark)"
                          : "var( --primaryDashMenuColor)",
                      }}
                      className="row form-control d-flex my-1 mt-3 pt-3 rounded mx-1 justify-content-between"
                    >
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
                              className=""
                            >
                              Attach <IoMdAttach />
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
                              Action
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
                              .filter((taskemp) => taskemp.empemail === email)
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
                                  >
                                    {i + 1}
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
                                    <button className="btn btn-light w-100 shadow-sm">
                                      <IoMdEye style={{ cursor: "pointer" }} />
                                    </button>
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
                                    <div className="d-flex align-items-center justify-content-evenly">
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
                                          taskemp.emptaskStatus ===
                                            "Accepted" ||
                                          taskemp.emptaskStatus ===
                                            "Rejected" ||
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
                                          taskemp.emptaskStatus ===
                                            "Accepted" ||
                                          taskemp.emptaskStatus ===
                                            "Rejected" ||
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
                  </div>
                </div>
              </details>
            ))}
      </div>
    </div>
  );
};

export default EmployeeNewTask;
