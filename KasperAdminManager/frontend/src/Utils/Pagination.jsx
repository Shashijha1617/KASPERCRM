import React from "react";
import { Button } from "react-bootstrap";
import { GrFormPrevious } from "react-icons/gr";

const Pagination = ({
  currentPage,
  pageNumbers,
  handlePaginationPrev,
  handlePaginationNext,
  setCurrentPage,
  filteredDataLength,
  itemsPerPage,
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;

  return (
    <div className="container-fluid d-flex justify-content-between stickey-bottom">
      <Button
        className="d-flex gap-2"
        onClick={handlePaginationPrev}
        disabled={currentPage === 1}
      >
        <GrFormPrevious className="my-auto" /> Previous
      </Button>
      <div className="pagination d-flex flex-nowrap gap-2">
        {pageNumbers.map((number) => (
          <Button
            key={number}
            style={{
              backgroundColor: currentPage === number ? "active" : "white",
              border: "none",
              color: "gray",
            }}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </Button>
        ))}
      </div>
      <Button
        onClick={handlePaginationNext}
        className="d-flex gap-3"
        disabled={indexOfLastItem >= filteredDataLength}
      >
        <span className="">Next</span>{" "}
        <GrFormPrevious className="my-auto" style={{ rotate: "180deg" }} />
      </Button>
    </div>
  );
};

export default Pagination;
