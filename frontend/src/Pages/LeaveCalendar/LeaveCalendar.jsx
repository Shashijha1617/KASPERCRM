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
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [filterYear, setFilterYear] = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const { darkMode } = useTheme();

  const formatDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const handleAddHoliday = async () => {
    if (date && holidayName) {
      const formattedDate = formatDate(date);
      const newHoliday = {
        holidayDate: formattedDate.getDate(),
        holidayMonth: formattedDate.getMonth() + 1,
        holidayYear: formattedDate.getFullYear(),
        holidayDay: formattedDate.getDay(),
        holidayName,
        holidayType
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
            responseData.newHoliday
          ]);
          setHolidayName("");
          setHolidayType("National Holiday");
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
        const response = await axios.get("${BASE_URL}/api/holidays");

        if (response.status === 200) {
          const data = response.data;
          setHolidaysData(data);
          setFilteredHolidays(data.filter(holiday =>
            holiday.holidayYear === currentYear && holiday.holidayMonth === currentMonth
          ));
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
  }, [searchTerm, filterYear, filterMonth]);

  const filterHolidays = () => {
    let filtered = [...holidaysData];

    // Filter by year
    if (filterYear) {
      filtered = filtered.filter(holiday => holiday.holidayYear === parseInt(filterYear));
    }

    // Filter by month
    if (filterMonth) {
      filtered = filtered.filter(holiday => holiday.holidayMonth === parseInt(filterMonth));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(holiday =>
        holiday.holidayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHolidays(filtered);
  };

  // Convert date to local timezone format
  const toLocalDate = (date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().split("T")[0];
  };

  return (
    <div className="container-fluid pt-3">
      <h6 style={{ color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)" }} className="fw-bold mb-3 my-auto">Holiday Calendar</h6>
      <div className="row container-fluid row-gap-3 py-2 justify-content-between">
        <div style={{ verticalAlign: 'middle', whiteSpace: 'pre', background: darkMode ? "var(--primaryDashMenuColor)" : 'var(--primaryDashColorDark)', color: darkMode ? 'var(--primaryDashColorDark)' : "var(--secondaryDashMenuColor)", border: 'none' }} className="col-12 col-lg-4 d-flex flex-column gap-3 py-2 rounded-2">
          <Calendar
            className="w-100 bg-white rounded-2 text-black shadow-sm"
            value={date}
            onChange={(selectedDate) => setDate(new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000))}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const formattedDate = new Date(date);
                formattedDate.setDate(formattedDate.getDate());
                const formattedDateString = formattedDate
                  .toISOString()
                  .split("T")[0];

                const holiday = holidays.find(
                  (holiday) => holiday.date === formattedDateString
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
          <div className="">
            <div className="mb-3">
              <input
                type="date"
                className="form-control"
                value={toLocalDate(date)}
                onChange={(e) => setDate(new Date(e.target.value))}
              />
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddHoliday}
            >
              Add Holiday
            </button>
          </div>
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
    </div>
  );
};

export default LeaveCalendar;
