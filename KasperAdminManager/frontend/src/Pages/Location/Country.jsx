import React, { useState, useEffect } from "react";
import "./Country.css";
import axios from "axios";
import CountryTable from "./CountryTable.jsx";
import CountryForm from "./CountryForm.jsx";
import CountryFormEdit from "./CountryFormEdit.jsx";
import BASE_URL from "../config/config.js";

const Country = () => {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [editData, setEditData] = useState({});

  const handleCountrySubmit = (event) => {
    event.preventDefault();
    const countryName = event.target[0].value;

    axios
      .post(
        `${BASE_URL}/api/country`,
        { CountryName: countryName },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then(() => {
        setIsTableVisible(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleAddCountry = () => {
    setIsTableVisible(false);
  };

  const handleEditCountry = (data) => {
    setEditData(data);
    setIsEditFormVisible(true);
  };

  const handleFormClose = () => {
    setIsTableVisible(true);
  };

  const handleEditFormClose = () => {
    setIsEditFormVisible(false);
  };

  const handleCountryEditUpdate = (info, event) => {
    event.preventDefault();
    const updatedCountryName = event.target[0].value;

    axios
      .put(
        `${BASE_URL}/api/country/${info["_id"]}`,
        { CountryName: updatedCountryName },
        {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then(() => {
        setIsTableVisible(true);
        setIsEditFormVisible(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {isTableVisible ? (
        isEditFormVisible ? (
          <CountryFormEdit
            onCountryEditUpdate={handleCountryEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
          />
        ) : (
          <CountryTable
            onAddCountry={handleAddCountry}
            onEditCountry={handleEditCountry}
          />
        )
      ) : (
        <CountryForm
          onCountrySubmit={handleCountrySubmit}
          onFormClose={handleFormClose}
        />
      )}
    </>
  );
};

export default Country;
