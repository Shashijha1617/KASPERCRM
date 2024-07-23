import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MdOutlineCancel } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import BASE_URL from "../../../Pages/config/config";
import AssignTask from "../../../img/Task/AssignTask.svg";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { RiAttachmentLine } from "react-icons/ri";
import { IoMdDoneAll } from "react-icons/io";

const ManagerNewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empData, setEmpData] = useState(null);
  const [status, setStatus] = useState({ accepted: false, rejected: false });
  const [currentTime, setCurrentTime] = useState(new Date());
  const { darkMode } = useTheme();

  const taskId = uuidv4();
  const name = localStorage.getItem("Name");
  const email = localStorage.getItem("Email");
  const id = localStorage.getItem("_id");

  const { socket } = useContext(AttendanceContext);

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setEmpData(response.data);
      })
      .catch((error) => {
        console.error(error);
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

  const handleTaskAction = async (taskID, taskName, adminMail, action) => {
    const actionMapping = {
      accept: {
        setStatus: setStatus,
        statusKey: "accepted",
        newStatus: "Pending",
        message: "Accepted",
        toastMessage: "Task Accepted successfully!",
      },
      reject: {
        setStatus: setStatus,
        statusKey: "rejected",
        newStatus: "Rejected",
        message: "Rejected",
        toastMessage: "Task Rejected",
      },
    };

    const actionConfig = actionMapping[action];
    if (!actionConfig) return;

    const { setStatus, statusKey, newStatus, message, toastMessage } =
      actionConfig;
    setStatus((prev) => ({ ...prev, [statusKey]: true }));

    const remark = prompt(`Enter remarks for ${message} Task:`);

    if (remark === null) {
      setStatus((prev) => ({ ...prev, [statusKey]: false }));
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/tasks/${taskID}`, {
        status: newStatus,
        comment: remark,
      });

      toast.success(toastMessage);

      const taskNotificationData = {
        taskId,
        taskName,
        senderMail: email,
        adminMail,
        Account: 1,
        message: `Task ${message}`,
        messageBy: empData?.profile?.image_url ? name : null,
        profile: empData?.profile?.image_url,
        status: "unseen",
        path: action === "accept" ? "taskassign" : "taskreject",
      };

      socket.emit("adminTaskNotification", taskNotificationData);
      fetchData();
    } catch (error) {
      console.error(`Error ${message.toLowerCase()} task:`, error.message);
      toast.error(`Failed to ${message.toLowerCase()} task. Please try again.`);
    } finally {
      setStatus((prev) => ({ ...prev, [statusKey]: false }));
    }
  };

  return (
    <div className="p-4">
      <div
        style={{
          color: darkMode
            ? "var(--primaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
        }}
      >
        <h5 style={{ fontWeight: "600" }} className="p-0 m-0 text-uppercase">
          New Task (
          {
            tasks.filter(
              (task) =>
                task.status === "Assigned" && task.managerEmail === email
            ).length
          }
          )
        </h5>
        <p className="p-0 m-0">You can view all new tasks here!</p>
      </div>

      {loading && (
        <div className="d-flex align-items-center gap-2">
          <div
            className="spinner-grow bg-primary"
            style={{ width: "1rem", height: "1rem" }}
            role="status"
          ></div>
          <span className="text-primary fw-bold">Loading...</span>
        </div>
      )}
      <div
        className="mt-2 d-flex flex-column gap-2 pt-2 pb-3"
        style={{
          overflowY: "scroll",
          maxHeight: "80vh",
          scrollbarWidth: "thin",
          scrollbarGutter: "stable",
          scrollMargin: "1rem",
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
              (task) =>
                task.status === "Assigned" && task.managerEmail === email
            )
            .map((task, index) => (
              <details
                className="p-1 shadow position-relative mt-3 fs-4 rounded mx-3"
                key={task.id}
              >
                <summary
                  style={{
                    height: "fit-content",
                    minHeight: "3.5rem",
                    background:
                      "linear-gradient(165deg,#11009E, #700B97, 90%, #C84B31)",
                  }}
                  className="d-flex justify-content-between align-items-center form-control text-white"
                >
                  <div className="fw-bold fs-5 d-flex justify-content-center flex-column">
                    # Task {index + 1} : {task.Taskname}
                  </div>
                  <div
                    style={{ position: "absolute", top: "-10px", left: "20px" }}
                    className="fw-bold bg-white rounded-5 px-3 text-primary fs-6 d-flex justify-content-center align-items-center flex-column"
                  >
                    {task.department}
                  </div>
                  <div className="d-flex gap-2 justify-content-between">
                    {calculateRemainingTime(task.endDate).delay ? (
                      <div className="">
                        <h5 className="btn btn-danger my-auto  p-1 px-3 fw-bold">
                          Late
                        </h5>
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
                            {calculateRemainingTime(task.endDate).days}
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
                            {calculateRemainingTime(task.endDate).hours}
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
                            {calculateRemainingTime(task.endDate).minutes}
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
                            {calculateRemainingTime(task.endDate).seconds}
                          </div>
                          <div>Sec</div>
                        </div>
                      </>
                    )}
                  </div>
                </summary>
                <div
                  style={{
                    position: "relative",
                    background: darkMode
                      ? "var(--secondaryDashMenuColor)"
                      : "var(--secondaryDashColorDark)",
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                  }}
                  className="row p-1 my-2 mx-0 rounded"
                >
                  <div
                    style={{
                      height: "fit-content",
                      background: darkMode
                        ? "var(--secondaryDashMenuColor)"
                        : "var(--secondaryDashColorDark)",
                      color: darkMode
                        ? "var(--secondaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                    }}
                    className="form-control "
                  >
                    <p
                      style={{
                        height: "fit-content",
                        background: darkMode
                          ? "var(--secondaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                      }}
                      className="text-start fs-6  form-control"
                    >
                      <h6 className="fw-bold">Task Description</h6>{" "}
                      <p style={{ width: "100%" }}>{task.description}</p>
                    </p>
                    <div
                      style={{
                        height: "fit-content",
                        background: darkMode
                          ? "var(--secondaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                      }}
                      className="row form-control px-0 d-flex pt-3 rounded mx-0 justify-content-between"
                    >
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-12 col-sm-6 col-md-3 col-lg-2"
                      >
                        <h6>Task Durations</h6>
                        <span className="border px-2 py-1 rounded-3">
                          {task.duration} days
                        </span>
                      </p>

                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-12 col-sm-6 col-md-3 col-lg-2"
                      >
                        <h6>Start Date</h6>
                        <span className="border px-2 py-1 rounded-3">
                          {new Date(task.startDate).toLocaleDateString()}
                        </span>
                      </p>
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-12 col-sm-6 col-md-3 col-lg-2"
                      >
                        <h6>End Date</h6>
                        <span className="border px-2 py-1 rounded-3">
                          {new Date(task.endDate).toLocaleDateString()}
                        </span>
                      </p>
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-12 col-sm-6 col-md-3 col-lg-2"
                      >
                        <h6>Task Status</h6>{" "}
                        <span className="border px-2 py-1 rounded-3">
                          {task.status}
                        </span>
                      </p>
                    </div>
                    <hr />
                    <div
                      style={{
                        height: "fit-content",
                        background: darkMode
                          ? "var(--secondaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                      }}
                      className="row form-control px-0 d-flex pt-3 rounded mx-1 justify-content-between"
                    >
                      <p className="m-0">
                        <span className="fw-bold">Remarks: </span>
                        {task.comment}
                      </p>
                    </div>
                    <hr />
                    <div
                      style={{
                        height: "fit-content",
                        background: darkMode
                          ? "var(--secondaryDashMenuColor)"
                          : "var(--secondaryDashColorDark)",
                        color: darkMode
                          ? "var(--secondaryDashColorDark)"
                          : "var(--primaryDashMenuColor)",
                        border: "none",
                      }}
                      className="row form-control d-flex pt-3 rounded mx-1 justify-content-between"
                    >
                      <button
                        className="btn btn-info col-2 d-flex justify-center align-items-center gap-2"
                        onClick={() =>
                          handleTaskAction(
                            task._id,
                            task.Taskname,
                            task.adminMail,
                            "accept"
                          )
                        }
                      >
                        <IoMdDoneAll />
                        <span className="d-none d-lg-flex">Accept</span>
                      </button>
                      <button className="btn btn-primary col-2 d-flex justify-center align-items-center gap-2">
                        <RiAttachmentLine />
                        <span className="d-none d-lg-flex">
                          View Attachment
                        </span>
                      </button>
                      <button
                        className="btn btn-primary col-2 d-flex justify-center align-items-center gap-2"
                        onClick={() =>
                          handleTaskAction(
                            task._id,
                            task.Taskname,
                            task.adminMail,
                            "reject"
                          )
                        }
                      >
                        <MdOutlineCancel />
                        <span className="d-none d-lg-flex">Reject</span>
                      </button>
                    </div>
                    <hr />
                  </div>
                </div>
              </details>
            ))
        ) : (
          <div
            className="d-flex flex-column gap-3  align-items-center justify-content-center"
            style={{ height: "80vh" }}
          >
            <img
              style={{ width: "30%", height: "auto" }}
              src={AssignTask}
              alt=""
            />
            <p
              style={{
                color: darkMode
                  ? "var(--primaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
              }}
            >
              Sorry, there are no tasks assigned yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerNewTask;
