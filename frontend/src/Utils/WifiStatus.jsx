import React, { useEffect, useState } from 'react';
import { FiWifi, FiWifiOff } from 'react-icons/fi';

const WifiStatus = () => {
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnlineStatus = () => {
            setOnline(navigator.onLine);
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    return online ? <FiWifi /> : <FiWifiOff />;
};

export default WifiStatus;
