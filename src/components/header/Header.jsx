import React, { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMap, faList, faUser, faBars, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import colors from '../../assets/Colors';

// Estilos personalizados


const StyledMenu = styled(Menu)`
    display: flex;
    background-color: ${colors.background}; 
    flex-direction: column;
    align-items: center;
    gap: 90px; // Espacio uniforme entre los íconos
    margin-top: 0px; // Separación superior
    border-right: 0.2px solid ${colors.white}; 
`;

const Icon = styled(FontAwesomeIcon)`
    color: ${colors.details};
    font-size: 24px;
`;

const IconActive = styled(FontAwesomeIcon)`
    color: ${colors.third};
    font-size: 24px;
`;

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            navigate('/home');
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLogged(!!token);
    }, [path]);

    return (
        <>
            {isLogged && (
                    <StyledMenu iconShape="square">
                        <MenuItem
                            component={<Link to="/home" />}
                            icon={
                                path === '/home' 
                                    ? <IconActive icon={faHome} /> 
                                    : <Icon icon={faHome} />
                            }
                        />
                        <MenuItem
                            component={<Link to="/mapa" />}
                            icon={
                                path === '/mapa' 
                                    ? <IconActive icon={faMap} /> 
                                    : <Icon icon={faMap} />
                            }
                        />
                        <MenuItem
                            component={<Link to="/lista" />}
                            icon={
                                path === '/lista' 
                                    ? <IconActive icon={faList} /> 
                                    : <Icon icon={faList} />
                            }
                        />
                        <MenuItem
                            component={<Link to="/pagina-principal" />}
                            icon={
                                path === '/pagina-principal' 
                                    ? <IconActive icon={faUser} /> 
                                    : <Icon icon={faUser} />
                            }
                        />
                    </StyledMenu>
            )}
        </>
    );
}

export default Header;
