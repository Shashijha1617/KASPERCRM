import React, { useEffect, useState } from "react";
import axios from "axios";
import { GiIndianPalace, GiPartyPopper } from "react-icons/gi"; // Importing necessary icons
import { PiBankBold } from "react-icons/pi";
import { MdCreateNewFolder } from "react-icons/md";
import { Link } from "react-router-dom/cjs/react-router-dom";
import BASE_URL from "../config/config";
function HolidayList({ title, newFolderLink, holidayIcons }) {
  const [holidaysData, setHolidaysData] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [isListVisible, setListVisibility] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const toggleListVisibility = () => {
    setListVisibility(!isListVisible);
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/holidays`);

        if (response.status === 200) {
          const data = response.data;
          setHolidaysData(data);
          setFilteredHolidays(data);
        } else {
          console.error("Failed to fetch holiday data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching holiday data:", error);
      }
    };

    fetchHolidays();
  }, []);

  useEffect(() => {
    filterHolidays();
  }, [searchTerm]);

  const filterHolidays = () => {
    let filtered = [...holidaysData];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((holiday) =>
        holiday.holidayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredHolidays(filtered);
  };

  const getHolidayIcons = (holidayType) => {
    switch (holidayType) {
      case "National Holiday":
        return (
          <span
            style={{
              height: "40px",
              width: "40px",
              display: "flex",
              margin: "auto",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
            }}
            className="rounded-5 bg-danger text-white"
          >
            <GiIndianPalace />
          </span>
        );
      case "Restricted Holiday":
        return (
          <span
            style={{
              height: "40px",
              width: "40px",
              display: "flex",
              margin: "auto",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
            }}
            className="rounded-5 bg-primary text-white"
          >
            <GiPartyPopper />
          </span>
        );
      case "Gazetted Holiday":
        return (
          <span
            style={{
              height: "40px",
              width: "40px",
              display: "flex",
              margin: "auto",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
            }}
            className="rounded-5 bg-warning text-white"
          >
            <PiBankBold />
          </span>
        );
      default:
        return (
          <span
            style={{
              height: "40px",
              width: "40px",
              display: "flex",
              margin: "auto",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
            }}
            className="rounded-5 bg-danger text-white"
          >
            <GiIndianPalace />
          </span>
        );
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <div
        style={{ overflow: "hidden" }}
        className="shadow bg-white p-0 rounded-4 h-100 "
      >
        <h5
          style={{
            backgroundColor: "var(--primaryDashColorDark)",
            color: "var(--primaryDashMenuColor)",
          }}
          className="fw-bolder pb-3 px-3 pt-3 d-flex justify-content-between gap-0 text-center align-items-center"
        >
          {title}{" "}
          <Link to={newFolderLink}>
            <span className="fs-4 d-flex">{holidayIcons}</span>
          </Link>
        </h5>

        <div className="row mx-auto shadow-sm p-0 pb-1">
          <div className="col-12 p-0">
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Search holiday..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div style={{ maxHeight: "350px", overflow: "auto" }}>
          {filteredHolidays.map((holiday, index) => (
            <div className="row p-2 mx-auto" key={index}>
              <span className="col-3 border-0 text-center">
                {getHolidayIcons(holiday.holidayType)}
              </span>
              <span className="col-5 border-0 fw-bold text-muted">
                {holiday.holidayName}
              </span>
              <span
                style={{ whiteSpace: "pre" }}
                className="col-3 border-0 fw-bold text-primary"
              >{`${holiday.holidayDate}-${holiday.holidayMonth}-${holiday.holidayYear}`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HolidayList;
