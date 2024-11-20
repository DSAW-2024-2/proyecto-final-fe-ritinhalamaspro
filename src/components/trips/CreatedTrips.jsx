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
import { useGoogleMaps } from '../common/GoogleMapsProvider';
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
const Badge = styled.div`
    position: absolute;
    top: -17px;
    right: 0px;
    background-color: ${colors.third};
    color: ${colors.white};
    font-size: 14px;
    font-weight: bold;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    box-shadow: 0 0 5px ${colors.primary};
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
    top: 20px;
    right: 10px;
    cursor: pointer;
    color: ${colors.details};
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
        width: 90vw;
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
        flex-direction: column;
        margin-top: 5em;
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
    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');
    const [pendingRequest, setPendingRequest] = useState([]);
    const [directions, setDirections] = useState(null);
    const [waypoints, setWaypoints] = useState([]);
    const [mapInstance, setMapInstance] = useState(null);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [recalculate, setRecalculate] = useState(false);
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const { services, isLoaded, loadError } = useGoogleMaps();
    const [forceRender, setForceRender] = useState(0);

    const navigate = useNavigate(); // Usa useNavigate para obtener la función navigate


    const [feedbackModal, setFeedbackModal] = useState({ // Define el estado del modal aquí
        isOpen: false,
        type: '',
        message: '',
        details: '',
        onConfirm: null,
        onClose: null,
    });

    const [startMarker, setStartMarker] = useState(null);
    const [endMarker, setEndMarker] = useState(null);

    useEffect(() => {
        setShowMap(false);
        if (selectedTrip) {
            console.log('Selected Trip:', selectedTrip);
            const newStartMarker = new window.google.maps.Marker({ position: selectedTrip.startPoint });
            const newEndMarker = new window.google.maps.Marker({ position: selectedTrip.endPoint});
            setStartMarker(newStartMarker);
            setEndMarker(newEndMarker);
        }
    }, [selectedTrip, recalculate]);

    useEffect(() => {
        // ...
        if (selectedTrip) {
            if (startMarker) startMarker.setMap(null); // Clear previous marker
            if (endMarker) endMarker.setMap(null); // Clear previous marker
            // ... create and set new markers
        }
    }, [selectedTrip, recalculate]);

   

    const triggerReRender = () => {
        setForceRender((prev) => prev + 1); // Cambiar el estado forzará el re-render
    };

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



    

    useEffect(() => {
        console.log('API Key:', import.meta.env.VITE_API_KEY);
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_API_URL}/trips/my-trips`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
        
                if (!response.ok) throw new Error('Error al obtener los viajes creados');
        
                const data = await response.json();
                
                // Filtrar viajes con state === 0 y ordenarlos en orden inverso
                const filteredTrips = data.myTrips
                    .filter(trip => trip.state === 0)
                    .reverse();
        
                setTrips(filteredTrips || []);
            } catch (error) {
                console.error('Error al obtener los viajes creados:', error);
            } finally {
                setLoading(false);
            }
        };
        

        fetchTrips();
    }, [pendingRequest]);

    const handleTripClick = async (trip) => {
        console.log(trip);
        setSelectedTrip(trip);
     
        if (trip.pendingRequests) {
            setPendingRequest(trip.pendingRequests);
        }

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
     
                    // Establecer los waypoints convertidos
                    setWaypoints(waypoints);
                } catch (error) {
                    console.error("Error al procesar solicitudes aceptadas:", error);
                }
            };

            processRequests();
        }
        // Cálculo de la ruta usando startPoint y endPoint
        else {
            console.error("Punto de inicio o final no definido en el viaje");
        }
     
        // Obtener direcciones formateadas para mostrar
        const addressPromise = await getDetailAddress(trip.startPoint.lat, trip.startPoint.lng);
        const endAddressPromise = await getDetailAddress(trip.endPoint.lat, trip.endPoint.lng);
        setStartAddress(addressPromise);
        setEndAddress(endAddressPromise);
     
        setShowDetailsModal(true);
    };

    const handleDeleteClick = (trip) => {
        setSelectedTrip(trip);
        setShowDeleteModal(true);
    };

    const handleStartTrip = async () => {
        // Mostrar el modal de confirmación
        setFeedbackModal({
            isOpen: true,
            type: 'question',
            message: '¿Deseas iniciar este viaje?',
            details: 'Esta acción cambiará el estado del viaje a "en curso".',
            onConfirm: async () => {
                // Realizar la actualización del estado del viaje
                try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error("Token no encontrado. Por favor, inicia sesión.");

                    const url = `${import.meta.env.VITE_API_URL}/trips/update-state`;
                    const response = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            tripId: selectedTrip?.tripId, // Asegúrate de que `selectedTrip` contiene el tripId
                            newState: 1, // Estado "en curso"
                        }),
                    });
    
                    if (!response.ok) throw new Error("Error al actualizar el estado del viaje");
    
                    // Navegar a la página de viajes en curso
                    navigate('/trips-progress-driver');
    
                } catch (error) {
                    console.error("Error al iniciar el viaje:", error);
                    setFeedbackModal({
                        isOpen: true,
                        type: 'error',
                        message: 'Error al iniciar el viaje',
                        details: error.message || 'Hubo un problema al iniciar el viaje. Inténtalo nuevamente.',
                    });
                }
            },
            onClose: () => setFeedbackModal({ isOpen: false }), // Cerrar el modal si se cancela
        });
    };

    const confirmDeleteTrip = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!selectedTrip || !selectedTrip.tripId) {
                console.error('El tripId no está definido');
                return;
            }

            const url = `${import.meta.env.VITE_API_URL}/trips/delete-trip`;
            const response = await fetch(url, {
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
        fetchTrips();
    };

    const getDetailAddress = async(lat, lng) => {
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

    const fitBounds = (map) => {
        if (!map || !startPoint || !endPoint) return; // Verifica que los datos existan
    
        const bounds = services.bounds;
    
        bounds.extend(new window.google.maps.LatLng(startPoint.lat, startPoint.lng));
        bounds.extend(new window.google.maps.LatLng(endPoint.lat, endPoint.lng));
    
        waypoints.forEach((waypoint) => {
            if (waypoint.location) {
                bounds.extend(new window.google.maps.LatLng(waypoint.location.lat, waypoint.location.lng));
            }
        });
    
        map.fitBounds(bounds);
    };

    const handleMapLoad = (map) => {
        if (!window.mapRef) {
            window.mapRef = map;
            setMap(map);
            fitBounds(map);
        }
    };

    useEffect(() => {
        console.log('Selected Trip:', selectedTrip);
        if (selectedTrip) {
            window.mapRef = map;

            setMap(map);
            setLocations(selectedTrip.startPoint, setStartPoint);
            setLocations(selectedTrip.endPoint, setEndPoint);
            fitBounds(map);

            const getRoute = async () => {
                await calculateRoute();

            }
            getRoute();
        }
    }, [map, selectedTrip,recalculate]);

    const setLocations = async (location, set) => {
        try {
            const geocoder = services.geocoder;
            geocoder.geocode({ location }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    console.log('Dirección:', results[0]);
                    set(results[0].geometry.location);
                } else {
                    console.error('Error al obtener la dirección:', status);
                }
            });
        } catch (error) {
            console.error('Error con el servicio de geocodificación:', error);
        }

    };

    async function calculateRoute() {
        console.log('Calculando ruta...');
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: startAddress,
            destination: endAddress,
            waypoints: waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
        });
    
        setDirections(results);
    
        // Initialize total distance and duration
        let totalDistance = 0;
        let totalDuration = 0;
    
        // Iterate over each leg of the route
        for (const leg of results.routes[0].legs) {
            totalDistance += leg.distance.value;
            totalDuration += leg.duration.value;
        }
    
        // Format the total distance and duration
        const formattedTotalDistance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(results.routes[0].legs[0].start_location.lat(), results.routes[0].legs[0].start_location.lng()),
            new google.maps.LatLng(results.routes[0].legs[0].end_location.lat(), results.routes[0].legs[0].end_location.lng())
        ).toFixed(2);
        const formattedTotalDuration = new Date(totalDuration * 1000).toISOString().substr(11, 8);
 
        const distanceKm = parseFloat(formattedTotalDistance) / 1000;
        setDistance(distanceKm.toFixed(2) + ' km');
        setDuration(formattedTotalDuration);
        console.log('Ruta calculada:', results);
    }

    const goMap = () => {
        setRecalculate(!recalculate);
        setTimeout(() => {
            setShowMap(true);
        }, 500);
    };


    const handleRequestAction = async (userId, action) => {
        try {
            const token = localStorage.getItem('token');
            if (!selectedTrip || !selectedTrip.tripId) {
                console.error('El tripId no está definido');
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
            setShowDetailsModal(false);
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
                                {/* Muestra el badge si hay solicitudes pendientes */}
                                {trip.pendingRequests?.length > 0 && (
                                    <Badge>{trip.pendingRequests.length}</Badge>
                                )}
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
                                    
                                    <Text1 style={{ color: colors.details }}>Fecha: {trip.date}</Text1>
                                    <Text1 style={{ color: colors.details }}>Hora: {trip.departureTime}</Text1>
                                    <Text1 style={{ color: colors.details }}>
                                        Precio /persona: <span style={{ color: colors.third }}>${trip.price}</span>
                                    </Text1>
                                </TripInfo>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <AiOutlineUser size={16} />
                                    <Text1>{trip.reservationsCount} Reservas</Text1>
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
                            <Tab onClick={() => {setShowMap(false)
                            }}>Viaje</Tab>
                            <Tab onClick={() => {setShowMap(false)
                            }}>Solicitudes</Tab>
                            <Tab onClick={() => {goMap()}}>Ruta</Tab>
                            </TabList>

                            <TabPanel>
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
                                    <Text1>Reservas: {selectedTrip.reservationsCount || 0}</Text1>
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
                                                <Button label="Aceptar" primary onClick={() => handleRequestAction(request.userId, "accept")}/>
                                                <Button label="Rechazar" onClick={() => handleRequestAction(request.userId, "reject")} />
                                            </RequestContainer>
                                        ))
                                    ) : (
                                        <Text>No hay solicitudes pendientes</Text>
                                    )}
                            </TabPanel>
                            <TabPanel>
                                <Title>Ruta</Title>
                                {showMap && (

                                    <>
                                    <GoogleMap
                                        mapContainerStyle={{ width: '100%', height: '400px' }}
                                        zoom={10}
                                        >
                                        {startPoint && <Marker position={startPoint} />}
                                        {endPoint && <Marker position={endPoint} />}
                                        {directions && <DirectionsRenderer directions={directions} />}
                                        {selectedTrip && (
                                            <>
                                                {startMarker && startMarker.setMap(null)}
                                                {endMarker && endMarker.setMap(null)}
                                            </>
                                        )}
                                    </GoogleMap>
                                    <Text> <span style={{ color: colors.third }}>Distancia:</span> {distance}, <span style={{ color: colors.third }}>Duración:</span> {duration}</Text>
                                    
                                    </>
                                    )}
                            </TabPanel>
                        </StyledTabs>
                    </DetailsModal>

                </>
            )}

        {feedbackModal.isOpen && (
            <FeedbackModal
                type={feedbackModal.type}
                message={feedbackModal.message}
                details={feedbackModal.details}
                onConfirm={feedbackModal.onConfirm} // Acción al confirmar
                onClose={feedbackModal.onClose}   // Acción al cerrar
            />
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
