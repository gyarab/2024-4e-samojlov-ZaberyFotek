import styled from "styled-components";

export const HomeContainer = styled.div`
    display: flex;
    background: var(--color-blue-1);
    height: 100vh; 
    width: 100%;
    overflow: scroll;
    z-index: -1;
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
    font-size: 6vw;
    align-items: center;
    gap: 20px;

    @media screen and (max-width: 768px) {
        display: grid;
        font-size: 4em;
    }
`;

export const Descript = styled.p`
    font-size: 24px;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    color: var(--color-shadow-7);
    margin-top: 10px;
`;


