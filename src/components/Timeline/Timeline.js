import React, {useEffect, useRef, useState} from 'react';
import {IoPause, IoPlay, IoPlayBack, IoPlayForward} from "react-icons/io5";
import TimelinePieces from "./TimelinePieces";
import {
    CanvasContent,
    ClipContainer,
    ClipTool,
    DownloadBtn, SubmitBtn,
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
import {FaCameraRetro, FaDownload} from "react-icons/fa";
import * as url from "url";
import {CiImageOn} from "react-icons/ci";

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

    // Ukládání výběru uživatele v panelu nástroje
    const [canvasSelector, setCanvasSelector] = useState([]);

    const [isFirstRun, setIsFirstRun] = useState(true);

    // Výpočet pozice X obrázku
    const [coordinateX, setCoordinateX] = useState(0);

    // Výpočet pozice Y obrázku
    const [coordinateY, setCoordinateY] = useState(0)

    // const [elementX, setElementX] = useState(0);
    //
    // // Výpočet pozice Y obrázku
    // const [elementY, setElementY] = useState(0)
    //
    // const [isFirst, setIsFirst] = useState(true)

    // Link pro stažení výsledného videa
    const [downloadLink, setDownloadLink] = useState(null);

    // Proměnné pro ukládání klipu
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunks = useRef([]);

    // Tlačítko pro ukládání vytvořeného klipu
    const [downloadBtn, setDownloadBtn] = useState(false);

    // Aktuální směr v rotaci
    const [currentDirection, setCurrentDirection] = useState("right");

    // Výběr poměru v sekci nástroje kamery
    const [ratioSelection, setRatioSelection] = useState([]);

    // Aktuální velikost kamery
    const [cameraSize, setCameraSize] = useState({width: "100 px", height: "100 px", currentIndex: 1});

    const [cameraIndex, setCameraIndex] = useState(0);

    /**
     * Spustí nahrávání videa z canvasu (25 fps).
     * Vytvoří `MediaRecorder`, který ukládá data do pole `chunks`.
     * Po zastavení nahrávání vytvoří video `Blob` a odkaz pro stažení.
     * Automaticky zastaví nahrávání po určité době.
     */
    const startRecording = (canvas) => {

        if (canvas) {
            const stream = canvas.captureStream(50);
            const mediaRecorder = new MediaRecorder(stream, {mimeType: 'video/webm'});

            mediaRecorder.ondataavailable = (event) => {
                chunks.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks.current, {type: 'video/webm'});
                const downloadUrl = URL.createObjectURL(blob);
                setDownloadLink(downloadUrl);
                chunks.current = [];
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
        }
    };

    /**
     * Funkce umožňuje stáhnout video. Vytvoří a klikne na odkaz pro stažení videa.
     */
    const handleDownload = () => {

        // setDownloadLink(null);
        // chunks.current = [];

        setDownloadBtn(true);

        if (downloadLink) {

            const link = document.createElement('a');
            link.href = downloadLink.toString();
            link.download = 'canvas-video.webm';
            link.click();
        }
    };

    /**
     * Zastaví nahrávání videa, pokud je aktivní.
     */
    const stopRecording = () => {

        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    /** Hlavní funkce pro správu plochy **/
    const handleCanvasContent = () => {

        // Plocha videa
        const canvas = videoRef.current;

        const ctx = canvas.getContext('2d');

        // Získání hodnoty z paměti pro plochu klipu
        setSelector(null, 'canvasSelector', false, 1);

        // Získání hodnoty z paměti pro velikost kamery
        setSelector(null, 'cameraSelector', false, 5);

        console.log("ACTIVE " + activeIndex)

        // // Nastavení velikosti plochy dle poměru
        // setRatioCanvas(canvas, canvasSelector[0], canvasTypes[activeIndex], selectedPieces[activeIndex], 5);


        if (!canvas || selectedPieces.length === 0) return;

        if (!isRecording && downloadBtn) {

            // Zahájení snímaní videa
            startRecording(canvas);
        }

        // Funkce pro vykreslení aktuálního snímku
        const createClip = (count) => {

            // Procházení pole částic
            for (let i = 0; i < selectedPieces.length; i++) {

                // Začáteční bod částice
                const startPiece = (selectedPieces[i].left * videoLength) / barWidth;

                // Konečný bod částice
                const endPiece = ((selectedPieces[i].left + selectedPieces[i].width) * videoLength) / barWidth;

                // Proměnná pro zjištění zda další částice je na ploše
                const nextPiece = selectedPieces[i + 1]
                    ? (selectedPieces[i + 1].left * videoLength) / barWidth
                    : null;

                // 3 proměnné, které určují prostor mezi částicemi
                const beforeFirstCheck = count < startPiece;
                const middleCheck = count > endPiece && nextPiece && count < nextPiece;
                const lastEndCheck = count > endPiece && !nextPiece;

                // Aktuálně zvolená částice
                const currentPiece = selectedPieces[i];

                const img = new Image();

                // Obsah obrázku
                img.src = currentPiece.src;

                // Kontrola, zda je aktuální čas v rámci částice
                const pieceTimeConditional = count >= startPiece && count <= endPiece;

                // Čas od začátku klipu
                const startClip = count - startPiece;

                // Délka klipu
                const duration = endPiece - startPiece;

                const ratioCanvas = getRatioValues(activeRatio);

                const arrowPosition = currentPiece.arrowDirection || {x: "+", y: "-"};

                const basicArrowType = arrowPosition.x !== "zoom" && arrowPosition.x !== "rotate";

                // Velikost kamery
                // Kontrola zda byly vybrány 2 poměry
                if (ratioSelection[0] && ratioSelection[1]) {

                    const [widthRatio1, heightRatio1] = ratioSelection[0].split('/').map(Number);

                    const [widthRatio2, heightRatio2] = ratioSelection[1].split('/').map(Number);

                    const finalWidth = img.width * (widthRatio1 / heightRatio1);
                    const finalHeight = img.height * (widthRatio2 / heightRatio2);

                    setCameraSize({
                        width: finalWidth.toString(),
                        height: finalHeight.toString(),
                        currentIndex: cameraSize.currentIndex
                    })
                }

                // let cameraWidth = parseInt(currentPiece.cameraSize.width)|| 100;
                // let cameraHeight =  parseInt(currentPiece.cameraSize.height) || 100;

                let cameraWidth = parseInt(cameraSize.width);
                let cameraHeight =  parseInt(cameraSize.height);

                let speedX = (img.width - cameraWidth) / (duration);
                let speedY = (img.height - cameraHeight) / (duration);

                // Výpočet pozice kamery
                let positionX = arrowPosition.x !== "rotation" ? speedX * startClip : speedX * startClip;
                let positionY = arrowPosition.x !== "rotation" ? speedY * startClip : speedY * startClip;

                // Funkce pro určení správného směru pozice na základě směru pohybu
                const arrowSetUp = (arrow, positionClip, maxDimension, cameraDimension) => {
                    if (arrow === "+") {
                        return positionClip;
                    } else if (arrow === "-") {
                        return maxDimension - (positionClip + cameraDimension);
                    } else {
                        return 0.0;
                    }
                };

                // Výpočet parametrů kamery pro efekt přiblížení/oddálení
                if (arrowPosition.x === "zoom") {

                    const zoomProgress = (startClip / duration);

                    if (arrowPosition.y === "in") {
                        cameraWidth = img.width / (1 + zoomProgress);
                        cameraHeight = img.height / (1 + zoomProgress);

                    } else {
                        cameraWidth = (img.width / 2) * (1 + zoomProgress);
                        cameraHeight = (img.height / 2) * (1 + zoomProgress);
                    }

                    positionX = (img.width - cameraWidth) / 2;
                    positionY = (img.height - cameraHeight) / 2;

                } else if (arrowPosition.x === "rotation") {

                    // console.log("TIME " + count + " " + startPiece);

                    const slowFactor = 0.5;
                    const newSpeedX = speedX * slowFactor;
                    const newSpeedY = speedY * slowFactor;

                    // console.log("DIRECTION: " + currentDirection)

                    // Pokud se začátek částice rovná aktuálnímu času
                    // if (Math.round(startPiece * 10) === Math.round(count * 10)) {
                    //
                    //     setCoordinateX(0);
                    //     setCoordinateY(0);
                    //     positionX = 0;
                    //     positionY = 0;
                    //     setCurrentDirection("right");
                    // }
                    //
                    // if (coordinateX === 0 && coordinateY === 0) {
                    //
                    //     setCurrentDirection("right");
                    // }

                    const squareRotation = getSquareRotation(arrowPosition, positionX, newSpeedX, positionY, cameraWidth, newSpeedY, cameraHeight, startClip, duration);
                    positionX = squareRotation.positionX;
                    positionY = squareRotation.positionY;

                } else {

                    // Vypočítání pozic kamery na základě směru šipek
                    positionX = arrowSetUp(arrowPosition.x, positionX, img.width, cameraWidth);
                    positionY = arrowSetUp(arrowPosition.y, positionY, img.height, cameraHeight);

                    // console.log("POSITION " + positionX + " " + canvas.width);
                }

                // Nastavení vypočítaných pozic pro animaci
                setCoordinateX(positionX);
                setCoordinateY(positionY);

                // Částice obsahující klip
                if (currentPiece.isSubmitted && pieceTimeConditional) {
                    // Funkce pro vytvoření klipu
                    const createClip = () => {

                        // console.log(coordinateY + " " + canvas.width + " " + img.width + " " + coordinateX);

                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        // Vykreslení obrázku s posunem (zleva doprava)
                        ctx.drawImage(
                            img,
                            coordinateX,
                            coordinateY,
                            cameraWidth,
                            cameraHeight,
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );
                    };

                    // Přehrání klipu
                    if (isPlaying && pieceTimeConditional) {
                        requestAnimationFrame(createClip);
                    } else {
                        // Vykreslení aktuálního snímku klipu
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(
                            img,
                            coordinateX,
                            coordinateY,
                            cameraWidth,
                            cameraHeight,
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );
                    }

                    break;

                    // Častice neobsahující klip
                } else if (!currentPiece.isSubmitted && pieceTimeConditional) {

                    // Vyčistění plochy
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Vykreslení částice
                    ctx.drawImage(
                        img,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    setPieceClicked(true);

                    handlePieceClick(true);

                    break;

                    // Částice se nachází v meziprostoru
                } else if (beforeFirstCheck || middleCheck || lastEndCheck) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    setPieceClicked(false);

                    handlePieceClick(false);

                    break;
                }
                // console.log("COUNT " + count);
            }
        };

        return createClip;
    };


    /** Průběžné přidávání času **/
    useEffect(() => {
        let intervalId = null;

        console.log("Count: ", currentTime, "s");

        // Pokud uživatel klikne na tlačítko 'Stáhnout video'
        if (downloadBtn) {

            intervalId = setInterval(() => {

                setCurrentTime((prevTime) => {

                    // console.log(isFirstRun)

                    if (isFirstRun && currentTime !== 0) {
                        setDownloadLink(null);
                        chunks.current = [];
                        setBarPosition(0);
                        setIsFirstRun(false);
                        return 0;

                    } else if (prevTime + 0.15 >= videoLength) {

                        clearInterval(intervalId);
                        setIsPlaying(false);
                        stopRecording();

                        return videoLength;
                    }

                    return prevTime + 0.15;
                });

                setBarPosition((prevPosition) => prevPosition + 0.25);

                // 150
            }, 100);

        } else if (isPlaying && !isDragging) {

            intervalId = setInterval(() => {

                setCurrentTime((prevTime) => {

                    if (prevTime + 0.15 >= videoLength) {

                        clearInterval(intervalId);
                        setIsPlaying(false);
                        return videoLength;
                    }

                    return prevTime + 0.15;
                });

                setBarPosition((prevPosition) => prevPosition + 0.25);

            }, 100);

        }

        const renderFrame = handleCanvasContent();
        renderFrame(currentTime);


        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };

    }, [videoRef.current, downloadBtn, isPlaying, isDragging, videoLength, currentTime, ratioSelection]);

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

        // console.log(mouseX)

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

    /** Funkce pro zobrazení úplné rotace obrázku ve směru nebo proti směru hodinových ručiček **/
    const getSquareRotation = (arrowPosition, positionX, newSpeedX, positionY, cameraWidth, newSpeedY, cameraHeight, startClip, duration) => {

        if (arrowPosition.y === "positive") {

            switch (currentDirection) {

                // Směr doprava
                case "right":
                    positionX = coordinateX + newSpeedX;
                    positionY = 0;

                    if (positionX + newSpeedX >= cameraWidth) {
                        console.log("Reached right edge, changing direction to down");

                        setCoordinateX(positionX);
                        setCoordinateY(0);
                        setCurrentDirection("down");
                    }
                    break;

                // Směr dolů
                case "down":
                    console.log("Moving down " + positionX + " " + positionY);
                    console.log("Moving down " + coordinateX + " " + coordinateY);

                    positionX = coordinateX;
                    positionY = coordinateY + newSpeedY;

                    if (positionY + newSpeedY >= cameraHeight) {
                        console.log("Reached bottom edge, changing direction to left");

                        setCoordinateX(positionX);
                        setCoordinateY(positionY);
                        setCurrentDirection("left");
                    }
                    break;

                // Směr vlevo
                case "left":
                    positionX = coordinateX - newSpeedX;
                    positionY = coordinateY;
                    console.log("Moving left " + positionX);

                    if (positionX - newSpeedX <= 0) {
                        console.log("Reached left edge, changing direction to up");

                        setCoordinateX(positionX);
                        setCoordinateY(positionY);
                        setCurrentDirection("up");
                    }
                    break;

                // Směr nahoru
                case "up":
                    positionX = coordinateX;
                    positionY = coordinateY - newSpeedY;
                    console.log("Moving up " + positionY);

                    if (positionY - newSpeedY <= 0) {
                        console.log("Reached top edge, changing direction to right");

                        setCoordinateX(positionX);
                        setCoordinateY(0);
                        setCurrentDirection("right");
                    }
                    break;

                default:
                    console.error("Neznámý směr: ", currentDirection);
            }

            // Rotace proti směru hodinových ručiček
        } else {

            switch (currentDirection) {

                case "right":
                    positionX = coordinateX - newSpeedX;
                    positionY = 0;
                    console.log("Moving left (inverse) " + positionX);

                    if (positionX - newSpeedX <= 0) {
                        console.log("Reached left edge (inverse), changing direction to up");

                        setCoordinateX(positionX);
                        setCoordinateY(0);
                        setCurrentDirection("up");
                    }
                    break;

                case "down":
                    console.log("Moving up (inverse) " + positionX + " " + positionY);
                    positionX = coordinateX;
                    positionY = coordinateY - newSpeedY;

                    if (positionY - newSpeedY <= 0) {
                        console.log("Reached top edge (inverse), changing direction to right");

                        setCoordinateX(positionX);
                        setCoordinateY(positionY);
                        setCurrentDirection("right");
                    }
                    break;

                case "left":
                    positionX = coordinateX + newSpeedX;
                    positionY = coordinateY;
                    console.log("Moving right (inverse) " + positionX);

                    if (positionX + newSpeedX >= cameraWidth) {
                        console.log("Reached right edge (inverse), changing direction to down");

                        setCoordinateX(positionX);
                        setCoordinateY(positionY);
                        setCurrentDirection("down");
                    }
                    break;

                case "up":
                    positionX = coordinateX;
                    positionY = coordinateY + newSpeedY;
                    console.log("Moving down (inverse) " + positionY);

                    if (positionY + newSpeedY >= cameraHeight) {
                        console.log("Reached bottom edge (inverse), changing direction to left");

                        setCoordinateX(positionX);
                        setCoordinateY(positionY);
                        setCurrentDirection("left");
                    }
                    break;

                default:
                    console.error("Neznámý směr: ", currentDirection);
            }
        }
        return {positionX, positionY};
    }

    /*
if (arrowPosition.y === "positive") {
    const quarterDuration = duration / 4;

    if (startClip < quarterDuration) { // Moving right
        positionX += newSpeedX;
        positionY = 0; // Stay at the top edge during right movement

        if (positionX >= cameraWidth) {
            console.log("Reached right edge, changing direction to down");
            positionX = cameraWidth; // Snap to the right edge
        }

    } else if (startClip >= quarterDuration && startClip < 2 * quarterDuration) { // Moving down
        positionY += newSpeedY; // Increment downward
        console.log(`Moving down - POSITION X: ${positionX} POSITION Y: ${positionY}`);

        if (positionY >= cameraHeight) {
            console.log("Reached bottom edge, changing direction to left");
            positionY = cameraHeight; // Snap to the bottom edge
        }

    } else if (startClip >= 2 * quarterDuration && startClip < 3 * quarterDuration) { // Moving left
        positionX -= newSpeedX; // Decrement leftward
        console.log(`Moving left - POSITION X: ${positionX} POSITION Y: ${positionY}`);

        if (positionX <= 0) {
            console.log("Reached left edge, changing direction to up");
            positionX = 0; // Snap to the left edge
        }

    } else if (startClip >= 3 * quarterDuration && startClip < duration) { // Moving up
        positionY -= newSpeedY; // Decrement upward
        console.log(`Moving up - POSITION X: ${positionX} POSITION Y: ${positionY}`);

        if (positionY <= 0) {
            console.log("Reached top edge, changing direction to right");
            positionY = 0; // Snap to the top edge
        }
    }
*/

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
    const handlePieceUpdate = (id, src, width, left, isSubmitted, arrow, duration, frameRate, scanSpeed, special, arrowDirection, cameraSizeObject) => {
        setActiveIndex(id);

        console.log("SUBMITTED", cameraSizeObject, id);

        handlePieces(
            id,
            src,
            width,
            left,
            isSubmitted,
            arrow,
            duration,
            frameRate,
            scanSpeed,
            special,
            arrowDirection,
            cameraSize
        );

        console.log("SUBMITTED 22", selectedPieces[id]?.cameraSize);
    };

    const [isFlexStart, setIsFlexStart] = useState(false);

    // Data pro výběr rozměrů velikosti plochy
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

    // Data pro výběr rozměrů kamery
    const cameraTypes = [

        {sizeX: "50 px", sizeY: "50 px"},
        {sizeX: "100 px", sizeY: "100 px"},
        {imgRatio: "1/2"},
        {imgRatio: "1/3"},
        {imgRatio: "1/4"}
    ];

    /** Funkce pro úpravu rozměrů plochy **/
    const resizeCanvas = (type) => {

        const resizeIndex = 1;

        const canvas = videoRef.current;

        return type.map((item, index) => {

            return (
                <CanvasContent
                    key={index}
                    isClicked={index === canvasSelector[resizeIndex]}
                    onClick={() => setRatioCanvas(canvas, index, item, resizeIndex)}
                >
                    {item.icon} {item.ratio}
                </CanvasContent>
            );
        });
    };

    // Šířka a výška ze vstupu
    const [widthDecimal, setWidthDecimal] = useState('75');
    const [heightDecimal, setHeightDecimal] = useState('75');

    // Vypsání zprávy v případě chyby
    const [errorMessage, setErrorMessage] = useState('');

    // Počet bodů ve výběru poměru vůči obrázku šířky a výšky
    const [selectedCounts, setSelectedCounts] = useState({});
    const [totalBullets, setTotalBullets] = useState(0);

    // Počet kliknutí na poměry kamer
    const [countClicks, setCountClicks] = useState(0);

    /** Funkce pro výběr optimální rozměrů kamery dle uživatele **/
    const cameraOptions = (type) => {

        // Maximální délka vstupu
        const maxLength = 3;

        // Index možnosti
        const cameraIndex = 5;

        /** Kontrola nastavené šířky nebo výšky **/
        const handleInputChange = (e, setter) => {

            const value = e.target.value;

            if (value.length <= maxLength) {
                setter(value);
            }
            if (value === "" || value < 10) {

                setErrorMessage("Hodnota musí být větší než 0 a žádný z parametrů nesmí být prázdný");

            } else {
                setErrorMessage("");
            }
        };

        // Styly pro odlišení výběru výšky a šířky
        const stylesWidth = {textAlign: 'center', color: '#f7ff63'};
        const stylesHeight = {textAlign: 'center', color: '#52ffe4'};

        return (
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    width: '100%',
                    gap: '25px'
                }}>
                    <div style={stylesWidth}>ŠÍŘKA</div>
                    <div style={stylesHeight}>VÝŠKA</div>
                </div>

                <hr style={{
                    margin: '10px 0',
                    border: 'none',
                    height: '1px',
                    background: 'linear-gradient(to right, #f7ff63, #52ffe4)'
                }}/>


                {type.map((item, index) => {

                    if (!item.sizeX || !item.sizeY) {
                        return null;
                    }

                    return (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            gap: '25px',
                            marginTop: "10px"
                        }}>

                            <CanvasContent
                                style={{width: "100%"}}
                                key={index}
                                isClicked={index === canvasSelector[cameraIndex]}
                                onClick={() => setRatioCanvas(videoRef.current, index, item, cameraIndex)}
                            >
                                <div style={{textAlign: 'center'}}>

                                    {item.sizeX}

                                </div>
                                <div style={{textAlign: 'center'}}>

                                    {item.sizeY}

                                </div>
                            </CanvasContent>
                        </div>
                    );
                })}

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    marginTop: '10px',
                    color: '#f7ff63',
                    gap: '5px'
                }}>
                    POMĚRY <CiImageOn style={{fontSize: '22px'}}/></div>
                <hr style={{margin: '10px 0', border: '1px solid #f9ffa6'}}/>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '5px',
                        marginTop: '10px',
                    }}
                >

                    {/** Výběr poměru z nabídky **/}
                    {type.map((item, index) => {

                        if (!item.imgRatio) {
                            return null;
                        }

                        const count = selectedCounts[index] || 0;
                        const circleColors = [];

                        // Rozlišování barev dle kliknutí
                        const circleColor = countClicks % 2 === 0 ? `${stylesHeight.color}` : `${stylesWidth.color}`;

                        if (count === 1) {
                            circleColors.push(circleColor);
                        }

                        if (count === 2) {
                            circleColors.push(circleColor);
                            circleColors.push(stylesWidth.color);
                        }

                        return (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    gap: '10px',
                                    marginTop: '10px',
                                    position: 'relative'
                                }}
                            >
                                <CanvasContent
                                    style={{
                                        width: '100%'
                                    }}
                                    key={index}
                                    isClicked={count > 0 && totalBullets > 0 && ratioSelection.length > 0}

                                    onClick={() => {

                                        if (countClicks >= 2) {
                                            return;
                                        }

                                        // Maximální počet bodů je 2
                                        if (count < 2 && totalBullets < 2) {

                                            // Nastavení pro index počet bodů
                                            setSelectedCounts((prev) => ({
                                                ...prev,
                                                [index]: count + 1,
                                            }));

                                            // Zvětšění počet kliknutí o jedna
                                            setCountClicks(prev => prev + 1);

                                            // Nastavení počet zvolených bodů
                                            setTotalBullets(totalBullets + 1);
                                        }

                                        setRatioCanvas(videoRef.current, index, item, cameraIndex);
                                    }}
                                >
                                    <div style={{textAlign: 'center'}}>
                                        {item.imgRatio}
                                    </div>

                                </CanvasContent>

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '5px',
                                        position: 'absolute',
                                        top: '35px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    {circleColors.map((color, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                backgroundColor: index === canvasSelector[cameraIndex] ? color : "none",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                </div>

                <div style={{textAlign: 'center', marginTop: "25px", color: "#f7ff63"}}>VLASTNÍ</div>
                <hr style={{margin: '10px 0', border: '1px solid #f9ffa6'}}/>

                <CanvasContent
                    style={{width: "100%"}}
                    key={index}
                    isClicked={5 === canvasSelector[cameraIndex]}
                    onClick={() => {

                        setSelectedCounts({});
                        setTotalBullets(0);
                        setRatioSelection([]);
                        setCountClicks(0);

                        setRatioCanvas(videoRef.current, 5, "vlastni", cameraIndex)

                    }
                    }
                    hasError={!!errorMessage}
                >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <input
                            id="widthDecimal"
                            type="number"
                            value={widthDecimal}
                            onChange={(e) => handleInputChange(e, setWidthDecimal)}
                            style={{
                                width: '100%',
                                padding: '4px',
                                borderRadius: '10px',
                                textAlign: "center",
                                background: "transparent",
                                border: "none"
                            }}
                        />
                        <div>px</div>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <input
                            id="heightDecimal"
                            type="number"
                            value={heightDecimal}
                            onChange={(e) => handleInputChange(e, setHeightDecimal)}
                            style={{
                                width: '100%',
                                padding: '4px',
                                borderRadius: '10px',
                                textAlign: "center",
                                background: "transparent",
                                border: "none"
                            }}
                        />
                        <div>px</div>
                    </div>

                </CanvasContent>

                <div style={{marginTop: "10px", fontSize: "12px", color: "#ffe564"}}>{errorMessage}</div>

                <SubmitBtn

                    onClick={() => {
                        setSelectedCounts({});
                        setTotalBullets(0);
                        setRatioSelection([]);
                        setCountClicks(0);


                        // setTimeout(() => {
                        //     setCanvasSelector(prev => {
                        //         const updatedArray = [...prev];
                        //         updatedArray[5] = 1;
                        //         return updatedArray;
                        //     });
                        // }, 0);
                    }}
                >
                    RESET
                </SubmitBtn>

            </div>
        );
    };

    /** Výpočet poměru **/
    const getRatioValues = (ratio) => {

        const [width, height] = ratio.split(':').map(Number);

        return {x: width, y: height};
    };

    /** Funkce pro ukládání dat o poměru kamery vybraným uživatelem **/
    const setCameraRatio = (item, index) => {

        if (ratioSelection.length < 2) {

            setRatioSelection((prev) => {
                const updatedArray = [...prev];
                updatedArray.push(item.imgRatio);
                return updatedArray;
            });
        }

        // Pokud se kliknutí uživatele nenachází v intervalu "poměrů kamer"
        if (!(index >= 2 && index <= 4)) {

            setSelectedCounts({});
            setTotalBullets(0);
            setRatioSelection([]);
            setCountClicks(0);
        }
    }

    /** Funkce pro nastavení předchozích hodnot z paměti **/
    const setSelector = (index, localStorageItem, set, selectedOption) => {

        const storedValue = set ? localStorage.setItem(localStorageItem, index.toString()) : parseInt(localStorage.getItem(localStorageItem));

        if (storedValue >= 0) {

            setCanvasSelector((prev) => {

                const updatedArray = [...prev];
                updatedArray[selectedOption] = storedValue;
                return updatedArray;
            });

            console.log("STORE " + selectedOption + " " + storedValue);
        }
    }

    /** Funkce pro obnovení hodnot metody setSelector **/
    const updateSelector = (key, defaultValue, selectedOption) => {

        const storedValue = localStorage.getItem(key);
        const value = storedValue !== null ? storedValue : defaultValue;
        setSelector(value, key, true, selectedOption);
    };

    /** Rozměry plochy (Canvas) **/
    const setRatioCanvas = (canvas, index, item, selectedOption) => {

        //console.log("index :" + index + " " + activeRatio + " " + item.imgRatio + " " + ratioSelection);

        if (index !== null && !isNaN(index)) {

            // Obnovení pole hodnot s indexem jednotlivých nástrojů
            setCanvasSelector(prev => {
                const updatedArray = [...prev];
                updatedArray[selectedOption] = index;
                return updatedArray;
            });

            if (selectedOption === 1 || selectedOption === undefined) {
                setSelector(index, 'canvasSelector', true, 1);

            } else if (selectedOption === 5 || selectedOption === undefined) {
                setSelector(index, 'cameraSelector', true, 5);

                console.log("INDEX CAMERA " + index + " ");

                if (cameraTypes && cameraTypes[index]) {

                    const sizeX = cameraTypes[index]?.sizeX ?
                        parseInt(cameraTypes[index].sizeX.replace("px", "").trim()) : 0;
                    const sizeY = cameraTypes[index]?.sizeY ?
                        parseInt(cameraTypes[index].sizeY.replace("px", "").trim()) : 0;

                    if (sizeX > 0 && sizeY > 0) {
                        setCameraSize({ width: sizeX.toString(), height: sizeY.toString(), currentIndex: index });
                    }

                    if (cameraTypes[index]?.imgRatio) {
                        console.log("ITEM " + cameraTypes[index]?.imgRatio);
                        setCameraRatio(item, index);
                    }
                }

                // Vlastní výběr kamery
                if (item === "vlastni"){

                    setCameraSize({width: widthDecimal, height: heightDecimal, currentIndex: index});
                }
            }

        } else {

            // Obnovení hodnot v paměti
            updateSelector('canvasSelector', 4, 1);
            updateSelector('cameraSelector', 1, 5);
        }

        // Nastavení aktuálního poměru
        if (item && item.ratio) {

            setActiveRatio(item.ratio);
            localStorage.setItem('activeRatio', item.ratio);
        }
    };

    /** Aktivní načítání při změně plochy klipu a obnovení pole pro parametry kamery **/
    useEffect(() => {

        if (activeIndex) {

            console.log("Obnovení velikosti kamery", selectedPieces[activeIndex].cameraSize, activeIndex);

            setCanvasSelector(prev => {
                const updatedArray = [...prev];
                updatedArray[5] = selectedPieces[activeIndex].cameraSize.currentIndex;
                return updatedArray;
            });
        }

        console.log("CANVAS SELECT: " + canvasSelector[5]);

        // const getCameraSelector = localStorage.getItem('cameraSelector');
        //
        // if (getCameraSelector === null) {
        //
        //
        // }

        const getCameraSelector = localStorage.getItem('cameraSelector');

        console.log("CAMERA " + getCameraSelector)

        //setRatioCanvas(videoRef.current, 3, null, 5);


        if (activeRatio) {

            const ratioValues = getRatioValues(activeRatio);

            const parentWidth = videoRef.current.parentElement.clientWidth;
            const parentHeight = videoRef.current.parentElement.clientHeight;

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
            videoRef.current.width = newWidth;
            videoRef.current.height = newHeight;
        }

        cameraOptions(cameraTypes);

    }, [activeRatio, ratioSelection, activeIndex, selectedPieces]);

    // Nástroje pro správu klipu
    const clipTools = [
        {icon: <RiUploadCloud2Line/>, label: 'Média'},
        {icon: <VscScreenFull/>, label: 'Plátno', content: resizeCanvas},
        {icon: <LuMusic4/>, label: 'Hudba'},
        {icon: <RxText/>, label: 'Text'},
        {icon: <TbTransitionRight/>, label: 'Přechody'},
        {icon: <FaCameraRetro/>, label: 'Kamera', content: cameraOptions}
    ];

    // Aktivní nástroj zvolený uživatelem
    const [activeTool, setActiveTool] = useState(null);

    const [index, setIndex] = useState(0);

    // Aktivní nástroj a index pro správu klipu
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
                                {/** Nadpisy všech nástrojů (před otěvřením) **/}
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

                                {/** Nadpis u otevřeného nástroje **/}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px',
                                    margin: '0 auto',
                                }}>
                                    {clipTools[activeTool].icon}
                                    {clipTools[activeTool].label}

                                </div>


                            </div>

                            {/** Vypsání obsahu nástroje **/}
                            {clipTools[activeTool].content !== null && activeTool === 1 && resizeCanvas(canvasTypes)}
                            {clipTools[activeTool].content !== null && activeTool === 5 && cameraOptions(cameraTypes)}

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
                    justifyContent: "space-between"
                }}>

                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        flexGrow: 1
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

                    <div style={{
                        marginLeft: "auto"
                    }}>

                        <DownloadBtn onClick={handleDownload}>

                            <FaDownload style={{fontSize: "14px"}}/> Stáhnout

                        </DownloadBtn>
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
                                timelineWidth={timelineRef}
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
}
;

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