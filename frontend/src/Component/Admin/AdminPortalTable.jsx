import React, { Component } from "react";
import "./AdminPortalTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import BASE_URL from "../../Pages/config/config";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

class AdminPortalTable extends Component {
  state = {
    portalData: [],
    loading: true
  };
  portalObj = [];
  rowDataT = [];

  loadPortalData = () => {
    axios
      .get(`${BASE_URL}/api/admin/portal`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        this.portalObj = response.data;
        // }
        console.log("response", response.data);
        this.setState({ portalData: response.data });
        this.setState({ loading: false });
        this.rowDataT = [];

        this.portalObj.map((data) => {
          let temp = {
            data,
            PortalName: data["PortalName"],
            Status: data["Status"] == 1 ? "enable" : "disable"
          };

          this.rowDataT.push(temp);
        });
        this.setState({ rowData: this.rowDataT });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onPortalDelete = (e) => {
    console.log(e);
    if (
      window.confirm(
        "Are you sure to delete this record,It Will Delete All Projects Related to This Portal? "
      ) == true
    ) {
      axios
        .delete(`${BASE_URL}/api/admin/portal/` + e, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        })
        .then((res) => {
          this.componentDidMount();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  componentDidMount() {
    this.loadPortalData();
  }
  renderButton(params) {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() => this.onPortalDelete(params.data.data["_id"])}
      />
    );
  }
  renderEditButton(params) {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => this.props.onEditPortal(params.data.data)}
      />
    );
  }

  Status = (s) => {
    if (s == 1) {
      return "enabled";
    } else {
      return "disabled";
    }
  };

  render() {
    return (
      <div className="p-4">
        <div className="d-flex justify-between aline-items-start mb-3">
          <div className=" my-auto">
            <h3 className="fw-bold text-muted">Portal Details</h3>
            <p className="text-muted">
              You can create new bid and view all Bidding details of the
              companies here !
            </p>
          </div>

          <Button
            className="my-auto"
            variant="primary"
            id="add-button"
            onClick={this.props.onAddPortal}
          >
            <FontAwesomeIcon icon={faPlus} id="plus-icon" />
            Add new Details
          </Button>
        </div>
        <div id="clear-both" />

        {!this.state.loading ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th
                  style={{
                    cursor: "pointer",
                    background: "linear-gradient(#1D267D, #2F58CD)",
                    color: "white"
                  }}
                >
                  Portal
                </th>
                <th
                  style={{
                    cursor: "pointer",
                    background: "linear-gradient(#1D267D, #2F58CD)",
                    color: "white"
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.portalData.map((items, index) => (
                <tr key={index}>
                  <td>{items.PortalName}</td>
                  <td>{items.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div id="loading-bar">
            <RingLoader
              css={override}
              sizeUnit={"px"}
              size={50}
              color={"#0000ff"}
              loading={true}
            />
          </div>
        )}
      </div>
    );
  }
}

export default AdminPortalTable;
