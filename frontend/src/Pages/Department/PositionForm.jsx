import React, { Component } from "react";
import "./PositionForm.css";
// import { Form,Button } from "react-bootstrap";
import { Form, Button, Col, Row } from "react-bootstrap";
import axios from "axios";
import BASE_URL from "../config/config";
class PositionForm extends Component {
  state = {
    companyInfo: [],
  };
  companyData = [];
  loadCompanyInfo = () => {
    axios
      .get(`${BASE_URL}/api/company`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        this.companyData = response.data;
        this.setState({ companyInfo: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  componentWillMount() {
    this.loadCompanyInfo();
  }
  render() {
    return (
      <div>
        <h2 className="p-3 fw-bold text-muted text-center mt-3">
          Add Position 🪑
        </h2>

        <div id="role-form-outer-div">
          <Form id="form" onSubmit={this.props.onPositionSubmit}>
            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                <h5>Company :</h5>
              </Form.Label>
              <Col sm={10} className="form-input">
                <Form.Control as="select" name="country" required>
                  <option value="" disabled selected>
                    Select your option
                  </option>
                  {this.companyData.map((data, index) => (
                    <option value={data["_id"]}>{data["CompanyName"]}</option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>
            <br />
            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                <h5>Position :</h5>
              </Form.Label>
              <Col sm={10} className="form-input">
                <Form.Control
                  type="Text"
                  placeholder="Position"
                  name="Position"
                  required
                />
              </Col>
            </Form.Group>
            <div className="row mt- ">
              <div className="col-2"></div>

              <div className="col-10 d-flex justify-between ">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
                <button
                  className="btn btn-secondary"
                  type="reset"
                  onClick={this.props.onFormClose}
                >
                  cancel
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default PositionForm;
