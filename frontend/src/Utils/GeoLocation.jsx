import React, { useEffect, useState } from 'react';

const GeoLocation = () => {
    const [geoLocation, setGeoLocation] = useState({ lat: null, lon: null });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setGeoLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => console.error('Error fetching geolocation:', error)
            );
        }
    }, []);

    return geoLocation.lat && geoLocation.lon ? (
        <span>Location: {geoLocation.lat.toFixed(2)}, {geoLocation.lon.toFixed(2)}</span>
    ) : null;
};

export default GeoLocation;
