// src/components/GoogleMapsProvider.jsx
import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

const GoogleMapsProvider = ({ children }) => {
    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
            {children}
        </LoadScript>
    );
};

export default GoogleMapsProvider;
