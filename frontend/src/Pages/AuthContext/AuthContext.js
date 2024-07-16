import React, { useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = React.createContext();

const AuthContextProvider = (props) => {
  const [activeUser, setActiveUser] = useState({});
  const [config, setConfig] = useState({
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
  });

  useEffect(() => {
    const controlAuth = async () => {
      try {
        const { data } = await axios.get("/auth/private", config);
        setActiveUser(data.user);
      } catch (error) {
        localStorage.removeItem("authToken");

        setActiveUser({});
      }
    };
    controlAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ activeUser, setActiveUser, config, setConfig }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

// // AuthContext.js
// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userData, setUserData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [pass, setPass] = useState(true);
//   const [isLogin, setIsLogin] = useState(false);
//   const [firstTimeAlert, setFirstTimeAlert] = useState(true);

//   useEffect(() => {
//     setUserData({
//       _id: localStorage.getItem("_id") || "",
//       Account: localStorage.getItem("Account") || "",
//       Name: localStorage.getItem("Name") || "",
//       Email: localStorage.getItem("Email") || "",
//     });

//     setIsLogin(localStorage.getItem("isLogin") === "true");

//     if (firstTimeAlert && !isLogin) {
//       setFirstTimeAlert(false);
//     }
//   }, [firstTimeAlert, isLogin]);

//   const handleLogin = (id, pass) => {
//     // Implement the login logic using axios and jwt

//     // Simulating a successful login
//     setLoading(true);
//     setTimeout(() => {
//       setUserData({ _id: "123", Account: "1", Name: "Admin" });
//       setIsLogin(true);
//       setLoading(false);
//       setPass(true);
//     }, 1000);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     setUserData({});
//     setIsLogin(false);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         userData,
//         loading,
//         pass,
//         isLogin,
//         firstTimeAlert,
//         handleLogin,
//         handleLogout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };
