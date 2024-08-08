import React from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const TittleHeader = ({ title, message, numbers }) => {
  const { darkMode } = useTheme();
  return (
    <div
      style={{
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="my-auto mt-2"
    >
      <div className="d-flex align-items-center gap-2">
        <h5
          style={{
            fontWeight: "500",
          }}
          className="m-0 p-0 text-capitalize"
        >
          {title}
        </h5>{" "}
        {numbers && <h5 className="text-primary fs-6">( {numbers} )</h5>}{" "}
      </div>
      {message && <p className=" m-0">{message}</p>}
    </div>
  );
};

export default TittleHeader;
