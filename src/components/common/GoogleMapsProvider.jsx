import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const GoogleMapsContext = createContext();

export const GoogleMapsProvider = ({ children }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_API_KEY,
        libraries: ['places', 'geometry', 'directions'],
    });

    const [services, setServices] = useState({
        geocoder: null,
        directionsService: null,
        placesService: null,
    });

    useEffect(() => {
        if (isLoaded) {
            setServices({
                geocoder: new window.google.maps.Geocoder(),
                directionsService: new window.google.maps.DirectionsService(),
                placesService: new window.google.maps.places.PlacesService(document.createElement('div')),
                bounds: new window.google.maps.LatLngBounds(),
            });
        }
    }, [isLoaded]);

    return (
        <GoogleMapsContext.Provider value={{ services, isLoaded, loadError }}>
            {children}
        </GoogleMapsContext.Provider>
    );
};

export const useGoogleMaps = () => {
    return useContext(GoogleMapsContext);
};
