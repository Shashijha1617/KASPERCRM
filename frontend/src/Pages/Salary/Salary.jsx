import React, { useState } from "react";
import "./Salary.css";
import axios from "axios";
import SalaryTable from "./SalaryTable.jsx";
import SalaryForm from "./SalaryForm.jsx";
import SalaryFormEdit from "./SalaryFormEdit.jsx";
import BASE_URL from "../config/config.js";

const Salary = () => {
  const [table, setTable] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // const handleSalarySubmit = (event) => {
  //   event.preventDefault();
  //   if (!(event.target[9].value === event.target[10].value)) {
  //     window.alert("The bank account number you entered does not match ");
  //   } else {
  //     let body = {
  //       BasicSalary: event.target[1].value,
  //       HRASalary: event.target[2].value,  // Ensure HRASalary is included
  //       MAllowance: event.target[3].value,
  //       SpecialAllowance: event.target[4].value,
  //       otherAllowance: event.target[5].value,
  //       LeaveDeduct: event.target[6].value,
  //       PFDeduct: event.target[7].value,
  //       BankName: event.target[8].value,
  //       AccountNo: event.target[9].value,
  //       AccountHolderName: event.target[11].value,
  //       IFSCcode: event.target[12].value,
  //       TaxDeduction: event.target[13].value,
  //       totalSalary: event.target[14].value
  //     };

  //     axios
  //       .post(`${BASE_URL}/api/salary/` + event.target[0].value, body, {
  //         headers: {
  //           authorization: localStorage.getItem("token") || ""
  //         }
  //       })
  //       .then((res) => {
  //         setTable(false);
  //         setTable(true);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         console.log(err.response);
  //         if (err.response.status === 403) {
  //           window.alert(err.response.data);
  //         }
  //       });
  //   }
  // };

  const handleSalarySubmit = (event) => {
    event.preventDefault();
    const {
      BasicSalary,
      HRASalary,
      MAllowance,
      SpecialAllowance,
      otherAllowance,
      LeaveDeduct,
      PFDeduct,
      BankName,
      AccountNo,
      AccountHolderName,
      IFSCcode,
      TaxDeduction,
      totalSalary,
      ReAccountNo,
    } = event.target.elements;

    if (AccountNo.value !== ReAccountNo.value) {
      window.alert("The bank account number you entered does not match ");
      return;
    }

    const body = {
      BasicSalary: BasicSalary.value,
      HRASalary: HRASalary.value,
      MAllowance: MAllowance.value,
      SpecialAllowance: SpecialAllowance.value,
      otherAllowance: otherAllowance.value,
      LeaveDeduct: LeaveDeduct.value,
      PFDeduct: PFDeduct.value,
      BankName: BankName.value,
      AccountNo: AccountNo.value,
      AccountHolderName: AccountHolderName.value,
      IFSCcode: IFSCcode.value,
      TaxDeduction: TaxDeduction.value,
      totalSalary: totalSalary.value,
    };

    axios
      .post(`${BASE_URL}/api/salary/${event.target.employeeId.value}`, body, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then(() => {
        setTable(false);
        setTable(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 403) {
          window.alert(err.response.data);
        }
      });
  };

  const handleAddSalary = () => {
    console.log("clicked1");
    setTable(false);
  };

  const handleEditSalary = (e) => {
    console.log(e);
    console.log("clicked6");
    setEditForm(true);
    setEditData(e);
  };

  const handleFormClose = () => {
    console.log("clicked1");
    setTable(true);
  };

  const handleEditFormClose = () => {
    console.log("clicked5");
    setEditForm(false);
  };

  const handleSalaryEditUpdate = (info, newInfo) => {
    console.log("eeeeeeeeeeeeeeeeeeeeddddddddddddddddddddddddd");
    newInfo.preventDefault();
    if (!(newInfo.target[9].value === newInfo.target[10].value)) {
      window.alert("The bank account number you entered does not match ");
    } else {
      let body = {
        BasicSalary: newInfo.target[1].value,
        HRASalary: newInfo.target[2].value, // Ensure HRASalary is included
        MAllowance: newInfo.target[3].value,
        SpecialAllowance: newInfo.target[4].value,
        otherAllowance: newInfo.target[5].value,
        LeaveDeduct: newInfo.target[6].value,
        PFDeduct: newInfo.target[7].value,
        BankName: newInfo.target[8].value,
        AccountNo: newInfo.target[9].value,
        AccountHolderName: newInfo.target[10].value,
        IFSCcode: newInfo.target[11].value,
        TaxDeduction: newInfo.target[12].value,
        totalSalary: newInfo.target[13].value,
      };

      axios
        .put(`${BASE_URL}/api/salary/` + info["salary"][0]["_id"], body, {
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
        })
        .then((res) => {
          setTable(false);
          setTable(true);
        })
        .catch((err) => {
          console.log(err);
        });

      setEditForm(false);
    }
  };

  // Placeholder functions - replace with actual implementations
  const handleEditFormGenderChange = () => {
    // Implement your logic here
  };

  const handleAddFormGenderChange = () => {
    // Implement your logic here
  };

  return (
    <React.Fragment>
      {table ? (
        editForm ? (
          <SalaryFormEdit
            onSalaryEditUpdate={handleSalaryEditUpdate}
            onFormEditClose={handleEditFormClose}
            editData={editData}
            onGenderChange={handleEditFormGenderChange}
          />
        ) : (
          <SalaryTable
            onAddSalary={handleAddSalary}
            onEditSalary={handleEditSalary}
          />
        )
      ) : (
        <SalaryForm
          onSalarySubmit={handleSalarySubmit}
          onFormClose={handleFormClose}
          onGenderChange={handleAddFormGenderChange}
        />
      )}
    </React.Fragment>
  );
};

export default Salary;

// import React, { useState } from "react";
// import "./Salary.css";
// import axios from "axios";
// import SalaryTable from "./SalaryTable.jsx";
// import SalaryForm from "./SalaryForm.jsx";
// import SalaryFormEdit from "./SalaryFormEdit.jsx";
// import BASE_URL from "../config/config.js";
// const Salary = () => {
//   const [table, setTable] = useState(true);
//   const [editForm, setEditForm] = useState(false);
//   const [editData, setEditData] = useState(null);

//   const handleSalarySubmit = (event) => {
//     event.preventDefault();
//     if (!(event.target[9].value === event.target[10].value)) {
//       window.alert("The bank account number you entered does not match ");
//     } else {
//       let body = {
//         BasicSalary: event.target[1].value,
//         BankName: event.target[8].value,
//         AccountNo: event.target[9].value,
//         // AccountHolderName: event.target[5].value,
//         IFSCcode: event.target[11].value,
//         TaxDeduction: event.target[12].value,
//         HRASalary: event.target[2].value,
//         PFDeduct: event.target[7].value,
//         LeaveDeduct: event.target[6].value,
//         MAllowance: event.target[3].value,
//         LeaveDeduct: event.target[12].value,
//         otherAllowance: event.target[5].value,
//         SpecialAllowance: event.target[4].value,
//         totalSalary: event.target[13].value
//       };

//       axios
//         .post(`${BASE_URL}/api/salary/` + event.target[0].value, body, {
//           headers: {
//             authorization: localStorage.getItem("token") || ""
//           }
//         })
//         .then((res) => {
//           setTable(false);
//           setTable(true);
//         })
//         .catch((err) => {
//           console.log(err);
//           console.log(err.response);
//           if (err.response.status === 403) {
//             window.alert(err.response.data);
//           }
//         });
//     }
//   };

//   const handleAddSalary = () => {
//     console.log("clicked1");
//     setTable(false);
//   };

//   const handleEditSalary = (e) => {
//     console.log(e);
//     console.log("clicked6");
//     setEditForm(true);
//     setEditData(e);
//   };

//   const handleFormClose = () => {
//     console.log("clicked1");
//     setTable(true);
//   };

//   const handleEditFormClose = () => {
//     console.log("clicked5");
//     setEditForm(false);
//   };

//   const handleSalaryEditUpdate = (info, newInfo) => {
//     console.log("eeeeeeeeeeeeeeeeeeeeddddddddddddddddddddddddd");
//     newInfo.preventDefault();
//     if (!(newInfo.target[3].value === newInfo.target[4].value)) {
//       window.alert("The bank account number you entered does not match ");
//     } else {
//       let body = {
//         BasicSalary: newInfo.target[1].value,
//         BankName: newInfo.target[2].value,
//         AccountNo: newInfo.target[3].value,
//         AccountHolderName: newInfo.target[5].value,
//         IFSCcode: newInfo.target[6].value,
//         TaxDeduction: newInfo.target[7].value
//       };

//       axios
//         .put(`${BASE_URL}/api/salary/` + info["salary"][0]["_id"], body, {
//           headers: {
//             authorization: localStorage.getItem("token") || ""
//           }
//         })
//         .then((res) => {
//           setTable(false);
//           setTable(true);
//         })
//         .catch((err) => {
//           console.log(err);
//         });

//       setEditForm(false);
//     }
//   };

//   // Placeholder functions - replace with actual implementations
//   const handleEditFormGenderChange = () => {
//     // Implement your logic here
//   };

//   const handleAddFormGenderChange = () => {
//     // Implement your logic here
//   };

//   return (
//     <React.Fragment>
//       {table ? (
//         editForm ? (
//           <SalaryFormEdit
//             onSalaryEditUpdate={handleSalaryEditUpdate}
//             onFormEditClose={handleEditFormClose}
//             editData={editData}
//             onGenderChange={handleEditFormGenderChange}
//           />
//         ) : (
//           <SalaryTable
//             onAddSalary={handleAddSalary}
//             onEditSalary={handleEditSalary}
//           />
//         )
//       ) : (
//         <SalaryForm
//           onSalarySubmit={handleSalarySubmit}
//           onFormClose={handleFormClose}
//           onGenderChange={handleAddFormGenderChange}
//         />
//       )}
//     </React.Fragment>
//   );
// };

// export default Salary;
