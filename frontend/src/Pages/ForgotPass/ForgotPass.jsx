import React, { useState, useEffect } from "react";
import axios from "axios";
import "./forgot.css";
import { useHistory } from "react-router-dom";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import BASE_URL from "../config/config";
const ForgotPass = () => {
  const history = useHistory();
  const [stage, setStage] = useState(1);
  const [data, setData] = useState({
    email: "",
    otp: "",
    pass: "",
    confirm_pass: ""
  });
  const [formError, setFormError] = useState({
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    setFormError({
      password: "",
      confirmPassword: ""
    });
  }, [stage]);

  const [passMatch, setPassMatch] = useState({
    password: "",
    confirmPassword: ""
  });

  const [countDown, setCountDown] = useState(0);
  const [message, setMessage] = useState("");

  // timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (countDown > 0) {
        if (countDown === 1 && stage === 2) {
          // alert("time out");
          // setStage(1);
          clearInterval(timer);
          setMessage("");
          return;
        }
        setCountDown(countDown - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countDown]);

  // verfy the email id
  const verfyEmail = async () => {
    await axios
      .post(`${BASE_URL}/api/verfy_email`, data)
      .then((res) => {
        localStorage.setItem("id", res.data.user._id);
        SendOtp();
        setStage(2);
      })
      .catch((err) => {
        if (err.response.data.message === "Enter valid email id") {
          alert(err.response.data.message);
        }
      });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    verfyEmail();
  };

  // send the otp
  const SendOtp = async () => {
    const id = localStorage.getItem("id");
    await axios
      .post(`${BASE_URL}/api/send_otp/${id}`, data)
      .then((res) => {
        let day = new Date();
        let secounds = day.getSeconds();
        setCountDown(res.data.time - secounds + 1);
      })
      .catch((err) => {});
  };

  // verfy the otp
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/verfy_otp`, data);
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response.data.message === "your requist is faild") {
        alert("invalid otp");
        // setStage(1);
        return;
      }
    }

    setStage(3);
  };

  // change  the password
  const validateFormInput = async (event) => {
    event.preventDefault();

    if (data.pass === "") {
      setFormError({
        password: "Password should not be empty"
      });
    } else {
      const id = localStorage.getItem("id");
      await axios
        .post(`${BASE_URL}/api/forgot_pass/${id}`, data)
        .then((res) => {
          console.log(res);
          localStorage.removeItem("id");
          history.push("/login#/login");
          alert("Your Password is Updated");
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setStage(3);
  };

  let success = () => {
    if (
      passMatch.password &&
      passMatch.confirmPassword === passMatch.password
    ) {
      alert("successfully changed");
    }
    return;
  };

  return (
    <>
      <div className="login-container">
        <div className="main">
          <div className="stage-indicator">
            <div className="logo">
              <img src={logo} alt="" />
            </div>
            <div className="progress-container">
              <div className={`progress-bar step-${stage}`} />
            </div>
            <span className="stage-text">Stage {stage} of 3</span>
          </div>

          {stage === 1 && (
            <form onSubmit={handleEmailSubmit} className="login-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="login-input"
                required
              />
              <button type="submit" className="login-button">
                Next
              </button>
            </form>
          )}

          {stage === 2 && countDown > 0 ? (
            <>
              <form onSubmit={handleOtpSubmit} className="login-form mb-3">
                <p className="count-Down">Time Left: {countDown} sec</p>
                <input
                  type="number"
                  placeholder="Enter OTP"
                  value={data.otp}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, otp: e.target.value }))
                  }
                  className="login-input"
                  required
                />
                <button type="submit" className="login-button">
                  Next
                </button>
              </form>
              <div className="box">
                <button
                  className={`bg-none mt-2 fw-semibold mx-auto text-primary`}
                  onClick={SendOtp}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "14px"
                  }}
                >
                  Resend Otp
                </button>
              </div>
            </>
          ) : (
            <p>{message}</p>
          )}

          {stage === 3 && (
            <form onSubmit={validateFormInput} className="login-form mb-3">
              <p className="label">Password</p>
              <input
                value={data.pass}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, pass: e.target.value }))
                }
                name="password"
                type="password"
                className="login-input"
                placeholder="Password"
                required
              />
              <p className="error-message">{formError.password}</p>

              <input
                type="submit"
                className="login-button"
                value="Submit"
                onClick={success}
              />
            </form>
          )}
          <div className="box text-center">
            <Link
              to="login#/login"
              className="fw-semibold"
              style={{ fontSize: "14px" }}
            >
              Do You Login Hear
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPass;
