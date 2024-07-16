import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-circular-progressbar/dist/styles.css";
import { Toaster } from "react-hot-toast";
import * as serviceWorker from "./serviceWorker";
import AttendanceContextProvider from "./Context/AttendanceContext/AttendanceContextProvider";
import { SidebarProvider } from "./Context/AttendanceContext/smallSidebarcontext";
import { ThemeProvider } from "./Context/TheamContext/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <SidebarProvider>
        <AttendanceContextProvider>
          <App />
        </AttendanceContextProvider>
      </SidebarProvider>
    </ThemeProvider>
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: "",
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff"
        },

        // Default options for specific types
        success: {
          duration: 3000,
          theme: {
            primary: "green",
            secondary: "black"
          }
        }
      }}
    />{" "}
  </React.StrictMode>
);

serviceWorker.unregister();
