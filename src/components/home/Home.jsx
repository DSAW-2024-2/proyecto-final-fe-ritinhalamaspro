// src/pages/HomePage/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClockCircle, AiOutlineCloseCircle  } from 'react-icons/ai';
import styled from 'styled-components';
import { Container, Text, Input, StyledAddButton, Text1 } from '../../components/common/CommonStyles';
import colors from '../../assets/Colors';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { useDriver } from '../../context/DriverContext';
import FeedbackModal from '../common/FeedbackModal';
import { selectName } from '../../features/users/UserSlice';
import {useDispatch, useSelector} from "react-redux"
import { GoogleMap, Marker, DirectionsRenderer, Autocomplete, useLoadScript } from '@react-google-maps/api';



const GOOGLE_MAPS_LIBRARIES = ['places'];
const apiKey = 'AIzaSyAhrQVoCw36PqqgNMN-AztGhfmqht47ZbI';

// Estilos personalizados
const MainContainer = styled(Container)`
    align-items: flex-start;
    padding: 20px;
    overflow-y: auto;
`;


const Title = styled.h2`
    text-align: left;
    font-size: 24px;
    color: ${colors.white};
    margin-bottom: 20px;
    width: 100%;
    span {
        color: ${({ isDriver }) => (isDriver ? colors.primary : colors.third)};
    }
`;

const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
`;

const ScrollableCardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    max-height: 500px;
    overflow-y: auto;
    padding: 10px;
    width: 100%;
`;

const TripCard = styled.div`
    background-color: ${({ isDriver }) => (isDriver ? colors.primaryHover : colors.background)};
    border-radius: 10px;
    padding: 20px;
    width: 250px;
    color: ${colors.white};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const DriverContainer = styled.div`
    display: flex;
    gap: 20px;
    width: 100%;
    justify-content: center;
    align-items: flex-start;
    margin-top: 20px;
`;

const CreateTripCard = styled.div`
    background-color: ${colors.primaryHover};
    border-radius: 10px;
    padding: 20px;
    width: 250px;
    color: ${colors.white};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-align: center;
`;

const NotificationsContainer = styled.div`
    background-color: ${colors.primaryHover};
    border-radius: 10px;
    padding: 20px;
    color: ${colors.white};
    width: 250px;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const NotificationCard = styled.div`
    background-color: ${colors.background};
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    color: ${colors.white};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const TimeContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${colors.white};
`;

const ReservationModalContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${colors.background};
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    width: 80%;
    max-width: 400px;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;


const HomePage = () => {
    const { isDriver } = useDriver();
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const id = useSelector(selectName)

    const [trips, setTrips] = useState([]);
    const [routeFilter, setRouteFilter] = useState('');
    const [availableSeatsFilter, setAvailableSeatsFilter] = useState('');
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [userName, setUserName] = useState('');

    const [showReservationModal, setShowReservationModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [reservationDetails, setReservationDetails] = useState({
        seats: '',
        pickupLocation: ''
    });
    const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey, libraries: GOOGLE_MAPS_LIBRARIES });
    const [pickupLocation, setPickupLocation] = useState(null);
    const [startAddresses, setStartAddresses] = useState([]);
    const [endAddresses, setEndAddresses] = useState([]);
    const [pickupQuery, setPickupQuery] = useState('');
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);

    const [feedbackModal, setFeedbackModal] = useState({
        isOpen: false,
        type: '',
        message: '',
        details: ''
    });

    
    useEffect(() => {
        setTimeout(() => {
            setUserName(id)
        }, 1000);
    }, [id]);

    useEffect(() => {
        if (selectedTrip) {
            setStartPoint(selectedTrip.startPoint);
            setEndPoint(selectedTrip.endPoint);
        }
    }, [selectedTrip]);



    useEffect(() => {
        // Intento de obtener el nombre del usuario desde localStorage
        const storedUsername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');        
        if (storedUsername) setUsername(storedUsername);
        if (storedUserId) setUserId(storedUserId);
    }, []);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/trips/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (!response.ok) throw new Error("Error al obtener los viajes");

                const data = await response.json();
                console.log("Datos de viajes:", data);

                const addressPromises = data.trips.map(trip =>
                    getDetailAddress(trip.startPoint.lat, trip.startPoint.lng)
                );
                const endAddressPromises = data.trips.map(trip =>
                    getDetailAddress(trip.endPoint.lat, trip.endPoint.lng)
                );
    
                const resolvedAddresses = await Promise.all(addressPromises);
                const resolvedEndAddresses = await Promise.all(endAddressPromises);
                setStartAddresses(resolvedAddresses);
                setEndAddresses(resolvedEndAddresses);
                console.log("Direcciones resueltas:", resolvedAddresses);

                setTrips(data.trips || []);
                setFilteredTrips(data.trips || []);
            } catch (error) {
                console.error("Error al obtener los viajes:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchTrips();
    }, []);

    const handleShowTripDetails = (trip) => {
        setSelectedTrip(trip);
        setShowReservationModal(true);
    };

    const handleMapClick = (event) => {
        const location = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setPickupLocation(location);
        setReservationDetails({ ...reservationDetails, pickupLocation: `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` });
        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const address = results[0].formatted_address;
                    setPickupQuery(address); // Rellenar el input con la dirección
                    setReservationDetails({
                        ...reservationDetails,
                        pickupLocation: address, // Guardar la dirección en los detalles de reserva
                    });
                } else {
                    console.error('Error al obtener la dirección:', status);
                }
            });
        } catch (error) {
            console.error('Error con el servicio de geocodificación:', error);
        }
    
    };

     const fitBounds = (map) => {
        const bounds = new window.google.maps.LatLngBounds();
        if (startPoint) bounds.extend(startPoint);
        if (endPoint) bounds.extend(endPoint);
        if (pickupLocation) bounds.extend(pickupLocation);
        map.fitBounds(bounds);
    };

    const handleMapLoad = (map) => {
        fitBounds(map);
    };
    
    
    const applyFilters = () => {
        const filtered = trips.filter((trip) => {
            return (
                (!routeFilter || trip.route.toLowerCase().includes(routeFilter.toLowerCase())) &&
                (!availableSeatsFilter || trip.availablePlaces >= parseInt(availableSeatsFilter))
            );
        });
        setFilteredTrips(filtered);
    };

    const handleCreateTrip = () => {
        navigate('/create-trip');
    };

    const handleSelectPlace = (place) => {
        const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };
        setPickupLocation(location);
        setPickupQuery(place.formatted_address);
        setReservationDetails({ ...reservationDetails, pickupLocation: place.formatted_address });
    };

    const handleSeatsChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value, 10) || 0); // No permitir negativos
        setReservationDetails({ ...reservationDetails, seats: value });
    };

    const handleReserveTrip = async (requestData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token no encontrado. Por favor, inicia sesión.");
    
            const response = await fetch(`https://proyecto-final-be-ritinhalamaspro.vercel.app/trips/reserve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData), // Enviar el requestData
            });
    
            if (!response.ok) throw new Error("Error al reservar el viaje");
    
            setFeedbackModal({
                isOpen: true,
                type: 'confirmation',
                message: 'Reserva realizada con éxito',
                details: 'Tu reserva ha sido confirmada. ¡Disfruta del viaje!',
            });
    
            setShowReservationModal(false);
        } catch (error) {
            console.error("Error al reservar el viaje:", error);
    
            setFeedbackModal({
                isOpen: true,
                type: 'error',
                message: 'Error al reservar el viaje',
                details: error.message || 'Hubo un problema al realizar la reserva. Inténtalo nuevamente.',
            });
        }
    };
    
    const getDetailAddress = (lat, lng) => {
        return new Promise((resolve, reject) => {
            const geocoder = new window.google.maps.Geocoder();
            const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
    
            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === "OK" && results[0]) {
                    resolve(results[0].formatted_address);
                } else {
                    console.error("Geocoding failed: ", status);
                    resolve("Dirección no encontrada");
                }
            });
        });
    };
    
    
    
    

    const closeReservationModal = () => {
        setShowReservationModal(false);
        setReservationDetails({
            seats: '',
            pickupLocation: ''
        });
    };
    
    const closeFeedbackModal = () => {
        setFeedbackModal({
            isOpen: false,
            type: '',
            message: '',
            details: ''
        });
    };

    if (loading) {
        return (
            <MainContainer>
                <Loader />
            </MainContainer>
        );
    }


    return (
        <MainContainer>
            <Title isDriver={isDriver}>
                ¡Hola, <span>{isDriver ? 'Conductor' : 'Pasajero'}</span> {userName}!
            </Title>

            {!isDriver && (
                <>
                    <FilterContainer>
                        <Input 
                            placeholder="Filtrar por Ruta" 
                            value={routeFilter} 
                            onChange={(e) => setRouteFilter(e.target.value)} 
                        />
                        <Input 
                            placeholder="Filtrar por Cantidad de Puestos Disponibles" 
                            value={availableSeatsFilter} 
                            onChange={(e) => setAvailableSeatsFilter(e.target.value)} 
                            type="number"
                        />
                        <Button 
                            label="Aplicar Filtros" 
                            primary 
                            onClick={applyFilters} 
                        />
                    </FilterContainer>

                    <ScrollableCardContainer>
    {filteredTrips.length > 0 ? (
        filteredTrips.map((trip, index) => (
            <TripCard key={index} isDriver={isDriver}>
                {trip.carPhoto && (
                    <img
                        src={trip.carPhoto}
                        alt="Foto del carro"
                        style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            marginBottom: '10px',
                        }}
                    />
                )}
                <Text1>
                    De: {startAddresses[index] || 'Dirección no encontrada'}
                </Text1>
                <Text1>
                    A: {endAddresses[index] || 'Dirección no encontrada'}
                </Text1>
                <TimeContainer>
                    <Text1>Hora de salida: {trip.departureTime || 'No especificada'}</Text1>
                </TimeContainer>
                <Text1>Precio/persona: ${trip.price || 'No especificado'}</Text1>
                <Text1>Cupos Disponibles: {trip.availability|| '0'}</Text1>
                <StyledAddButton onClick={() => handleShowTripDetails(trip)}>+</StyledAddButton>
            </TripCard>
        ))
    ) : (
        <Text>No hay viajes disponibles en este momento</Text>
    )}
    </ScrollableCardContainer>

                    {showReservationModal && (
    <>
        <Overlay onClick={closeReservationModal} />
        <ReservationModalContainer>
            <AiOutlineCloseCircle
                size={24}
                color={colors.white}
                style={{ position: 'absolute', top: 15, right: 15, cursor: 'pointer' }}
                onClick={closeReservationModal}
            />
            <Title>Reservar Viaje</Title>
            
            <p style={{ color: colors.details, margin: '10px 0' }}>Selecciona el punto de recogida</p>
            <div
                style={{
                    height: '300px',
                    width: '100%',
                    marginBottom: '10px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                }}
            >
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        onLoad={handleMapLoad}
                        onClick={handleMapClick}
                    >
                        {startPoint && (
                            <Marker
                                position={startPoint}
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    scale: 8,
                                    fillColor: 'green',
                                    fillOpacity: 1,
                                    strokeColor: 'white',
                                    strokeWeight: 2,
                                }}
                            />
                        )}
                        {endPoint && (
                            <Marker
                                position={endPoint}
                                icon={{
                                    url: 'http://maps.google.com/mapfiles/kml/paddle/go.png', // Bandera
                                    scaledSize: new window.google.maps.Size(40, 40), // Tamaño ajustado
                                }}
                            />
                        )}
                        {pickupLocation && (
                            <Marker
                                position={pickupLocation}
                                icon={{
                                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Marcador estándar
                                }}
                            />
                        )}
                    </GoogleMap>
                ) : (
                    <Loader />
                )}
            </div>
            <Autocomplete
                onLoad={(autocomplete) => (window.pickupAutocomplete = autocomplete)}
                onPlaceChanged={() => {
                    const place = window.pickupAutocomplete.getPlace();
                    handleSelectPlace(place);
                }}
            >
                <Input
                    placeholder="Escribe la dirección del punto de recogida"
                    value={pickupQuery}
                    onChange={(e) => setPickupQuery(e.target.value)}
                />
            </Autocomplete>

            <Button
    primary
    label="Enviar solicitud de reserva"
    onClick={() => {
        const requestData = {
            tripId: selectedTrip?.tripId, // Asegúrate de que el ID del viaje esté presente
            location: reservationDetails.pickupLocation, // Dirección o coordenadas del punto de recogida
            seats: reservationDetails.seats, // Número de asientos reservados
        };

        console.log('Datos enviados al endpoint:', requestData);

        handleReserveTrip(requestData); // Llama a la función con el objeto requestData
    }}
    style={{ marginTop: '20px', alignSelf: 'center' }}
/>

        </ReservationModalContainer>
    </>
)
}

                </>
            )}

            {isDriver && (
                <DriverContainer>
                    <CreateTripCard onClick={handleCreateTrip}>
                        <Text style={{ fontWeight: 'bold' }}>Crea un viaje</Text>
                        <Button primary label="+" />
                    </CreateTripCard>

                    <NotificationsContainer>
                        <Title style={{ textAlign: 'left' }}>Notificaciones</Title>
                        <NotificationCard>
                            <Text style={{ fontWeight: 'bold' }}>Cancelación de Reserva</Text>
                            <Text>Canceló <span style={{ color: colors.third }}>1</span> puesto</Text>
                            <Text>Diego Gomez</Text>
                        </NotificationCard>
                        <NotificationCard>
                            <Text style={{ fontWeight: 'bold' }}>Reserva</Text>
                            <Text>Punto de Recogida: Calle 134</Text>
                            <Text>Reservó <span style={{ color: colors.third }}>2</span> puestos</Text>
                            <Text>Diego Gomez</Text>
                        </NotificationCard>
                    </NotificationsContainer>
                </DriverContainer>
            )}

            {feedbackModal.isOpen && (
                <FeedbackModal
                    type={feedbackModal.type}
                    message={feedbackModal.message}
                    details={feedbackModal.details}
                    onClose={closeFeedbackModal}
                />
            )}
        </MainContainer>
    );
};

export default HomePage;
