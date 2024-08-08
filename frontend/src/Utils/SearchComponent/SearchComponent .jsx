import React, { useState, useRef, useEffect } from "react";
import { Form, InputGroup, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { SearchRouteData } from "./SearchRouteData";
import BASE_URL from "../../Pages/config/config";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);
  const [employeeData, setEmployeeData] = useState({});
  const { darkMode } = useTheme();
  const id = localStorage.getItem("_id");

  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        console.log(response.data);
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleIconClick = () => {
    setExpanded(!expanded);
  };

  const handleLinkClick = () => {
    setSearchTerm("");
    setExpanded(false);
  };

  const filteredRoutes = searchTerm
    ? SearchRouteData.filter((route) => {
        const isNameMatch = route.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const isUserTypeMatch = (() => {
          switch (employeeData.Account) {
            case 1: // Admin
              return route.control === "admin";
            case 2: // HR
              return route.control === "hr";
            case 3: // Employee
              return route.control === "employee";
            case 4: // Manager
              return route.control === "manager";
            default:
              return false;
          }
        })();
        return isNameMatch && isUserTypeMatch;
      }).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSearchTerm("");
        setExpanded(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{
        width: expanded ? "210px" : "30px",
        borderRadius: expanded ? "0" : "50%",
        overflow: "hidden",
        transition: "1s ease",
        height: "25px",
        border: expanded ? "1px solid black" : "none",
      }}
      className="searchComponent bg-white rounded-5"
      ref={inputRef}
    >
      <InputGroup
        className="rounded-2"
        style={{ position: "relative", height: "100%" }}
      >
        <Form.Control
          className="rounded-0 border"
          placeholder="Search any page"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            display: expanded ? "block" : "none",
            transition: "1s ease",
            height: "25px",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "50%",
            width: "25px",
            height: "25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            right: "0",
            transform: "translate(-2px, -50%)",
            zIndex: "2001",
            color: darkMode
              ? "var(--primaryDashMenuColor)"
              : "var(--primaryDashColorDark)",
            backgroundColor: darkMode
              ? "var(--primaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
            cursor: "pointer",
          }}
          onClick={handleIconClick}
        >
          <IoSearchOutline />
        </span>
      </InputGroup>

      {filteredRoutes.length > 0 && expanded ? (
        <ListGroup
          className="bg-white p-2"
          style={{
            position: "absolute",
            width: "209px",
            borderRadius: "0",
            zIndex: "2000",
          }}
        >
          {filteredRoutes.map((route, index) => (
            <Link
              style={{ textDecorationLine: "none" }}
              to={route.path}
              key={index}
              onClick={handleLinkClick}
            >
              <span
                style={{ textDecorationLine: "none" }}
                className="text-dark search-hoverable-text"
              >
                {route.name}
              </span>
            </Link>
          ))}
        </ListGroup>
      ) : (
        <div>
          {searchTerm && expanded && (
            <span
              style={{
                position: "absolute",
                width: "210px",
                textAlign: "start",
              }}
              className="bg-white shadow-sm border rounded-0 py-1  px-3"
            >
              No result found
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
