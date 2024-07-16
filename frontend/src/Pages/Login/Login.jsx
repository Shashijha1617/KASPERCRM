import React, { useState } from "react";
import "./Login.css";
import { css } from "@emotion/core";
import LoginIMG from "../../img/LOGINBACK.svg";
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

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
        className="row mx-auto bg-white"
      >
        <div
          style={{ height: "100%" }}
          className="col-12 col-md-6 position-relative  px-0 p-md-5 d-flex bg-white flex-column justify-content-center aline-center"
        >
          <form
            style={{ height: "100%" }}
            onSubmit={props.onSubmit}
            className="form  my-auto  w-75  p-0 p-md-3 pb-4 rounded text-black fw-bold d-flex flex-column justify-content-center"
          >
            <h2
              style={{
                color: "var(--primaryDashColorDark)"
              }}
              className="fw-bolder mb-4 text-center text-md-start gap-2"
            >
              <FaUserCircle /> Log in
            </h2>
            <div className="d-flex flex-column my-3">
              <label for="email" className="ps-2 fw-normal">
                Enter your email address{" "}
              </label>
              <input
                name="email"
                placeholder="abcd@xyz.com"
                className="form-control rounded-5 bg-white border-3 border-muted"
                type="email"
              />
            </div>

            <div className="d-flex position-relative flex-column my-3 mb-4 mb-md-3">
              <label for="password" className="ps-2  fw-normal">
                Enter your password
              </label>
              <div className="position-relative">
                <input
                  name="password"
                  style={{ width: "100%" }}
                  placeholder="**********"
                  className="form-control rounded-5 bg-white border-3 border-muted"
                  type={!seePass ? "password" : "text"}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "5%",
                    right: "3%",
                    outline: "none",
                    border: "none"
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
                    whiteSpace: "pre"
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
                fontWeight: "normal"
              }}
              className="text-danger text-center"
            >
              {alertMsg}
            </p>

            <div className="row mx-auto w-100 justify-content-between my-3 row-gap-4">
              <input
                style={{
                  background: "var(--primaryDashColorDark)",
                  color: "var(--primaryDashMenuColor)"
                }}
                type="submit"
                className="btn col-12 col-md-5  shadow rounded-5 fw-bolder shadow-sm"
                value=" Login"
              />
              <Link
                to="/forgetPassword"
                className="fw-semibold btn  col-12 col-md-5 shadow rounded-5 mt-0"
              >
                Forgot password
              </Link>
            </div>

            <p
              style={{
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translate(-50%)",
                fontWeight: "normal",
                whiteSpace: "pre"
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
            backgroundColor: "var(--primaryDashColorDark)"
          }}
          className="col-12 col-md-6 p-5 d-flex flex-column justify-content-center gap-4 "
        >
          <div className="pt-5">
            <h5
              style={{ wordSpacing: "5px" }}
              className="text-white text-center"
            >
              👋 Nice to see you again
            </h5>
            <h1
              style={{ letterSpacing: "5px" }}
              className="fw-bolder text-white text-center"
            >
              Welcome Back
            </h1>
          </div>
          <img
            style={{ width: "80%", margin: "0 auto" }}
            src={LoginIMG}
            alt=""
          />
          <p className="text-center pt-5 text-white">www.kasperinfotech.org</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
