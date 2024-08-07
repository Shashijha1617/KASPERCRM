import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ImBin } from "react-icons/im";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import "./notification.css";
import BASE_URL from "../../../Pages/config/config";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
const Notification = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState([]);
  const [notification, setNotification] = useState(null);
  const { socket } = useContext(AttendanceContext);
  const id = localStorage.getItem("_id");
  const email = localStorage.getItem("Email");
  const { darkMode } = useTheme();

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        setNotification(response.data.Notification);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    loadEmployeeData();
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("taskNotificationReceived", () => {
        loadEmployeeData();
      });
    }
  }, [socket]);

  useEffect(() => {
    setSelectAll(
      notification && selectedNotification.length === notification.length
    );
  }, [selectedNotification, notification]);

  const addSelectedNotification = (val) => {
    const isChecked = selectedNotification.some(
      (noti) => noti.taskId === val.taskId
    );

    if (isChecked) {
      setSelectedNotification((prevNotification) =>
        prevNotification.filter((noti) => noti.taskId !== val.taskId)
      );
    } else {
      setSelectedNotification([...selectedNotification, val]);
    }
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedNotification(selectAll ? [] : [...notification]);
  };
  const clearAllHandler = () => {
    if (notification.length > 0) {
      console.log("clearALL");
      axios
        .post(
          `${BASE_URL}/api/selectedNotificationDelete`,
          { email },
          {
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          }
        )
        .then((response) => {
          console.log(response);
          setNotification(response.data.result.Notification);
          socket.emit("notificationPageUpdate", true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const multiNotificationDeleteHandler = () => {
    if (selectedNotification.length > 0) {
      const taskIDArray = selectedNotification.map((val) => val.taskId);
      const data = {
        employeeMail: email,
        tasks: taskIDArray,
      };
      if (selectAll) {
        clearAllHandler();
      } else {
        axios
          .post(`${BASE_URL}/api/multiSelectedNotificationDelete`, data, {
            headers: {
              authorization: localStorage.getItem("token") || "",
            },
          })
          .then((response) => {
            setNotification(response.data.result.Notification);
            setSelectedNotification([]);
            console.log("emittted");
            socket.emit("notificationPageUpdate", true);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
  const notificationDeleteHandler = (id) => {
    console.log(id);
    axios
      .post(
        `${BASE_URL}/api/notificationDeleteHandler/${id}`,
        { email },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((response) => {
        setNotification(response.data.result.Notification);
        setSelectedNotification([]);
        console.log("emittted");
        socket.emit("notificationPageUpdate", true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const rowHeadStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--primaryDashMenuColor)"
      : "var(--primaryDashColorDark)",
    color: darkMode
      ? "var(--primaryDashColorDark)"
      : "var(--secondaryDashMenuColor)",
    border: "none",
    position: "sticky",
    top: "0rem",
    zIndex: "100",
  };

  const rowBodyStyle = {
    verticalAlign: "middle",
    whiteSpace: "pre",
    background: darkMode
      ? "var(--secondaryDashMenuColor)"
      : "var(--secondaryDashColorDark)",
    color: darkMode
      ? "var(--secondaryDashColorDark)"
      : "var(--primaryDashMenuColor)",
    border: "none",
  };

  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--primaryDashMenuColor)",
      }}
      className="container-fluid py-3 "
    >
      <div>
        <form className="d-flex flex-column gap-3">
          <div>
            <div className="p-2">
              {" "}
              <input
                type="checkbox"
                name=""
                id=""
                onChange={toggleSelectAll}
                checked={selectAll}
              />{" "}
              <span>Select All</span>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th style={rowHeadStyle}>Select</th>
                  <th style={rowHeadStyle}>task Name</th>
                  <th style={rowHeadStyle}>Sender</th>
                  <th style={rowHeadStyle}>Status</th>
                  <th style={rowHeadStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {notification &&
                  notification.map((val, index) => (
                    <tr key={index}>
                      <th style={rowBodyStyle}>
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          onChange={() => addSelectedNotification(val)}
                          checked={selectedNotification.some(
                            (noti) => noti.taskId === val.taskId
                          )}
                        />
                      </th>
                      <td style={rowBodyStyle}>{val.message}</td>
                      <td style={rowBodyStyle}>{val.messageBy}</td>
                      {val.status === "unseen" ? (
                        <td style={rowBodyStyle}>Unseen</td>
                      ) : (
                        <td style={rowBodyStyle}>Seen</td>
                      )}
                      <td style={rowBodyStyle}>
                        <button
                          className="btn btn-danger py-1 d-flex align-items-center justify-content-center gap-0"
                          onClick={() => notificationDeleteHandler(val.taskId)}
                        >
                          <ImBin />{" "}
                          <span className="d-none d-md-flex">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>

      <button
        className="Notification_delete"
        onClick={multiNotificationDeleteHandler}
      >
        Delete
      </button>
    </div>
  );
};

export default Notification;
