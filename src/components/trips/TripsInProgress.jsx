import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
import Loader from '../../components/common/Loader';
import colors from '../../assets/Colors';
import { Container, Text, Title } from '../common/CommonStyles';
import Button from '../common/Button';
import { useGoogleMaps } from '../common/GoogleMapsProvider';

const TripDetailsContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
    width: 90%;
`;

const TripDetails = styled.div`
    flex: 1;
    background-color: ${colors.primaryHover};
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
    max-width: 500px;
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
                const url = `${import.meta.env.VITE_API_URL}/trips/my-trips`;
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error('Error al obtener los viajes');

                const data = await response.json();
                const inProgressTrip = data.myTrips.find((t) => t.state === 1);
                if (inProgressTrip) {
                    setTrip(inProgressTrip);
                    calculateRoute(inProgressTrip.startPoint, inProgressTrip.endPoint, inProgressTrip.acceptedRequests);
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
            <strong>Sector:</strong> {trip.sector}
        </Text>
        <Text>
            <strong>Hora de Salida:</strong> {trip.departureTime}
        </Text>
        <Text>
            <strong>Precio por Persona:</strong> ${trip.price}
        </Text>
        <Text>
            <strong>Cupos Disponibles:</strong> {trip.availability}
        </Text>
        <Title>Paradas y Reservas</Title>
        {trip.acceptedRequests?.length > 0 ? (
            <StopsList>
                {trip.acceptedRequests.map((reservation, index) => (
                    <StopItem key={index}>
                        <Text>Parada: {reservation.location || 'No especificada'}</Text>
                    </StopItem>
                ))}
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
