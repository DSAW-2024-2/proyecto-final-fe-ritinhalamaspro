// src/pages/HomePage/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClockCircle } from 'react-icons/ai';
import styled from 'styled-components';
import { Container, Text, Input, StyledAddButton } from '../../components/common/CommonStyles';
import colors from '../../assets/Colors';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { useDriver } from '../../context/DriverContext';
import FeedbackModal from '../common/FeedbackModal';
import { selectName } from '../../features/users/UserSlice';
import {useDispatch, useSelector} from "react-redux"

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
    align-items: center;
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

    const [feedbackModal, setFeedbackModal] = useState({
        isOpen: false,
        type: '',
        message: '',
        details: ''
    });

    const [showReservationModal, setShowReservationModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [reservationDetails, setReservationDetails] = useState({
        seats: '',
        pickupLocation: ''
    });

    useEffect(() => {
        setTimeout(() => {
            setUserName(id)
        }, 1000);
    }, [id]);


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


    const handleReserveTrip = async () => {
        const { seats, pickupLocation } = reservationDetails;
        if (!seats || !pickupLocation) {
            setFeedbackModal({
                isOpen: true,
                type: 'error',
                message: 'Datos incompletos',
                details: 'Por favor, completa todos los campos antes de reservar.'
            });
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token no encontrado. Por favor, inicia sesión.");
    
            const response = await fetch(`https://proyecto-final-be-ritinhalamaspro.vercel.app/trips/reserve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    tripId: selectedTrip.id,
                    seats,
                    pickupLocation
                })
            });
    
            if (!response.ok) throw new Error("Error al reservar el viaje");
    
            setFeedbackModal({
                isOpen: true,
                type: 'confirmation',
                message: 'Reserva realizada con éxito',
                details: 'Tu reserva ha sido confirmada. ¡Disfruta del viaje!'
            });
            setShowReservationModal(false);
        } catch (error) {
            console.error("Error al reservar el viaje:", error);
    
            setFeedbackModal({
                isOpen: true,
                type: 'error',
                message: 'Error al reservar el viaje',
                details: error.message || 'Hubo un problema al realizar la reserva. Inténtalo nuevamente.'
            });
        }
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
                                    <Text>De: ${trip.startPoint.formattedAddress || trip.startPoint.location}</Text>
                                    <Text>A: ${trip.endPoint.formattedAddress || trip.endPoint.location}</Text>
                                    <TimeContainer>
                                        <AiOutlineClockCircle color={colors.white} />
                                        <Text>{trip.departureTime}</Text>
                                    </TimeContainer>
                                    <Text>Precio/persona: ${trip.price}</Text>
                                    <Text>Cupos: {trip.capacity}</Text>
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
            <Title>Reservar Viaje</Title>
            <Input
                placeholder="Número de asientos"
                type="number"
                value={reservationDetails.seats}
                onChange={(e) => setReservationDetails({ ...reservationDetails, seats: e.target.value })}
            />
            <Input
                placeholder="Lugar de recogida"
                value={reservationDetails.pickupLocation}
                onChange={(e) => setReservationDetails({ ...reservationDetails, pickupLocation: e.target.value })}
            />
            <Button primary label="Reservar" onClick={handleReserveTrip} />
            <Button label="Cancelar" onClick={closeReservationModal} />
        </ReservationModalContainer>
    </>
)}

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
