import React, { useEffect, useState, useContext } from 'react'
import NoticeBadge from '../../../img/NoticeBadge.svg'
import { AttendanceContext } from "../../../Context/AttendanceContext/AttendanceContext";
import axios from 'axios';
import { useTheme } from '../../../Context/TheamContext/ThemeContext';
import BASE_URL from '../../../Pages/config/config';
const NoticeBoard = () => {
  const [notice, setNotice] = useState([]);
  const { darkMode } = useTheme();
  const { socket } = useContext(AttendanceContext);
  const id = localStorage.getItem("_id");
  const loadEmployeeData = () => {
    axios
      .get(`${BASE_URL}/api/particularEmployee/${id}`, {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then((response) => {

        console.log(response.data.Notice)
        setNotice(response.data.Notice)

      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    loadEmployeeData()
  }, []);
  useEffect(() => {
    console.log('Socket:', socket?.id);
    if (socket) {
      socket.on("notice", (data) => {
        setNotice((prev) => [data, ...prev])
      });
      socket.on("noticeDelete", (data) => {
        if (data) {
          loadEmployeeData()
        }
      })
    }
  }, [socket]);
  const pdfHandler = (path) => {
    window.open(
      `${BASE_URL}/${path}`,
      "_blank",
      "noreferrer"
    );
    // window.open(path, "_blank")
  }
  return (
    <div className="container box-shadow: 0 4px 10px 0 rgb(137 137 137 / 25%); p-0 h-100">
      <div style={{backgroundColor: darkMode ? "var(--primaryDashMenuColor)" : "var(--primaryDashColorDark)"}} className="rounded-0 shadow-sm border  position-relative">
        <h5 style={{ position: "sticky", top: '0', backgroundColor: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)", color: darkMode ? "var(--primaryDashMenuColor)" : "var(--primaryDashColorDark)" }} className="fw-bolder pb-3 px-3 pt-3 d-flex justify-content-between gap-0 text-center">
          Notice Board{" "}
          <span>
            ({notice.length})
          </span>
        </h5>
        <div
          className=" py-2"
          style={{ maxWidth: "100%", overflowX: "auto" }}
        >
          {notice.filter((val, i, ar) => ar.findIndex(item => item.noticeId === val.noticeId) === i).length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>

                  <th className='cursor-pointer' style={{ width: "100%" }}>Notice</th>

                </tr>
              </thead>
              <tbody>
                {notice.filter((val, i, ar) => ar.findIndex(item => item.noticeId === val.noticeId) === i).map((val) => (
                  <tr key={val.noticeId} style={{ cursor: "pointer" }} >

                    <td onClick={() => pdfHandler(val.attachments)}>{`${val.notice}`}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="d-flex flex-column justify-content-center aline-items-center gap-3" style={{ height: '100%', width: '100%' }}><img style={{ height: '70%', width: '60%' }} className="mx-auto" src={NoticeBadge} alt="Happy Birthday" />
              <p style={{ opacity: '60%', fontSize: '13px' }} className="text-center w-75 mx-auto  fw-bold text-muted ">Notice Not Assigned</p></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NoticeBoard
