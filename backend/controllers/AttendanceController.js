const { AttendanceModel, Holiday } = require("../models/attendanceModel");
const { Employee } = require("../models/employeeModel");
const schedule = require("node-schedule");
const Moment = require("moment");

const createAttendance = async (req, res) => {
  const {
    employeeId,
    year,
    month,
    date,
    breakTime,
    breakTimeMs,
    ResumeTime,
    resumeTimeMS,
    BreakReasion,
    LogStatus,
    status,
    totalLogAfterBreak
  } = req.body;
  const currentTimeMs = Math.round(new Date().getTime() / 1000 / 60);
  const currentTime = Moment().format("HH:mm:ss");
  let loginTime;
  let logoutTime;
  let loginTimeMs;
  let logoutTimeMs;
  if (status === "login") {
    loginTime = [currentTime];
    loginTimeMs = [currentTimeMs];
  } else if (status === "logout") {
    logoutTime = [currentTime];
    logoutTimeMs = [currentTimeMs];
  }

  console.log(
    employeeId,
    year,
    month,
    date,
    loginTime,
    logoutTime,
    loginTimeMs,
    logoutTimeMs,
    breakTime,
    breakTimeMs,
    ResumeTime,
    resumeTimeMS,
    BreakReasion,
    LogStatus,
    status,
    totalLogAfterBreak
  );
  const { attendanceId } = req.params;

  try {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res
        .status(404)
        .json({ error: "Employee ID not found : " + employeeId });
    }

    let attendanceRecord = await AttendanceModel.findById(attendanceId);

    if (!attendanceRecord) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    let yearObject = attendanceRecord.years.find((y) => y.year === year);

    if (!yearObject) {
      yearObject = { year, months: [] };
      attendanceRecord.years.push(yearObject);
    }

    let monthObject = yearObject.months.find((m) => m.month === month);

    if (!monthObject) {
      monthObject = { month, dates: [] };
      yearObject.months.push(monthObject);
    }

    let dateObject = monthObject.dates.find((d) => d.date === date);

    if (!dateObject) {
      dateObject = {
        date,
        day: new Date(year, month - 1, date).getDay(),
        loginTime: [],
        logoutTime: [],
        breakTime: [],
        ResumeTime: [],
        breakTimeMs: [],
        loginTimeMs: [],
        resumeTimeMS: [],
        BreakReasion: [],
        BreakData: [],
        status: "logout",
        totalBrake: 0,
        totalLogAfterBreak: 0
      };

      if (dateObject.day === 0) {
        dateObject.loginTime = ["Weekends"];
        dateObject.logoutTime = ["Weekends"];
        dateObject.breakTime = [0];
        dateObject.breakTimeMs = [0];
        dateObject.resumeTimeMS = [0];
        dateObject.ResumeTime = [0];
        dateObject.BreakData = [0];
        dateObject.BreakReasion = [0];
        dateObject.totalBrake = 0;
        dateObject.status = "Weekends";
      }

      monthObject.dates.push(dateObject);
    } else if (dateObject.day === 0) {
      return res.status(400).json({ error: "Cannot modify data for Sunday." });
    }

    if (loginTime) {
      dateObject.loginTime = [...dateObject.loginTime, ...loginTime];
    }
    if (loginTimeMs) {
      dateObject.loginTimeMs = [...dateObject.loginTimeMs, ...loginTimeMs];
    }

    if (logoutTime) {
      dateObject.logoutTime = [...dateObject.logoutTime, ...logoutTime];
    }

    if (logoutTimeMs) {
      dateObject.logoutTimeMs = [...dateObject.logoutTimeMs, ...logoutTimeMs];

      const logoutTimeMSArray = dateObject.logoutTimeMs.slice(
        -logoutTimeMs.length
      );
      const loginTimeMsArray = dateObject.loginTimeMs.slice(
        -logoutTimeMs.length
      );

      const loginDataArray = logoutTimeMSArray.map((login, index) => {
        const LogMs = loginTimeMsArray[index];
        return login - LogMs;
      });

      dateObject.LogData = [...dateObject.LogData, ...loginDataArray];

      dateObject.TotalLogin = dateObject.LogData.reduce(
        (sum, value) => sum + value,
        0
      );
      dateObject.totalLogAfterBreak = Math.max(
        0,
        dateObject.TotalLogin - dateObject.totalBrake
      );
    }

    if (breakTime) {
      dateObject.breakTime = [...dateObject.breakTime, ...breakTime];
    }

    if (breakTimeMs) {
      dateObject.breakTimeMs = [...dateObject.breakTimeMs, ...breakTimeMs];
    }

    if (resumeTimeMS) {
      dateObject.resumeTimeMS = [...dateObject.resumeTimeMS, ...resumeTimeMS];

      const resumeTimeMSArray = dateObject.resumeTimeMS.slice(
        -resumeTimeMS.length
      );
      const breakTimeMsArray = dateObject.breakTimeMs.slice(
        -resumeTimeMS.length
      );

      const breakDataArray = resumeTimeMSArray.map((Resume, index) => {
        const BreakMs = breakTimeMsArray[index];
        return Resume - BreakMs;
      });

      dateObject.BreakData = [...dateObject.BreakData, ...breakDataArray];

      dateObject.totalBrake = dateObject.BreakData.reduce(
        (sum, value) => sum + value,
        0
      );
    }

    if (ResumeTime) {
      dateObject.ResumeTime = [...dateObject.ResumeTime, ...ResumeTime];
    }
    if (BreakReasion) {
      dateObject.BreakReasion = [...dateObject.BreakReasion, ...BreakReasion];
    }

    dateObject.LogStatus = LogStatus;
    // dateObject.totalLogAfterBreak = dateObject.TotalLogin - dateObject.totalBrake;
    if (totalLogAfterBreak) {
      if (dateObject.TotalLogin >= dateObject.totalBrake) {
        return (dateObject.totalLogAfterBreak =
          dateObject.TotalLogin - dateObject.totalBrake);
      } else {
        return (dateObject.totalLogAfterBreak = 0);
      }
    }
    dateObject.status = status;
    await attendanceRecord.save();

    res.status(200).json({ message: "Attendance data updated successfully" });
  } catch (error) {
    console.error("Error updating attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createHolidays = async (req, res) => {
  try {
    // Create a new Holiday record using the Holiday model
    const newHoliday = new Holiday({
      holidayYear: req.body.holidayYear,
      holidayMonth: req.body.holidayMonth,
      holidayDate: req.body.holidayDate,
      holidayName: req.body.holidayName,
      holidayType: req.body.holidayType
    });

    // Save the Holiday record
    await newHoliday.save();

    res
      .status(201)
      .json({ message: "Holiday data added successfully", newHoliday });
  } catch (error) {
    console.error("Error adding Holiday data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// find all employee Attendance
const findAttendance = async (req, res) => {
  try {
    // Fetch attendance data from the database
    const attendanceData = await AttendanceModel.find().populate(
      "employeeObjID"
    );
    res.json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// find single employee AttendanceId
const findEmployeeAttendanceId = async (req, res) => {
  try {
    const allAttendance = await AttendanceModel.find().populate(
      "employeeObjID"
    ); // Populate the user information
    res.status(200).json(allAttendance);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// find single employeeId
const findEmployeeAttendanceEployeeId = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Find the user based on the provided employee ID
    const employee = await Employee.findOne({ _id: employeeId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Find the attendance record associated with the user
    const attendanceRecord = await AttendanceModel.findOne({
      employeeObjID: employee._id
    });

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ error: "Attendance record not found for the user" });
    }

    res.status(200).json(attendanceRecord);
  } catch (error) {
    console.error("Error fetching attendance data by employee ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// find all holidays
const findAllHolidays = async (req, res) => {
  try {
    const allHolidays = await Holiday.find();
    res.status(200).json(allHolidays);
  } catch (error) {
    console.error("Error fetching holiday data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const attendanceRegister = async (req, res) => {
  try {
    const { year, month } = req.params;

    // Convert year and month to numbers
    const yearNumber = parseInt(year);
    const monthNumber = parseInt(month);

    // Fetch all users from the database
    const users = await Employee.find();

    // Define an array to hold the formatted attendance register data
    const attendanceRegister = [];

    // Iterate over each user
    for (const employee of Employee) {
      // Find the attendance record for the specified year and month
      const attendanceRecord = await AttendanceModel.findOne({
        employeeObjID: Employee._id,
        "years.year": yearNumber,
        "years.months.month": monthNumber
      });

      // If attendance record exists, format the data
      if (attendanceRecord) {
        const attendanceData = attendanceRecord.years[0].months[0].dates.map(
          (dateData) => {
            // Translate attendance status codes to corresponding letters
            const attendanceStatus = {
              P: "Present",
              A: "Absent",
              H: "Holiday",
              L: "Leave"
            };

            // Convert status codes to letters
            const formattedData = dateData.status.map(
              (status) => attendanceStatus[status]
            );

            return formattedData;
          }
        );

        // Push user's attendance data to the register array
        attendanceRegister.push({
          EmpId: employee.empID,
          Name: employee.name,
          ...attendanceData
        });
      }
    }

    res.status(200).json(attendanceRegister);
  } catch (error) {
    console.error("Error fetching attendance register:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const todaysAttendance = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    // Find all users and populate their attendance data for today
    const usersWithAttendance = await Employee.find().populate(
      "attendanceObjID"
    );

    // Extract relevant attendance data and send it in the response
    const attendanceData = usersWithAttendance.map((user) => {
      const attendanceRecord = user.attendanceObjID;
      let attendance = null;

      // Check if attendanceRecord exists and has valid data
      if (
        attendanceRecord &&
        attendanceRecord.years &&
        attendanceRecord.years.length > 0
      ) {
        const yearData = attendanceRecord.years.find(
          (year) => year.year === currentYear
        );

        if (yearData && yearData.months && yearData.months.length > 0) {
          const monthData = yearData.months.find(
            (month) => month.month === currentMonth
          );

          if (monthData && monthData.dates && monthData.dates.length > 0) {
            const dateData = monthData.dates.find(
              (date) => date.date === currentDay
            );

            if (dateData) {
              attendance = dateData;
            }
          }
        }
      }

      return {
        userId: user._id,
        FirstName: user.FirstName,
        LastName: user.LastName,
        empID: user.empID,
        attendance: attendance
      };
    });

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching today's attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEmployeeTodayAttendance = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Fetch the employee based on the provided employee ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Fetch today's attendance for the employee
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const attendanceRecord = await AttendanceModel.findOne({
      employeeObjID: employee._id,
      "years.year": currentYear,
      "years.months.month": currentMonth
    });

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ error: "Attendance record not found for the employee" });
    }

    const monthData = attendanceRecord.years[0].months.find(
      (month) => month.month === currentMonth
    );

    if (!monthData) {
      return res
        .status(404)
        .json({ error: "Attendance data not found for the current month" });
    }

    const dateData = monthData.dates.find((date) => date.date === currentDay);

    if (!dateData) {
      return res
        .status(404)
        .json({ error: "Attendance data not found for today" });
    }

    const employeeAttendanceData = {
      loginTime: dateData.loginTime[0],
      logoutTime: dateData.logoutTime[0],
      totalBrake: dateData.totalBrake,
      totalLoginTime: dateData.totalLogAfterBreak // Assuming this is the total login time after deducting break time
    };

    res.status(200).json(employeeAttendanceData);
  } catch (error) {
    console.error("Error fetching today's attendance for employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createAttendance,
  createHolidays,
  findAttendance,
  findEmployeeAttendanceEployeeId,
  findEmployeeAttendanceId,
  findAllHolidays,
  attendanceRegister,
  todaysAttendance,
  getEmployeeTodayAttendance
};
