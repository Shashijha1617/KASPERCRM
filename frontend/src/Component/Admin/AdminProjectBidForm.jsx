import React, { useState, useEffect } from "react";
import "./AdminProjectBidForm.css";
import axios from "axios";
import { Form, Button, Col, Row } from "react-bootstrap";
import BASE_URL from "../../Pages/config/config";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const AdminProjectBidForm = ({ onProjectBidSubmit, onFormClose }) => {
  const [status, setStatus] = useState("");
  const [portalsInfo, setPortalsInfo] = useState([]);
  const { darkMode } = useTheme();
  let portalsData = [];

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const loadPortalsInfo = () => {
    axios
      .get(`${BASE_URL}/api/admin/portal`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        portalsData = response.data.filter((data) => data.Status === 1);
        setPortalsInfo(portalsData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadPortalsInfo();
  }, []);

  return (
    <div className="container-fluid py-3">
      <div className="my-auto">
        <h5
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
            fontWeight: "600",
          }}
          className="m-0"
        >
          Add Project Bid Details
        </h5>
        <p
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="m-0"
        >
          You can create new bid here.
        </p>
      </div>

      <div id="role-form-outer-div">
        <Form id="form" onSubmit={onProjectBidSubmit}>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Project Title
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="text"
                placeholder="Project Title"
                name="ProjectTitle"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Project URL
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="text"
                placeholder="Project URL"
                name="ProjectURL"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Project Description
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control as="textarea" rows="3" required />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Portals
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control as="select" name="CompanyID" required>
                {portalsInfo.map((data, index) => (
                  <option key={data["_id"]} value={data["_id"]}>
                    {data["PortalName"]}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Estimated Time
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="number"
                placeholder="Estimated Time"
                name="EstimatedTime"
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Estimated Cost
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="number"
                placeholder="Estimated Cost"
                name="EstimatedCost"
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Resource
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control as="select" required>
                <option value="1">Resource1</option>
                <option value="2">Resource2</option>
                <option value="3">Resource3</option>
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Status
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control as="select" required>
                <option value="1">Open</option>
                <option value="2">Close</option>
                <option value="3">Cancel</option>
                <option value="4">Award</option>
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Remark
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control as="textarea" rows="3" required />
            </Col>
          </Form.Group>

          <Form.Group as={Row} id="form-submit-button">
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit">Submit</Button>
            </Col>
          </Form.Group>
          <Form.Group as={Row} id="form-cancel-button">
            <Col sm={{ span: 10, offset: 2 }} id="form-cancel-button-inner">
              <Button type="reset" onClick={onFormClose}>
                Cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default AdminProjectBidForm;
