import React from "react";

const FamilyInfoForm = (props) => {
  return (
    <div className="container-fluid">
      <h5 className="my-3">+ Add Experience</h5>
      <div>
        <form onSubmit={props.onFamilyInfoSubmit}>
          <div>
            <label>Name</label>
            <div className="form-input">
              <input
                className="form-control"
                type="Text"
                placeholder="Name"
                required
              />
            </div>
          </div>
          <div>
            <lable>Relationship</lable>
            <div className="form-input">
              <input
                className="form-control"
                type="Text"
                placeholder="Relationship"
                required
              />
            </div>
          </div>
          <div>
            <lable> DOB</lable>
            <div className="form-input">
              <input className="form-control" type="date" required />
            </div>
          </div>
          <div>
            <lable>Occupation</lable>
            <div className="form-input">
              <input
                className="form-control"
                type="Text"
                placeholder="Occupation"
                required
              />
            </div>
          </div>
          <div>
            <lable> Contact No</lable>
            <div className="form-input">
              <input
                className="form-control"
                type="Text"
                placeholder="Contact No"
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
    // <div>
    //   <h2 id="role-form-title">Add FamilyInfo Details</h2>
    //   <div id="role-form-outer-div">
    //     <Form id="form" onSubmit={props.onFamilyInfoSubmit}>
    //       <Form.Group as={Row}>
    //         <Form.Label column sm={2}>
    //           Name
    //         </Form.Label>
    //         <Col sm={10} className="form-input">
    //           <Form.Control type="Text" placeholder="Name" required />
    //         </Col>
    //       </Form.Group>
    //       <Form.Group as={Row}>
    //         <Form.Label column sm={2}>
    //           Relationship
    //         </Form.Label>
    //         <Col sm={10} className="form-input">
    //           <Form.Control type="Text" placeholder="Relationship" required />
    //         </Col>
    //       </Form.Group>
    //       <Form.Group as={Row}>
    //         <Form.Label column sm={2}>
    //           DOB
    //         </Form.Label>
    //         <Col sm={10} className="form-input">
    //           <Form.Control type="date" required />
    //         </Col>
    //       </Form.Group>
    //       <Form.Group as={Row}>
    //         <Form.Label column sm={2}>
    //           Occupation
    //         </Form.Label>
    //         <Col sm={10} className="form-input">
    //           <Form.Control type="Text" placeholder="Occupation" required />
    //         </Col>
    //       </Form.Group>
    //       {/* <Form.Group as={Row}>
    //         <Form.Label column sm={2}>
    //           Contact No
    //         </Form.Label>
    //         <Col sm={10} className="form-input">
    //           <Form.Control type="Text" placeholder="Contact No" required />
    //         </Col>
    //       </Form.Group> */}

    //       <Form.Group as={Row} id="form-submit-button">
    //         <Col sm={{ span: 10, offset: 2 }}>
    //           <Button type="submit">Submit</Button>
    //         </Col>
    //       </Form.Group>
    //       <Form.Group as={Row} id="form-cancel-button">
    //         <Col sm={{ span: 10, offset: 2 }} id="form-cancel-button-inner">
    //           <Button type="reset" onClick={props.onFormClose}>
    //             cancel
    //           </Button>
    //         </Col>
    //       </Form.Group>
    //     </Form>
    //   </div>
    // </div>
  );
};

export default FamilyInfoForm;
