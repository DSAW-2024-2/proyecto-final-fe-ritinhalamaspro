import styled from "styled-components";
import {Link} from 'react-router-dom'
import colors from '../../assets/Colors';

const Nav = styled.div `
  padding: 0 6vh 0 2vw; 
  display: flex;
  min-height: 12vh;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  background: ${({ color }) => color};
  position: relative;
  top: 0;
  left: 0;
  right: 0;
`

const Left = styled.div`
    display: flex;
    padding: 1em;
    align-items: center;
    width: 30%;
`

const Logo = styled.img `

    cursor: pointer;
    width: 50%;
    @media (max-width: 800px) {
        width: 100%;
    }
`

const NavMenu = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    @media (max-width: 500px) {
        overflow: hidden;
        flex-direction: column;
        max-height: ${({ isOpen }) => (isOpen ? "400px" : "0")};
        transition: max-height 0.3s ease-in;
        width: 100%;
    }
`

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  span {
    height: 2px;
    width: 25px;
    background: black;
    margin-bottom: 4px;
    border-radius: 5px;
  }
  @media (max-width: 500px) {
    display: flex;
  }
`

const MenuLink = styled(Link) `
    padding: 1rem 2rem;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: all 0.3s ease-in;
    font-size: 1.4rem;
    color: white;
    font-weight: bold;
    span{
        position: relative; 
        &:after{
            content:"";
            height: 2px;
            background: black;
            position: absolute;
            left: 0;
            right: 0;
            bottom: -6px;
            opacity: 0;
            transform-origin: left center;
            transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
            transform: scaleX(0);
        }
    }
    &:hover {
        span:after {
            transform: scaleX(1);
            opacity: 1;
        }
  }
`

export const NavbarContainer = styled.div`
    background-color: ${colors.background};
    width: 6em;
`

export const NavbarMenu = styled.nav`
    background-color: ${colors.background};
    color: white;
    transition: all 0.5s ease;
    border-right: solid 1px #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100vh;
    width: ${({ isOpen }) => (isOpen ? "18em" : "6em")};
    z-index: 10;
    position: ${({ isOpen }) => (isOpen ? "absolute" : "relative")};
    @media (max-width: 768px) {
        width: 100vw;
        height: 10vh;
        border-top: 1px solid #ffffff;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }
`;

export const Burger = styled.div`
    margin-top: 1em;
    display: flex;
    justify-content: center;

    @media (max-width: 768px) {
        display: none;
    }
`;

export const User = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 0.5em;
    height: 5em;
    width: ${({ open }) => (open ? "100%" : "100%")};
    transition: all 0.5s ease;
    justify-content: center;
    align-items: center; 
`;

export const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    transition: all 0.5s ease;
`;

export const UserName = styled.div`
    font-size: 1.2em;
    font-weight: 500;
    color: white;
    transition: all 0.5s ease;
`;

export const UserRole = styled.div`
    font-size: 1em;
    font-weight: 300;
    color: white;
    transition: all 0.5s ease;
`;

export const UserPhoto = styled.div`
    
    display: flex;
    width: 80%;
    height: 100%;
    justify-content: center;
    align-items: center;
    gap: 1em;
    transition: all 0.5s ease;

    img {
    width: 3.5em;
    height: 3.5em;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
    transition: all 0.5s ease;
    }
`;
export const RowContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 20%;
    cursor: pointer;
  `
export const BurgerImage = styled.img`
    width: ${({ isOpen }) => (isOpen ? "95%" : "4em")};
    height: 5em;
    cursor: pointer;

    @media (max-width: 1300px) {
        width: ${({ isOpen }) => (isOpen ? "90%" : "4em")};
    }
`;

export const NavbarList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2em;
    align-items: center;
    justify-content: center;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: row;
        gap: 1em;
        width: 100vw;
        justify-content: space-around;
    }
`;

export const NavbarListComplete = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2em;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    margin-top: 1em;

    @media (max-width: 768px) {
        flex-direction: row;
        gap: 1em;
        width: 100vw;
        justify-content: space-around;
    }
`;

export const NavbarListTitle = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
    color: white;
    transition: all 0.5s ease;
    margin-top: 1em;
`;   
export const NavbarOptions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: ${({ isOpen }) => (isOpen ? "2em" : "4em")};

    @media (max-width: 1300px) {
        margin-top: ${({ isOpen }) => (isOpen ? "3em" : "5em")};
    }

    @media (max-width: 768px) {
        margin-top: 1em
    }
`

export const NavbarItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 3em;
    height: 3em;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        transform: scale(1.1);
    }

    img {
        width: 80%;
    }
  `
export const LogOutItem = styled(NavbarItem)`
    flex-direction: row;
    color: white;
    transition: 0.3s;
    gap: 5px;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: black;
    width: 100%;
    border-radius: 0px 0px 20px 20px;

    &:hover{
        transform: scale(1);
        color: #ff3b3b;
    }
`

export const NavbarItemComplete = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 2em;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }

    img {
        width: 30%;
        height: 100%;
    }
  `

export const NavbarItemText = styled.div`
    font-size: 1.2em;
    font-weight: 500;
    color: white;
    opacity: ${({ active }) => (active ? "1" : "0")};
    transition: opacity 0.5s ease-in-out;
    margin-left: 1em;
`;

export const Separator = styled.div`
    width: 80%;
    height: 3px;
    background-color: black;
`;

export const UserNav = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-bottom: 1em;

    @media (max-width: 768px) {
        display: none;
    }

`;

export const UserMobile = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;

    @media (max-width: 768px) {
        display: none;
    }

`;

export const NavbarListImg = styled.img`
    width: 55%;
    height: 55%;
    cursor: pointer;

    @media (max-width: 768px) {
        width: 50%;
        height: 50%;
    }
`;

export const NavbarListItem = styled.div`
   font-size: 1em;
   font-weight: 500;
   text-align: center;

    @media (max-width: 768px) {
        display: none;
    }
`;

export const NavbarListItemBox = styled.div`
    display: flex;
    flex-direction: column;
    height: 5em;
    width: 5em;
    border-radius: 1em;
    background-color: ${colors.primary};
    align-items: center;
    justify-content: center;


    &:first-child {
        margin-top: 3em;
    }

    &:hover {
        background-color: ${colors.primary};
        cursor: pointer;
    }

    @media (max-width: 768px) {
        height: 3em;
        width: 3em;

        &:first-child {
            margin-top: 0;
        }
    }
`;

export const NavbarListItemBoxUser = styled.div`
    display: flex;
    flex-direction: column;
    height: 5em;
    width: 5em;
    border-radius: 1em;
    background-color: ${colors.primary};
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: ${colors.primary};
        cursor: pointer;
    }

    @media (max-width: 768px) {
        display: flex;
    }
`;

export { Nav, Left, Logo, NavMenu, Hamburger, MenuLink }