import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
import Loader from '../common/Loader';
import colors from '../../assets/Colors';
import { Container, Text, Title } from '../common/CommonStyles';
import Button from '../common/Button';
import FeedbackModal from '../common/FeedbackModal';
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

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
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

    const [feedbackModal, setFeedbackModal] = useState({
        isOpen: false,
        type: '',
        message: '',
        details: '',
        onConfirm: null,
        onClose: null,
    });
    
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

    const getCoordinatesFromAddress = (address) => {
        return new Promise((resolve, reject) => {
            if (!window.google || !window.google.maps) {
                reject("Google Maps JavaScript API no está cargada");
                return;
            }
    
            const geocoder = services.geocoder;
    
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results[0]) {
                    const location = results[0].geometry.location;
                    resolve({
                        lat: location.lat(),
                        lng: location.lng(),
                    });
                } else {
                    reject(`No se pudo geocodificar la dirección. Status: ${status}`);
                }
            });
        });
    };

    const navigateToMaps = () => {
        const origin = `${trip.startPoint.lat},${trip.startPoint.lng}`;
        const destination = `${trip.endPoint.lat},${trip.endPoint.lng}`;

        if (trip.acceptedRequests) {

            const processRequests = async () => {
                try {
                    // Iterar sobre cada solicitud y convertir direcciones a coordenadas
                    const waypoints = await Promise.all(
                        trip.acceptedRequests.map(async (request) => {
                            const coordinates = await getCoordinatesFromAddress(request.location);
                            console.log(coordinates);
                            return { location: coordinates, stopover: true }; // Crear un waypoint
                        })
                    );

                    console.log('Waypoints:', waypoints);
     
                    // Establecer los waypoints convertidos
                    const waypointsUrl = waypoints?.map(waypoint => `${waypoint.location.lat},${waypoint.location.lng}`).join('/');
        
                    // Construir la URL con waypoints (si existen)
                    let url = `https://www.google.com/maps/dir/${origin}`;
                    
                    if (waypointsUrl) {
                       url += `/${waypointsUrl}`;
                    }
                
                    url += `/${destination}`;

                    window.open(url, '_blank');
            
                } catch (error) {
                    console.error("Error al procesar solicitudes aceptadas:", error);
                }
            };

            processRequests();
        }
        
        // Construir la cadena de waypoints si existen

    };

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

    const handleFinalizeTrip = () => {
        setFeedbackModal({
            isOpen: true,
            type: 'question',
            message: '¿Deseas finalizar este viaje?',
            details: 'Esto marcará el viaje como finalizado.',
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const url = `${import.meta.env.VITE_API_URL}/trips/update-state`;
                    const response = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            tripId: trip.tripId,
                            newState: 2, // Estado "finalizado"
                        }),
                    });
    
                    if (!response.ok) throw new Error('Error al finalizar el viaje.');
                    setTrip(null);
                } 
                
                catch (error) {
                    console.error('Error al finalizar el viaje:', error);
                    alert('Hubo un problema al finalizar el viaje. Intenta de nuevo.');
                } finally {
                    setFeedbackModal({ isOpen: false });
                }
            },
            onClose: () => setFeedbackModal({ isOpen: false }),
        });
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
            <div style={{ textAlign: 'center', marginTop: '10px' }}>      
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
        
            <Button label="Abrir en maps" primary onClick={() => navigateToMaps()} />
        </div>


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
                    <ButtonContainer>
                    <Button label="Finalizar Viaje" primary onClick={handleFinalizeTrip} />
                    </ButtonContainer>
                </TripDetails>
            </TripDetailsContainer>
            {feedbackModal.isOpen && (
    <FeedbackModal
        type={feedbackModal.type}
        message={feedbackModal.message}
        details={feedbackModal.details}
        onConfirm={feedbackModal.onConfirm}
        onClose={feedbackModal.onClose}
    />
)}
        </Container>
    );
};

export default TripsInProgress;
