import React, { useState, useEffect } from "react";
import axios from "axios";
import "./forgot.css";
import { useHistory } from "react-router-dom";
import logo from "../../img/logo.webp";
import { Link } from "react-router-dom";
import BASE_URL from "../config/config";
import { IoArrowBackOutline, IoFingerPrintSharp } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import PasswordStrengthMeter from "../../Utils/PasswordStrengthMeter/PasswordStrengthMeter";
import { TbPasswordFingerprint } from "react-icons/tb";

const ForgetPass = () => {
  const history = useHistory();
  const [stage, setStage] = useState(1);
  const [data, setData] = useState({
    email: "",
    otp: "",
    pass: "",
    confirm_pass: "",
  });
  const [formError, setFormError] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passMatch, setPassMatch] = useState({
    password: "",
    confirmPassword: "",
  });
  const [countDown, setCountDown] = useState(0);
  const [message, setMessage] = useState("");
  const [isContinueDisabled, setIsContinueDisabled] = useState(true); // Added state

  useEffect(() => {
    setFormError({
      password: "",
      confirmPassword: "",
    });
  }, [stage]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countDown > 0) {
        if (countDown === 1 && stage === 2) {
          clearInterval(timer);
          setMessage("");
          return;
        }
        setCountDown(countDown - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countDown]);

  const verifyEmail = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/verfy_email`, data);
      localStorage.setItem("id", res.data.user._id);
      SendOtp();
      setStage(2);
    } catch (err) {
      if (err.response.data.message === "Enter valid email id") {
        alert(err.response.data.message);
      }
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    verifyEmail();
  };

  const SendOtp = async () => {
    const id = localStorage.getItem("id");
    try {
      const res = await axios.post(`${BASE_URL}/api/send_otp/${id}`, data);
      let day = new Date();
      let seconds = day.getSeconds();
      setCountDown(res.data.time - seconds + 1);
    } catch (err) {}
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/verfy_otp`, data);
      setStage(3);
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response.data.message === "your requist is faild") {
        alert("invalid otp");
      }
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const otpArray = data.otp.split("");
    otpArray[index] = value;
    const updatedOtp = otpArray.join("");
    setData((prev) => ({ ...prev, otp: updatedOtp }));

    if (updatedOtp.length === 4 && !updatedOtp.includes("")) {
      setIsContinueDisabled(false);
    } else {
      setIsContinueDisabled(true);
    }

    if (value && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (index < 3) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const validateFormInput = async (event) => {
    event.preventDefault();

    let valid = true;
    let passwordError = "";
    let confirmPasswordError = "";

    // Password validation
    if (data.pass === "") {
      passwordError = "Password should not be empty";
      valid = false;
    } else if (data.pass.length < 6) {
      passwordError = "Password must be at least 6 characters long";
      valid = false;
    } else if (!/\d/.test(data.pass)) {
      passwordError = "Password must include at least 1 numeric character";
      valid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.pass)) {
      passwordError = "Password must include at least 1 special character";
      valid = false;
    }

    // Confirm password validation
    if (data.pass !== data.confirm_pass) {
      confirmPasswordError = "Passwords do not match";
      valid = false;
    }

    setFormError((prev) => ({
      ...prev,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    }));

    if (!valid) return;

    const id = localStorage.getItem("id");
    try {
      await axios.post(`${BASE_URL}/api/forgot_pass/${id}`, data);
      localStorage.removeItem("id");
      history.push("/login#/login");
      alert("Your Password is Updated");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{ height: "100vh", width: "100%" }}
      className="login-container d-flex align-items-center justify-content-center"
    >
      <div
        style={{
          width: "25rem",
          background: "#ffffffd7",
          position: "relative",
        }}
        className="shadow p-3 px-4 rounded-4"
      >
        <div className="stage-indicator m-0">
          <div className="d-flex align-items-center flex-column">
            <img style={{ height: "60px", width: "auto" }} src={logo} alt="" />
            <h6>Technologies Private Limited</h6>
          </div>
          {/* <div className="progress-container">
            <div className={`progress-bar step-${stage}`} />
          </div>
          <span className="stage-text">Stage {stage} of 3</span> */}
        </div>
        <div
          className="row mx-auto"
          style={{
            width: "75%",
            position: "absolute",
            top: "-1.5rem",
            right: "0",
            // background: #3a82f8)",
            transform: "translate(-18%, 0%)",
          }}
        >
          <div className="col-4 p-1">
            <div
              className="rounded-5 shadow-sm"
              style={{
                height: ".5rem",
                background:
                  stage === 1 || stage === 2 || stage === 3
                    ? "#DE4E26"
                    : "white",
              }}
            ></div>
          </div>
          <div className="col-4 p-1">
            <div
              className="rounded-5 shadow-sm"
              style={{
                height: ".5rem",
                background: stage === 2 || stage === 3 ? "#DE4E26" : "white",
              }}
            ></div>
          </div>
          <div className="col-4 p-1">
            <div
              className="rounded-5 shadow-sm"
              style={{
                height: ".5rem",
                background: stage === 3 ? "#DE4E26" : "white",
              }}
            ></div>
          </div>
        </div>

        {stage === 1 && (
          <form onSubmit={handleEmailSubmit} className="login-form my-4">
            <div className="d-flex flex-column align-items-center gap-3 mb-3">
              <span
                style={{
                  height: "3rem",
                  width: "3rem",
                  border: "1px solid #3f3d3d9d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                  color: "#3f3d3d9d",
                }}
                className="shadow-sm"
              >
                <IoFingerPrintSharp className="fs-3" />
              </span>
              <div className="text-center">
                <h5 className="m-0">Forgot Password?</h5>
                <p className="m-0">
                  No worries, we will send you reset instructions.{" "}
                </p>
              </div>
            </div>
            <div className="d-flex flex-column w-100 my-2">
              <label htmlFor="">Email</label>
              <input
                type="email"
                placeholder="Please enter your email here"
                value={data.email}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="login-input rounded-1 m-0"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 rounded-0 mt-2"
            >
              Reset Password
            </button>
          </form>
        )}

        {stage === 2 && countDown > 0 ? (
          <>
            <form onSubmit={handleOtpSubmit} className="login-form my-4">
              <div className="d-flex flex-column align-items-center gap-3 mb-3">
                <span
                  style={{
                    height: "3rem",
                    width: "3rem",
                    border: "1px solid #3f3d3d9d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    color: "#3f3d3d9d",
                  }}
                  className="shadow-sm"
                >
                  <MdOutlineMarkEmailUnread className="fs-3" />
                </span>
                <div className="text-center">
                  <h5 className="m-0">Password reset</h5>
                  <p className="m-0">
                    We sent a code to{" "}
                    <span style={{ fontWeight: "500" }}>{data.email}</span>
                  </p>
                </div>
              </div>
              {countDown > 1 ? (
                <p>
                  Time Left: <span className="fw-bold mx-1">{countDown}</span>{" "}
                  Second
                </p>
              ) : (
                <p className="text-center">
                  Sorry, OTP has been Expired, <br />
                  <span
                    style={{ cursor: "pointer", color: "#DE4E26" }}
                    onClick={SendOtp}
                    className="resend-otp-button fw-bold"
                  >
                    Resend OTP
                  </span>
                </p>
              )}

              <div className="d-flex align-items-center justify-content-center gap-3">
                <input
                  id="otp-input-0"
                  type="text"
                  maxLength="1"
                  value={data.otp[0] || ""}
                  onChange={(e) => handleOtpChange(e, 0)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                  className="otp-input shadow-sm fw-bolder"
                  required
                />
                <input
                  id="otp-input-1"
                  type="text"
                  maxLength="1"
                  value={data.otp[1] || ""}
                  onChange={(e) => handleOtpChange(e, 1)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                  className="otp-input shadow-sm fw-bolder"
                  required
                />
                <input
                  id="otp-input-2"
                  type="text"
                  maxLength="1"
                  value={data.otp[2] || ""}
                  onChange={(e) => handleOtpChange(e, 2)}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                  className="otp-input shadow-sm fw-bolder"
                  required
                />
                <input
                  id="otp-input-3"
                  type="text"
                  maxLength="1"
                  value={data.otp[3] || ""}
                  onChange={(e) => handleOtpChange(e, 3)}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                  className="otp-input shadow-sm fw-bolder"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-75 mx-auto mt-4"
              >
                Continue
              </button>
            </form>
          </>
        ) : (
          <p>{message}</p>
        )}

        {stage === 3 && (
          <form onSubmit={validateFormInput} className="login-form mb-3">
            <div className="d-flex flex-column align-items-center gap-3 mb-3">
              <span
                style={{
                  height: "3rem",
                  width: "3rem",
                  border: "1px solid #3f3d3d9d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                  color: "#3f3d3d9d",
                }}
                className="shadow-sm"
              >
                <TbPasswordFingerprint className="fs-3" />
              </span>
              <div className="text-center">
                <h5 className="m-0">Set New Password</h5>
                <p className="m-0">
                  Password must be at least 6 characters long and include 1
                  numeric and 1 special character.
                </p>
              </div>
            </div>
            <div className="d-flex flex-column align-items-start gap-0 w-100">
              <label>Password</label>
              <input
                value={data.pass}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, pass: e.target.value }))
                }
                name="password"
                type="password"
                className="login-input m-0"
                placeholder="Password"
                required
              />
              <PasswordStrengthMeter password={data.pass} />
            </div>
            <p className="error-message">{formError.password}</p>

            <div className="d-flex flex-column align-items-start gap-0 w-100">
              <label>Confirm Password</label>
              <input
                value={data.confirm_pass}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, confirm_pass: e.target.value }))
                }
                name="confirm_password"
                type="password"
                className="login-input m-0"
                placeholder="Confirm Password"
                required
              />
            </div>

            <p className="error-message">{formError.confirmPassword}</p>
            <button type="submit" className="btn btn-primary w-100">
              Reset
            </button>
          </form>
        )}
        <Link
          to="login#/login"
          className="d-flex align-items-center gap-2 text-decoration-none text-dark"
          style={{ fontSize: "14px", width: "fit-content" }}
        >
          <IoArrowBackOutline />
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgetPass;
