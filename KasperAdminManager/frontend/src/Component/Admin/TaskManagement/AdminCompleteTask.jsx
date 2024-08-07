import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../Pages/config/config";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { getFormattedDate } from "../../../Utils/GetDayFormatted";

const AdminCompleteTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const { darkMode } = useTheme();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tasks`, {
        params: { status: "Completed" }, // Filter by status "Completed"
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching completed tasks:", error.message);
      setError("Error fetching completed tasks. Please try again later.");
    } finally {
      setLoading(false);
      // Schedule the next update after 1 minute (adjust as needed)
    }
  };
  useEffect(() => {
    fetchData();

    return () => clearTimeout();
  });

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="container-fluid py-3"
    >
      <TittleHeader
        title={"Completed Task"}
        numbers={tasks.filter((task) => task.status === "Rejected").length}
        message={"You can view all completed task status here."}
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
      <div
        style={{
          overflowY: "scroll",
          height: "80vh",
          scrollbarWidth: "thin",
          scrollbarGutter: "stable",
          scrollMargin: "1rem",
        }}
        className="d-flex flex-column gap-3"
      >
        {tasks
          .filter((task) => task.status === "Completed")
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
                  <h6>{task.Taskname}</h6>
                  <button
                    style={{ cursor: "auto" }}
                    className="btn btn-success"
                  >
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
                    />
                    <span>Kishor.kumar@kasperinfotech.org</span>
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
                  <div className="d-flex justify-content-between gap-3 my-2">
                    <span className="d-flex flex-column">
                      <h6>Task Duration</h6>
                      <span style={{ width: "fit-content" }}>
                        {task.duration} days
                      </span>
                    </span>{" "}
                    <span className="d-flex flex-column">
                      <h6>Start Date</h6>{" "}
                      <span style={{ width: "fit-content" }}>
                        {getFormattedDate(task.startDate)}
                      </span>
                    </span>
                    <span className="d-flex flex-column">
                      <h6>End Date</h6>{" "}
                      <span style={{ width: "fit-content" }}>
                        {getFormattedDate(task.endDate)}
                      </span>
                    </span>
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
                      <div className="d-flex flex-column gap-2 my-2">
                        {task.status === "Completed" && (
                          <span className="border border-success px-2 py-1 text-center">
                            This task is successfully completed and cannot be
                            re-open for any query contact your admin.
                          </span>
                        )}
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

export default AdminCompleteTask;
