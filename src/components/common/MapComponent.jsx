// src/components/MapWithAutocomplete.jsx
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker } from '@react-google-maps/api';
import styled from 'styled-components';

const apiKey = 'AIzaSyAhrQVoCw36PqqgNMN-AztGhfmqht47ZbI';

// Estilos para el contenedor del mapa
const MapContainer = styled.div`
    width: 100%;
    height: 400px;
    position: relative;
`;

const MapComponent = () => {
    const [autocomplete, setAutocomplete] = useState(null);
    const [place, setPlace] = useState(null);
    const [center, setCenter] = useState({ lat: 4.7325735, lng: -74.0563375 }); // Ubicación inicial

    // Callback para manejar la carga del autocompletado
    const onLoad = (autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    };

    // Callback para manejar el cambio de lugar
    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const newLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                setCenter(newLocation);
                setPlace(place);
            }
        }
    };

    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
            <MapContainer>
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={center}
                    zoom={15}
                >
                    {/* Input de Autocompletado */}
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <input
                            type="text"
                            placeholder="Enter a location"
                            style={{
                                boxSizing: 'border-box',
                                border: '1px solid transparent',
                                width: '240px',
                                height: '32px',
                                padding: '0 12px',
                                borderRadius: '3px',
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                                fontSize: '14px',
                                outline: 'none',
                                textOverflow: 'ellipses',
                                position: 'absolute',
                                top: '10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 5,
                            }}
                        />
                    </Autocomplete>

                    {/* Marcador en la ubicación seleccionada */}
                    {place && (
                        <Marker
                            position={{
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng(),
                            }}
                        />
                    )}
                </GoogleMap>
            </MapContainer>
        </LoadScript>
    );
};

export default MapComponent;
