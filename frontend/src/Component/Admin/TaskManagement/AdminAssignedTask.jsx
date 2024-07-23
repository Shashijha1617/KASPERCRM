import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdCancel, MdEdit } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BsFiletypeDoc } from "react-icons/bs";
import BASE_URL from "../../../Pages/config/config";
import toast from "react-hot-toast";

const AdminAssignedTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [allImage, setAllImage] = useState(null);

  const [updatedTask, setUpdatedTask] = useState({
    id: "",
    Taskname: "",
    description: "",
    startDate: "",
    endDate: "",
    managerEmail: "",
    duration: 0,
  });
  const [totalAssignedTasks, setTotalAssignedTasks] = useState(0);

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

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tasks`);
      setTasks(response.data);

      // Update the totalAssignedTasks state with the count of assigned tasks
      const assignedTasksCount = response.data.filter(
        (task) => task.status === "Assigned"
      ).length;
      setTotalAssignedTasks(assignedTasksCount);
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

  const cancelTask = async (taskId) => {
    try {
      setIsCanceling(true);

      // Prompt the user for cancellation remarks
      const cancellationRemarks = prompt(
        "Enter remarks for task cancellation:"
      );

      if (cancellationRemarks === null) {
        // If the user clicks Cancel in the prompt, do nothing
        setIsCanceling(false);
        return;
      }

      // Update the task status to "Cancelled" in the database
      await axios.put(`${BASE_URL}/api/tasks/${taskId}`, {
        status: "Cancelled",
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
      setIsCanceling(false);
    }
  };

  const updateTask = (taskId) => {
    const taskToUpdate = tasks.find((task) => task._id === taskId);

    if (taskToUpdate) {
      setUpdatedTask({
        id: taskToUpdate._id,
        Taskname: taskToUpdate.Taskname,
        description: taskToUpdate.description,
        startDate: taskToUpdate.startDate,
        endDate: taskToUpdate.endDate,
        managerEmail: taskToUpdate.managerEmail,
        duration: taskToUpdate.duration,
      });

      setShowUpdateModal(true);
    }

    console.log();
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/api/tasks/${updatedTask.id}`, {
        Taskname: updatedTask.Taskname,
        description: updatedTask.description,
        startDate: updatedTask.startDate,
        endDate: updatedTask.endDate,
        managerEmail: updatedTask.managerEmail,
        duration: updatedTask.duration,
      });

      // Display success notification
      toast.success("Task updated successfully!");

      // Close the update modal
      handleCloseUpdateModal();

      // Update the UI by fetching the latest tasks
      fetchData();
    } catch (error) {
      console.error("Error updating task:", error.message);
      toast.error("Failed to update task. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="fs-2 text-muted fw-bolder text-uppercase">
        🟡 Task Status ({totalAssignedTasks})
      </h1>
      <p className="text-muted">You can view all Task Status here!</p>{" "}
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
      >
        {tasks
          .filter(
            (task) => task.status === "Assigned" || task.status === "Pending"
          )
          .map((task, index) => (
            <details
              style={{
                boxShadow: "-1px 1px 10px gray",
              }}
              className="p-1 position-relative mt-3 fs-4 rounded mx-3"
              key={task.id}
            >
              <summary
                style={{
                  height: "fit-content",
                  background: "linear-gradient(#1D267D, #2F58CD)",
                }}
                className="d-flex justify-content-between aline-center form-control  text-white"
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
                      Manager's Email <br /> <span>{task.managerEmail}</span>
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
                      className="btn btn-danger col-2 d-flex justify-center aline-center gap-2"
                      onClick={() => cancelTask(task._id)}
                    >
                      <MdCancel />
                      Cancel Task
                    </button>
                    {allImage && allImage.length > 0 && (
                      <button
                        className="btn btn-primary col-2 d-flex justify-center aline-center gap-2"
                        onClick={() => showPdf(task._id)}
                      >
                        <BsFiletypeDoc />
                        View Docs
                      </button>
                    )}
                    <button
                      className="btn btn-primary col-2 d-flex justify-center aline-center gap-2"
                      onClick={() => updateTask(task._id)}
                    >
                      <MdEdit />
                      Update Task
                    </button>
                  </div>
                </div>
              </div>
            </details>
          ))}
      </div>
      {/* Update Task Modal */}
      <Modal
        show={showUpdateModal}
        fullscreen={false}
        onHide={handleCloseUpdateModal}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-uppercase">
            Update Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex flex-column gap-3">
            <Form.Group controlId="formTaskName">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedTask.Taskname}
                onChange={(e) =>
                  setUpdatedTask({ ...updatedTask, Taskname: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={updatedTask.description}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <div className="row">
              <Form.Group className="col-12 col-md-6" controlId="startDate">
                <Form.Label>Start Date </Form.Label>
                <Form.Control
                  type="date"
                  value={updatedTask.startDate}
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      startDate: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="col-12 col-md-6" controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={updatedTask.endDate}
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      endDate: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>

            <Button variant="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminAssignedTask;
