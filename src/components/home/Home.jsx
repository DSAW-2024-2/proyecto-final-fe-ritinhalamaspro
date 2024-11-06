import React, { useState, useEffect } from 'react';
import { AiOutlineUser, AiOutlineFilter, AiOutlineCar } from 'react-icons/ai'; // Asegúrate de importar AiOutlineFilter aquí
import { FiUsers } from 'react-icons/fi';
import { Container, StyledWrapper, Title, Text, CardContainer } from '../../components/common/CommonStyles';
import Button from '../../components/common/Button';
import colors from '../../assets/Colors';

const HomePage = () => {
    const [isPassenger, setIsPassenger] = useState(true);
    const [username, setUsername] = useState('');
    const [hasCar, setHasCar] = useState(false); // Nuevo estado para verificar si el usuario tiene un carro registrado
    const [loading, setLoading] = useState(true);

    // Obtiene los datos del perfil del usuario desde el endpoint
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/users/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                
                if (!response.ok) throw new Error('Error al obtener los datos del perfil');

                const data = await response.json();
                setUsername(data.name || 'Usuario');
                setHasCar(!!data.carRegistered); // Suponiendo que el endpoint devuelve un campo que indica si el usuario tiene un carro registrado
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    // Manejo de cambio de roles (Pasajero/Conductor)
    const toggleRole = () => {
        if (isPassenger) {
            // Al intentar cambiar a conductor, verifica si tiene un carro registrado
            if (!hasCar) {
                // Si no tiene carro registrado, muestra un mensaje de alerta y la opción de registrar
                if (window.confirm("No tienes un carro registrado. ¿Deseas registrarlo ahora?")) {
                    // Redirigir a la página de registro de carro
                    window.location.href = '/registrar-carro';
                }
            } else {
                // Si tiene un carro registrado, permite el cambio de rol
                setIsPassenger(false);
            }
        } else {
            // Cambio de "Conductor" a "Pasajero" sin verificación
            setIsPassenger(true);
        }
    };

    // Mostrar un loader mientras se carga el nombre del usuario
    if (loading) {
        return (
            <Container>
                <p style={{ color: colors.details }}>Cargando...</p>
            </Container>
        );
    }

    return (
        <Container > {/* Se habilita scroll y padding para márgenes */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '80%' }}>
                <Title>
                    ¡Hola, <span style={{ color: colors.third }}> {isPassenger ? 'Pasajero' : 'Conductor'} </span> {username}!
                </Title>
                {/* Switch para cambiar entre "Pasajero" y "Conductor" */}
                <StyledWrapper>
                    <label className="switch" aria-label="Toggle Passenger/Driver">
                        <input type="checkbox" checked={!isPassenger} onChange={toggleRole} />
                        <span>{isPassenger ? <FiUsers size={20} /> : <AiOutlineCar size={20} />}</span> {/* Ícono condicional */}
                        <span><AiOutlineUser size={20} /></span>
                    </label>
                </StyledWrapper>
            </header>

            {/* Filtros */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <Button 
                    label="Filtrar por Ruta" 
                    primary 
                    icon={<AiOutlineFilter size={20} />}
                    style={{ padding: '10px 20px', borderRadius: '15px', border: `1px solid ${colors.details}` }}
                />
                <Button 
                    label="Filtrar por Cantidad de Puestos Disponibles" 
                    primary 
                    icon={<FiUsers size={20} />} 
                    style={{ padding: '10px 20px', borderRadius: '15px', border: `1px solid ${colors.details}` }}
                />
            </div>

            {/* Sección de Tarjetas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '30px' }}>
                {[1, 2, 3, 4].map((_, index) => (
                    <CardContainer key={index} style={{ position: 'relative', padding: '20px', width: '300px' }}>
                        <Text style={{ fontWeight: 'bold', color: colors.white }}>Ruta de {index % 2 === 0 ? 'Boyacá' : 'Autopista'}</Text>
                        <Text style={{ color: colors.details }}>Hora: 8:00am</Text>
                        <Text style={{ color: colors.details }}>Conductor: Juanita Diaz</Text>
                        {index % 2 !== 0 && (
                            <Text style={{ color: colors.third }}>Precio /persona: 5,000$</Text>
                        )}
                        {/* Ícono de personas */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: colors.details, marginTop: '10px' }}>
                            <FiUsers />
                            <Text>{index % 2 === 0 ? '3' : '1'}</Text>
                        </div>
                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                            <Button label="+" primary style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        </div>
                    </CardContainer>
                ))}
            </div>
        </Container>
    );
};

export default HomePage;
