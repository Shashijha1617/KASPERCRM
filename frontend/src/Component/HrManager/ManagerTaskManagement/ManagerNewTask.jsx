import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MdCancel } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { BsFiletypeDoc } from "react-icons/bs";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import BASE_URL from "../../../Pages/config/config";

const ManagerNewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setIsAccepted] = useState(false);
  const [, setIsRejected] = useState(false);
  const [empData, setEmpData] = useState(null);

  const taskId = uuidv4();
const name = localStorage.getItem("Name")
  const email = localStorage.getItem("Email");
  const id = localStorage.getItem("_id");

  const { socket } = useContext(AttendanceContext);
  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
    
        setEmpData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(()=>{
    loadEmployeeData()
},[])

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
      console.log(response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
      // Schedule the next update after 1 minute (adjust as needed)
    }
  };

  useEffect(() => {
    fetchData();

    return () => clearTimeout();
  }, []);

  const AcceptTask = async (taskID, taskName, adminMail) => {
    try {
      setIsAccepted(true);

      // Prompt the user for Accept remarks
      const AcceptTaskRemark = prompt("Enter remarks for Accept Task:");

      if (AcceptTaskRemark === null) {
        // If the user clicks Cancel in the prompt, do nothing
        setIsAccepted(false);
        return;
      }

      // Update the task status to "Cancelled" in the database
      await axios.put(`${BASE_URL}/api/tasks/${taskID}`, {
        status: "Pending",
        comment: AcceptTaskRemark
      });

      // Display success notification
      toast.success("Task Accepteed successfully!");
      if(empData.profile){
        const taskNotificationData = {
          taskId,
          taskName,
          senderMail: email,
          adminMail,
          Account: 1,
          message: `Task Accepted`,
          messageBy: name,
          profile: empData.profile.image_url,
          status: "unseen",
          path: "taskassign"
        };

        socket.emit("adminTaskNotification", taskNotificationData);
      }else{
        const taskNotificationData = {
          taskId,
          taskName,
          senderMail: email,
          adminMail,
          Account: 1,
          message: `Task Accepted`,
          messageBy: null,
          status: "unseen",
          path: "taskassign"
        };

        socket.emit("adminTaskNotification", taskNotificationData);
      }
      // Update the UI by fetching the latest tasks
      fetchData();
    } catch (error) {
      console.error("Error canceling task:", error.message);
      toast.error("Failed to cancel task. Please try again.");
    } finally {
      setIsAccepted(false);
    }
  };
  const RejectTask = async (taskId,taskName, adminMail) => {
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
      if(empData.profile){
        const taskNotificationData = {
          taskId,
          taskName,
          senderMail: email,
          adminMail,
          Account: 1,
          message: `Task Rejected`,
          messageBy: name,
          profile: empData.profile.image_url,
          status: "unseen",
          path: "taskreject"
        };

        socket.emit("adminTaskNotification", taskNotificationData);
      }else{
        const taskNotificationData = {
          taskId,
          taskName,
          senderMail: email,
          adminMail,
          Account: 1,
          message: `Task Rejected`,
          messageBy: null,
          status: "unseen",
          path: "taskreject"
        };

        socket.emit("adminTaskNotification", taskNotificationData);
      }
      fetchData();
    } catch (error) {
      console.error("Error Rejecting task:", error.message);
      toast.error("Failed to Reject task. Please try again.");
    } finally {
      setIsRejected(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="fs-2 text-muted fw-bolder text-uppercase">⭐ New Task</h1>
      <p className="text-muted">You can view all New task here!</p>{" "}
      <h1 className="fs-3 fw-bolder text-uppercase "></h1>
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
          scrollMargin: "1rem"
        }}
      >
        {tasks
          .filter(
            (task) => task.status === "Assigned" && task.managerEmail === email
          )
          .map((task, index) => (
            <details
              style={{
                boxShadow: "-1px 1px 10px gray"
              }}
              className="p-1 position-relative mt-3 fs-4 rounded mx-3"
              key={task.id}
            >
              <summary
                style={{
                  height: "fit-content",
                  background:
                    "linear-gradient(165deg,#11009E, #700B97, 90%, #C84B31)"
                }}
                className="d-flex justify-content-between aline-center form-control text-white "
              >
                <div className="fw-bold fs-5 d-flex justify-content-center flex-column">
                  # Task {index + 1} : {task.Taskname}
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
                        className="form-control fw-bold px-1 py-0"
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
                        className="form-control fw-bold px-1 py-0"
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
                        className="form-control fw-bold px-1 py-0"
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
                className="row p-1 my-2 mx-0 bg-light text-dark rounded"
              >
                <div style={{ height: "fit-content" }} className="form-control">
                  <p
                    style={{ height: "fit-content" }}
                    className="text-start fs-6 form-control"
                  >
                    <h6 className="fw-bold">Task Discription</h6>{" "}
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
                      Task Durations <br /> <span>{task.duration} days</span>{" "}
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
                      <span>{new Date(task.endDate).toLocaleDateString()}</span>
                    </p>
                    <p
                      style={{ fontSize: "1rem" }}
                      className="col-6 col-sm-6 col-md-2"
                    >
                      <span>
                        Task Status <br /> {task.status}
                      </span>
                    </p>
                  </div>
                  <div
                    style={{ height: "fit-content" }}
                    className="row form-control d-flex pt-3 rounded mx-1 justify-content-between"
                  >
                    <p>
                      <span className="fw-bold">Remarks : </span> {task.comment}
                    </p>
                  </div>
                  <div
                    style={{ height: "fit-content" }}
                    className="row form-control d-flex pt-3 rounded mx-1 justify-content-between"
                  >
                    <button
                      className="btn btn-info col-2 d-flex justify-center aline-center gap-2"
                      onClick={() =>
                        AcceptTask(task._id, task.Taskname, task.adminMail)
                      }
                    >
                      <IoCheckmarkDoneSharp />
                      Accept
                    </button>
                    <button
                      className="btn btn-primary col-2 d-flex justify-center aline-center gap-2"
                      onClick={() =>
                        RejectTask(task._id, task.Taskname, task.adminMail)
                      }
                    >
                      <BsFiletypeDoc />
                      View Docs
                    </button>
                    <button
                      className="btn btn-primary col-2 d-flex justify-center aline-center gap-2"
                      onClick={() => RejectTask(task._id,task.Taskname, task.adminMail)}
                    >
                      <MdCancel />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </details>
          ))}
      </div>
    </div>
  );
};

export default ManagerNewTask;
