import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoMdDownload } from "react-icons/io";
import axios from 'axios';
import BASE_URL from '../../../Pages/config/config';
const LeaveBalance = () => {
    const [leaveBalance, setLeaveBalance] = useState([]);
    const email = localStorage.getItem("Email");

    useEffect(() => {
        axios.post(`${BASE_URL}/api/getLeave`, { email })
            .then((response) => {
                const formattedData = response.data.map((item) => {
                    const leaveType = Object.keys(item)[0];
                    const totalLeaveType = Object.keys(item)[1];
                    return {
                        leaveType: leaveType.replace(/([A-Z])/g, ' $1').trim(),
                        balance: item[leaveType],
                        totalBalance: item[totalLeaveType]
                    };
                });
                setLeaveBalance(formattedData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const calculatePercentage = (used, total) => {
        if (total === 0) return 0;  // Prevent division by zero
        const percentage = (used / total) * 100;
        return Math.round(percentage) || 0;  // Use '|| 0' to handle NaN results by returning 0
    };

    return (
        <>
            <div className='d-flex justify-content-between mb-2 mt-4 p-2'>
                <h4 className='fw-bold text-muted my-auto'>Leave Balance</h4>
                <div className='d-flex align-items-center gap-2'>
                    <Link className="btn btn-outline-primary my-auto fw-bold" to="/LeaveApply">Apply</Link>
                    <button className="btn btn-primary my-auto px-4"><IoMdDownload /></button>
                </div>
            </div>

            <div className="card-deck d-flex flex-wrap gap-1 justify-content-between w-100">
                {leaveBalance.length>0 ? <> {leaveBalance.map(({ leaveType, balance, totalBalance }) => (
                    <div style={{ minWidth: '250px', boxShadow: "2px 2px 8px 2px black" }} key={leaveType} className="border-0 rounded shadow-sm">
                        <div className="card-body">
                            <div className='d-flex justify-content-between'>
                                <p className="fw-bold text-primary">{leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}</p>
                            </div>
                            <h6 className="card-text text-center fs-2 fw-bold">{totalBalance - balance} / {totalBalance}</h6>
                            <div>
                                <p style={{ fontSize: '.8rem' }}>{calculatePercentage(totalBalance - balance, totalBalance)}% of 100%</p>
                                <div style={{ height: '4px' }} className="progress">
                                    <div className="progress-bar" role="progressbar" style={{ width: `${calculatePercentage(totalBalance - balance, totalBalance)}%` }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}</>:<><h4 className='fw-bold text-muted my-auto pl-4'>No Leave Record Found</h4></> }
              
            </div>
        </>
    );
};

export default LeaveBalance;
