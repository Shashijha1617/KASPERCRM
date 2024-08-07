import React, { useEffect, useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./leave.css";
import LeaveTable from "./LeaveTable";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";

const LeaveCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [holidayName, setHolidayName] = useState("");
  const [holidayType, setHolidayType] = useState("National Holiday");
  const [holidays, setHolidays] = useState([]);
  const [holidaysData, setHolidaysData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [filterYear, setFilterYear] = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const { darkMode } = useTheme();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleAddHoliday = async () => {
    if (date && holidayName) {
      const formattedDate = new Date(date);

      const newHoliday = {
        holidayDate: formattedDate.getDate(),
        holidayMonth: formattedDate.getMonth() + 1,
        holidayYear: formattedDate.getFullYear(),
        holidayDay: formattedDate.getDay(),
        holidayName,
        holidayType,
      };

      try {
        const response = await axios.post(
          `${BASE_URL}/api/Create-holiday`,
          newHoliday
        );

        if (response.status === 201) {
          const responseData = response.data;
          setHolidays((prevHolidays) => [
            ...prevHolidays,
            responseData.newHoliday,
          ]);
          setHolidayName("");
          setHolidayType("National Holiday");
          setShowModal(false); // Close modal on successful addition
          alert("Holiday Added Successfully");
        } else {
          console.error("Failed to add holiday:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding holiday:", error);
      }
    }
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/holidays`);

        if (response.status === 200) {
          const data = response.data;
          setHolidaysData(data);
          setFilteredHolidays(
            data.filter(
              (holiday) =>
                holiday.holidayYear === currentYear &&
                holiday.holidayMonth === currentMonth
            )
          );
        } else {
          console.error("Failed to fetch holiday data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching holiday data:", error);
      }
    };

    fetchHolidays();
  }, [currentYear, currentMonth]);

  useEffect(() => {
    filterHolidays();
  }, [searchTerm, filterYear, filterMonth]);

  const filterHolidays = () => {
    let filtered = [...holidaysData];

    if (filterYear) {
      filtered = filtered.filter(
        (holiday) => holiday.holidayYear === parseInt(filterYear)
      );
    }

    if (filterMonth) {
      filtered = filtered.filter(
        (holiday) => holiday.holidayMonth === parseInt(filterMonth)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((holiday) =>
        holiday.holidayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHolidays(filtered);
  };

  return (
    <div className="container-fluid pt-3">
      <h6
        style={{
          color: darkMode
            ? "var(--secondaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
        }}
        className="fw-bold mb-3 my-auto"
      >
        Holiday Calendar
      </h6>
      <div className="row container-fluid row-gap-3 py-2 justify-content-between">
        <div className="col-12 col-lg-4">
          <Calendar
            className="w-100 bg-white rounded-2 text-black shadow-sm"
            value={date}
            onChange={(selectedDate) => setDate(new Date(selectedDate))}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const formattedDate = formatDate(date);
                const holiday = holidays.find(
                  (holiday) => holiday.date === formattedDate
                );

                if (holiday) {
                  return (
                    <div className="holiday-marker">
                      <span className="squarepinch"></span>
                      {holiday.type}
                    </div>
                  );
                }
              }
            }}
          />
          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={() => setShowModal(true)}
          >
            Add Holiday
          </button>
        </div>

        <div className="col-12 col-lg-8">
          <LeaveTable
            filteredHolidays={filteredHolidays}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterYear={filterYear}
            setFilterYear={setFilterYear}
            filterMonth={filterMonth}
            setFilterMonth={setFilterMonth}
          />
        </div>
      </div>

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Holiday</h5>
              <button
                type="button"
                className="close"
                onClick={() => setShowModal(false)}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-3" style={{ position: "relative" }}>
                <input
                  type="date"
                  className="form-control"
                  value={formatDate(date)}
                  onChange={(e) => setDate(new Date(e.target.value))}
                />
                <div
                  style={{
                    height: "100%",
                    width: "93%",
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }}
                >
                  {" "}
                </div>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Holiday Name"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <select
                  className="form-select"
                  value={holidayType}
                  onChange={(e) => setHolidayType(e.target.value)}
                >
                  <option value="National Holiday">National Holiday</option>
                  <option value="Gazetted Holiday">Gazetted Holiday</option>
                  <option value="Restricted Holiday">Restricted Holiday</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddHoliday}
              >
                Add Holiday
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;
