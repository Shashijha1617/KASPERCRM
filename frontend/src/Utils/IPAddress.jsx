import React, { useEffect, useState } from 'react';

const IPAddress = () => {
    const [ipAddress, setIpAddress] = useState(null);

    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setIpAddress(data.ip))
            .catch(error => console.error('Error fetching IP address:', error));
    }, []);

    return ipAddress ? <span>IP: {ipAddress}</span> : null;
};

export default IPAddress;
