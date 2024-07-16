import React, { Component } from "react";
import "./AdminProjectBidTable.css";
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

class AdminProjectBidTable extends Component {
  state = {
    projectBidData: [],
    loading: true,
    rowData: [],
    sortColumn: null,
    sortDirection: "asc",
    error: null // New state for handling errors
  };
  loadProjectBidData = () => {
    axios
      .get(`${BASE_URL}/api/admin/project-bid`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {
        const projectBidData = response.data;
        this.setState({ projectBidData, loading: false, error: null });

        const rowData = projectBidData.map((data) => ({
          data,
          ProjectTitle: data["ProjectTitle"],
          PortalName: data["portals"][0]["PortalName"],
          ProjectURL: data["ProjectURL"],
          EstimatedTime: data["EstimatedTime"],
          EstimatedCost: data["EstimatedCost"],
          Remark: data["Remark"]
        }));

        this.setState({ rowData });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false, error: "Error loading data." });
      });
  };

  onProjectBidDelete = (e) => {
    console.log(e);
    if (window.confirm("Are you sure to delete this record? ") == true) {
      axios
        .delete(`${BASE_URL}/api/admin/project-bid/` + e, {
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
    this.loadProjectBidData();
  }
  renderButton(params) {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() => this.onProjectBidDelete(params.data.data["_id"])}
      />
    );
  }
  renderEditButton(params) {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => this.props.onEditProjectBid(params.data.data)}
      />
    );
  }

  renderSortIcon = (field) => {
    const { sortColumn, sortDirection } = this.state;
    if (sortColumn === field) {
      return sortDirection === "asc" ? "▴" : "▾";
    }
    return null;
  };

  sortData = (columnName) => {
    const { rowData, sortColumn, sortDirection } = this.state;
    let newSortDirection = "asc";

    if (sortColumn === columnName && sortDirection === "asc") {
      newSortDirection = "desc";
    }

    const sortedData = [...rowData];

    sortedData.sort((a, b) => {
      const valueA = String(a[columnName]).toLowerCase(); // Convert to lowercase string
      const valueB = String(b[columnName]).toLowerCase(); // Convert to lowercase string

      let comparison = 0;

      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      return sortDirection === "desc" ? comparison * -1 : comparison;
    });

    this.setState({
      rowData: sortedData,
      sortColumn: columnName,
      sortDirection: newSortDirection
    });
  };
  render() {
    return (
      <div className="p-4" id="table-outer-div-scroll">
        <div className="d-flex justify-between aline-items-start mb-3">
          <div className=" my-auto">
            <h3 className="fw-bold text-muted">Bidding Details</h3>
            <p className="text-muted">
              You can create new bid and view all Bidding details of the
              companies here !
            </p>
          </div>

          <Button
            className="my-auto"
            variant="primary"
            id="add-button"
            onClick={this.props.onAddProjectBid}
          >
            <FontAwesomeIcon icon={faPlus} id="plus-icon" />
            Add new Details
          </Button>
        </div>

        <div id="clear-both" />

        {!this.state.loading ? (
          <div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th
                    style={{
                      background: "linear-gradient(#1D267D, #2F58CD)",
                      color: "white"
                    }}
                    className="py-1"
                    onClick={() => this.sortData("ProjectTitle")}
                  >
                    Project Title {this.renderSortIcon("ProjectTitle")}
                  </th>
                  <th
                    style={{
                      background: "linear-gradient(#1D267D, #2F58CD)",
                      color: "white"
                    }}
                    className="py-1"
                    onClick={() => this.sortData("PortalName")}
                  >
                    Portal {this.renderSortIcon("PortalName")}
                  </th>
                  <th
                    style={{
                      background: "linear-gradient(#1D267D, #2F58CD)",
                      color: "white"
                    }}
                    className="py-1"
                    onClick={() => this.sortData("ProjectURL")}
                  >
                    Project URL {this.renderSortIcon("ProjectURL")}
                  </th>
                  <th
                    style={{
                      background: "linear-gradient(#1D267D, #2F58CD)",
                      color: "white"
                    }}
                    className="py-1"
                    onClick={() => this.sortData("EstimatedTime")}
                  >
                    Estimate Time {this.renderSortIcon("EstimatedTime")}
                  </th>
                  <th
                    style={{
                      background: "linear-gradient(#1D267D, #2F58CD)",
                      color: "white"
                    }}
                    className="py-1"
                    onClick={() => this.sortData("EstimatedCost")}
                  >
                    Estimate Cost {this.renderSortIcon("EstimatedCost")}
                  </th>
                  <th
                    style={{
                      background: "linear-gradient(#1D267D, #2F58CD)",
                      color: "white"
                    }}
                    className="py-1"
                    onClick={() => this.sortData("Remark")}
                  >
                    Remark {this.renderSortIcon("Remark")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.projectBidData.map((items, index) => (
                  <tr key={index}>
                    <td className="text-uppercase">{items.ProjectTitle}</td>
                    <td>{items.portals[0].PortalName}</td>
                    <td>
                      <a href={items.ProjectURL}>{items.ProjectURL}</a>
                    </td>
                    <td>{items.EstimatedTime}</td>
                    <td>{items.EstimatedCost}</td>
                    <td>{items.Remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default AdminProjectBidTable;
