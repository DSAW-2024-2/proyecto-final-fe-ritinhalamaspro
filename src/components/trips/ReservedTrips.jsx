// src/pages/CreatedTrips/CreatedTrips.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Title, Text } from '../../components/common/CommonStyles';
import colors from '../../assets/Colors';
import Button from '../../components/common/Button';
import FeedbackModal from '../../components/common/FeedbackModal';
import { AiOutlineDelete, AiOutlineUser } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    background-color: ${colors.background};
    height: 100vh;
    overflow: hidden;
`;

const TripsList = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-right: 20px;
    overflow-y: auto;
    max-height: 100%;
`;

const TripCard = styled.div`
    background-color: ${colors.background};
    border-radius: 15px;
    padding: 15px;
    color: ${colors.white};
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    width: 250px;
    height: 180px;
    min-width: 250px;
    min-height: 180px;
`;

const TripInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const TripImage = styled.img`
    width: 80px;
    border-radius: 8px;
    align-self: flex-end;
    margin-top: auto;
`;

const DeleteIcon = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: ${colors.white};
    font-size: 20px;
`;

const DetailsContainer = styled.div`
    flex: 0.4;
    background-color: ${colors.primaryHover};
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-left: 20px;
    max-height: 80%;
    overflow-y: auto;
`;

const ReservationsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ReservationCard = styled.div`
    background-color: ${colors.details};
    border-radius: 10px;
    padding: 10px;
    color: ${colors.white};
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const ReservationText = styled(Text)`
    font-size: 14px;
`;

const NoReservationsMessage = styled.div`
    color: ${colors.details};
    text-align: center;
    margin-top: 50px;
`;

const ReservedTrips = () => {
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservedTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/trips/my-reservations', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error("Error al obtener los viajes reservados");

                const data = await response.json();
                setTrips(data.trips || []); // Actualiza el estado con los datos obtenidos
            } catch (error) {
                console.error("Error al obtener los viajes reservados:", error);
            }
        };

        fetchReservedTrips();
    }, []);

    const handleTripClick = (trip) => {
        setSelectedTrip(trip);
    };

    const handleDeleteClick = (trip) => {
        setTripToDelete(trip);
        setShowModal(true);
    };

    const confirmDeleteTrip = () => {
        console.log(`Eliminando viaje: ${tripToDelete.route}`);
        setShowModal(false);
        setTripToDelete(null);
    };

    return (
        <Container>
            <TripsList>
                <Title>Viajes <span style={{ color: colors.third }}>Agendados</span></Title>
                
                {trips.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                        {trips.map((trip) => (
                            <TripCard key={trip.id} onClick={() => handleTripClick(trip)}>
                                <DeleteIcon onClick={(e) => { e.stopPropagation(); handleDeleteClick(trip); }}>
                                    <AiOutlineDelete />
                                </DeleteIcon>
                                <TripInfo>
                                    <Text style={{ fontWeight: 'bold', fontSize: '16px' }}>{trip.route}</Text>
                                    <Text style={{ color: colors.details }}>Hora: {trip.time}</Text>
                                    <Text style={{ color: colors.details }}>Precio /persona: <span style={{ color: colors.third }}>${trip.price}</span></Text>
                                </TripInfo>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <AiOutlineUser size={16} />
                                    <Text>{trip.availablePlaces} Reservas</Text>
                                </div>
                                <TripImage src={trip.image} alt="Car" />
                            </TripCard>
                        ))}
                    </div>
                ) : (
                    <NoReservationsMessage>
                        <Text>No hay viajes reservados</Text>
                        <Button 
                            primary 
                            label="Reservar un viaje" 
                            onClick={() => navigate('/home')} 
                        />
                    </NoReservationsMessage>
                )}
            </TripsList>

            {selectedTrip && (
                <DetailsContainer>
                    <Title>{selectedTrip.route}</Title>
                    <TripImage src={selectedTrip.image} alt="Car" style={{ width: '150px', borderRadius: '10px' }} />
                    <Text>Reservas</Text>
                    <ReservationsContainer>
                        {selectedTrip.reservations.map((reservation) => (
                            <ReservationCard key={reservation.id}>
                                <AiOutlineUser size={20} />
                                <div>
                                    <ReservationText>Punto de Recogida: {reservation.pickupPoint}</ReservationText>
                                    <ReservationText>Reservó <span style={{ color: colors.third }}>{reservation.seats}</span> puestos</ReservationText>
                                    <ReservationText>{reservation.passenger}</ReservationText>
                                </div>
                            </ReservationCard>
                        ))}
                    </ReservationsContainer>
                    <Button primary label="Cancelar Viaje" />
                </DetailsContainer>
            )}

            {showModal && (
                <FeedbackModal
                    type="question"
                    message="¿Está seguro de que desea eliminar este viaje?"
                    details={`Esta acción eliminará permanentemente el viaje: ${tripToDelete.route}`}
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmDeleteTrip}
                />
            )}
        </Container>
    );
};

export default ReservedTrips;