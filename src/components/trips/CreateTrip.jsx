// src/pages/CreateTrip/CreateTrip.jsx
import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { GoogleMap, Marker, DirectionsRenderer, Autocomplete, useLoadScript } from '@react-google-maps/api';
import { Title, Input } from '../../components/common/CommonStyles';
import colors from '../../assets/Colors';
import Button from '../../components/common/Button';
import FeedbackModal from '../../components/common/FeedbackModal';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClockCircle, AiOutlineCalendar, AiOutlineAim } from 'react-icons/ai';

const GOOGLE_MAPS_LIBRARIES = ['places'];
const apiKey = 'AIzaSyAhrQVoCw36PqqgNMN-AztGhfmqht47ZbI';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
    height: 100vh;
    background-color: ${colors.background};
    overflow-y: auto;
`;

const ContentWrapper = styled.div`
    display: flex;
    gap: 20px;
    width: 100%;
    max-width: 1200px;
    justify-content: center;
    align-items: flex-start;
`;

const StyledMapContainer = styled.div`
    width: 100%;
    height: 400px;
    max-width: 600px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const Card = styled.div`
    background-color: ${colors.background};
    border-radius: 15px;
    padding: 30px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    color: ${colors.white};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const FormField = styled.div`
    margin-bottom: 15px;
    width: 100%;
    position: relative;
`;

const MapIcon = styled(AiOutlineAim)`
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    cursor: pointer;
    color: ${({ active }) => (active ? colors.primaryHover : colors.details)};
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;
`;

const CreateTrip = () => {
    const navigate = useNavigate();
    const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey, libraries: GOOGLE_MAPS_LIBRARIES });
    const [passengerCount, setPassengerCount] = useState('');
    const [route, setRoute] = useState('');
    const [price, setPrice] = useState('');
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [originQuery, setOriginQuery] = useState('');
    const [destinationQuery, setDestinationQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [selectingOrigin, setSelectingOrigin] = useState(false);
    const [directions, setDirections] = useState(null); 

    useEffect(() => {
        if (origin && destination) {
            calculateRoute();
        }
    }, [origin, destination]);

    const handleMapClick = async (event) => {
        const location = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        
        if (selectingOrigin) {
            setOrigin(location);
            setOriginQuery(`Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`);
            await fetchSectorFromLocation(location); // Obtener el sector automáticamente
        } else {
            setDestination(location);
            setDestinationQuery(`Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`);
        }
    };

    const fetchSectorFromLocation = async (location) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location }, (results, status) => {
            if (status === "OK" && results[0]) {
                const addressComponents = results[0].address_components;
                const neighborhood = addressComponents.find((component) =>
                    component.types.includes("sublocality") || component.types.includes("neighborhood")
                );
                setRoute(neighborhood ? neighborhood.long_name : "Sector no encontrado");
            } else {
                console.error("Error al obtener el sector:", status);
                setRoute("Sector no encontrado");
            }
        });
    };

    const handleSelectPlace = async (place, setLocation, setQuery) => {
        const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };
        setLocation(location);
        setQuery(place.formatted_address);
        if (setLocation === setOrigin) await fetchSectorFromLocation(location);
    };

    const calculateRoute = () => {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    };

    const handleCreateTrip = async () => {
        if (passengerCount && route && price && time && date && origin && destination) {
            try {
                const token = localStorage.getItem('token');
                const tripData = {
                    startPoint: origin,
                    endPoint: destination,
                    sector: route,
                    departureTime: `${time}`,
                    price: parseFloat(price)
                };
                
                console.log("JSON enviado:", JSON.stringify(tripData));
                console.log("Token enviado:", token);
    
                const response = await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/trips/create/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(tripData)
                });
    
                if (!response.ok) throw new Error("Error al crear el viaje");
    
                setModalMessage("¡Viaje creado exitosamente!");
            } catch (error) {
                console.error("Error al crear el viaje:", error);
                setModalMessage("Ocurrió un error al crear el viaje. Por favor, inténtelo nuevamente.");
            }
        } else {
            setModalMessage("Por favor, complete todos los campos requeridos.");
        }
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
        if (modalMessage === "¡Viaje creado exitosamente!") {
            navigate('/home');
        }
    };

    const today = new Date().toISOString().split('T')[0];

    const handlePriceChange = (e) => {
        const value = Math.max(0, Math.ceil(e.target.value / 1000) * 1000);
        setPrice(value.toString());
    };

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <Container>
            <Title>Crea tu <span style={{ color: colors.third }}>Viaje</span></Title>
            <ContentWrapper>
                <StyledMapContainer>
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={origin || { lat: 4.7325735, lng: -74.0563375 }}
                        zoom={15}
                        onLoad={(map) => { window.mapRef = map; }}
                        onClick={handleMapClick}
                    >
                        {origin && <Marker position={origin} />}
                        {destination && <Marker position={destination} />}
                        {directions && <DirectionsRenderer directions={directions} />}
                    </GoogleMap>
                </StyledMapContainer>

                <Card>
                    <FormField>
                        <Autocomplete
                            onLoad={(autocomplete) => (window.originAutocomplete = autocomplete)}
                            onPlaceChanged={() => {
                                const place = window.originAutocomplete.getPlace();
                                handleSelectPlace(place, setOrigin, setOriginQuery);
                            }}
                        >
                            <Input
                                placeholder="Punto de Partida"
                                value={originQuery}
                                onChange={(e) => setOriginQuery(e.target.value)}
                                
                            />
                        </Autocomplete>
                        <MapIcon active={selectingOrigin} onClick={() => setSelectingOrigin(true)} />
                    </FormField>

                    <FormField>
                        <Autocomplete
                            onLoad={(autocomplete) => (window.destinationAutocomplete = autocomplete)}
                            onPlaceChanged={() => {
                                const place = window.destinationAutocomplete.getPlace();
                                handleSelectPlace(place, setDestination, setDestinationQuery);
                            }}
                        >
                            <Input
                                placeholder="Punto de Llegada"
                                value={destinationQuery}
                                onChange={(e) => setDestinationQuery(e.target.value)}
                            />
                        </Autocomplete>
                        <MapIcon active={!selectingOrigin} onClick={() => setSelectingOrigin(false)} />
                    </FormField>

                    <FormField>
                        <Input as="select" value={passengerCount} onChange={(e) => setPassengerCount(e.target.value)}>
                            <option value="">Cantidad de Pasajeros</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </Input>
                    </FormField>
                    <FormField>
                        <Input value={route} placeholder="Ruta" readOnly />
                    </FormField>
                    <FormField>
                        <Input
                            type="number"
                            placeholder="Precio por persona"
                            value={price}
                            onChange={handlePriceChange}
                        />
                    </FormField>
                    <FormField>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={today}
                            icon={<AiOutlineCalendar color={colors.white} />}
                        />
                    </FormField>
                    <FormField>
                        <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            icon={<AiOutlineClockCircle color={colors.white} />}
                        />
                    </FormField>
                    <ButtonContainer>
                        <Button primary label="¡Listo!" onClick={handleCreateTrip} />
                    </ButtonContainer>
                </Card>
            </ContentWrapper>

            {showModal && (
                <FeedbackModal
                    type={modalMessage === "¡Viaje creado exitosamente!" ? "success" : "error"}
                    message={modalMessage}
                    onClose={handleCloseModal}
                />
            )}
        </Container>
    );
};

export default CreateTrip;