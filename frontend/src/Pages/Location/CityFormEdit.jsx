import React, { Component } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import axios from "axios";
import BASE_URL from "../config/config";

class CityForm extends Component {
  state = {
    CityData: this.props.editData["CityName"],
    stateData: [],
    filteredStateData: [],
    countryData: [],
    filteredCountryData: [],
  };

  onChange = (e) => {
    this.setState({ CityData: e.target.value });
  };

  loadCountryInfo = () => {
    axios
      .get(`${BASE_URL}/api/country`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        this.setState({ countryData: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loadStateInfo = () => {
    axios
      .get(`${BASE_URL}/api/state`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        this.setState({ stateData: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.loadCountryInfo();
    this.loadStateInfo();
  }

  onCountryChange = (e) => {
    const currentCountry = e.target.value;
    const filteredState = this.state.stateData.filter(
      (data) => data["country"][0]["_id"] === currentCountry
    );
    this.setState({ filteredStateData: filteredState });
  };

  render() {
    return (
      <div>
        <h2 id="role-form-title">Edit City Details</h2>

        <div id="role-form-outer-div">
          <Form
            id="form"
            onSubmit={(e) =>
              this.props.onCityEditUpdate(this.props.editData, e)
            }
          >
            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                Country
              </Form.Label>
              <Col sm={10} className="form-input">
                <Form.Control
                  as="select"
                  name="country"
                  onChange={this.onCountryChange}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select your option
                  </option>
                  {this.state.countryData.map((data, index) => (
                    <option key={index} value={data["_id"]}>
                      {data["CountryName"]}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                State
              </Form.Label>
              <Col sm={10} className="form-input">
                <Form.Control as="select" name="state" required>
                  <option value="" disabled>
                    Select your option
                  </option>
                  {this.state.filteredStateData.map((data, index) => (
                    <option
                      key={index}
                      value={data["_id"]}
                      selected={
                        this.props.editData["state"][0]["_id"] === data["_id"]
                      }
                    >
                      {data["StateName"]}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                City
              </Form.Label>
              <Col sm={10} className="form-input">
                <Form.Control
                  type="text"
                  placeholder="City"
                  name="City"
                  required
                  onChange={this.onChange}
                  value={this.state.CityData}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} id="form-submit-button">
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type="submit">Update</Button>
              </Col>
            </Form.Group>
            <Form.Group as={Row} id="form-cancel-button">
              <Col sm={{ span: 10, offset: 2 }} id="form-cancel-button-inner">
                <Button type="reset" onClick={this.props.onFormEditClose}>
                  Cancel
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }
}

export default CityForm;
