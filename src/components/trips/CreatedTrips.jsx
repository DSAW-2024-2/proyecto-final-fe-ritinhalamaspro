import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Title, Text, Text1 } from '../../components/common/CommonStyles';
import colors from '../../assets/Colors';
import Button from '../../components/common/Button';
import FeedbackModal from '../../components/common/FeedbackModal';
import Loader from '../../components/common/Loader';
import { AiOutlineDelete, AiOutlineUser, AiOutlineCloseCircle } from 'react-icons/ai';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { GoogleMap, Marker, DirectionsRenderer, Autocomplete, useLoadScript } from '@react-google-maps/api';



const GOOGLE_MAPS_LIBRARIES = ['places'];
const apiKey = 'AIzaSyAhrQVoCw36PqqgNMN-AztGhfmqht47ZbI';

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

const StyledTabs = styled(Tabs)`

    .react-tabs__tab-list {
        display: flex;
    }
    .react-tabs__tab {
        font-size: 1.2em;
        padding: 10px 20px;
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
        background: ${colors.primary};
    }
    .react-tabs__tab-panel {
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1em;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 20px;
    margin-top: 20px;
`;

const ContentContainer = styled.div`

    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
    justify-content: center;
    width: 80%;
`;

const RequestContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 100%;
    border: 1px solid white;
    border-radius: 10px;
`;

const CreatedTrips = () => {
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey, libraries: GOOGLE_MAPS_LIBRARIES });
    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');
    const [pendingRequest, setPendingRequest] = useState([]);
    

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

    const handleTripClick = async(trip) => {
        console.log(trip);
        setSelectedTrip(trip);
        if (trip.pendingRequests)
        {
            setPendingRequest(trip.pendingRequests);
        }
        
        setShowDetailsModal(true);
        const addressPromise = await getDetailAddress(trip.startPoint.lat, trip.startPoint.lng)
        const endAddressPromise = await getDetailAddress(trip.endPoint.lat, trip.endPoint.lng)
        setStartAddress(addressPromise);
        setEndAddress(endAddressPromise);
    };

    const handleDeleteClick = (trip) => {
        setSelectedTrip(trip);
        setShowDeleteModal(true);
    };

    const handleStartTrip = async () => {
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

    const getDetailAddress = async(lat, lng) => {
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

    const handleRequestAction = async (userId, action) => {
        try {
            const token = localStorage.getItem('token');
            if (!selectedTrip || !selectedTrip.tripId) {
                console.error('El tripId no está definido');
                return;
            }
    
            const response = await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/trips/manage-reservation', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tripId: selectedTrip.tripId,
                    userId,
                    action,
                }),
            });
    
            if (!response.ok) {
                console.error(`Error al ${action} la solicitud:`, response.statusText);
                return;
            }
    
            // Elimina el request del array localmente
            const requestIndex = pendingRequest.findIndex((request) => request.userId === userId);
            if (requestIndex !== -1) {
                const updatedRequests = [...pendingRequest];
                updatedRequests.splice(requestIndex, 1);
                setPendingRequest(updatedRequests); // Actualiza el estado con el array modificado
            }
    
            console.log(`Solicitud ${action} correctamente para el usuario ${userId}`);
        } catch (error) {
            console.error(`Error al ${action} la solicitud:`, error);
        }
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
                                    <Text1 style={{ fontWeight: 'bold', fontSize: '16px' }}>{trip.sector}</Text1>
                                    <Text1 style={{ color: colors.details }}>Hora: {trip.departureTime}</Text1>
                                    <Text1 style={{ color: colors.details }}>
                                        Precio /persona: <span style={{ color: colors.third }}>${trip.price}</span>
                                    </Text1>
                                </TripInfo>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <AiOutlineUser size={16} />
                                    <Text1>{trip.reservations ? trip.reservations.length : 0} Reservas</Text1>
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

                        <StyledTabs>
                            <TabList>
                            <Tab>Viaje</Tab>
                            <Tab>Solicitudes</Tab>
                            <Tab>Ruta</Tab>
                            </TabList>

                            <TabPanel>
                                
                                <Title>{selectedTrip.sector}</Title>
                                <ContentContainer>
                                    <Text1>
                                        Desde:{startAddress}
                                    </Text1>
                                    <Text1>
                                        Hasta:{endAddress}
                                    </Text1>
                                    <Text1>Hora de salida: {selectedTrip.departureTime}</Text1>
                                    <Text1>Precio /persona: ${selectedTrip.price}</Text1>
                                    <Text1>Reservas: {selectedTrip.reservations?.length || 0}</Text1>
                                </ContentContainer>                              
                                <ButtonContainer>
                                    <Button label="Iniciar Viaje" primary onClick={handleStartTrip} />
                                </ButtonContainer>
                                </TabPanel>
                                <TabPanel>
                                    <Title>Solicitudes</Title>
                                    {pendingRequest.length > 0 ? (
                                        pendingRequest.map((request) => (
                                            <RequestContainer key={request.userId}>
                                                <Text1>{request.location}</Text1>
                                                <Button
                                                    label="Aceptar"
                                                    primary
                                                    onClick={() => handleRequestAction(request.userId, 'accept')}
                                                />
                                                <Button
                                                    label="Rechazar"
                                                    onClick={() => handleRequestAction(request.userId, 'reject')}
                                                />
                                            </RequestContainer>
                                        ))
                                    ) : (
                                        <Text>No hay solicitudes pendientes</Text>
                                    )}
                                </TabPanel>


                        </StyledTabs>
                        <AiOutlineCloseCircle
                                    size={24}
                                    color={colors.white}
                                    style={{
                                        position: 'absolute',
                                        top: 15,
                                        right: 15,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => closeModals()}
                                />
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
