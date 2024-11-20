// src/pages/CreatedTrips/CreatedTrips.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Title, Text, Text1 } from '../../components/common/CommonStyles';
import colors from '../../assets/Colors';
import Button from '../../components/common/Button';
import FeedbackModal from '../../components/common/FeedbackModal';
import { AiOutlineDelete, AiOutlineUser } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
 
 
 
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
    height: auto; /* Cambiado de fijo a automático */
    min-width: 250px;
    overflow: hidden; /* Asegura que nada se salga del contenedor */
    max-height: 400px; /* Opcional: limita el tamaño máximo de la tarjeta */
`;
 
 
const TripInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    overflow: hidden; /* Asegura que no se salga */
    text-overflow: ellipsis; /* Corta el texto si es muy largo */
    white-space: nowrap; /* Mantiene el texto en una sola línea */
`;
 
 
const DeleteIcon = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: ${colors.white};
    font-size: 20px;
    `;
 
 
 
const TripImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-radius: 15px;
    position: cover;
    
`;


const TripImage = styled.img`
    width: 100%;
    height: 6em;
    border-radius: 1em;
    object-fit: cover;
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
 
 
const StyledTabs = styled(Tabs)`
 
    .react-tabs__tab-list {
        display: flex;
        width: 90vw;
    }
    .react-tabs__tab {
        font-size: 1.2em;
        padding: 10px 10px;
        color: white;
        cursor: pointer;
        width: 100%;
        text-align: center;
        background: transparent;
        border: none;
        transition: all 0.3s ease;
    }
 
    .react-tabs__tab:hover {
        color:${colors.primaryHover};;
    }
    .react-tabs__tab--selected {
        color: #ffffff;
        background: ${colors.third};
    }
    .react-tabs__tab-panel {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1em;
    }
`;
const ReservedTrips = () => {
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);
    const navigate = useNavigate();
    const [pendingTrips, setPendingTrips] = useState(null);
    const [acceptedTrips, setAcceptedTrips] = useState(null);
    const [rejectedTrips, setRejectedTrips] = useState(null);
 
    const [reload, setReload] = useState(false);
 
 
    useEffect(() => {
        const fetchReservedTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_API_URL}/trips/my-reservations`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error("Error al obtener los viajes reservados");
 
                const data = await response.json();
                console.log("Viajes reservados:", data.reservedTrips);
                setTrips(data.reservedTrips || []); // Actualiza el estado con los datos obtenidos
                const pending = data.reservedTrips.filter((trip) => trip.status === 'pending');
                const accepted = data.reservedTrips.filter((trip) => trip.status === 'accepted');
                const rejected = data.reservedTrips.filter((trip) => trip.status === 'rejected');
 
 
                setPendingTrips(pending);
                setAcceptedTrips(accepted);
                setRejectedTrips(rejected);
 
            } catch (error) {
                console.error("Error al obtener los viajes reservados:", error);
            }
        };
 
        fetchReservedTrips();
    }, [reload]);
 
    const handleTripClick = (trip) => {
        setSelectedTrip(trip);
    };
 
    const handleDeleteClick = (trip) => {
        setTripToDelete(trip);
        setShowModal(true);
    };
 
    const confirmDeleteTrip = () => {
        if (tripToDelete) {
            deleteReservation(tripToDelete.tripId); // Llama a la función con el ID del viaje
        }
        setShowModal(false);
        setTripToDelete(null);
    };
 
 
    const deleteReservation = async (tripId) => {
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_API_URL}/trips/cancel`;
            const body = {
                tripId: tripId
            };
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
 
            if (!response.ok) throw new Error("Error al cancelar la reserva");
            else setReload(!reload);
            
            console.log("Reserva cancelada exitosamente");
            // Realizar las acciones necesarias después de cancelar la reserva
 
        } catch (error) {
            console.error("Error al cancelar la reserva:", error);
        }
    };
 
 
    return (
        <Container>
            <TripsList>
                <Title>Viajes <span style={{ color: colors.third }}>Agendados</span></Title>
                
                {trips.length > 0 ? (
                    <StyledTabs>
                        <TabList>
                            <Tab>Pendientes</Tab>
                            <Tab>Aceptados</Tab>
                            <Tab>Rechazados</Tab>
                            
                            </TabList>
 
                            <TabPanel>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
                                {pendingTrips.map((trip) => (
                                    <TripCard key={trip.id}>
                                        <DeleteIcon
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(trip);
                                            }}
                                        >
                                            <AiOutlineDelete />
                                        </DeleteIcon>
                                        
                                        <TripInfo>
                                            <Title>{trip.sector}</Title>
                                            <Text1 style={{ fontWeight: 'bold', fontSize: '16px' }}>{trip.date}</Text1>
                                            <Text1 style={{ color: colors.details }}>Hora: {trip.departureTime}</Text1>
                                            <Text1 style={{ color: colors.details }}>
                                                Precio /persona: <span style={{ color: colors.third }}>${trip.price}</span>
                                            </Text1>
                                        </TripInfo>
                                        {/* Agregar la imagen del carro */}
                                        {trip.carPhoto&& (
                                            <TripImageContainer>
                                            <TripImage
                                                src={trip.carPhoto}
                                                alt="Car"
                                            />
                                            </TripImageContainer>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        </div>
                                    </TripCard>
                                ))}
                            </div>
                        </TabPanel>
 
                        <TabPanel>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
                                {acceptedTrips.map((trip) => (
                                    <TripCard key={trip.id}>
                                        <DeleteIcon
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(trip);
                                            }}
                                        >
                                            <AiOutlineDelete />
                                        </DeleteIcon>
                                        <TripInfo>
                                            <Title>{trip.sector}</Title>
                                            <Text1 style={{ fontWeight: 'bold', fontSize: '16px' }}>{trip.date}</Text1>
                                            <Text1 style={{ color: colors.details }}>Hora: {trip.departureTime}</Text1>
                                            <Text1 style={{ color: colors.details }}>
                                                Precio /persona: <span style={{ color: colors.third }}>${trip.price}</span>
                                            </Text1>
                                        </TripInfo>
                                        {/* Agregar la imagen del carro */}
                                        {trip.carPhoto&& (
                                            <TripImage
                                                src={trip.carPhoto}
                                                alt="Car"
                                            />
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        </div>
                                    </TripCard>
                                ))}
                            </div>
                        </TabPanel>
 
                        <TabPanel>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
                                {rejectedTrips.map((trip) => (
                                    <TripCard key={trip.id} >
                                        <DeleteIcon
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(trip);
                                            }}
                                        >
                                            <AiOutlineDelete />
                                        </DeleteIcon>
                                        <TripInfo>
                                            <Title>{trip.sector}</Title>
                                            <Text1 style={{ fontWeight: 'bold', fontSize: '16px' }}>{trip.date}</Text1>
                                            <Text1 style={{ color: colors.details }}>Hora: {trip.departureTime}</Text1>
                                            <Text1 style={{ color: colors.details }}>
                                                Precio /persona: <span style={{ color: colors.third }}>${trip.price}</span>
                                            </Text1>
                                        </TripInfo>
                                        {/* Agregar la imagen del carro */}
                                        {trip.carPhoto&& (
                                            <TripImage
                                                src={trip.carPhoto}
                                                alt="Car"
                                            />
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        </div>
                                    </TripCard>
                                ))}
                            </div>
                        </TabPanel>
 
 
 
 
                    </StyledTabs>
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
                    message="¿Está seguro de que desea cancelar esta reserva?"
                    details={`Esta acción cancelará su reserva.`}
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmDeleteTrip}
                />
            )}
        </Container>
    );
};
 
export default ReservedTrips;