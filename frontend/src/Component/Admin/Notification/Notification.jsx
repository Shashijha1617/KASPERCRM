import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ImBin } from "react-icons/im";
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import "./notification.css";
import BASE_URL from "../../../Pages/config/config";

const Notification = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState([]);
  const [notification, setNotification] = useState(null);
  const { socket } = useContext(AttendanceContext);
  const id = localStorage.getItem("_id");
  const email = localStorage.getItem("Email");

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
    // Check if all notifications are selected and update the "Select All" checkbox accordingly
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
  console.log(notification);
  return (
    <>
      <div className="row">
        <form className="d-flex col-8 flex-column gap-3">
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
                  <th scope="col">Select</th>
                  <th scope="col">task Name</th>
                  <th scope="col">Sender</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {notification &&
                  notification.map((val, index) => (
                    <tr key={index}>
                      <th scope="row">
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
                      <td>{val.taskName}</td>
                      <td>{val.senderMail}</td>
                      {val.status === "unseen" ? (
                        <td>Unread</td>
                      ) : (
                        <td>read</td>
                      )}
                      <td>
                        <ImBin
                          onClick={() => notificationDeleteHandler(val.taskId)}
                          className="bin"
                        />
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
    </>
  );
};

export default Notification;
