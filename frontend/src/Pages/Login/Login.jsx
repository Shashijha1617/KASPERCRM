import React, { useState } from "react";
import "./Login.css";
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
import { Link } from "react-router-dom";
import LoginImage from "../../img/AuthPage/LoginPage.jpeg";

const Login = (props) => {
  let error = null;
  const [alertMsg, setalertMsg] = useState("");
  const [seePass, setSeepass] = useState(false);
  const [password, setPassword] = useState("");
  if (props.error) {
    if (props.error.response) {
      error = props.error.response.data;
    } else {
      error = props.error.message;
    }
  }
  return (
    <div
      style={{ height: "100vh", width: "100%", overflow: "auto" }}
      className="  m-0 p-0 bg-light"
    >
      <div
        style={{ height: "100%", width: "100%" }}
        className="row flex-row-reverse mx-auto bg-white"
      >
        <div
          style={{ height: "100%" }}
          className="col-12 col-md-4 position-relative  px-0 p-md-5 d-flex bg-white flex-column justify-content-center aline-center"
        >
          <form
            style={{
              height: "fit-content",
              zIndex: "1",
            }}
            onSubmit={props.onSubmit}
            className="form my-auto p-md-3 p py-5 rounded text-black fw-bold d-flex flex-column justify-content-center"
          >
            <h4
              style={{
                color: "var(--primaryDashColorDark)",
              }}
              className="my-4 text-center text-md-start gap-2"
            >
              Sign In
            </h4>
            <div className="d-flex flex-column my-3">
              <label for="email" className="ps-2 fw-normal">
                Account
              </label>
              <input
                name="email"
                placeholder="Email Address, Phone or UserID"
                className="login-input border my-0"
                type="text"
              />
            </div>

            <div className="d-flex position-relative flex-column my-3 mb-4 mb-md-3">
              <label for="password" className="ps-2  fw-normal">
                Enter your password
              </label>
              <div className="position-relative">
                <input
                  name="password"
                  placeholder="**********"
                  className="login-input border my-0"
                  type={!seePass ? "password" : "text"}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "5%",
                    right: "3%",
                    outline: "none",
                    border: "none",
                  }}
                  className="fs-5 text-muted my-0"
                  onClick={(e) => {
                    e.preventDefault();
                    setSeepass(seePass ? false : true);
                  }}
                >
                  {!seePass ? <RxEyeOpen /> : <GoEyeClosed />}
                </span>
              </div>
              {error ? (
                <p
                  style={{
                    position: "absolute",
                    fontWeight: "normal",
                    bottom: "-80%",
                    left: "50%",
                    transform: "translate(-50%)",
                    whiteSpace: "pre",
                  }}
                  className="alert   text-danger"
                >
                  {error}
                </p>
              ) : (
                ""
              )}
            </div>

            <p
              style={{
                display: alertMsg ? "block" : "none",
                fontWeight: "normal",
              }}
              className="text-danger text-center"
            >
              {alertMsg}
            </p>

            <div className="row mx-auto w-100 justify-content-between my-3 row-gap-4">
              <input
                style={{
                  background: "var(--primaryDashColorDark)",
                  color: "var(--primaryDashMenuColor)",
                }}
                type="submit"
                className="btn btn-primary"
                value=" Login"
              />
              <Link
                to="/forgetPassword"
                className="fw-normal text-decoration-none"
                style={{ cursor: "pointer" }}
              >
                Forgot password?
              </Link>
            </div>

            <p
              style={{
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translate(-50%)",
                fontWeight: "normal",
                whiteSpace: "pre",
              }}
              className="d-blocktext-center text-muted"
            >
              Made with <span className="heart beat">❤️</span> by Kasper
              Infotech
            </p>
          </form>
        </div>
        <div
          style={{
            height: "100%",
            zIndex: "0",
            // position: "relative",
            backgroundImage: `url(${LoginImage})`,
          }}
          className="imagePossition col-12 col-md-8 p-5 d-flex flex-column justify-content-center gap-4 "
        >
          <p
            style={{ position: "absolute", bottom: "10px" }}
            className="text-center pt-5 text-white"
          >
            www.kasperinfotech.org
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
