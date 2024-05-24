import styled from "styled-components";
import {FaPlus} from "react-icons/fa";

export const HomeContainer = styled.div`
    display: grid;
    background: linear-gradient(217deg, var(--color-blue-6), var(--color-blue-2) 70.71%),
    linear-gradient(127deg, var(--color-blue-1), var(--color-blue-8) 70.71%),
    linear-gradient(336deg, var(--color-blue-7), var(--color-blue-1) 70.71%);
    height: 100%; 
    width: 100%;
    z-index: -1;
    justify-items: center;
`;

export const TextElements = styled.div`
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 75px;
`;

export const HeadingContainer = styled.h1`
    display: flex;
    color: var(--color-shadow-9);
    text-align: center;
    justify-content: center;
    font-size: 6em;
    align-items: center;
    margin-top: 20px;
    gap: 20px;

    @media screen and (max-width: 768px) {
        display: grid;
        font-size: 4em;
    }

    @media screen and (max-width: 300px) {
        display: grid;
        font-size: 2.5em;
    }
`;

export const HeadDescription = styled.p`
    font-size: 1.5em;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    color: var(--color-shadow-7);
    margin-top: 10px;
`;

export const ImageArea = styled.div`
    display: flex;
    align-items: center;
    height: calc(100vw * 1 / 3);
    width: calc(100vw * 1 / 3);
    background-color: #fff;
    background-image: linear-gradient(45deg, var(--color-shadow-1) 25%, transparent 25%, transparent 75%, var(--color-shadow-1) 75%), linear-gradient(45deg, var(--color-shadow-1) 25%, transparent 25%, transparent 75%, var(--color-shadow-1) 75%);
    background-size: 40px 40px;
    background-position: 0 0, 20px 20px;
    border-radius:15px;
    margin-top: 15px;
    justify-content: center;
    box-shadow: 0 8px 32px 0 rgba( 0, 0, 0, 0.18 );
`;

export const TextArea = styled.div`
    display: grid;
    justify-items: center;
`;


export const PlusIcon = styled(FaPlus)`
    border-radius: 50%;
    color: white;
    margin-right: 15px;
    background: var(--color-blue-7);
    transform: scale(1.25);
`;

export const UploadBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    transform: perspective(1px) translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    position: relative;
    transition-property: color;
    transition-duration: 0.3s;
    color: white;
    background: var(--color-blue-8);
    padding: 15px;
    border-radius: 0.5rem;
    font-size: 1.25rem;
    letter-spacing: 0.05rem;
    width: 75%;

    &::before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--color-blue-6);
        transform: scaleX(0);
        transform-origin: 0 50%;
        transition-property: transform;
        transition-duration: 0.3s;
        transition-timing-function: ease-out;
        border-radius: 0.5rem;
    }

    &:hover {
        color: white;
    }

    &:hover::before {
        transform: scaleX(1);
    }
    
`;

export const TextElement = styled.text`
    color: black;
    font-weight: 700;
    font-size: 1.5rem;
    text-align: center;
    margin-top: 25px;
`;


