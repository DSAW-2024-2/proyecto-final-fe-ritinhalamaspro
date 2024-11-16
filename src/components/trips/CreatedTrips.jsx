import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Title, Text } from '../../components/common/CommonStyles';
import colors from '../../assets/Colors';
import Button from '../../components/common/Button';
import FeedbackModal from '../../components/common/FeedbackModal';
import Loader from '../../components/common/Loader';
import { AiOutlineDelete, AiOutlineUser, AiOutlineCloseCircle } from 'react-icons/ai';

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

const DeleteIcon = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: ${colors.white};
    font-size: 20px;
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

const DetailsModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${colors.primaryHover};
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    width: 90%;
    max-width: 500px;
`;

const CreatedTrips = () => {
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/trips/my-trips', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error('Error al obtener los viajes creados');

                const data = await response.json();
                setTrips(data.myTrips || []);
            } catch (error) {
                console.error('Error al obtener los viajes creados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    const handleTripClick = (trip) => {
        setSelectedTrip(trip);
        setShowDetailsModal(true);
    };

    const handleDeleteClick = (trip) => {
        setSelectedTrip(trip);
        setShowDeleteModal(true);
    };

    const confirmDeleteTrip = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!selectedTrip || !selectedTrip.tripId) {
                console.error('El tripId no está definido');
                return;
            }

            const response = await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/trips/delete-trip', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tripId: selectedTrip.tripId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error del servidor:', errorData.message || 'Error desconocido');
                throw new Error('Error al eliminar el viaje');
            }

            setTrips(trips.filter((trip) => trip.tripId !== selectedTrip.tripId));
            setShowDeleteModal(false);
            setSelectedTrip(null);
        } catch (error) {
            console.error('Error al eliminar el viaje:', error);
        }
    };

    const closeModals = () => {
        setShowDetailsModal(false);
        setShowDeleteModal(false);
        setSelectedTrip(null);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Container>
            <TripsList>
                <Title>
                    Viajes <span style={{ color: colors.third }}>Creados</span>
                </Title>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                    {trips.length > 0 ? (
                        trips.map((trip) => (
                            <TripCard key={trip.tripId} onClick={() => handleTripClick(trip)}>
                                <DeleteIcon
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(trip);
                                    }}
                                >
                                    <AiOutlineDelete />
                                </DeleteIcon>
                                <TripInfo>
                                    <Text style={{ fontWeight: 'bold', fontSize: '16px' }}>{trip.sector}</Text>
                                    <Text style={{ color: colors.details }}>Hora: {trip.departureTime}</Text>
                                    <Text style={{ color: colors.details }}>
                                        Precio /persona: <span style={{ color: colors.third }}>${trip.price}</span>
                                    </Text>
                                </TripInfo>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <AiOutlineUser size={16} />
                                    <Text>{trip.reservations ? trip.reservations.length : 0} Reservas</Text>
                                </div>
                            </TripCard>
                        ))
                    ) : (
                        <Text>No hay viajes creados por el conductor</Text>
                    )}
                </div>
            </TripsList>

            {showDetailsModal && selectedTrip && (
                <>
                    <Overlay onClick={closeModals} />
                    <DetailsModal style={{ backgroundColor: colors.background }}>
    <AiOutlineCloseCircle
        size={24}
        color={colors.white}
        style={{
            position: 'absolute',
            top: 15,
            right: 15,
            cursor: 'pointer',
        }}
        onClick={closeModal}
    />
    <Title>{selectedTrip.sector}</Title>
    <Text>
        Desde:{' '}
        {typeof selectedTrip.startPoint === 'object'
            ? `Lat: ${selectedTrip.startPoint.lat}, Lng: ${selectedTrip.startPoint.lng}`
            : selectedTrip.startPoint}
    </Text>
    <Text>
        Hasta:{' '}
        {typeof selectedTrip.endPoint === 'object'
            ? `Lat: ${selectedTrip.endPoint.lat}, Lng: ${selectedTrip.endPoint.lng}`
            : selectedTrip.endPoint}
    </Text>
    <Text>Hora de salida: {selectedTrip.departureTime}</Text>
    <Text>Precio /persona: ${selectedTrip.price}</Text>
    <Text>Reservas: {selectedTrip.reservations?.length || 0}</Text>
    <Button label="Iniciar Viaje" primary onClick={handleStartTrip} />
</DetailsModal>

                </>
            )}

            {showDeleteModal && (
                <FeedbackModal
                    type="question"
                    message="¿Está seguro de que desea eliminar este viaje?"
                    details={`Esta acción eliminará permanentemente el viaje: ${
                        selectedTrip ? selectedTrip.sector : ''
                    }`}
                    onClose={closeModals}
                    onConfirm={confirmDeleteTrip}
                />
            )}
        </Container>
    );
};

export default CreatedTrips;
