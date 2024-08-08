import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Logo from "../../img/logo.webp";
import MiniLogo from "../../img/MiniLogo.png";
import "./NavBar.css";
import { IoMdClose } from "react-icons/io";
// import Switch from "react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AttendanceContext } from "../../Context/AttendanceContext/AttendanceContext";
import { useHistory } from "react-router-dom";
import addNotification from "react-push-notification";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import DarkModeToggle from "../TheamChanger/DarkModeToggle";
import { FaBell } from "react-icons/fa6";
import { LuMenu } from "react-icons/lu";
import { useSidebar } from "../../Context/AttendanceContext/smallSidebarcontext";
import DarkMode from "../TheamChanger/DarkMode/DarkMode";
import profile from "../../img/profile.jpg";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import BASE_URL from "../config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import SearchComponent from "../../Utils/SearchComponent/SearchComponent ";

const NavBar = (props, data) => {
  const [activeProfile, setActiveProfile] = useState(null);
  const history = useHistory();
  const { darkMode } = useTheme();
  const location = useLocation().pathname.split("/")[1];
  console.log(location);
  const [notification, setNotification] = useState([]);
  const [employeeData, setEmployeeData] = useState("");
  const [notiToggle, setNotiToggle] = useState(false);
  const { socket } = useContext(AttendanceContext);
  const { toggleSidebar } = useSidebar();
  const [loginNoti, setLoginNoti] = useState(true); //this is only for hr and admin to block employee login notification.
  let userProfile;

  console.log(userProfile);
  const id = localStorage.getItem("_id");
  const email = localStorage.getItem("Email");
  const pushNotification = (taskName) => {
    addNotification({
      title: "Kasper",
      subtitle: taskName,
      duration: 4000,
      icon: Logo,
      native: true,
    });
  };
  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        console.log(response.data);
        setEmployeeData(response.data);
        setNotification(response.data.Notification);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    loadEmployeeData();
  }, []);
  const notificationDeleteHandler = (id) => {
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
        console.log(response);
        setEmployeeData(response.data.result);
        setNotification(response.data.result.Notification);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const notificationHandler = (id, path) => {
    console.log(id);
    axios
      .post(
        `${BASE_URL}/api/notificationStatusUpdate/${id}`,
        { email },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((response) => {
        setEmployeeData(response.data.result);
        setNotification(response.data.result.Notification);
        console.log(response.data.result.Notification);
        history.push(`/${location}/${path}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleNotificationRequest = () => {
    // Check if the browser supports notifications
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Permission granted, you can now trigger notifications
          console.log("Notification permission granted");
        }
      });
    }
  };
  useEffect(() => {
    // console.log('Socket:', socket.id);
    socket.emit("userConnected", { email });
    handleNotificationRequest();
    if (socket) {
      socket.on("taskNotificationReceived", (data) => {
        console.log(data.Account);
        if (data.Account === 4) {
          if (data.managerEmail === email) {
            setNotification((prev) => [data, ...prev]);
            pushNotification(data.message);
          }
        } else if (data.Account === 2 || data.Account === 3) {
          console.log(data);
          let emp = data.employeesEmail.filter((val) => {
            return val === email && val !== data.senderMail;
          });
          if (emp.length > 0) {
            setNotification((prev) => [data, ...prev]);
            pushNotification(data.message);
          }
        } else if (data.Account === 1) {
          console.log(data);
          if (data.adminMail === email) {
            setNotification((prev) => [data, ...prev]);
            pushNotification(data.message);
          }
        }
      });
      socket.on("notificationPageUpdate", (data) => {
        if (data) {
          loadEmployeeData();
        }
      });
      socket.on("leaveNotificationReceived", (data) => {
        const {
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        } = data;

        const data1 = {
          message,
          status,
          path,
          taskId,
          managerEmail,
          hrEmail,
          messageBy,
          profile,
        };
        setNotification((prev) => [data1, ...prev]);
        pushNotification(data1.message);
      });
      socket.on("leaveManagerStatusNotificationReceived", (data) => {
        const {
          message,
          status,
          path,
          taskId,
          employeeEmail,
          hrEmail,
          managerEmail,
          messageBy,
          profile,
        } = data;
        if (location === "employee") {
          const data1 = {
            message,
            status,
            path,
            taskId,
            employeeEmail,
            hrEmail,
            messageBy,
            profile,
          };
          setNotification((prev) => [data1, ...prev]);
          pushNotification(data1.message);
        } else if (location === "hr") {
          const data1 = {
            message,
            status,
            path,
            taskId,
            employeeEmail,
            hrEmail,
            messageBy,
            profile,
          };
          setNotification((prev) => [data1, ...prev]);
          pushNotification(data1.message);
        } else if (location === "manager") {
          const data1 = {
            message,
            status,
            path,
            taskId,
            employeeEmail,
            managerEmail,
            messageBy,
            profile,
          };
          setNotification((prev) => [data1, ...prev]);
          pushNotification(data1.message);
        }
      });
    }
  }, [socket]);
  const clearAllHandler = () => {
    if (notification.length > 0) {
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
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  let uniqueNotification = notification.filter((val, index, arr) => {
    return (
      val.status === "unseen" &&
      arr.findIndex((item) => item.taskId === val.taskId) === index
    );
  });
  console.log(notification);

  const handleClick = () => {
    toggleSidebar();
  };

  const handleUserLogin = (data) => {
    const showNotification = (data) => {
      console.log(data);
      if (data) {
        const { message } = data;
        alert(message);
        toast.success(message, {
          duration: 2000,
          position: "top-right",
          style: {
            color: "green",
            backgroundColor: "white",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            zIndex: "9999",
          },
          toastClassName: "custom-toast",
        });
      }
    };
    if (loginNoti) {
      showNotification(data);
    }
  };
  const handleUserLogout = (data) => {
    const showNotification = (data) => {
      if (data) {
        const { message } = data;
        alert(message);
        toast.error(message, {
          duration: 2000,
          position: "top-right",
          style: {
            color: "white",
            backgroundColor: "red",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            zIndex: "9999",
          },
          toastClassName: "custom-toast",
        });
      }
    };

    if (loginNoti) {
      showNotification(data);
    }
  };

  useEffect(() => {
    socket.on("userLogin", handleUserLogin);
    socket.on("userLogout", handleUserLogout);
    return () => {
      socket.off("userLogin", handleUserLogin);
      socket.off("userLogout", handleUserLogout);
    };
  }, []);

  const renderInfoButton = (params) => {
    if (params.data && params.data.data) {
      return (
        <div>
          <FontAwesomeIcon
            icon={faInfoCircle}
            onClick={() => props.onEmpInfo(params.data.data)}
          />
        </div>
      );
    }
    return null;
  };

  function truncateMessage(message) {
    if (message.length > 15) {
      return message.substring(0, 15) + "...";
    }
    return message;
  }

  return (
    <div
      className="px-2 py-1"
      style={{
        height: "fit-content",
        backgroundColor: darkMode
          ? "var(--primaryDashMenuColor)"
          : "var(--primaryDashColorDark)",
      }}
    >
      <nav
        style={{ height: "3rem" }}
        className="d-flex align-items-center justify-content-between"
      >
        <button
          onClick={handleClick}
          style={{
            color: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
          }}
          className="my-auto btn fs-5 p-1 mx-0 d-flex d-sm-none align-iems-center"
        >
          <LuMenu />
        </button>
        <span>
          <img
            className="d-flex d-sm-none"
            style={{ width: "auto", height: "30px" }}
            src={Logo}
            alt=""
          />
          <img
            className="d-sm-flex d-none"
            style={{ width: "auto", height: "50px" }}
            src={Logo}
            alt=""
          />
        </span>
        <DarkModeToggle />
        <div className="ml-auto my-auto d-flex align-items-center gap-3">
          <SearchComponent />
          <div
            className="position-relative"
            onMouseEnter={() => setNotiToggle("name")}
            onMouseLeave={() => setNotiToggle(false)}
          >
            {notification.length > 0 && (
              <div
                className="notilenghth bg-warning text-muted fw-bold"
                style={{
                  display: uniqueNotification.length <= 0 ? "none" : "flex",
                  height: "fit-content",
                  width: "fit-content",
                  minWidth: "18px",
                  position: "absolute",
                  top: "-30%",
                  right: "-35%",
                  borderRadius: "50% 50% 50% 0",
                  objectFit: "cover",
                  fontSize: ".8rem",
                  padding: "0 .1rem",
                }}
              >
                <span className="m-auto">{uniqueNotification.length}</span>
              </div>
            )}
            <FaBell className="fs-5 text-primary" />
            {notification.length > 0 && (
              <div className="position-relative">
                <div
                  style={{
                    position: "absolute",
                    zIndex: "2001",
                    right: ".5rem",
                    top: "100%",
                    minWidth: "230px",
                    maxWidth: "250px",
                    borderRadius: "20px 0 20px 20px",
                    display: notiToggle == "name" ? "flex" : "none",
                  }}
                  className="border border-muted border-1 flex-column gap-1 w-100 bg-white align-items-center gap-2 justify-content-between  p-2  shadow"
                >
                  {notiToggle &&
                    notification.length > 0 &&
                    notification
                      .filter(
                        (val, i, ar) =>
                          ar.findIndex((item) => item.taskId === val.taskId) ===
                          i
                      )
                      .slice(0, 10)
                      .map((val, i) => {
                        return (
                          <div
                            className={
                              val.status === "unseen"
                                ? "d-flex align-items-center justify-content-between w-100 back"
                                : "d-flex align-items-center justify-content-between w-100"
                            }
                          >
                            <div
                              className="d-flex align-items-center gap-2 cursor-pointer "
                              onClick={
                                val.status === "unseen"
                                  ? () =>
                                      notificationHandler(val.taskId, val.path)
                                  : () =>
                                      history.push(`/${location}/${val.path}`)
                              }
                            >
                              <div
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "cover",
                                    overflow: "hidden",
                                    borderRadius: "50%",
                                  }}
                                  src={val.profile ? val.profile : profile}
                                  alt=""
                                />
                              </div>
                              <div>
                                <p
                                  style={{ fontSize: ".75rem" }}
                                  className="p-0 m-0 w-100 text-muted fw-bold"
                                >
                                  {truncateMessage(val.message)}
                                </p>
                                <p
                                  style={{ fontSize: ".80rem" }}
                                  className="p-0 m-0 w-100"
                                >
                                  {val.messageBy}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <span
                                style={{
                                  fontSize: ".80rem",
                                  height: "1.2rem",
                                  width: "1.2rem",
                                  borderRadius: "50%",
                                }}
                                className="d-flex align-items-center text-white  bg-danger justify-content-center"
                                onClick={(e) => (
                                  notificationDeleteHandler(val.taskId),
                                  e.stopPropagation()
                                )}
                              >
                                x
                              </span>
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
            )}
            {/* profile section */}
          </div>
          <span className="navbar-right-content my-auto d-flex  fw-bold">
            <div
              onMouseEnter={() => setActiveProfile("name")}
              onMouseLeave={() => setActiveProfile(null)}
              style={{
                height: "30px",
                width: "30px",
                border: "1px solid blue",
                borderRadius: "50%",
                position: "relative",
              }}
            >
              <img
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  border: "1px solid red",
                  borderRadius: "50%",
                }}
                src={
                  employeeData.profile
                    ? employeeData.profile.image_url
                    : profile
                }
                alt=""
              />

              <div
                className="bg-white shadow pb-3 pt-1 px-3 flex-column gap-3"
                style={{
                  position: "absolute",
                  zIndex: "100",
                  width: "fit-content",
                  right: "0",
                  top: "90%",
                  display: activeProfile === "name" ? "flex" : "none",
                }}
              >
                <span>
                  <p
                    style={{ width: "fit-content", fontSize: ".8rem" }}
                    className="m-0 my-1 border-danger border rounded-5 text-muted p-0 px-2"
                  >
                    {props.loginInfo["empID"]}
                  </p>
                  <p className="m-0 p-0">
                    <span className="text-capitalize m-0 p-0">
                      {props.loginInfo["Name"]}
                    </span>{" "}
                  </p>
                  <p className="m-0 text-muted p-0">
                    {props.loginInfo["Email"]}
                  </p>
                </span>
                <Link
                  className="text-decoration-none text-black"
                  to={
                    location === "employee"
                      ? `/employee/${id}/personal-info`
                      : `/${location}/personal-info`
                  }
                >
                  <span> My Profile</span>
                </Link>

                <button
                  onClick={props.onLogout}
                  style={{ cursor: "pointer" }}
                  className="btn btn-danger d-flex align-items-center justify-content-between"
                >
                  Logout
                  <FontAwesomeIcon
                    className="my-auto fs-6"
                    icon={faSignOutAlt}
                  />
                </button>
              </div>
            </div>
            <span className="text-muted"></span>
          </span>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
