// final filter based department
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const TaskAssign = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [endDateError, setEndDateError] = useState(false);
  const [managerData, setManagerData] = useState(null);
  const [empData, setEmpData] = useState(null);
  const { socket } = useContext(AttendanceContext);
  const email = localStorage.getItem("Email");
  const name = localStorage.getItem("Name");
  const id = localStorage.getItem("_id");
  const taskId = uuidv4();
  const { darkMode } = useTheme();
  const [newTask, setNewTask] = useState({
    Taskname: "",
    description: "",
    startDate: "",
    endDate: "",
    attachments: null,
    managerEmail: "",
    department: "",
    comment: "",
  });

  const isFormValid = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      newTask.Taskname.trim() !== "" &&
      newTask.description.trim() !== "" &&
      newTask.startDate.trim() !== "" &&
      newTask.endDate.trim() !== "" &&
      newTask.managerEmail.trim() !== "" &&
      emailPattern.test(newTask.managerEmail) &&
      newTask.department.trim() !== ""
    );
  };
  const ManagerDataHandler = () => {
    if (newTask.department === "") return;
    axios
      .get(`${BASE_URL}/api/employee`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((val) => {
        let mana = val.data.filter((val) => {
          return (
            val.Account === 4 &&
            val.department[0].DepartmentName === newTask.department
          );
        });
        setManagerData(mana);
      })
      .catch(console.log("hello"));
  };
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
        console.log(error);
      });
  };
  useEffect(() => {
    loadEmployeeData();
  }, []);
  const addTask = async () => {
    let formData = new FormData();
    formData.append("Taskname", newTask.Taskname);
    formData.append("description", newTask.description);
    formData.append("startDate", newTask.startDate);
    formData.append("endDate", newTask.endDate);
    formData.append("file", newTask.attachments);
    formData.append("managerEmail", newTask.managerEmail);
    formData.append("department", newTask.department);
    formData.append("comment", newTask.comment);
    formData.append("adminMail", email);

    axios
      .post(`${BASE_URL}/api/tasks`, formData)
      .then((res) => {
        console.log(res);
        if (empData.profile) {
          const taskNotificationData = {
            taskId,
            taskName: newTask.Taskname,
            senderMail: email,
            managerEmail: newTask.managerEmail,
            Account: 4,
            message: `Task assigned`,
            messageBy: name,
            profile: empData.profile.image_url,
            status: "unseen",
            path: "newTask",
          };

          socket.emit("managerTaskNotification", taskNotificationData);
        } else {
          const taskNotificationData = {
            taskId,
            taskName: newTask.Taskname,
            senderMail: email,
            managerEmail: newTask.managerEmail,
            Account: 4,
            message: `Task assigned`,
            messageBy: name,
            profile: null,
            status: "unseen",
            path: "newTask",
          };

          socket.emit("managerTaskNotification", taskNotificationData);
        }

        // Display success toast
        toast.success("Task added successfully!");

        // Clear the form fields and reset state
        setNewTask({
          Taskname: "",
          description: "",
          startDate: "",
          endDate: "",
          attachments: null,
          managerEmail: "",
          department: "",
          comment: "",
        });
      })
      .catch((err) => {
        console.log(err);
        // Display error toast
        toast.error("Failed to add task. Please try again.");
      });
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/tasks`);
        // Handle the response data as needed (e.g., set it in the component state)
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        // Handle the error
      }
    };

    fetchTasks();
  }, []); // Empty dependency array means this effect runs only once on mount

  const loadDepartmentInfo = () => {
    axios
      .get(`${BASE_URL}/api/department`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setDepartmentData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadDepartmentInfo();
  }, []);

  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="container-fluid py-2"
    >
      <TittleHeader
        title={"Create New Task"}
        message={
          "You can Create New task and Assign to the manager for the process."
        }
      />
      <form className="my-3">
        <div className="row row-gap-2">
          <div className="col-12 d-flex flex-column">
            <div controlId="Taskname">
              <label>Task Name</label>
              <input
                className="form-control rounded-0"
                type="text"
                required
                placeholder="Enter task name"
                value={newTask.Taskname}
                onChange={(e) =>
                  setNewTask({ ...newTask, Taskname: e.target.value })
                }
              />
            </div>
          </div>
          <div className="col-12 mt-2 d-flex flex-column">
            <div controlId="description">
              <label>Task Description</label>
              <textarea
                className="form-control rounded-0"
                required
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mt-3 d-flex flex-column">
            <div controlId="startDate">
              <label>Start Date</label>
              <input
                className="form-control rounded-0"
                type="date"
                required
                value={newTask.startDate}
                onChange={(e) => {
                  setNewTask({ ...newTask, startDate: e.target.value });

                  setEndDateError(false);
                }}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mt-3 d-flex flex-column">
            <div controlId="endDate">
              <label>End Date</label>
              <input
                className="form-control rounded-0"
                type="date"
                required
                value={newTask.endDate}
                onChange={(e) => {
                  const selectedEndDate = e.target.value;
                  // Check if selectedEndDate is less than StartDate
                  if (selectedEndDate < newTask.startDate) {
                    setEndDateError(true);
                  } else {
                    setEndDateError(false);
                    setNewTask({ ...newTask, endDate: selectedEndDate });
                  }
                }}
              />
            </div>
          </div>
          <div className="col-12 col-md-3 mt-3 d-flex flex-column">
            <div controlId="department">
              <label>Department</label>
              <select
                className="form-select rounded-0"
                as="select"
                name="department"
                required
                value={newTask.department}
                onChange={(e) =>
                  setNewTask({ ...newTask, department: e.target.value })
                }
                onBlur={ManagerDataHandler}
              >
                <option value="">Select your option</option>
                {departmentData.map((data, index) => (
                  <option key={index} value={data.DepartmentName}>
                    {data.DepartmentName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-md-9 mt-3 d-flex flex-column">
            <div controlId="department">
              <label>managerEmail</label>
              <select
                className="form-select rounded-0"
                as="select"
                name="department"
                required
                value={newTask.managerEmail}
                onChange={(e) =>
                  setNewTask({ ...newTask, managerEmail: e.target.value })
                }
              >
                <option value="">Select your option</option>
                {managerData &&
                  managerData.map((data, index) => (
                    <option key={index} value={data.Email}>
                      {data.Email}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <div controlId="Attachments">
              <label className=" mt-3">Attachments</label>
              <input
                className="form-control rounded-0"
                type="file"
                multiple
                required
                onChange={(e) =>
                  setNewTask({ ...newTask, attachments: e.target.files[0] })
                }
              />
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary my-3"
          variant="info"
          onClick={addTask}
          disabled={!isFormValid()}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskAssign;
