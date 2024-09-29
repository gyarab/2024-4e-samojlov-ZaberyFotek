import styled from "styled-components";

export const ClipContainer = styled.div`
    display: flex;
    height: calc(100vh * 0.5);
    width: calc(100vw * 0.75);
    margin-left: 25px;
    padding-top: 15px;
`;

export const VideoTools = styled.div`
    background: linear-gradient(to right, var(--color-blue-2), var(--color-blue-8));
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    color: var(--color-shadow-2);
    
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 150px;
        text-align: center;
        font-weight: 600;
        padding: 15px;
        background: var(--color-shadow-8);
        border-radius: 16px;
        box-shadow: 0 4px 10px var(--color-shadow-2);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.46);
        cursor: pointer;
    }
`;

export const VideoPreview = styled.div`
    background: black;
    flex: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--color-shadow-2);
    
    canvas {
        width: 100%;
        height: 100%;
    }
`;

export const TimelineContainer = styled.div`
    display: grid;
    padding: 20px;
    background: var(--color-shadow-1);
    border-radius: 15px;
    margin: 25px 0 15px 25px;
    width: calc(100vw * 0.75);
`;