// src/pages/HomePage/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClockCircle, AiOutlineCloseCircle, AiOutlineCheckCircle, AiOutlineSearch   } from 'react-icons/ai';
import styled from 'styled-components';
import { Container, Text, Input, StyledAddButton, Text1 } from '../../components/common/CommonStyles';
import colors from '../../assets/Colors';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { useDriver } from '../../context/DriverContext';
import FeedbackModal from '../common/FeedbackModal';
import { selectName, selectUser } from '../../features/users/UserSlice';
import {useDispatch, useSelector} from "react-redux"
import { useGoogleMaps } from '../common/GoogleMapsProvider';
import { GoogleMap, Marker, DirectionsRenderer, Autocomplete, useLoadScript } from '@react-google-maps/api';


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
    flex-direction: row; /* Los hijos estarán en columnas */
    align-items: center; /* Centrar elementos horizontalmente */
    justify-content: flex-end;
    margin-left: auto;
    margin-bottom: 20px;
    width: 50%;
`;

const FilterInputs = styled.div`
    display: flex;
    flex-direction: row; /* Los inputs estarán en una fila */
    gap: 10px; /* Espacio entre inputs */
    width: 100%; /* Asegurar que ocupen el ancho necesario */
    justify-content: center; /* Centrar los inputs */
`;


const SearchIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 20px; 
    margin-left:5px;
    color: ${colors.third}; /* Cambia este color según tu paleta */
    &:hover {
        color: ${colors.primaryHover}; /* Cambia el color al pasar el mouse */
    }
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
    background-color: ${colors.background};
    border-radius: 10px;
    padding: 20px;
    width: 250px;
    color: ${colors.white};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-align: center;
`;

const NotificationContainer = styled.div`
    background-color: ${colors.background};
    border-radius: 10px;
    padding: 20px;
    color: ${colors.white};
    width: 550px;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: 0 -1px 10px rgba(118, 29, 166, 0.8);
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

const LocationCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${colors.primaryHover};
    padding: 10px;
    border-radius: 8px;
    margin: 5px 0;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${colors.white};
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
        color: ${colors.third};
    }
`;



const HomePage = () => {
    const { isDriver } = useDriver();
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const id = useSelector(selectName)
    const universityId = useSelector(selectUser)

    const [trips, setTrips] = useState([]);
    const [routeFilter, setRouteFilter] = useState('');
    const [availableSeatsFilter, setAvailableSeatsFilter] = useState('');
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [userName, setUserName] = useState('');
    const [userUniversityId, setUserUniversityId] = useState('')

    const [showReservationModal, setShowReservationModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [reservationDetails, setReservationDetails] = useState({
        seats: '',
        pickupLocation: ''
    });
    const [pickupLocation, setPickupLocation] = useState(null);
    const [startAddresses, setStartAddresses] = useState([]);
    const [endAddresses, setEndAddresses] = useState([]);
    const [pickupQuery, setPickupQuery] = useState('');
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const { services, isLoaded, loadError } = useGoogleMaps();


    const [driverTrips, setDriverTrips] = useState([]); // Almacena los viajes del conductor
    const [driverLoading, setDriverLoading] = useState(true); // Estado de carga para los viajes del conductor


    const [feedbackModal, setFeedbackModal] = useState({
        isOpen: false,
        type: '',
        message: '',
        details: ''
    });
    const [startMarker, setStartMarker] = useState(null);
    const [endMarker, setEndMarker] = useState(null);

    useEffect(() => {
        if (selectedTrip) {
            const newStartMarker = new window.google.maps.Marker({ position: selectedTrip.startPoint });
            const newEndMarker = new window.google.maps.Marker({ position: selectedTrip.endPoint, icon: { url: 'http://maps.google.com/mapfiles/kml/paddle/go.png' } });
            setStartMarker(newStartMarker);
            setEndMarker(newEndMarker);
        }
    }, [selectedTrip]);

    useEffect(() => {
        // ...
        if (selectedTrip) {
            if (startMarker) startMarker.setMap(null); // Clear previous marker
            if (endMarker) endMarker.setMap(null); // Clear previous marker
            // ... create and set new markers
        }
    }, [selectedTrip]);


    useEffect(() => {
        if (selectedTrip) {
            setStartPoint(selectedTrip.startPoint);
            setEndPoint(selectedTrip.endPoint);
        }
    }, [selectedTrip]);



    const handleRequestAction = async (userId, action) => {
        try {
            const token = localStorage.getItem('token');
            if (!userId) {
                console.error('El userId no está definido');
                return;
            }
            const url = `${import.meta.env.VITE_API_URL}/trips/manage-reservation`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tripId: selectedTrip?.tripId,
                    userId,
                    action,
                }),
            });
    
            if (!response.ok) {
                console.error(`Error al ${action} la solicitud:`, response.statusText);
                return;
            }
    
            console.log(`Solicitud ${action} correctamente para el usuario ${userId}`);
            // Actualiza el estado local para reflejar el cambio
            const updatedTrips = driverTrips.map((trip) =>
                trip.tripId === selectedTrip?.tripId
                    ? {
                          ...trip,
                          pendingRequests: trip.pendingRequests.filter((request) => request.userId !== userId),
                      }
                    : trip
            );
            setDriverTrips(updatedTrips);
        } catch (error) {
            console.error(`Error al ${action} la solicitud:`, error);
        }
    };
    

    useEffect(() => {
        // Intento de obtener el nombre del usuario desde localStorage
        const storedUsername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');        
        if (storedUsername) setUsername(storedUsername);
        if (storedUserId) setUserId(storedUserId);
    }, []);


    useEffect(() => {
        const fetchTripsDriver = async () => {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_API_URL}/trips/my-trips`;
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) throw new Error('Error al obtener los viajes creados');
    
                const data = await response.json();
                console.log("Viajes creados por el conductor:", data);
    
                // Filtrar solo los viajes con state === 0
                const driverTrips = data.myTrips
                    .filter(trip => trip.state === 0) // Filtrar viajes con estado 0
                    .reverse()
                    .map(trip => ({
                        tripId: trip.tripId,
                        sector: trip.sector,
                        departureTime: trip.departureTime,
                        date: trip.date,
                        price: trip.price,
                        pendingRequests: trip.pendingRequests || [],
                    }));
    
                setDriverTrips(driverTrips); // Usa un estado separado para los viajes del conductor
            } catch (error) {
                console.error("Error al obtener los viajes creados por el conductor:", error);
            } finally {
                setDriverLoading(false); // Usa un estado separado para el loading del conductor
            }
        };
    
        fetchTripsDriver();
    }, []);
    

    

    const handleShowTripDetails = (trip) => {
        setSelectedTrip(trip);

        setTimeout(() => {
            setShowReservationModal(true);

        }, 500);
    };

    const handleMapClick = (event) => {
        const location = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setPickupLocation(location);
        setReservationDetails({ ...reservationDetails, pickupLocation: `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` });
        try {
            const geocoder = services.geocoder;
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
        const bounds = services.bounds;
        if (startPoint) bounds.extend(startPoint);
        if (endPoint) bounds.extend(endPoint);
        if (pickupLocation) bounds.extend(pickupLocation);
        map.fitBounds(bounds);
        console.log(startPoint, endPoint, pickupLocation);
    };

    const handleMapLoad = (map) => {
        fitBounds(map);
    };
    
    
    const [sectors, setSectors] = useState([]); // Lista de sectores únicos
const [selectedSector, setSelectedSector] = useState(''); // Sector seleccionado

useEffect(() => {
    const fetchTrips = async (universityID) => {
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_API_URL}/trips/all`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Error al obtener los viajes");

            const data = await response.json();
            console.log("Datos de viajes:", data);
            const newFilteredTrips = data.trips
                    .filter(trip => trip.userId !== universityID && trip.state === 0 && trip.capacity > 0)
                    .reverse();

            // Extrae todos los sectores únicos
            const uniqueSectors = [...new Set(newFilteredTrips.map(trip => trip.sector))];
            setSectors(uniqueSectors);

            const addressPromises = newFilteredTrips.map(trip =>
                getDetailAddress(trip.startPoint.lat, trip.startPoint.lng)
            );
            const endAddressPromises = newFilteredTrips.map(trip =>
                getDetailAddress(trip.endPoint.lat, trip.endPoint.lng)
            );

            const resolvedAddresses = await Promise.all(addressPromises);
            const resolvedEndAddresses = await Promise.all(endAddressPromises);
            setStartAddresses(resolvedAddresses);
            setEndAddresses(resolvedEndAddresses);

            const filteredTrips = newFilteredTrips.filter(trip => trip.userId !== universityID);
            setTrips(filteredTrips);
            setFilteredTrips(filteredTrips);

        } catch (error) {
            console.error("Error al obtener los viajes:", error);
        } finally {
            setLoading(false);
        }
    };

    setTimeout(() => {
        setUserName(id);
        setUserUniversityId(universityId);
        console.log("Nombre de usuario:", universityId);
    }, 1000);

    if (universityId !== null) {
        console.log("Universidad del usuario:", universityId);
        fetchTrips(universityId);
    }
}, [id, universityId]);

const applyFilters = () => {
    const filtered = trips.filter((trip) => {
        return (
            (!selectedSector || trip.sector === selectedSector) &&
            (!availableSeatsFilter || trip.capacity >= parseInt(availableSeatsFilter, 10))
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

            const url = `${import.meta.env.VITE_API_URL}/trips/reserve`;
            const response = await fetch(url, {
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
            const geocoder = services.geocoder;
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
                        <FilterInputs>
                            <Input
                                as="select"
                                placeholder="Filtrar por Sector de Inicio de Viaje"
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                            >
                                <option value="">Todos los sectores</option>
                                {sectors.map((sector, index) => (
                                    <option key={index} value={sector}>
                                        {sector}
                                    </option>
                                ))}
                            </Input>

                            <Input 
                                placeholder="Cantidad de Puestos Disponibles" 
                                value={availableSeatsFilter} 
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!value || parseInt(value, 10) >= 1) {
                                        setAvailableSeatsFilter(value);
                                    } 
                                }}
                                type="number"
                            />
                        </FilterInputs>

                        <SearchIcon onClick={applyFilters}>
                        <AiOutlineSearch />
                    </SearchIcon>
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
                <Title>{trip.sector}</Title> 

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
                <Text1>Cupos Disponibles: {trip.availability|| 'No especificado'}</Text1>
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
                        {selectedTrip && (
                            <>
                                {startMarker && startMarker.setMap(null)}
                                {endMarker && endMarker.setMap(null)}
                            </>
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
                <CreateTripCard onClick={() => navigate('/create-trip')}>
                    <Text style={{ fontWeight: 'bold' }}>Crea un viaje</Text>
                    <Button primary label="+" />
                </CreateTripCard>
    
                {isDriver && (
                    <NotificationContainer>
                    <Title>Viajes Pendientes</Title>
                    {driverTrips.length > 0 ? (
                        driverTrips.map((trip, index) => (
                            <NotificationCard key={index}>
                                <Text1 style={{ fontWeight: 'bold' }}>{trip.sector}</Text1>
                                <TimeContainer>
                                    <AiOutlineClockCircle size={16} />
                                    <span>{trip.departureTime || 'Hora no especificada'}</span>
                                </TimeContainer>
                                <Text1>Fecha: {trip.date || 'Fecha no especificada'}</Text1>
                                <Text1>Precio: ${trip.price || 'No especificado'}</Text1>
                                <Text1>Solicitudes de Recogida:</Text1>
                                {trip.pendingRequests.length > 0 ? (
                                    trip.pendingRequests.map((request, idx) => (
                                        <LocationCard key={idx}>
                                            <Text1>{request.location || 'Ubicación no especificada'}</Text1>
                                            <ButtonContainer>
                                                <ActionButton onClick={() => handleRequestAction(request.userId, 'accept')}>
                                                    <AiOutlineCheckCircle size={20} />
                                                </ActionButton>
                                                <ActionButton onClick={() => handleRequestAction(request.userId, 'reject')}>
                                                    <AiOutlineCloseCircle size={20} />
                                                </ActionButton>
                                            </ButtonContainer>
                                        </LocationCard>
                                    ))
                                ) : (
                                    <Text1>Sin solicitudes pendientes</Text1>
                                )}
                            </NotificationCard>
                        ))
                    ) : (
                        <Text>No hay notificaciones</Text>
                    )}
                    <Button
                        label="Ver más"
                        primary
                        onClick={() => navigate('/created-trips')}
                        style={{ marginTop: '20px' }}
                    />
                </NotificationContainer>
                
                )}
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
