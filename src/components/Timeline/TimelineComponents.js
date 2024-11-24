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
    justify-content: ${({isFlexStart}) => (isFlexStart ? 'flex-start' : 'space-evenly')};
    align-items: center;
    color: var(--color-shadow-2);
`;

export const VideoPreview = styled.div`
    background: black;
    flex: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--color-shadow-2);

    canvas {
        background: white;
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

export const ClipTool = styled.div`
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
    box-shadow: 0 2px 5px var(--color-shadow-2);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.46);
    cursor: pointer;
    transition: all 1s ease-in-out;
    flex-direction: column;

    ${({isActive}) =>
            isActive &&
            `
    /* Posunutí prvku na vrchol souřadnicové osy Y */
    order: -1; 
    background: var(--color-shadow-7);
    margin-top: 25px;
    width: 75%;
    display: flex;
    justify-content: space-between;
  `}

    ${({fadeOut}) =>
            fadeOut &&
            `
    opacity: 0;
    transition: opacity 1s ease-out;
    display: none;
  `}
`;

export const CanvasContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    width: 75%;
    transition: background-color 0.3s ease-in-out;
    border-radius: 25px;
    padding: 2px 10px 2px 10px;
    background: ${({ isClicked }) => (isClicked ? '#00cc66' : 'var(--color-shadow-7)')};;
    
    &:hover {
        background: var(--color-shadow-6);
    }
`;

export const DownloadBtn = styled.button`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: white;
    gap: 5px;
    background: linear-gradient(to right, #9e1a1f , var(--color-blue-7));
    border-radius: 25px;
    padding: 5px 10px 5px 10px;
    transition: background 0.5s ease-in, opacity 0.5s ease-out;
    
    &:hover {
        background: linear-gradient(to left, #9e1a1f , var(--color-blue-7));
        opacity: 0.8;
    }
`;