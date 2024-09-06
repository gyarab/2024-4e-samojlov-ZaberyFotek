import React, {useEffect, useState} from 'react';
import {IoPause, IoPlay, IoPlayBack, IoPlayForward} from "react-icons/io5";
import TimelinePieces from "./TimelinePieces";
import {ClipContainer, TimelineContainer, VideoPreview, VideoTools} from "./TimelineComponents";

/** Prvek časové osy **/
function Timeline({canvasRef, selectedPieces, handlePieces, barWidth}) {

    // Smazání původní plochy
    canvasRef.current.style.display = 'none';

    // Aktuální čas na Timeline
    const [currentTime, setCurrentTime] = useState(0);

    // Nastavení přehrávání
    const [isPlaying, setIsPlaying] = useState(false);

    // Celková délka videa
    const videoLength = 60;

    // Kontrola, zda tah je v pohybu
    const [isDragging, setIsDragging] = useState(false);

    // Akutální pozice časomíry
    const [barPosition, setBarPosition] = useState(0);

    /** Spuštění času **/
    const handlePlay = () => {

        setIsPlaying(true);
    }

    /** Průběžné přidávání času **/
    useEffect(() => {

        let intervalId = null;

        console.log(currentTime, "s")

        if (isPlaying && !isDragging) {

            // Nastavení času a pozice časomíry
            intervalId = setInterval(() => {

                setCurrentTime(prevTime => {

                    if (prevTime + 0.15 >= videoLength) {

                        clearInterval(intervalId);
                        setIsPlaying(false);

                        return videoLength;
                    }

                    return prevTime + 0.15;
                });

                setBarPosition(prevPosition => prevPosition + 0.25);

            }, 100);

        }

        return () => {

            if (intervalId) {
                clearInterval(intervalId);
            }

        };

    }, [isPlaying, isDragging]);

    /** Zastavení času **/
    const handlePause = () => setIsPlaying(false);

    /** Posunutí času na začátek klipu **/
    const handleBack = () => {

        setCurrentTime(0);

        setBarPosition(0);
    };

    /** Posunutí času na konec klipu **/
    const handleForward = (e) => {

        setCurrentTime(videoLength);

        setBarPosition(100);
    };

    /** Funkce pro pohyby - DragMove a Click **/
    const handleFunction = (event) => {

        // Časová osa
        const bar = event.currentTarget;

        console.log("bar", bar.offsetWidth);

        const mouseX = event.clientX - bar.getBoundingClientRect().left;

        // Výpočet nového času
        const newTime = (mouseX / bar.offsetWidth) * videoLength;

        const newPosition = (mouseX / bar.offsetWidth) * 100;

        if (newTime >= 0 && newTime <= videoLength) {

            setCurrentTime(newTime);
            setBarPosition(newPosition);

            console.log("position", barPosition)
        }

    }

    /** Přenastavení času dle kliknutí uživatele **/
    const handleClick = (event) => {

        handleFunction(event);
    };

    /** Začátek tahu **/
    const handleMouseDown = () => setIsDragging(true);

    /** Ukončení tahu **/
    const handleMouseUp = () => {

        setIsDragging(false);
    }

    /** Tah je v pohybu **/
    const handleMouseMove = (event) => {

        if (isDragging) {

            handleFunction(event);
        }
    };

    const playStyling = {
        fontSize: "35px",
        borderRadius: "50%",
        background: "var(--color-shadow-3)",
        padding: "8px"
    };

    const controlStyling = {
        fontSize: "30px",
        borderRadius: "50%",
        background: "var(--color-shadow-3)",
        padding: "7px"
    };

    const divStyles = {
        display: "flex",
        gap: "5px",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "10px",
        userSelect: "none"
    };

    // Body na časové ose
    const checkPoints = [];

    // Vzdálenost mezi body
    const spacingPoints = 2;

    // Výpočet měřítka
    const pixelsPerSecond = barWidth / videoLength;

    for (let i = 0; i <= videoLength; i += spacingPoints) {

        checkPoints.push(i);
    }

    return (
        <div style={{display: "grid"}}>

            <ClipContainer>

                <VideoTools />

                <VideoPreview />

            </ClipContainer>

            <TimelineContainer>

                <div style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                    alignItems: "center",
                    justifyContent: "center"
                }}>

                    <div style={divStyles}>

                        <button onClick={handleBack}>

                            <IoPlayBack style={controlStyling}/>

                        </button>

                        <button onClick={isPlaying ? handlePause : handlePlay}>

                            {isPlaying ? <IoPause style={playStyling}/> : <IoPlay style={playStyling}/>}

                        </button>

                        <button onClick={handleForward}>

                            <IoPlayForward style={controlStyling}/>

                        </button>

                    </div>

                    <div style={divStyles}>

                        <div>{formatTime(currentTime)}</div>

                        <div>/</div>

                        <div>{formatTime(videoLength)}</div>

                    </div>

                </div>

                <div style={{display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"}}>

                    <div
                        style={{
                            width: `${barWidth}px`,
                            height: "100px",
                            backgroundColor: "lightgray",
                            position: "relative",
                            cursor: "pointer",
                            borderRadius: "5px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-end",
                            gap: "5px"
                        }}
                        onClick={handleClick}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >

                        {selectedPieces.map((piece) => (
                            <TimelinePieces
                                key={piece.id}
                                piece={piece}
                                pieceLeft={piece.left}
                                piecesArray={selectedPieces}
                                onPieceUpdate={handlePieces}
                                barWidth={barWidth}
                            />
                        ))}


                        {/** Procházení mapy s indexem **/}
                        {checkPoints.map((time, index) => (

                            <div
                                style={{
                                    position: "absolute",
                                    top: "0",
                                    left: `${time * pixelsPerSecond}px`,
                                    width: "1px",
                                    height: "10%",
                                    backgroundColor: index % spacingPoints === 0 ? "black" : "gray",
                                }}
                            >
                                {index % spacingPoints === 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "12px",
                                            left: "-10px",
                                            fontSize: "10px",
                                            color: "black",
                                            userSelect: "none"
                                        }}
                                    >
                                {time}s
                                </span>
                                )}
                            </div>
                        ))}

                        <div
                            style={{
                                position: 'absolute',
                                top: '-2.5px',
                                left: `${barPosition}%`,
                                width: '2.5px',
                                height: '100%',
                                backgroundColor: 'blue',
                                transform: 'translateX(-50%)',
                                cursor: 'pointer',
                                borderRadius: '2px'
                            }}
                            onMouseDown={handleMouseDown}
                        />

                    </div>
                </div>
            </TimelineContainer>
        </div>
    )
};

/** Funkce pro přeformátování času **/
const formatTime = (seconds) => {

    const ms = (seconds % 1).toFixed(1).substring(1);

    const s = Math.floor(seconds % 60);

    const formattedSeconds = s.toString().padStart(2, '0');

    const min = Math.floor(seconds / 60);

    const formattedMinutes = min.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}${ms}`;
};

export default Timeline;