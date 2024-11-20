import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
import Loader from '../../components/common/Loader';
import colors from '../../assets/Colors';
import { Container, Text, Title } from '../common/CommonStyles';
import Button from '../common/Button';
import { useGoogleMaps } from '../common/GoogleMapsProvider';

import { useSelector } from 'react-redux';
import { selectUser } from '../../features/users/UserSlice';

const TripDetailsContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
    width: 90%;
`;

const TripDetails = styled.div`
    background-color: ${colors.background};
    border-radius: 10px;
    padding: 20px;
    color: ${colors.white};
    width: 500px;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: 0 -1px 10px rgba(118, 29, 166, 0.8);
`;

const StopsList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const StopItem = styled.li`
    margin-bottom: 10px;
`;

const MapContainer = styled.div`
    flex: 1;
    height: 400px;
    border-radius: 10px;
    overflow: hidden;
`;

const TripsInProgress = () => {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [directions, setDirections] = useState(null);
    const [startMarker, setStartMarker] = useState(null);
    const [endMarker, setEndMarker] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [recalculate, setRecalculate] = useState(false);
    const { services, isLoaded, loadError } = useGoogleMaps();
    const userId = useSelector(selectUser);
    const [stop, setStop] = useState(null);

    const [loggedUserId, setLoggedUserId] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setLoggedUserId(userId);
    }, []);



    useEffect(() => {
        setRecalculate(!recalculate);
        if(trip) {
            calculateRoute(trip.startPoint, trip.endPoint, trip.acceptedRequests);
        }
        setTimeout(() => {
            setShowMap(true);
        }, 500);
    }, [trip]);

    useEffect(() => {
        setShowMap(false);
        if (trip) {
            console.log('Selected Trip:', trip);
            const newStartMarker = new window.google.maps.Marker({ position: trip.startPoint });
            const newEndMarker = new window.google.maps.Marker({ position: trip.endPoint});
            setStartMarker(newStartMarker);
            setEndMarker(newEndMarker);
        }
    }, [trip,recalculate]);

    useEffect(() => {
        // ...
        if (trip) {
            if (startMarker) startMarker.setMap(null); // Clear previous marker
            if (endMarker) endMarker.setMap(null); // Clear previous marker
            // ... create and set new markers
        }
    }, [trip, recalculate]);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_API_URL}/trips/my-reservations`;
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) throw new Error('Error al obtener los viajes');
    
                const data = await response.json();
                console.log("Respuesta de la API:", data); // Verifica la estructura de la respuesta
    
                // Filtra el viaje con status "accept" y state === 1
                const inProgressTrip = (data.reservedTrips || []).find(
                    (trip) =>  trip.state === 1
                );
    
                if (inProgressTrip) {
                    setTrip(inProgressTrip);
                    calculateRoute(inProgressTrip.startPoint, inProgressTrip.endPoint, inProgressTrip.acceptedRequests);
                    setTimeout(() => {
                        setStop(inProgressTrip.acceptedRequests.find((request) => request.userId === userId));
                        console.log('Stop:', stop);
                    }, 1000);
                } else {
                    setTrip(null); // No hay viajes en progreso
                }
            } catch (error) {
                console.error('Error al obtener el viaje en progreso:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchTrips();
    }, []);
    

    const calculateRoute = async (start, end, acceptedRequests = []) => {
        try {
            const directionsService = new window.google.maps.DirectionsService();
            const waypoints = acceptedRequests.map((request) => ({
                location: request.location,
                stopover: true,
            }));

            const result = await directionsService.route({
                origin: start,
                destination: end,
                waypoints,
                optimizeWaypoints: true,
                travelMode: window.google.maps.TravelMode.DRIVING,
            });

            setDirections(result);
        } catch (error) {
            console.error('Error al calcular la ruta:', error);
        }
    };


    if (loading) {
        return (
            <Container>
                <Loader />
            </Container>
        );
    }

    if (!trip) {
        return (
            <Container>
                <Title>No hay viajes en progreso</Title>
            </Container>
        );
    }

    return (
        <Container>
            <Title>
                    Viajes en <span style={{ color: colors.third }}>Progreso</span>
                </Title>
            <TripDetailsContainer>
    <MapContainer>
        {showMap && (
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                zoom={10}
                >
                {trip.startPoint && <Marker position={trip.startPoint} />}
                {trip.endPoint && <Marker position={trip.endPoint} />}
                {directions && <DirectionsRenderer directions={directions} />}
                {trip && (
                    <>
                        {startMarker && startMarker.setMap(null)}
                        {endMarker && endMarker.setMap(null)}
                    </>
                )}
            </GoogleMap>
            )}
    </MapContainer>

    <TripDetails>
        <Title>Detalles del Viaje</Title>

        <Text>
            <strong>Hora de Salida:</strong> {trip.departureTime}
        </Text>
        <Text>
            <strong>Precio por Persona:</strong> ${trip.price}
        </Text>

        <Title>Tu Parada:</Title>
                    {trip.acceptedRequests?.length > 0 ? (
                        <StopsList>
                        {stop && (
                            <StopItem>
                                <Text>{stop.location}</Text>
                            </StopItem>
                        )

                        }
                    </StopsList>
                    
                    
        ) : (
            <Text>No hay reservas en este viaje.</Text>
        )}
    </TripDetails>
</TripDetailsContainer>

        </Container>
    );
};

export default TripsInProgress;
