import React from "react";
import MyTodaysLoginData from "./MyTodaysLoginData";
import BASE_URL from "../../../../Pages/config/config";
const AttendanceToday = () => {
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Fetch today's attendance data for the employee
        const response = await fetch(
          `${BASE_URL}/api/employee/${employeeId}/today-attendance`
        );
        console.log(employeeId);

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, [employeeId]);

  console.log(employeeId);
  console.log(attendanceData);

  return (
    <div>
      {attendanceData ? (
        <MyTodaysLoginData
          loginTime={attendanceData.loginTime}
          breakTime={attendanceData.breakTime}
          totalLoginTime={attendanceData.totalLoginTime}
          logoutTime={attendanceData.logoutTime}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AttendanceToday;
