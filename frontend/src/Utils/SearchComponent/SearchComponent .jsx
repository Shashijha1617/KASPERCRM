import React, { useState, useRef, useEffect } from "react";
import { Form, InputGroup, ListGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { SearchRouteData } from "./SearchRouteData";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);
  const { darkMode } = useTheme();

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
    ? SearchRouteData.filter((route) =>
        route.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
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
        height: "30px",
        border: expanded ? "1px solid black" : "none",
      }}
      className="searchComponent bg-white"
      ref={inputRef}
    >
      <InputGroup style={{ position: "relative", height: "100%" }}>
        <Form.Control
          className="rounded-0 border"
          placeholder="Search any page"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            display: expanded ? "block" : "none",
            transition: "1s ease",
            height: "30px",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            right: "0",
            transform: "translate(-0px, -50%)",
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
          <FaSearch />
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
