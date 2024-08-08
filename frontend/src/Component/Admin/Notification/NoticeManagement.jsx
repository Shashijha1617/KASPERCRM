import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Container, Form } from "react-bootstrap";
import { v4 as uuid } from "uuid";
import BASE_URL from "../../../Pages/config/config";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";

const NoticeManagement = () => {
  const email = localStorage.getItem("Email");
  const [newTask, setNewTask] = useState({
    notice: "",
    attachments: null,
  });
  const { darkMode } = useTheme();
  const isFormValid = () => {
    return newTask.notice.trim() !== "";
  };

  const sendNotice = async () => {
    let formData = new FormData();
    const noticeId = uuid();
    formData.append("noticeId", noticeId);
    formData.append("notice", newTask.notice);
    formData.append("file", newTask.attachments);
    formData.append("creator", email);
    // console.log(newTask);
    // socket.emit('sendNotice', formData);
    axios
      .post(`${BASE_URL}/api/notice`, formData)
      .then((res) => {
        alert("Notice send");
        setNewTask({
          notice: "",
          attachments: null,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-2"
    >
      <TittleHeader
        title={"Send new Notice"}
        message={"Create notice or announcement from here."}
      />
      <form className="mt-3 d-flex flex-column gap-3">
        <div>
          <label>Notice</label>
          <textarea
            className="form-control rounded-0"
            type="text"
            required
            placeholder="Please mention topic for the notice or announcement"
            value={newTask.notice}
            onChange={(e) => setNewTask({ ...newTask, notice: e.target.value })}
          />
        </div>
        <div>
          <label>Attachments</label>
          <input
            className="form-control rounded-0"
            type="file"
            multiple
            required
            onChange={(e) =>
              setNewTask({ ...newTask, attachments: e.target.files[0] })
            }
          />
        </div>
        <div className="d-flex">
          <btn
            className="btn btn-primary"
            onClick={sendNotice}
            disabled={!isFormValid()}
          >
            Send Notice
          </btn>
        </div>
      </form>
    </div>
  );
};

export default NoticeManagement;
