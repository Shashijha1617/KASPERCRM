import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MdCancel } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { BsFiletypeDoc } from "react-icons/bs";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import BASE_URL from "../../../Pages/config/config";
import AssignTask from "../../../img/Task/AssignTask.svg";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const ManagerNewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empData, setEmpData] = useState(null);
  const [status, setStatus] = useState({ accepted: false, rejected: false });
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

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const endDateTime = new Date(endDate);
    let remainingTime = endDateTime - now;

    if (remainingTime < 0) {
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
      <h5 style={{ fontWeight: "600" }} className="p-0 m-0 text-uppercase">
        New Task (
        {
          tasks.filter(
            (task) => task.status === "Assigned" && task.managerEmail === email
          ).length
        }
        )
      </h5>
      <p className="text-muted p-0 m-0">You can view all new tasks here!</p>
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
        className="mt-2"
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
                style={{ boxShadow: "-1px 1px 10px gray" }}
                className="p-1 position-relative mt-3 fs-4 rounded mx-3"
                key={task.id}
              >
                <summary
                  style={{
                    height: "fit-content",
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
                      <div>
                        <h5 className="btn btn-danger p-1 px-3 fw-bold">
                          Late
                        </h5>
                      </div>
                    ) : (
                      <>
                        <div className="text-center">
                          <div
                            style={{ boxShadow: "0 0 5px 2px gray inset" }}
                            className="form-control fw-bold px-1 py-0"
                          >
                            {calculateRemainingTime(task.endDate).days}
                          </div>
                          <div>Day</div>
                        </div>
                        <div className="text-center">
                          <div
                            style={{ boxShadow: "0 0 5px 2px gray inset" }}
                            className="form-control fw-bold px-1 py-0"
                          >
                            {calculateRemainingTime(task.endDate).hours}
                          </div>
                          <div>Hrs</div>
                        </div>
                        <div className="text-center">
                          <div
                            style={{ boxShadow: "0 0 5px 2px gray inset" }}
                            className="form-control fw-bold px-1 py-0"
                          >
                            {calculateRemainingTime(task.endDate).minutes}
                          </div>
                          <div>Min</div>
                        </div>
                      </>
                    )}
                  </div>
                </summary>
                <div
                  style={{ position: "relative" }}
                  className="row p-1 my-2 mx-0 bg-light text-dark rounded"
                >
                  <div
                    style={{ height: "fit-content" }}
                    className="form-control"
                  >
                    <p
                      style={{ height: "fit-content" }}
                      className="text-start fs-6 form-control"
                    >
                      <h6 className="fw-bold">Task Description</h6>{" "}
                      {task.description}
                    </p>
                    <div
                      style={{ height: "fit-content" }}
                      className="row form-control d-flex pt-3 rounded mx-1 justify-content-between"
                    >
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-6 col-sm-6 col-md-2"
                      >
                        Task Durations <br /> <span>{task.duration} days</span>
                      </p>
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-6 col-sm-6 col-md-2"
                      >
                        Created By <br /> <span>{task.managerEmail}</span>
                      </p>
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-6 col-sm-6 col-md-2"
                      >
                        Start Date <br />{" "}
                        <span>
                          {new Date(task.startDate).toLocaleDateString()}
                        </span>
                      </p>
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-6 col-sm-6 col-md-2"
                      >
                        End Date <br />{" "}
                        <span>
                          {new Date(task.endDate).toLocaleDateString()}
                        </span>
                      </p>
                      <p
                        style={{ fontSize: "1rem" }}
                        className="col-6 col-sm-6 col-md-2"
                      >
                        Task Status <br /> {task.status}
                      </p>
                    </div>
                    <div
                      style={{ height: "fit-content" }}
                      className="row form-control d-flex pt-3 rounded mx-1 justify-content-between"
                    >
                      <p>
                        <span className="fw-bold">Remarks: </span>{" "}
                        {task.comment}
                      </p>
                    </div>
                    <div
                      style={{ height: "fit-content" }}
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
                        <IoCheckmarkDoneSharp />
                        Accept
                      </button>
                      <button className="btn btn-primary col-2 d-flex justify-center align-items-center gap-2">
                        <BsFiletypeDoc />
                        View Docs
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
                        <MdCancel />
                        Reject
                      </button>
                    </div>
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
            <p>Sorry, there are no tasks assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerNewTask;
