import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import axios from "axios";

const FamilyInfoFormEdit = (props) => {
  const [nameData, setNameData] = useState(props.editData["Name"]);
  const [relationshipData, setRelationshipData] = useState(
    props.editData["Relationship"]
  );
  const [dobData, setDOBData] = useState(props.editData["DOB"].slice(0, 10));
  const [occupationData, setOccupationData] = useState(
    props.editData["Occupation"]
  );

  const onNameDataChange = (e) => {
    setNameData(e.target.value);
  };

  const onRelationshipDataChange = (e) => {
    setRelationshipData(e.target.value);
  };

  const onOccupationDataChange = (e) => {
    setOccupationData(e.target.value);
  };

  const onDOBDataChange = (e) => {
    setDOBData(e.target.value);
  };

  return (
    <div>
      <h2 id="role-form-title">Edit FamilyInfo Details</h2>
      <div id="role-form-outer-div">
        <Form
          id="form"
          onSubmit={(e) => props.onFamilyInfoEditUpdate(props.editData, e)}
        >
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Name
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="Text"
                placeholder="Name"
                required
                value={nameData}
                onChange={(e) => onNameDataChange(e)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Relationship
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="Text"
                placeholder="Relationship"
                required
                value={relationshipData}
                onChange={(e) => onRelationshipDataChange(e)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              DOB
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="date"
                placeholder="DOB"
                required
                value={dobData}
                onChange={(e) => onDOBDataChange(e)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Occupation
            </Form.Label>
            <Col sm={10} className="form-input">
              <Form.Control
                type="Text"
                placeholder="Occupation"
                required
                value={occupationData}
                onChange={(e) => onOccupationDataChange(e)}
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
              <Button type="reset" onClick={props.onFormEditClose}>
                Cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default FamilyInfoFormEdit;
