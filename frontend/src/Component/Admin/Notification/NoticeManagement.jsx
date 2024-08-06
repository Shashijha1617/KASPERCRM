import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Container, Form } from "react-bootstrap";
import { v4 as uuid } from "uuid";
import BASE_URL from "../../../Pages/config/config";

const NoticeManagement = () => {
  const [newTask, setNewTask] = useState({
    notice: "",
    attachments: null,
  });
  const isFormValid = () => {
    return newTask.notice.trim() !== "";
  };

  const sendNotice = async () => {
    let formData = new FormData();
    const noticeId = uuid();
    formData.append("noticeId", noticeId);
    formData.append("notice", newTask.notice);
    formData.append("file", newTask.attachments);
    // console.log(newTask);
    // socket.emit('sendNotice', formData);
    axios
      .post(`${BASE_URL}/api/notice`, formData)
      .then((res) => {
        alert("Notice send");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div style={{ zIndex: "1" }} className="p-4 d-flex flex-column ">
      <form className="row p-0 p-md-3 m-auto">
        <h2 className="fw-bold text-muted "> 🖋️Send new Notice</h2>
        <p className="text-muted">
          Unleash the Power of Notice: Communicate with Impact, Ignite Change!
        </p>
        <div className="col-12 mt-5 d-flex flex-column">
          <Form.Group controlId="Taskname">
            <Form.Label className="fw-bold">Notice</Form.Label>
            <input
              className="form-control"
              type="text"
              required
              placeholder="Notice"
              value={newTask.notice}
              onChange={(e) =>
                setNewTask({ ...newTask, notice: e.target.value })
              }
            />
          </Form.Group>
        </div>
        <div>
          <Form.Group controlId="Attachments">
            <Form.Label className="fw-bold mt-3">Attachments</Form.Label>
            <input
              className="form-control"
              type="file"
              multiple
              required
              onChange={(e) =>
                setNewTask({ ...newTask, attachments: e.target.files[0] })
              }
            />
          </Form.Group>
        </div>
        <Button
          className="mt-4 w-100 fw-bold text-white"
          variant="info"
          onClick={sendNotice}
          disabled={!isFormValid()}
        >
          Send Notice
        </Button>
      </form>
    </div>
  );
};

export default NoticeManagement;
