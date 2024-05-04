import styled from "styled-components";
import {FaTimes} from "react-icons/fa";
import {Link as LinkR} from "react-router-dom";
import {Link as LinkS} from "react-scroll";

export const SidebarContainer = styled.aside`
    position: fixed;
    z-index: 999;
    height: 100%;
    width: 100%;
    background: black;
    display: grid;
    align-items: center;
    left: 0;
    transition: 0.3s ease-in-out;
    opacity: ${({isOpen}) => (isOpen ? '100%' : '0')};
    top: ${({isOpen}) => (isOpen ? '0' : '-100%')};`
;

export const CloseIcon = styled(FaTimes)`
    color: white;`
;

export const Icon = styled.div`
    position: absolute;
    top: 1.2rem;
    right: 1.5rem;
    background: transparent;
    font-size: 2rem;
    cursor: pointer;`
;

export const SidebarWrapper = styled.div`
    color: white;`
;

export const SidebarMenu = styled.ul`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 80px);
    text-align: center;

    @media screen and (max-width: 480px) {
        grid-template-rows: repeat(6, 60px);
    }`
;

export const SidebarLink = styled(LinkS)`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    transition: 0.2s ease-in-out;
    text-decoration: none;
    list-style: none;
    color: white;
    cursor: pointer;

    &:hover {
        color: brown;
        transition: 0.2s ease-in-out;
    }`
;

export const SidebarBtn = styled.div`
    display: flex;
    justify-content: center;`
;

export const SidebarBtnLink = styled(LinkR)`
    border-radius: 50px;
    background: #01bf71;
    white-space: nowrap;
    padding: 16px 64px;
    color: #010606;
    font-size: 16px;
    outline: none;
    border: none;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        color: yellow;
        background: blue;
    }`
;
