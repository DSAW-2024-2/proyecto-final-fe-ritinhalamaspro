import React, { useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';



function Header() {

    const navigate = useNavigate()
    const location= useLocation()
    const path = location.pathname
    const [isLogged,setIsLogged]= useState(false)
    const [collapse, setCollapse] = useState(true)

    useEffect(() => {
        // Verificar si el usuario ya está autenticado
        const token = localStorage.getItem('token');
        console.log(token)
        if (!token) {
            navigate('/');
        }else{
            navigate('/home')
        }
        }
    , []);

    useEffect (() => {
        const token = localStorage.getItem('token');
        console.log(path)
        if (!token) {
            setIsLogged(false)
        }else{
            setIsLogged(true)
        }
    },[path])

  return (
    <>
     {isLogged &&
        <Sidebar collapsed={collapse}>
            <div onClick={() => setCollapse(!collapse)}>abrir</div>
            <Menu>
            <MenuItem component={<Link to="/pagina-principal" />} icon={<FontAwesomeIcon icon={faEyeSlash} /> }> Pie charts </MenuItem>
            <MenuItem> Line charts </MenuItem>
            <MenuItem> Documentation </MenuItem>
            <MenuItem> Calendar </MenuItem>
            </Menu>
        </Sidebar>
     }
    </>
    
  )
}

export default Header
