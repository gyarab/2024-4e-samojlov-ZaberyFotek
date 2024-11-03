import React, {useEffect, useRef, useState} from 'react';
import {IoPause, IoPlay, IoPlayBack, IoPlayForward} from "react-icons/io5";
import TimelinePieces from "./TimelinePieces";
import {
    CanvasContent,
    ClipContainer,
    ClipTool,
    TimelineContainer,
    VideoPreview,
    VideoTools
} from "./TimelineComponents";
import {TimelineWidth} from "./TimelineWidth";
import {RiUploadCloud2Line} from "react-icons/ri";
import {VscScreenFull} from "react-icons/vsc";
import {LuLayoutGrid, LuMusic4, LuRectangleHorizontal, LuRectangleVertical, LuSquare} from "react-icons/lu";
import {RxText} from "react-icons/rx";
import {TbTransitionRight} from "react-icons/tb";
import {MdAnimation} from "react-icons/md";
import {GoArrowLeft} from "react-icons/go";
import {ArrowBtn} from "../../pages/Zabery/ZaberyComponents";
import {CgScreenWide} from "react-icons/cg";

/** Prvek časové osy **/
function Timeline({canvasRef, selectedPieces, handlePieces, handlePieceClick}) {

    let {timelineRef, barWidth} = TimelineWidth();

    barWidth -= 75;

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

    const [pieceIsClicked, setPieceClicked] = useState(false);

    // Inicializace plochy pro vytváření klipu
    const videoRef = useRef(null);

    // Aktivní poměr plochy
    const [activeRatio, setActiveRatio] = useState(() => {
        return localStorage.getItem('activeRatio') || '1:1';
    });

    // Ukládání výběru uživatele po kliknutí
    const [canvasSelector, setCanvasSelector] = useState(() => {

        return parseInt(localStorage.getItem('canvasSelector'));
    });

    // Výpočet pozice X obrázku
    const [coordinateX, setCoordinateX] = useState(0);

    // Výpočet pozice Y obrázku
    const [coordinateY, setCoordinateY] = useState(0);

    /** Zobrazení fotek do videa **/
    useEffect(() => {

        // Plocha videa
        const canvas = videoRef.current;

        const ctx = canvas.getContext('2d');

        if (activeRatio) {

            // Uložení aktivního poměru do místního úložiště
            localStorage.setItem('activeRatio', activeRatio.toString());
        }

        // Nastavení velikosti plochy dle poměru
        setRatioCanvas(canvas, canvasSelector, activeRatio);

        if (!videoRef.current || selectedPieces.length === 0) return;

        // Procházení pole částic
        for (let i = 0; i < selectedPieces.length; i++) {

            // Začáteční bod částice
            const startPiece = (selectedPieces[i].left * videoLength) / barWidth;

            // Konečný bod částice
            const endPiece = ((selectedPieces[i].left + selectedPieces[i].width) * videoLength) / barWidth;

            // Proměnná pro zjištění zda další částice je na ploše
            const nextPiece = selectedPieces[i + 1] ? (selectedPieces[i + 1].left * videoLength) / barWidth : null;

            // 3 proměnné, které určují prostor mezi částicemi
            const beforeFirstCheck = currentTime < startPiece;
            const middleCheck = currentTime > endPiece && nextPiece && currentTime < nextPiece;
            const lastEndCheck = currentTime > endPiece && !nextPiece;

            // Aktuálně zvolená částice
            const currentPiece = selectedPieces[i];

            const img = new Image();

            // Obsah obrázku
            img.src = currentPiece.src;

            // Kontrola, zda je aktuální čas v rámci částice
            const pieceTimeContional = currentTime >= startPiece && currentTime <= endPiece;

            // Čas od začátku klipu
            const startClip = currentTime - startPiece;

            // Délka klipu
            const duration = endPiece - startPiece;

            // Velikost kamery
            const cameraWidth = canvas.width / 1.5// * Math.max(currentPiece.width / canvas.width, currentPiece.width / canvas.height);
            const cameraHeight = canvas.height / 2

            const speedX = (canvas.width - currentPiece.width) / duration;
            const speedY = (canvas.height - img.height) / duration;

            // Výpočet pozice kamery
            let positionX = startPiece + (speedX * startClip);
            let positionY = startPiece + (speedY * startClip);

            const arrowPosition = currentPiece.arrowDirection || {x: "+", y: "-"};

            // console.log(currentPiece)

            // Funkce pro určení správného směru pozice na základě směru pohybu
            const arrowSetUp = (arrow, positionClip, maxDimension) => {

                if (arrow === "+") {

                    return positionClip;

                } else if (arrow === "-") {

                    return maxDimension - positionClip;

                } else {

                    return 0.0;
                }
            };

            // Vypočítání pozic kamery na základě směru šipek
            positionX = arrowSetUp(arrowPosition.x, positionX, canvas.width - img.width);
            positionY = arrowSetUp(arrowPosition.y, positionY, canvas.height - img.height);

            // Nastavení vypočítaných pozic pro animaci
            setCoordinateX(positionX);
            setCoordinateY(positionY);

            // Částice obsahující klip
            if (currentPiece.isSubmitted && pieceTimeContional) {

                /** Funkce pro vytvoření klipu **/
                const createClip = () => {

                    // Ukončení klipu
                    if (!isPlaying || currentTime < startPiece || currentTime > endPiece /** || Math.round(startClip) >= Math.round((duration - 3)) **/) {
                        return;
                    }

                    // const progress = currentTime / endPiece;
                    // const imageX = progress * (canvas.width - img.width); // Horizontal movement across the canvas
                    // const imageY = progress * (canvas.height - img.height);
                    //
                    // const bottomEdge = imageY;

                    console.log(coordinateY + " " + canvas.width + " " + img.width + " " + duration);

                    // if (coordinateY <= 0) {
                    //
                    //     return;
                    // }

                    // if (coordinateY < (currentPiece.width / 2) && coordinateX > (currentPiece.width / 2)) {

                    // Vykreslení obrázku s posunem (zleva doprava)
                    ctx.drawImage(
                        img,
                        coordinateX, coordinateY,
                        cameraWidth, cameraHeight,
                        0, 0,
                        canvas.width, canvas.height
                    );
                };

                // Přehrání klipu
                if (isPlaying && pieceTimeContional) {

                    requestAnimationFrame(createClip);
                }

                // Vykreslení aktuálního snímku klipu
                else {

                    ctx.drawImage(
                        img,
                        coordinateX, coordinateY,
                        cameraWidth, cameraHeight,
                        0, 0,
                        canvas.width, canvas.height
                    );
                }

                break;


                // Častice neobsahující klip
            } else if (!currentPiece.isSubmitted && pieceTimeContional) {

                // Vyčistění plochy
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Vykreslení částice
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                setPieceClicked(true);

                handlePieceClick(true);

                break;

                // Částice se nachází v meziprostoru
            } else if (beforeFirstCheck || middleCheck || lastEndCheck) {

                setPieceClicked(false);

                handlePieceClick(false);

                break;
            }
        }

    }, [currentTime, videoRef, selectedPieces, videoLength, barWidth, activeRatio, canvasSelector]);


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

        const mouseX = event.clientX - bar.getBoundingClientRect().left;

        // Výpočet nového času
        const newTime = (mouseX / barWidth) * videoLength;

        const newPosition = (mouseX / barWidth) * 100;

        if (newTime >= 0 && newTime <= videoLength) {

            setCurrentTime(newTime);
            setBarPosition(newPosition);

            console.log("time", currentTime)
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

    const [activeIndex, setActiveIndex] = useState(null);

    /** Nastavení aktuálního indexu částice **/
    const handlePieceUpdate = (id, src, width, left, isSubmitted, arrow, duration, frameRate, scanSpeed, special, arrowDirection) => {

        setActiveIndex(id);

        console.log("SUBMITTED", isSubmitted);

        // Nastavení po stisknutí tlačítka parametru isSubmitted na true
        handlePieces(id, src, width, left, isSubmitted, arrow, duration, frameRate, scanSpeed, special, arrowDirection);
    };

    /** Nástroje určené pro klipy **/

    const [isFlexStart, setIsFlexStart] = useState(false);

    const canvasTypes = [

        {icon: <LuRectangleHorizontal/>, ratio: '4:3', name: 'Na šířku'},
        {icon: <LuRectangleVertical/>, ratio: '4:5', name: 'Portrét'},
        {icon: <LuLayoutGrid/>, ratio: '5:4', name: 'Na šířku (příspěvek)'},
        {icon: <LuRectangleVertical/>, ratio: '2:3', name: 'Vertikální'},
        {icon: <LuSquare/>, ratio: '1:1', name: 'Čtverec'},
        {icon: <LuRectangleHorizontal/>, ratio: '16:9', name: 'Širokoúhlý'},
        {icon: <LuRectangleVertical/>, ratio: '9:16', name: 'Na výšku'},
        {icon: <CgScreenWide/>, ratio: '21:9', name: 'Ultra širokoúhlý'}
    ];

    // useEffect(() => {
    //
    //     const interval = setInterval(() => {
    //
    //         setCanvasSelector(prev => prev === canvasSelector);
    //
    //     }, 1000);
    //
    //     return () => clearInterval(interval);
    //
    // }, [canvasTypes.length]);

    /** Funkce pro úpravu rozměrů plochy **/
    const canvasContent = (type) => {

        const canvas = videoRef.current;

        return type.map((item, index) => (

            <CanvasContent
                key={index}
                isClicked={index === canvasSelector}
                onClick={() => setRatioCanvas(canvas, index, item)}
            >
                {item.icon} {item.ratio}

            </CanvasContent>
        ));
    };

    /** Výpočet poměru **/
    const getRatioValues = (ratio) => {

        const [width, height] = ratio.split(':').map(Number);

        return {x: width, y: height};
    };


    /** Rozměry plochy (Canvas) **/
    const setRatioCanvas = (canvas, index, item) => {

        if (index !== null) {

            // Nastavení aktuálního indexu
            setCanvasSelector(index);

            localStorage.setItem('canvasSelector', index.toString());
        }

        if (item && item.ratio) {

            // Nastavení vybraného poměru plochy uživatelem
            setActiveRatio(item.ratio);

        } else if (!item.ratio && !activeRatio) {

            // Nastavení výchozího poměru plochy
            setActiveRatio('1:1');
        }

        const ratioValues = getRatioValues(activeRatio);

        const parentWidth = canvas.parentElement.clientWidth;
        const parentHeight = canvas.parentElement.clientHeight;

        // Poměr X:Y
        const aspectRatioX = ratioValues.x;
        const aspectRatioY = ratioValues.y;

        // Výpočet poměru
        const aspectRatio = aspectRatioX / aspectRatioY;

        // Na základě výšky určujeme délku šířky
        let newWidth = parentHeight * aspectRatio;
        let newHeight = parentHeight;

        // Přenastavení šířky
        if (newWidth > parentWidth) {

            newWidth = parentWidth;
            newHeight = parentWidth / aspectRatio;
        }

        // Nastavení rozměrů plochy
        canvas.width = newWidth;
        canvas.height = newHeight;
    };


    const clipTools = [
        {icon: <RiUploadCloud2Line/>, label: 'Média'},
        {icon: <VscScreenFull/>, label: 'Plátno', content: canvasContent},
        {icon: <LuMusic4/>, label: 'Hudba'},
        {icon: <RxText/>, label: 'Text'},
        {icon: <TbTransitionRight/>, label: 'Přechody'},
        {icon: <MdAnimation/>, label: 'Animace'}
    ];

    // Aktivní nástroj zvolený uživatelem
    const [activeTool, setActiveTool] = useState(null);

    const [index, setIndex] = useState(0);

    const handleToolClick = (index) => {

        setActiveTool(index);

        setIsFlexStart(!isFlexStart);

        setIndex(index);
    };

    return (
        <div>
            <ClipContainer>

                <VideoTools isFlexStart={isFlexStart}>

                    {activeTool === null ? (

                        clipTools.map((item, index) => (

                            <ClipTool
                                key={index}
                                onClick={() => handleToolClick(index)}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    {item.icon} {item.label}
                                </div>

                            </ClipTool>
                        ))
                    ) : (

                        <ClipTool
                            key={activeTool}
                            isActive={activeTool === index}
                            fadeOut={activeTool !== index}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontWeight: 600,
                                width: "100%",
                                background: 'var(--color-shadow-8)',
                                borderRadius: '25px',
                                padding: '5px'
                            }}>

                                <ArrowBtn onClick={() => handleToolClick(null)}>
                                    <GoArrowLeft/>
                                </ArrowBtn>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px',
                                    margin: '0 auto',
                                }}>
                                    {clipTools[activeTool].icon} {clipTools[activeTool].label}
                                </div>

                            </div>

                            {/** Vypsání obsahu nástroje **/}
                            {clipTools[activeTool].content !== null ? (

                                canvasContent(canvasTypes)

                            ) : (
                                <div>Někde nastala chyba</div>
                            )}

                        </ClipTool>
                    )}

                </VideoTools>

                <VideoPreview>

                    <canvas ref={videoRef}/>

                    {/*<ClipCreator canvas={videoRef.current} img={img} arrow={0} duration={10000} videoRef={videoRef}/>*/}

                </VideoPreview>

            </ClipContainer>

            <TimelineContainer ref={timelineRef}>

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

                <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "20px"}}>

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
                            alignItems: "flex-end"
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
                                handlePieceUpdate={handlePieceUpdate}
                                activeIndex={activeIndex}
                                pieceIsClicked={pieceIsClicked}
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
                                width: '2px',
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