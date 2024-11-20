import React, { useState, useEffect} from 'react'
import styled,{keyframes} from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux"
import { Burger, BurgerImage, Hamburger, Left, LogOutItem, MenuLink, Nav, NavMenu, NavbarContainer, NavbarItem, NavbarItem1, NavbarItemComplete, NavbarItemText, NavbarList, NavbarListComplete, NavbarListImg, NavbarListItem, NavbarListItemBox, NavbarListItemBoxUser, NavbarListTitle, NavbarMenu, NavbarOptions, RowContainer, Separator, User, UserInfo, UserName, UserPhoto, UserRole } from './HeaderStyle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from '../../assets/Colors';
import { useDriver } from '../../context/DriverContext';
import { faChevronLeft, faChevronRight, faHome, faMap, faUser, faRoad } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/Logo.png';
import logoS from '../../assets/LogoS.png';
import { AiOutlineUser, AiOutlineCar } from 'react-icons/ai';
import { StyledWrapper, StyledWrapper1 } from '../common/CommonStyles';
import FeedbackModal from '../common/FeedbackModal';
import { setUserLogin } from '../../features/users/UserSlice'
import userPhoto from '../../assets/PofilePhoto.png'
 
const fadeInOut = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;
 
const HeaderWrapper = styled.header`
    display: flex;
    flex-direction: column;
    align-items: ${({ isOpen }) => (isOpen ? 'flex-start' : 'center')};
    gap: 20px;
    padding: 10px;
    background-color: ${colors.background};
    position: relative;
    width: ${({ isOpen }) => (isOpen ? '250px' : '60px')};
    transition: width 0.3s ease;
    box-shadow: ${({ isOpen }) => (isOpen ? '5px 0 15px rgba(0, 0, 0, 0.3)' : 'none')};
    
    @media (max-width: 768px) {
        width: 100%;
        position: fixed;
        bottom: 0;
        flex-direction: row;
        justify-content: space-around;
        padding: 10px 0;
        box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.3);
        height: 60px;
        align-items: center;
    }
`;
 
const ToggleButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: ${colors.white};
    font-size: 24px;
    cursor: pointer;
 
    @media (max-width: 768px) {
        display: none;
    }
`;
 
const CenterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    margin-top: 30px;
    margin-bottom: 30px;
 
    @media (max-width: 768px) {
        display: none;
    }
`;
 
const Logo = styled.img`
    width: ${({ isOpen }) => (isOpen ? '120px' : '25px')};
    margin-top: 1em;
    height: auto;
    transition: width 0.3s ease, opacity 0.3s ease;
    animation: ${fadeInOut} 0.3s ease;
 
    @media (max-width: 768px) {
        display: none;
    }
`;
 
const Icon = styled(FontAwesomeIcon)`
    color: ${({ isDriver, active }) =>
        isDriver && active ? colors.primary : !isDriver && active ? colors.third : colors.details};
    font-size: 24px;
    background: none;
 
    &:hover {
        color: ${colors.primaryHover};
    }
`;
 
const MenuText = styled.span`
    color: ${colors.white};
    display: ${({ isOpen }) => (isOpen ? 'inline' : 'none')};
    background: none;
 
    &:hover {
        color: ${colors.primaryHover};
    }
 
    @media (max-width: 768px) {
        display: none;
    }
`;
 
function Header2() {
 
    const [isOpen, setIsOpen] = useState(false)
    const history = useNavigate()
    const dispatch = useDispatch()
    const path = useLocation().pathname
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState('')
 
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogged, setIsLogged] = useState(false);
    const [showRegisterCarModal, setShowRegisterCarModal] = useState(false);
    const [showToggleModeModal, setShowToggleModeModal] = useState(false);
    const [headerOpen, setHeaderOpen] = useState(true);
    const { isDriver, toggleDriverMode } = useDriver();
    const [hasCarRegistered, setHasCarRegistered] = useState(false);
    const [photoUrl, setPhotoUrl] = useState('');
 
    const verifyCarRegistration = async () => {
      const token = localStorage.getItem('token');
      try {
          const url = `${import.meta.env.VITE_API_URL}/cars/me`;
 
          const response = await fetch(url, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          });
 
          const data = await response.json();
          if (data && Object.keys(data).length > 0) {
              setHasCarRegistered(true);
              return true;
          } else {
              setShowRegisterCarModal(true);
              setHasCarRegistered(false);
              return false;
          }
 
      } catch (error) {
          console.error('Error al verificar el registro del carro:', error);
          return false;
      }
  };
 
  const verifyIsDriver = async () => {
      const token = localStorage.getItem('token');
      try {
         const url = `${import.meta.env.VITE_API_URL}/cars/me`;
          const response = await fetch(url , {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          });
 
          if (!response.ok) {
              setShowRegisterCarModal(true);
              return true;
          }
          else{
              setShowRegisterCarModal(false);
              return false;
          }
 
      } catch (error) {
          console.error('Error al verificar el registro del carro:', error);
          return false;
      }
  };
 
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = `${import.meta.env.VITE_API_URL}/users/me`
      
      const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
 
        if (!response.ok) throw new Error('Error al obtener los datos del perfil');
        
        let data = await response.json();
        dispatch(setUserLogin({
            name: data.name,
            id: data.universityID,
            token: token,
            photo: data.photoURL,            
        }));
        console.log(data.photoURL)
        if (data.photoURL === undefined) {
            setPhotoUrl(userPhoto);
        }else{
            setPhotoUrl(data.photoURL);
        }
        setUserName(data.name);
 
      } catch (error) {
        console.error('Error:', error);
      }
    };
  const handleToggleDriverMode = async () => {
      if (!isDriver) {
          const hasCar = await verifyIsDriver();
          console.log(hasCar)
          if(!hasCar){
            toggleDriverMode();
          }
        
      }else{
          toggleDriverMode();
      }
  };
 
  const confirmToggleDriverMode = async() => {
      setShowToggleModeModal(true);
  };
 
  useEffect(() => {
      const token = localStorage.getItem('token');
      setIsLogged(!!token);
      if (!token) {
          navigate('/');
      }
  }, []);
 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      fetchProfileData();
    }
  }, [path]);
 
  useEffect(() => {
      verifyCarRegistration();
  }, []);
 
  useEffect(() => {
      if (isDriver) {
          if (path === '/reserved-trips') navigate('/created-trips');
      } else {
          if (path === '/create-trip'){
              navigate('/reserved-trips');
          }
          if (path === '/created-trips') {
              navigate('/home');
          }
      }
  }, [isDriver, path]);
 
  useEffect(() => {
      const token = localStorage.getItem('token');
      console.log('Path:', path);
      setHeaderOpen(false);
      if (path === '/register-car') {
        console.log('Register Car');
        setIsLogged(false);
      }else if (token){
          setIsLogged(true);
      } else {
          setIsLogged(false);
      }
      console.log('Header Open:', isLogged);
  }, [path]);
 
  
 
 
  return (
    <>
    {isLogged &&
      <NavbarContainer>
        <NavbarMenu isOpen={headerOpen} style={{position:"relative"}}>
              <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: '100%', position:'relative'}}>
                <div>
                <ToggleButton
                    isOpen={headerOpen}
                    onClick={() => setHeaderOpen(!headerOpen)}
                >
                    <FontAwesomeIcon icon={headerOpen ? faChevronLeft : faChevronRight} />
                </ToggleButton>      
                  <CenterContainer>
                    {headerOpen ? (<Logo src={logo} alt="Logo" isOpen={headerOpen} />):(<Logo src={logoS} alt="Logo" isOpen={headerOpen} />)}
                          <StyledWrapper>
                              <label className="switch" aria-label="Toggle Passenger/Driver">
                                  <input
                                      type="checkbox"
                                      checked={isDriver}
                                      onChange={confirmToggleDriverMode}
                                  />
                                  <span>
                                      <AiOutlineUser />
                                  </span>
                                  <span>
                                      <AiOutlineCar />
                                  </span>
                              </label>
                          </StyledWrapper>
                  </CenterContainer>
                  <NavbarOptions isOpen={headerOpen} >
                    {!headerOpen ? (
                    <>
                    <NavbarList>
                      <NavbarItem onClick={() => history('/home')}>
                      <Icon icon={faHome} isDriver={isDriver} active={path === '/home'} />
                      </NavbarItem>
                      
                      <NavbarItem onClick={() => history(isDriver ? '/created-trips' : '/reserved-trips')}>
                      <Icon
                          icon={faMap}
                          isDriver={isDriver}
                          active={path === (isDriver ? '/created-trips' : '/reserved-trips')}
                      />
                      </NavbarItem>
                      <NavbarItem onClick={() =>history (isDriver ? '/trips-progress-driver' : '/trips-progress')}>
                      <Icon
                                icon={faRoad}
                                isDriver={isDriver}
                                active={path === (isDriver ? '/trips-progress-driver' : '/trips-progress')}
                            />
                      </NavbarItem>
                      <NavbarItem1 onClick={() =>history ('/pagina-principal')}>
                      <Icon
                                icon={faUser}
                                isDriver={isDriver}
                                active={path === ('/pagina-principal')}
                            />
                      </NavbarItem1>
                      </NavbarList>
                    </>
                    ):(
                    <>
                    <NavbarListComplete>
                      <NavbarItemComplete onClick={() => history('/home')}>
                        <Icon icon={faHome} isDriver={isDriver} active={path === '/home'} />
                        <NavbarItemText active={headerOpen}>Inicio</NavbarItemText>
                      </NavbarItemComplete>
                      <NavbarItemComplete onClick={() => history(isDriver ? '/created-trips' : '/reserved-trips')}>
                      <Icon
                          icon={faMap}
                          isDriver={isDriver}
                          active={path === (isDriver ? '/created-trips' : '/reserved-trips')}
                      />
                        <NavbarItemText active={headerOpen}>{isDriver ? 'Viajes Creados' : 'Viajes Reservados'}</NavbarItemText>
                      </NavbarItemComplete>
                      <NavbarItemComplete onClick={() => history('/trips-progress-driver')}>
                      <Icon
                                icon={faRoad}
                                isDriver={isDriver}
                                active={path === (isDriver ? '/trips-progress-driver' : '/trips-progress')}
                                
                            />                  
                        <NavbarItemText active={headerOpen}>Viajes en curso</NavbarItemText>
                      </NavbarItemComplete>
                    </NavbarListComplete>
                    </>)}
                  </NavbarOptions>
                  </div>
                  <User open={headerOpen} onClick={() => history('/pagina-principal')}>
                    <UserPhoto>
                      <img src={photoUrl} alt="logo"/>
                      {headerOpen &&
                      <UserInfo>
                      <UserName>{userName}</UserName>
                    </UserInfo>
                      }
                    </UserPhoto>
                  </User>            
              </div>
              <StyledWrapper1>
                    <label className="switch" aria-label="Toggle Passenger/Driver">
                        <input
                            type="checkbox"
                            checked={isDriver}
                            onChange={confirmToggleDriverMode}
                        />
                        <span>
                            <AiOutlineUser />
                        </span>
                        <span>
                            <AiOutlineCar />
                        </span>
                    </label>
                </StyledWrapper1>
          </NavbarMenu>
          {showRegisterCarModal && (
                    <FeedbackModal
                        type="question"
                        message="No tienes un carro registrado."
                        details="Para cambiar a modo conductor, primero debes registrar un carro."
                        onClose={() => setShowRegisterCarModal(false)}
                        onConfirm={() => {
                            setShowRegisterCarModal(false);
                            navigate('/registrar-carro');
                        }}
                    />
                )}
 
                {showToggleModeModal && (
                    <FeedbackModal
                        type="question"
                        message={`¿Estás seguro de cambiar a modo ${isDriver ? 'Pasajero' : 'Conductor'}?`}
                        details={`Este cambio afectará la forma en que usas la aplicación.`}
                        onClose={() => setShowToggleModeModal(false)}
                        onConfirm={() => {
                            setShowToggleModeModal(false);
                            handleToggleDriverMode();
                            navigate('/home')
                        }}
                    />
                )}
        </NavbarContainer>
    }
    </>
  )
}
 
export default Header2