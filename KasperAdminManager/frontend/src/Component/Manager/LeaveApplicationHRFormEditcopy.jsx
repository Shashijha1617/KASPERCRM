import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";

const LeaveApplicationHRForm = (props) => {
  const [FromDateData, setFromDateData] = useState(
    props.editData["FromDate"].slice(0, 10)
  );
  const [ToDateData, setToDateData] = useState(
    props.editData["ToDate"].slice(0, 10)
  );
  const [ReasonforleaveData, setReasonforleaveData] = useState(
    props.editData["Reasonforleave"]
  );

  const handleLeaveApplicationHREditUpdate = (e) => {
    e.preventDefault();
    props.onLeaveApplicationHREditUpdate(props.editData, e);
  };

  return (
    <div className="registration-page py-4">
      <h2
        id="role-form-title"
        className="text-center text-black text-uppercase fw-bold my-4"
      >
        Edit Leave Application Of {props.editData["employee"][0]["FirstName"]}{" "}
        {props.editData["employee"][0]["LastName"]}
      </h2>
      <div id="role-form-outer-div">
      <Form id="form" onSubmit={handleLeaveApplicationHREditUpdate}>
          <div className="d-flex  flex-column gap-2 rounded ">
            <div style={{ padding: "70px" }} className="row ">
              <div className="form-group col-12 col-md-6">
                <Form.Group as={Row}>
                  <Form.Label column sm={6}>
                    Leave Type
                  </Form.Label>
                  <Col sm={10} className="form-input">
                    <Form.Control as="select" required>
                      <option value="" disabled selected>
                        Select your option
                      </option>
                      <option
                        value="Sick Leave"
                        selected={props.editData["Leavetype"] == "Sick Leave"}
                        disabled
                      >
                        Sick Leave
                      </option>
                      <option
                        value="Casual Leave"
                        selected={props.editData["Leavetype"] == "Casual Leave"}
                        disabled
                      >
                        Casual Leave
                      </option>
                      <option
                        value="Privilege Leave"
                        selected={
                          props.editData["Leavetype"] == "Privilege Leave"
                        }
                        disabled
                      >
                        Privilege Leave
                      </option>
                    </Form.Control>
                  </Col>
                </Form.Group>
              </div>
              <div className="form-group col-12 col-md-6">
                <Form.Group as={Row}>
                  <Form.Label column sm={6}>
                    FromDate
                  </Form.Label>
                  <Col sm={10} className="form-input">
                    <Form.Control
                      type="date"
                      required
                      disabled
                      value={FromDateData}
                    />
                  </Col>
                </Form.Group>
              </div>
              <div className="form-group col-12 col-md-6">
                <Form.Group as={Row}>
                  <Form.Label column sm={6}>
                    ToDate
                  </Form.Label>
                  <Col sm={10} className="form-input">
                    <Form.Control
                      type="date"
                      required
                      disabled
                      value={ToDateData}
                    />
                  </Col>
                </Form.Group>
              </div>
              <div className="form-group col-12 col-md-6">
                <Form.Group as={Row}>
                  <Form.Label column sm={6}>
                    Leave Status
                  </Form.Label>
                  <Col sm={10} className="form-input">
                    <Form.Control as="select" required>
                      <option value="Pending" selected disabled>
                        Pending
                      </option>
                      <option
                        value="2"
                        selected={props.editData["Status"] == 2}
                      >
                        Approve
                      </option>
                      <option
                        value="3"
                        selected={props.editData["Status"] == 3}
                      >
                        Reject
                      </option>
                    </Form.Control>
                  </Col>
                </Form.Group>
              </div>
              <div className="form-group col-12">
                <Form.Group as={Row}>
                  <Form.Label column sm={6}>
                    Reason for leave
                  </Form.Label>
                  <Col sm={11} className="form-input">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Reason for leave"
                      required
                      disabled
                      value={ReasonforleaveData}
                    />
                  </Col>
                </Form.Group>
              </div>
              <div
                className="form-group col-12 d-flex  gap-5"
                id="form-submit-button"
              >
                <Button className="mx-3" type="submit">
                  Submit
                </Button>
                <Button
                  className="mx-3"
                  type="reset"
                  onClick={props.onFormClose}
                >
                  cancel
                </Button>
              </div>
              <div
                className="form-group col-12 col-md-6"
                id="form-cancel-button"
              ></div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LeaveApplicationHRForm;

// import React, { useState } from "react";
// import { Form, Button, Col, Row } from "react-bootstrap";

// const LeaveApplicationHRForm = (props) => {
//   const [FromDateData, setFromDateData] = useState(
//     props.editData["FromDate"].slice(0, 10)
//   );
//   const [ToDateData, setToDateData] = useState(
//     props.editData["ToDate"].slice(0, 10)
//   );
//   const [ReasonforleaveData, setReasonforleaveData] = useState(
//     props.editData["Reasonforleave"]
//   );

//   const handleLeaveApplicationHREditUpdate = (e) => {
//     e.preventDefault();
//     props.onLeaveApplicationHREditUpdate(props.editData, e);
//   };

//   return (
//     <div className="registration-page py-4">
//       <h2 id="role-form-title" className="text-center text-black text-uppercase fw-bold my-4">
//         Edit Leave Application Of {props.editData["employee"][0]["FirstName"]}{" "}
//         {props.editData["employee"][0]["LastName"]}
//       </h2>

//       <div id="role-form-outer-div">
//         <Form id="form" onSubmit={handleLeaveApplicationHREditUpdate}>
//           <div className="d-flex flex-column gap-2 rounded">
//             <div style={{ padding: '70px' }} className="row">
//               <div className="form-group col-12 col-md-6">
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={6}>
//                     Leave Type
//                   </Form.Label>
//                   <Col sm={10} className="form-input">
//                     <Form.Control as="select" required disabled>
//                       <option value="" disabled selected>
//                         Select your option
//                       </option>
//                       <option
//                         value="Sick Leave"
//                         selected={props.editData["Leavetype"] === "Sick Leave"}
//                         disabled
//                       >
//                         Sick Leave
//                       </option>
//                       <option
//                         value="Casual Leave"
//                         selected={props.editData["Leavetype"] === "Casual Leave"}
//                         disabled
//                       >
//                         Casual Leave
//                       </option>
//                       <option
//                         value="Privilege Leave"
//                         selected={props.editData["Leavetype"] === "Privilege Leave"}
//                         disabled
//                       >
//                         Privilege Leave
//                       </option>
//                     </Form.Control>
//                   </Col>
//                 </Form.Group>
//               </div>
//               <div className="form-group col-12 col-md-6">
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={6}>
//                     FromDate
//                   </Form.Label>
//                   <Col sm={10} className="form-input">
//                     <Form.Control type="date" required disabled value={FromDateData} />
//                   </Col>
//                 </Form.Group>
//               </div>
//               <div className="form-group col-12 col-md-6">
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={6}>
//                     ToDate
//                   </Form.Label>
//                   <Col sm={10} className="form-input">
//                     <Form.Control type="date" required disabled value={ToDateData} />
//                   </Col>
//                 </Form.Group>
//               </div>
//               <div className="form-group col-12 col-md-6">
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={6}>
//                     Leave Status
//                   </Form.Label>
//                   <Col sm={10} className="form-input">
//                     <Form.Control as="select" required >
//                       <option value="Pending" selected disabled>
//                         Pending
//                       </option>
//                       <option value="2" selected={props.editData["Status"] === 2}>
//                         Approve
//                       </option>
//                       <option value="3" selected={props.editData["Status"] === 3}>
//                         Reject
//                       </option>
//                     </Form.Control>
//                   </Col>
//                 </Form.Group>
//               </div>
//               <div className="form-group col-12">
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={6}>
//                     Reason for leave
//                   </Form.Label>
//                   <Col sm={11} className="form-input">
//                     <Form.Control
//                       as="textarea"
//                       rows={3}
//                       placeholder="Reason for leave"
//                       required
//                       disabled
//                       value={ReasonforleaveData}
//                     />
//                   </Col>
//                 </Form.Group>
//               </div>
//               <div className="form-group col-12 d-flex gap-5" id="form-submit-button">
//                 <Button className="mx-3" type="submit">
//                   Submit
//                 </Button>
//                 <Button className="mx-3" type="reset" onClick={props.onFormClose}>
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default LeaveApplicationHRForm;
