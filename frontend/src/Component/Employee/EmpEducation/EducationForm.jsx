import React from "react";
import "./EducationForm.css";
import { Form, Button, div, Row } from "react-bootstrap";

const EducationForm = (props) => {
  let id;
  if (props.data) {
    id = props.data["_id"];
  } else {
    id = localStorage.getItem("_id");
  }
  return (
    <div className="container-fluid">
      <h5 className="my-3">+ Add Education Details</h5>
      <div>
        <form onSubmit={(e) => props.onEducationSubmit(e, id)}>
          <div>
            <label>School / University</label>
            <div className="form-input">
              <Form.Control
                type="Text"
                className="rounded-0"
                placeholder="School / University "
                required
              />
            </div>
          </div>
          <div>
            <lable>Degree</lable>
            <div sm={10} className="form-input">
              <Form.Control type="Text" placeholder="Degree " required />
            </div>
          </div>
          <div>
            <lable>Grade</lable>
            <div sm={10} className="form-input">
              <Form.Control
                className="rounded-0"
                type="Text"
                placeholder="Grade"
                required
              />
            </div>
          </div>
          <div>
            <lable>Passing Of Year</lable>
            <div sm={10} className="form-input">
              <Form.Control
                type="Text"
                className="rounded-0"
                placeholder="Passing Of Year"
                required
              />
            </div>
          </div>

          <div className="d-flex gap-3 mt-3">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>

            <button
              className="btn btn-danger"
              type="reset"
              onClick={props.onFormClose}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationForm;
