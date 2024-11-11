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

const HomePage = () => {
    const { isDriver } = useDriver();
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [trips, setTrips] = useState([]);
    const [routeFilter, setRouteFilter] = useState('');
    const [availableSeatsFilter, setAvailableSeatsFilter] = useState('');
    const [filteredTrips, setFilteredTrips] = useState([]);

    const [feedbackModal, setFeedbackModal] = useState({
        isOpen: false,
        type: '',
        message: '',
        details: ''
    });

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

    const handleReserveTrip = async (tripId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token no encontrado. Por favor, inicia sesión.");
    
            const response = await fetch(`https://proyecto-final-be-ritinhalamaspro.vercel.app/trips/reserve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tripId })
            });
    
            if (!response.ok) throw new Error("Error al reservar el viaje");
    
            // Muestra modal de confirmación
            setFeedbackModal({
                isOpen: true,
                type: 'confirmation',
                message: 'Reserva realizada con éxito',
                details: 'Tu reserva ha sido confirmada. ¡Disfruta del viaje!'
            });
        } catch (error) {
            console.error("Error al reservar el viaje:", error);
    
            // Muestra modal de error
            setFeedbackModal({
                isOpen: true,
                type: 'error',
                message: 'Error al reservar el viaje',
                details: error.message || 'Hubo un problema al realizar la reserva. Inténtalo nuevamente.'
            });
        }
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
                ¡Hola, <span>{isDriver ? 'Conductor' : 'Pasajero'}</span> {username}!
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
                                    <Text>{trip.route}</Text>
                                    <TimeContainer>
                                        <AiOutlineClockCircle color={colors.white} />
                                        <Text>{trip.timeTrip}</Text>
                                    </TimeContainer>
                                    <Text>Conductor: {trip.driver}</Text>
                                    <Text>Precio/persona: ${trip.priceTrip}</Text>
                                    <Text>Cupos: {trip.availablePlaces}</Text>
                                    <img src={trip.image} alt="Car" style={{ width: '100%', borderRadius: '10px', marginTop: '10px' }} />
                                    <StyledAddButton onClick={() => handleReserveTrip(trip.tripId)}>+</StyledAddButton>
                                </TripCard>
                            ))
                        ) : (
                            <Text>No hay viajes disponibles en este momento</Text>
                        )}
                    </ScrollableCardContainer>
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
