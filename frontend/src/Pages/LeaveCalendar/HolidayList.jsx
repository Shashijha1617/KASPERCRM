import React, { useEffect, useState } from "react";
import axios from "axios";
import holidayImage from "../../img/holidayImage.svg";
import { Link } from "react-router-dom/cjs/react-router-dom";
import BASE_URL from "../config/config";
import { TwoDigitDates } from "../../Utils/GetDayFormatted";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
function HolidayList({ title, newFolderLink, holidayIcons }) {
  const [holidaysData, setHolidaysData] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { darkMode } = useTheme();

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

  return (
    <div
      style={{
        height: "100%",
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="border"
    >
      <div
        style={{
          backgroundColor: darkMode
            ? "var(--primaryDashMenuColor)"
            : "var(--primaryDashColorDark)",
        }}
        className="rounded-0 shadow position-relative"
      >
        <h6
          style={{
            position: "sticky",
            top: "0",
            backgroundColor: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
            color: darkMode
              ? "var(--primaryDashMenuColor)"
              : "var(--primaryDashColorDark)",
          }}
          className="p-2 px-3 d-flex justify-content-between gap-0 text-center align-items-center"
        >
          {title}{" "}
          <Link to={newFolderLink}>
            <span
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
              }}
              className="fs-4 d-flex"
            >
              {holidayIcons}
            </span>
          </Link>
        </h6>

        <div className="row mx-auto shadow-sm p-0 pb-1">
            <div className="col-11 mx-auto p-0">
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
          {filteredHolidays.length > 0 ? (
            filteredHolidays.map((holiday, index) => (
              <div
                className="d-flex align-items-center justify-content-between px-3 py-2 mx-auto"
                key={index}
              >
                <span className="border-0">{holiday.holidayName}</span>
                <span>{`${TwoDigitDates(holiday.holidayDate)}-${TwoDigitDates(
                  holiday.holidayMonth
                )}-${holiday.holidayYear}`}</span>
              </div>
            ))
          ) : (
            <div
              className="d-flex flex-column justify-content-center aline-items-center gap-3 my-3"
              style={{ height: "100%", width: "100%" }}
            >
              <img
                style={{ height: "70%", width: "60%" }}
                className="mx-auto"
                src={holidayImage}
                alt="Happy Birthday"
              />
              <p
                style={{
                  opacity: "60%",
                  fontSize: "13px",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                }}
                className="text-center w-75 mx-auto "
              >
                Holidays not available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HolidayList;
