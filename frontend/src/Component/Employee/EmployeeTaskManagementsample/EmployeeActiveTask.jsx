import React, { useState, useEffect } from "react";
import axios from "axios";

import { toast } from "react-hot-toast";
import Table from "react-bootstrap/Table";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const EmployeeActiveTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setIsCanceling] = useState(false);
  const [, setIsCompleting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const { darkMode } = useTheme();
  const email = localStorage.getItem("Email");
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
        comment: cancellationRemarks
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
        comment: RejectRemarks
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
        comment: CompleteRemarks
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

  return (
    <div className="container-fluid">
      <h5
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)"
        }}
        className="fw-bolder text-uppercase py-2 mt-2 "
      >
        🌟 Active Task
      </h5>
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
      <div
        style={{
          overflowY: "auto",
          maxHeight: "80vh",
          scrollbarWidth: "thin",
          scrollbarGutter: "stable",
          scrollMargin: "1rem"
        }}
      >
        {tasks
          .filter(
            (task) =>
              task.emptaskStatus === "Acceoted" &&
              task.employees.some((taskemp) => taskemp.empemail === email)
          )
          .map((task, index) => (
            <details
              style={{
                background: darkMode
                  ? "var( --primaryDashMenuColor)"
                  : "var(--primaryDashColorDark)"
              }}
              className="p-1 position-relative mt-3 fs-4 rounded mx-3"
              key={task.id}
            >
              <summary
                style={{
                  height: "fit-content",
                  background: darkMode
                    ? "var( --primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)"
                }}
                className="d-flex justify-content-between py-3 align-center form-control"
              >
                <div
                  style={{
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var( --primaryDashMenuColor)"
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
                  tyle={{
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var( --primaryDashMenuColor)"
                  }}
                  className="d-flex gap-2 RemainingTimeHandel justify-content-between "
                >
                  {calculateRemainingTime(task.endDate).delay ? (
                    <div>
                      <div className="text-center d-none">
                        <div className="form-control  fw-bold p-0">
                          {calculateRemainingTime(task.endDate).days}{" "}
                        </div>{" "}
                        <div>Day</div>
                      </div>
                      <h5 className="btn btn-danger p-1 px-3 fw-bold">Late</h5>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div
                        style={{ boxShadow: "0 0 5px 2px gray inset" }}
                        className="form-control fw-bold"
                      >
                        {calculateRemainingTime(task.endDate).days}{" "}
                      </div>{" "}
                      <div>Day</div>
                    </div>
                  )}
                  {calculateRemainingTime(task.endDate).delay ? (
                    <div className="text-center d-none">
                      <div className="form-control  fw-bold p-0">
                        {calculateRemainingTime(task.endDate).hours}{" "}
                      </div>{" "}
                      <div>Min</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div
                        style={{ boxShadow: "0 0 5px 2px gray inset" }}
                        className="form-control fw-bold"
                      >
                        {calculateRemainingTime(task.endDate).hours}{" "}
                      </div>{" "}
                      <div>Hrs</div>
                    </div>
                  )}
                  {calculateRemainingTime(task.endDate).delay ? (
                    <div className="text-center d-none">
                      <div className="form-control fw-bold p-0">
                        {calculateRemainingTime(task.endDate).minutes}{" "}
                      </div>{" "}
                      <div>Min</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div
                        style={{ boxShadow: "0 0 5px 2px gray inset" }}
                        className="form-control fw-bold"
                      >
                        {calculateRemainingTime(task.endDate).minutes}{" "}
                      </div>{" "}
                      <div>Min</div>
                    </div>
                  )}
                </div>
              </summary>
              <div
                style={{
                  position: "relative",
                  background: darkMode
                    ? "var( --primaryDashMenuColor)"
                    : "var(--primaryDashColorDark)"
                }}
                className="row p-1 my-2 mx-0 rounded"
              >
                <div
                  style={{
                    height: "fit-content",
                    background: darkMode
                      ? "var( --primaryDashMenuColor)"
                      : "var(--primaryDashColorDark)"
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
                        : "var( --primaryDashMenuColor)"
                    }}
                    className="text-start fs-6 form-control border-0 "
                  >
                    <h6 className="fw-bold">Task Discription</h6>{" "}
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
                        : "var( --primaryDashMenuColor)"
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
                              border: "none"
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
                              border: "none"
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
                              border: "none"
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
                              border: "none"
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
                              border: "none"
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
                              border: "none"
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
                              border: "none"
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
                              border: "none"
                            }}
                          >
                            {new Date(task.startDate)
                              .toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
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
                              border: "none"
                            }}
                          >
                            {new Date(task.endDate)
                              .toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
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
                              border: "none"
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
                        : "var( --primaryDashMenuColor)"
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
                              border: "none"
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
                              border: "none"
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
                              border: "none"
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
                              border: "none"
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
                              border: "none"
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
                              border: "none"
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
                                  border: "none"
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
                                  border: "none"
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
                                  border: "none"
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
                                  border: "none"
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
                                  border: "none"
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
                                  border: "none"
                                }}
                              >
                                {taskemp.empTaskComment}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                    {/* <div
                      style={{ height: "fit-content" }}
                      className="row form-control d-flex pt-3 rounded mx-1 justify-content-between"
                    >
                      <p>
                        <span className="fw-bold">Remarks : </span>{" "}
                        {task.comment}
                      </p>
                    </div>

                    <div
                      style={{ height: "fit-content" }}
                      className="row form-control d-flex pt-3 rounded mx-1 justify-content-between"
                    >
                      <button
                        className="btn btn-info col-2 d-flex justify-center aline-center gap-2"
                        onClick={() => AcceptTask(task._id)}
                      >
                        <IoCheckmarkDoneSharp />
                        Accept
                      </button>
                      <button
                        className="btn btn-info col-2 d-flex justify-center aline-center gap-2"
                        onClick={() => AcceptTask(task._id)}
                      >
                        <BsFiletypeDoc />
                        View Docs
                      </button>
                      <button
                        className="btn btn-primary col-2 d-flex justify-center aline-center gap-2"
                        onClick={() => RejectTask(task._id)}
                      >
                        <MdCancel />
                        Reject
                      </button>
                      <button
                        className="btn btn-warning col-2 d-flex justify-center aline-center gap-2"
                        onClick={() => completeTask(task._id)}
                      >
                        <PiInfoFill />
                        Report
                      </button>
                      <button
                        className="btn btn-success col-2 d-flex justify-center aline-center gap-2"
                        onClick={() => completeTask(task._id)}
                      >
                        <FaCheck />
                        Complete Task
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </details>
          ))}
      </div>
    </div>
  );
};

export default EmployeeActiveTask;
