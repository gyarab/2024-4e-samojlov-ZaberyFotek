import styled from "styled-components";

export const ClipContainer = styled.div`
    display: flex;
    width: calc(100vw * 0.75);
    height: 575px;
    margin-bottom: 175px;
    padding: 20px;
`;

export const VideoTools = styled.div`
    background: yellow;
    flex: 1;
`;

export const VideoPreview = styled.div`
    background: black;
    flex: 3;
`;

export const TimelineContainer = styled.div`
    display: grid;
    align-items: center;
    padding: 20px;
    background: var(--color-shadow-1);
    border-radius: 15px;
    position: fixed;
    bottom: 0;
    margin-bottom: 15px;
    margin-left: 25px;
`;