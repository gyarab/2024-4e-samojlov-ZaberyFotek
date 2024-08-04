import styled from "styled-components";
import React from "react";


export const ZaberyPage = styled.div`
    display: flex;  
    height: 100vh;  
    overflow: hidden;
    padding-top: 80px;
    align-items: center;
`;


export const ZaberySidebarContainer = styled.nav`
    height: 75vh;
    width: 250px;
    margin-left: 50px;
    flex-direction: column;
    background: var(--color-shadow-9);
    position: fixed;
    display: flex;
    border-radius: 25px;

    // 520px
    @media screen and (max-width: 768px) {
        height: 100px;
        width: 100%;
        flex-direction: row;
        bottom: 0;
    }
`;


export const ZaberySidebarItem = styled.div`
    padding: 15px;
    border-radius: 25px;
    color: ${({isClicked}) => (isClicked ? '#00cc66' : 'white')};
    background: ${({isClicked}) => (isClicked ? 'var(--color-shadow-8)' : 'transparent')};;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: left;
    text-decoration: none;
    width: 100%;
    cursor: pointer;
    opacity: ${({isClicked}) => (isClicked ? '1' : '0.5')};
    transition: opacity 0.25s ease-in-out;
    box-sizing: border-box;
    gap: 10px;
    margin: 1px;
    text-align: left;

    &:hover {
        opacity: 1;
        background: var(--color-shadow-8);
    }
`;


export const Foto = styled.div`
    position: relative;
    flex: 1;  
    height: 100%;
    // 250px + margin-left 50px Container
    margin-left: 300px;  
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 1250px;

    canvas {
        //max-width: 75%;  
        //max-height: 75%; 
        //width: calc(100vw * 0.75);
        //height: calc(100vw * 0.75);
        object-fit: contain;  
    }

    // 520px
    @media screen and (max-width: 768px) {
        margin-left: 0;
    }
`;

export const PiecesContainer = styled.div`
    color: white;
    font-size: 16px;
    font-weight: 500;
    padding: 15px;
    text-align: left;
`;

export const AddBtn = styled.button`
    cursor: pointer;
    width: 34px;
    height: 34px;
    margin-right: 2px;
    border-radius: 50px;
    opacity: 0.5;
    transition: opacity 0.25s ease-in-out;
    
    &:hover {
        opacity: 1;
    }
`;

export const ShowNum = styled.div`
    width: 68px;
    height: 34px;
    border-radius: 50px;
    color: white;
    background: var(--color-blue-4);
    text-align: center;
    font-size: 20px;
    margin-right: 15px;
`;

export const PieceImages = styled.div`
    display: grid;
    margin-left: 50px;
    gap: 50px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-template-rows: repeat(auto-fit, minmax(200px, 1fr));
    box-sizing: border-box;
    max-width: 100%;
    width: 100%;
    position: relative;

    img {
        object-fit: contain;
        width: 100%;
        height: 100%;
        max-width: 250px;
        max-height: 250px;
        padding: 25px;
        background: linear-gradient(45deg, var(--color-shadow-8), 1) 0, var(--color-shadow-4) 100%;
        box-shadow: 0 5px 20px var(--color-shadow-4, 0.3);
        border-radius: 10px;
        cursor: pointer;
    }

    @media screen and (max-width: 768px) {
        margin-left: 0;
        justify-items: center;
        align-items: center;
    }
`;
