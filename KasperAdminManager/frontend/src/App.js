import React, { useState, useEffect, useContext } from "react";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";
import jwt from "jsonwebtoken";
import history from "./history.js";
import "./App.css"
import Login from "./Pages/Login/Login.jsx";
import DashboardAdmin from "./Component/Admin/DashboardAdmin.jsx";
import DashboardHR from "./Component/HrManager/DashboardHR.jsx";
import DashboardEmployee from "./Component/Employee/DashboardEmployee.jsx";
import ManagerDashboard from "./Component/Manager/ManagerDashboard.jsx";
import ForgetPass from "./Pages/ForgotPass/ForgetPass.jsx";
import BASE_URL from "./Pages/config/config.js";
import Moment from "moment";
import { AttendanceContext } from "./Context/AttendanceContext/AttendanceContext.js";
import { toast } from "react-hot-toast";

const App = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [firstTimeAlert, setFirstTimeAlert] = useState(true);
  const [employees, setEmployees] = useState(null);
  const { socket } = useContext(AttendanceContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUserData({
      _id: localStorage.getItem("_id") || "",
      Account: localStorage.getItem("Account") || "",
      Name: localStorage.getItem("Name") || "",
      Email: localStorage.getItem("Email") || "",
      empID: localStorage.getItem("empID") || "",
      profile: localStorage.getItem("profile") || ""
    });

    setIsLogin(localStorage.getItem("isLogin") === "true");

    // temporary: for the user to see user id and pass of all accounts to explore all features of the app
    if (firstTimeAlert && !isLogin) {
      setFirstTimeAlert(false);
    }
  }, [firstTimeAlert, isLogin]);
  const loadEmployeeData = (email, account) => {
    console.log(email, account, localStorage.getItem("token"));
    axios
      .get(`${BASE_URL}/api/employee`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        // Ensure that response.data is an array
        let related = response.data.filter((val) => {
          return val.Account === account;
        });
        console.log(related);
        setEmployees(related);
        handleLogin(related, email);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    setPass(true);
    setLoading(true);
    login(event.target[0].value, event.target[1].value);
    event.target.reset();
  };
  const handleLogou = async (data) => {
    let email = localStorage.getItem("Email");
    console.log(data);
    if (data) {
      console.log(data);
      let attencenceID = data[0].attendanceObjID;
      let selectedEmployee = data[0]._id;
      socket.emit("logoutUser", {
        manager: data[0].reportHr || data[0].reportManager,
        user: data[0].Email
      });
      try {
        if (!data[0].Email) {
          alert("Please select an employee");
          return;
        }

        const currentTime = Moment().format("HH:mm:ss");
        const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
        await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
          employeeId: selectedEmployee,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          date: new Date().getDate(),
          logoutTime: [currentTime],
          logoutTimeMs: [currentTimeMs],
          status: "logout"
        });
        //to allow user to login in another browser
        axios
          .patch(`${BASE_URL}/api/employeeLogoutStatusUpdate`, {
            email: data[0].Email
          })
          .then((res) => {})
          .catch((err) => {
            console.log("err");
          });
        alert("Logout time recorded successfully");
      } catch (error) {
        console.error("Error recording logout time:", error);
        alert("Error recording logout time");
      }
    }
  };
  const loadParticularEmployeeData = () => {
    const id = localStorage.getItem("_id");
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        console.log(response.data);
        handleLogou([response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleLogout = () => {
    console.log("logout");
    loadParticularEmployeeData();
    localStorage.clear();
    setUserData({});
    setIsLogin(false);
  };
  const fetchUsers = async (id, email) => {
    console.log(id, email);
    try {
      const response = await axios.get(`${BASE_URL}/api/employee/` + id, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      });
      console.log(response.data);
      setEmployees(response.data);
      handleLogin(response.data, email);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleLogin = async (data1, email) => {
    console.log(data1);
    if (data1 && email) {
      let data = data1.filter((val) => {
        return val.Email === email;
      });
      console.log(data[0].attendanceObjID, data[0]._id);
      let attencenceID = data[0].attendanceObjID;
      let selectedEmployee = data[0]._id;

      try {
        if (!(data1 && email)) {
          alert("Please select a user");
          return;
        }

        const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
        const currentTime = Moment().format("HH:mm:ss");

        await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
          employeeId: selectedEmployee,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          date: new Date().getDate(),
          loginTime: [currentTime],
          loginTimeMs: [currentTimeMs],
          status: "login"
        });
        toast.success("Login time recorded successfully");
      } catch (error) {
        console.error("Error recording login time:", error);
        toast.error("Error recording login time");
      }
    }
  };
  const login = (id, pass) => {
    const bodyLogin = {
      email: id,
      password: pass
    };

    axios
      .post(`${BASE_URL}/api/login`, bodyLogin)
      .then((res) => {
        const decodedData = jwt.decode(res.data);
        console.log(decodedData.status);
        if (decodedData.status === "Inactive") {
          console.log(decodedData.status);
          throw new Error("User Inactive");
          return;
        }
        
        // if (decodedData["loginStatus"] === "loggedIn") {
        //   throw new Error("User Already Logged In");
        //   return;
        // }

        localStorage.setItem("token", res.data);

        if (decodedData.Account === 1) {
          setPass(true);
          setLoading(false);
          setIsLogin(true);

          localStorage.setItem("isLogin", true);
          localStorage.setItem("Account", 1);
          localStorage.setItem("_id", decodedData._id);
          localStorage.setItem(
            "Name",
            `${decodedData.FirstName} ${decodedData.LastName}`
          );
          localStorage.setItem("Email", bodyLogin.email);
          localStorage.setItem("empID", decodedData.empID);
          localStorage.setItem("profile", decodedData.profile);

          loadEmployeeData(bodyLogin.email, decodedData.Account);
          history.push("#/admin/dashboard");
        } else if (decodedData.Account === 2) {
          console.log(decodedData);
          setPass(true);
          setLoading(false);
          setIsLogin(true);

          localStorage.setItem("isLogin", true);
          localStorage.setItem("Account", 2);
          localStorage.setItem("_id", decodedData._id);
          localStorage.setItem(
            "Name",
            `${decodedData.FirstName} ${decodedData.LastName}`
          );
          localStorage.setItem("Email", bodyLogin.email);
          localStorage.setItem("empID", decodedData.empID);
          localStorage.setItem("profile", decodedData.profile);

          // console.log(decodedData._id);
          loadEmployeeData(bodyLogin.email, decodedData.Account);
          history.push("#/hr/dashboard");
          socket.emit("loginUser", {
            manager: decodedData.reportManager,
            user: bodyLogin.email
          });
        } else if (decodedData.Account === 4) {
          console.log(decodedData);
          setPass(true);
          setLoading(false);
          setIsLogin(true);

          localStorage.setItem("isLogin", true);
          localStorage.setItem("Account", 4);
          localStorage.setItem("_id", decodedData._id);
          localStorage.setItem(
            "Name",
            `${decodedData.FirstName} ${decodedData.LastName}`
          );
          localStorage.setItem("Email", bodyLogin.email);
          localStorage.setItem("empID", decodedData.empID);
          localStorage.setItem("profile", decodedData.profile);
          // console.log(decodedData._id);
          loadEmployeeData(bodyLogin.email, decodedData.Account);
          // fetchUsers(decodedData._id, bodyLogin.email);
          history.push("#/manager/dashboard");
          socket.emit("loginUser", {
            manager: decodedData.reportManager,
            user: bodyLogin.email
          });
        } else if (decodedData.Account === 3) {
          console.log(decodedData);
          setPass(true); 
          setLoading(false);
          setIsLogin(true);

          localStorage.setItem("isLogin", true);
          localStorage.setItem("Account", 3);
          localStorage.setItem("_id", decodedData._id);
          localStorage.setItem("Name", `${decodedData.FirstName} `);
          localStorage.setItem("Email", bodyLogin.email);
          localStorage.setItem("empID", decodedData.empID);

          localStorage.setItem("profile", decodedData.profile);
          // loadEmployeeData(bodyLogin.email, decodedData.Account);
          fetchUsers(decodedData._id, bodyLogin.email);
          socket.emit("loginUser", {
            manager: decodedData.reportHr,
            user: bodyLogin.email
          });

          // history.push(`#/employee/${decodedData._id}/dashboard`);
        }
        axios
          .patch(`${BASE_URL}/api/employeeLoginStatusUpdate`, {
            email: bodyLogin.email
          })
          .then((res) => {})
          .catch((err) => {
            console.log("err");
          });
      })
      .catch((err) => {
        setError(err);
        setPass(false);
        setLoading(false);
      });
  };

  return (
    <Router>
      <Route
        exact
        path="/login"
        render={() =>
          userData.Account == 1 ? (
            <Redirect to="/admin/dashboard" />
          ) : userData.Account == 2 ? (
            <Redirect to="/hr/dashboard" />
          ) : userData.Account == 3 ? (
            <Redirect to="/employee/dashboard" />
          ) : userData.Account == 4 ? (
            <Redirect to="/manager/dashboard" />
          ) : (
            <Login
              onSubmit={handleSubmit}
              loading={loading}
              pass={pass}
              error={error}
            />
          )
        }
      />
      <Route
        path="/admin"
        render={() =>
          userData.Account == 1 ? (
            <DashboardAdmin data={userData} onLogout={handleLogout} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
      <Route
        path="/hr"
        render={() =>
          userData.Account == 2 ? (
            <DashboardHR data={userData} onLogout={handleLogout} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
      <Route
        path="/employee/"
        render={() =>
          userData.Account == 3 ? (
            <DashboardEmployee data={userData} onLogout={handleLogout} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
      <Route
        path="/manager/"
        render={() =>
          userData.Account == 4 ? (
            <ManagerDashboard data={userData} onLogout={handleLogout} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
      <Route path="/forgetPassword" exact component={ForgetPass} />
      <Route path="/" render={() => <Redirect to="/login" />} />
      <Route render={() => <Redirect to="/login" />} />
    </Router>
  );
};

export default App;

// import React, { useState, useEffect, useContext } from "react";
// import { HashRouter as Router, Route, Redirect } from "react-router-dom";
// import axios from "axios";
// import jwt from "jsonwebtoken";
// import history from "./history.js";

// import Login from "./Pages/Login/Login.jsx";
// import DashboardAdmin from "./Component/Admin/DashboardAdmin.jsx";
// import DashboardHR from "./Component/HrManager/DashboardHR.jsx";
// import DashboardEmployee from "./Component/Employee/DashboardEmployee.jsx";
// import ManagerDashboard from "./Component/Manager/ManagerDashboard.jsx";
// import ForgetPass from "./Pages/ForgotPass/ForgetPass.jsx";
// import BASE_URL from "./Pages/config/config.js";
// import Moment from "moment";
// import { AttendanceContext } from "./Context/AttendanceContext/AttendanceContext.js";
// import { toast } from "react-hot-toast";

// const App = () => {
//   const [userData, setUserData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [pass, setPass] = useState(true);
//   const [isLogin, setIsLogin] = useState(false);
//   const [firstTimeAlert, setFirstTimeAlert] = useState(true);
//   const [employees, setEmployees] = useState(null);
//   const { socket } = useContext(AttendanceContext);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setUserData({
//       _id: localStorage.getItem("_id") || "",
//       Account: localStorage.getItem("Account") || "",
//       Name: localStorage.getItem("Name") || "",
//       Email: localStorage.getItem("Email") || "",
//       empID: localStorage.getItem("empID") || "",
//       profile: localStorage.getItem("profile") || ""
//     });

//     setIsLogin(localStorage.getItem("isLogin") === "true");

//     // temporary: for the user to see user id and pass of all accounts to explore all features of the app
//     if (firstTimeAlert && !isLogin) {
//       setFirstTimeAlert(false);
//     }
//   }, [firstTimeAlert, isLogin]);
//   const loadEmployeeData = (email, account) => {
//     console.log(email, account, localStorage.getItem("token"));
//     axios
//       .get(`${BASE_URL}/api/employee`, {
//         headers: {
//           authorization: localStorage.getItem("token") || ""
//         }
//       })
//       .then((response) => {
//         // Ensure that response.data is an array
//         let related = response.data.filter((val) => {
//           return val.Account === account;
//         });
//         console.log(related);
//         setEmployees(related);
//         handleLogin(related, email);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
//   const handleSubmit = (event) => {
//     event.preventDefault();

//     setPass(true);
//     setLoading(true);
//     login(event.target[0].value, event.target[1].value);
//     event.target.reset();
//   };
//   const handleLogou = async () => {
//     let email = localStorage.getItem("Email");
//     console.log(employees, email);
//     if (employees) {
//       let data = employees.filter((val) => {
//         return val.Email === email;
//       });
//       console.log(data);
//       let attencenceID = data[0].attendanceObjID;
//       let selectedEmployee = data[0]._id;
//       socket.emit("logoutUser", {
//         manager: data[0].reportHr || data[0].reportManager,
//         user: data[0].Email
//       });
//       try {
//         if (!email) {
//           alert("Please select an employee");
//           return;
//         }

//         const currentTime = Moment().format("HH:mm:ss");
//         const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
//         await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
//           employeeId: selectedEmployee,
//           year: new Date().getFullYear(),
//           month: new Date().getMonth() + 1,
//           date: new Date().getDate(),
//           logoutTime: [currentTime],
//           logoutTimeMs: [currentTimeMs],
//           status: "logout"
//         });
//         axios
//           .patch(`${BASE_URL}/api/employeeLogoutStatusUpdate`, {
//             email
//           })
//           .then((res) => { })
//           .catch((err) => {
//             console.log("err");
//           });
//         toast.success("Logout time recorded successfully");
//       } catch (error) {
//         console.error("Error recording logout time:", error);
//         toast.error("Error recording logout time");
//       }
//     }
//   };
//   const handleLogout = () => {
//     console.log("logout");
//     handleLogou();
//     localStorage.clear();
//     setUserData({});
//     setIsLogin(false);
//   };
//   const fetchUsers = async (id, email) => {
//     console.log(id, email);
//     try {
//       const response = await axios.get(`${BASE_URL}/api/employee/` + id, {
//         headers: {
//           authorization: localStorage.getItem("token") || ""
//         }
//       });
//       console.log(response.data);
//       setEmployees(response.data);
//       handleLogin(response.data, email);
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//     }
//   };

//   const handleLogin = async (data1, email) => {
//     console.log(data1);
//     if (data1 && email) {
//       let data = data1.filter((val) => {
//         return val.Email === email;
//       });
//       console.log(data[0].attendanceObjID, data[0]._id);
//       let attencenceID = data[0].attendanceObjID;
//       let selectedEmployee = data[0]._id;

//       try {
//         if (!(data1 && email)) {
//           alert("Please select a user");
//           return;
//         }

//         const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
//         const currentTime = Moment().format("HH:mm:ss");

//         await axios.post(`${BASE_URL}/api/attendance/${attencenceID}`, {
//           employeeId: selectedEmployee,
//           year: new Date().getFullYear(),
//           month: new Date().getMonth() + 1,
//           date: new Date().getDate(),
//           loginTime: [currentTime],
//           loginTimeMs: [currentTimeMs],
//           status: "login"
//         });
//         toast.success("Login time recorded successfully");
//       } catch (error) {
//         console.error("Error recording login time:", error);
//         toast.error("Error recording login time");
//       }
//     }
//   };

//   const login = (id, pass) => {
//     const bodyLogin = {
//       email: id,
//       password: pass
//     };

//     axios
//       .post(`${BASE_URL}/api/login`, bodyLogin)
//       .then((res) => {
//         const decodedData = jwt.decode(res.data);
//         console.log(decodedData.status);
//         if (decodedData.status === "Inactive") {
//           console.log(decodedData.status);
//           throw new Error("User Inactive");
//           return;
//         }
//         if (decodedData["loginStatus"] === "loggedIn") {
//           throw new Error("User Already Logged In");
//           return;
//         }
//         localStorage.setItem("token", res.data);

//         if (decodedData.Account === 1) {
//           setPass(true);
//           setLoading(false);
//           setIsLogin(true);

//           localStorage.setItem("isLogin", true);
//           localStorage.setItem("Account", 1);
//           localStorage.setItem("_id", decodedData._id);
//           localStorage.setItem(
//             "Name",
//             `${decodedData.FirstName} ${decodedData.LastName}`
//           );
//           localStorage.setItem("Email", bodyLogin.email);
//           localStorage.setItem("empID", decodedData.empID);
//           localStorage.setItem("profile", decodedData.profile);

//           loadEmployeeData(bodyLogin.email, decodedData.Account);
//           history.push("#/admin/dashboard");
//         } else if (decodedData.Account === 2) {
//           console.log(decodedData);
//           setPass(true);
//           setLoading(false);
//           setIsLogin(true);

//           localStorage.setItem("isLogin", true);
//           localStorage.setItem("Account", 2);
//           localStorage.setItem("_id", decodedData._id);
//           localStorage.setItem(
//             "Name",
//             `${decodedData.FirstName} ${decodedData.LastName}`
//           );
//           localStorage.setItem("Email", bodyLogin.email);
//           localStorage.setItem("empID", decodedData.empID);
//           localStorage.setItem("profile", decodedData.profile);

//           // console.log(decodedData._id);
//           loadEmployeeData(bodyLogin.email, decodedData.Account);
//           history.push("#/hr/dashboard");
//           socket.emit("loginUser", {
//             manager: decodedData.reportManager,
//             user: bodyLogin.email
//           });
//         } else if (decodedData.Account === 4) {
//           console.log(decodedData);
//           setPass(true);
//           setLoading(false);
//           setIsLogin(true);

//           localStorage.setItem("isLogin", true);
//           localStorage.setItem("Account", 4);
//           localStorage.setItem("_id", decodedData._id);
//           localStorage.setItem(
//             "Name",
//             `${decodedData.FirstName} ${decodedData.LastName}`
//           );
//           localStorage.setItem("Email", bodyLogin.email);
//           localStorage.setItem("empID", decodedData.empID);
//           localStorage.setItem("profile", decodedData.profile);
//           // console.log(decodedData._id);
//           loadEmployeeData(bodyLogin.email, decodedData.Account);
//           // fetchUsers(decodedData._id, bodyLogin.email);
//           history.push("#/manager/dashboard");
//           socket.emit("loginUser", {
//             manager: decodedData.reportManager,
//             user: bodyLogin.email
//           });
//         } else if (decodedData.Account === 3) {
//           console.log(decodedData);
//           setPass(true);
//           setLoading(false);
//           setIsLogin(true);

//           localStorage.setItem("isLogin", true);
//           localStorage.setItem("Account", 3);
//           localStorage.setItem("_id", decodedData._id);
//           localStorage.setItem("Name", `${decodedData.FirstName} `);
//           localStorage.setItem("Email", bodyLogin.email);
//           localStorage.setItem("empID", decodedData.empID);

//           localStorage.setItem("profile", decodedData.profile);
//           // loadEmployeeData(bodyLogin.email, decodedData.Account);
//           fetchUsers(decodedData._id, bodyLogin.email);
//           socket.emit("loginUser", {
//             manager: decodedData.reportHr,
//             user: bodyLogin.email
//           });

//           // history.push(`#/employee/${decodedData._id}/dashboard`);
//         }
//         axios
//           .patch(`${BASE_URL}/api/employeeLoginStatusUpdate`, {
//             email: bodyLogin.email
//           })
//           .then((res) => { })
//           .catch((err) => {
//             console.log("err");
//           });
//       })
//       .catch((err) => {
//         setError(err);
//         setPass(false);
//         setLoading(false);
//       });
//   };

//   return (
//     <div style={{ maxHeight: '100vh', overflow: 'hidden' }}>
//       <Router>
//         <Route
//           exact
//           path="/login"
//           render={() =>
//             userData.Account == 1 ? (
//               <Redirect to="/admin/dashboard" />
//             ) : userData.Account == 2 ? (
//               <Redirect to="/hr/dashboard" />
//             ) : userData.Account == 3 ? (
//               <Redirect to="/employee/dashboard" />
//             ) : userData.Account == 4 ? (
//               <Redirect to="/manager/dashboard" />
//             ) : (
//               <Login
//                 onSubmit={handleSubmit}
//                 loading={loading}
//                 pass={pass}
//                 error={error}
//               />
//             )
//           }
//         />
//         <Route
//           path="/admin"
//           render={() =>
//             userData.Account == 1 ? (
//               <DashboardAdmin data={userData} onLogout={handleLogout} />
//             ) : (
//               <Redirect to="/login" />
//             )
//           }
//         />
//         <Route
//           path="/hr"
//           render={() =>
//             userData.Account == 2 ? (
//               <DashboardHR data={userData} onLogout={handleLogout} />
//             ) : (
//               <Redirect to="/login" />
//             )
//           }
//         />
//         <Route
//           path="/employee/"
//           render={() =>
//             userData.Account == 3 ? (
//               <DashboardEmployee data={userData} onLogout={handleLogout} />
//             ) : (
//               <Redirect to="/login" />
//             )
//           }
//         />
//         <Route
//           path="/manager/"
//           render={() =>
//             userData.Account == 4 ? (
//               <ManagerDashboard data={userData} onLogout={handleLogout} />
//             ) : (
//               <Redirect to="/login" />
//             )
//           }
//         />
//         <Route path="/forgetPassword" exact component={ForgetPass} />
//         <Route path="/" render={() => <Redirect to="/login" />} />
//         <Route render={() => <Redirect to="/login" />} />
//       </Router>
//     </div>
//   );
// };

// export default App;
