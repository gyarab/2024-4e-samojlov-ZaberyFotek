import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    AddBtn, ArrowBtn,
    Foto, PieceImages,
    PiecesContainer,
    ShowNum, TimeInput,
    ZaberyPage,
    ZaberySidebarContainer,
    ZaberySidebarItem
} from "./ZaberyComponents";
import {PiNumberCircleFour, PiNumberCircleOne, PiNumberCircleThree, PiNumberCircleTwo} from "react-icons/pi";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/16/solid";
import {
    GoArrowDown,
    GoArrowDownLeft,
    GoArrowDownRight,
    GoArrowLeft,
    GoArrowRight,
    GoArrowUp, GoArrowUpLeft,
    GoArrowUpRight
} from "react-icons/go";
import {SlControlEnd, SlControlPause, SlControlPlay, SlControlStart} from "react-icons/sl";
import {IoPause, IoPlay, IoPlayBack, IoPlayForward} from "react-icons/io5";
import ResizableImage from "./TimelineImages";
import {Resizable} from "re-resizable";

function Zabery(props) {

    // Vybrané částice obrázku uživatelem
    const [selectedPieces, setSelectedPieces] = useState([]);

    const [rangeValue, setRangeValue] = useState(50)

    // Aktuální obrázek
    const [currentImage, setCurrentImage] = useState('');

    let positionX = [];

    let positionY = [];

    let [vertIndex, setVertIndex] = useState(0);

    let [horIndex, setHorIndex] = useState(0);

    // Přidávání jednotlivých linií
    const [items, setItems] = useState([]);

    /** Funkce pro přidání nové linie **/
    const addItem = (array, newItem) => {

        const updatedItems = [...array, newItem];

        console.log('Updated Items:', updatedItems);

        setItems(updatedItems);
    };

    /** Vypsání prvků **/
    const logItems = () => {

        console.log('Current Items:', items);

    };

    /** Funkce pro odstranění poslední linie **/
    const deleteLastItem = (array, type) => {

        console.log('Deleted Items:', array);

        const indexToRemove = array
            .map((item, index) => item.type === type ? index : -1)
            .filter(index => index !== -1)
            .pop();

        const result = indexToRemove !== undefined
            ? array.filter((_, index) => index !== indexToRemove)
            : array;

        setItems(result);
    };

    // Aktivní prvek v seznamu SidebarContainer
    const [activeItem, setActiveItem] = useState(null);

    // Aktivní směr pro obrázek
    const [activeArrow, setActiveArrow] = useState(null);

    // Funkce pro zobrazení jednoho prvku
    const handleVisibility = (item, setFunction) => {

        // Zobrazení původní plochy
        canvasRef.current.style.display = 'inline';

        setFunction(prevActiveItem => (prevActiveItem === item ? null : item));
    };

    // Počet aktuálních sloupců a řádků v paneli nástrojů
    const [row, setAsRows] = useState(0);
    const [column, setAsColumns] = useState(0);

    // Ukládání dat o liniích
    const [lines, setLines] = useState({vertical: [], horizontal: []});

    // Stav tahu linie
    const [dragging, setDragging] = useState(null);

    // Inicializace plochy
    const canvasRef = useRef(null);

    // Souřadnice liní
    const [startOffset, setStartOffset] = useState(null);

    /** Funkce pro přidání nebo odebrání řádků **/
    const operationHandler = (operation, type, setType, word) => {

        // Přidávání linií
        if (operation === "+") {

            setType(type + 1);

            // Akutální počet linií
            const newLines = {...lines};

            let position = 0;

            // Přidání sloupce
            if (word === "columnAdd") {

                position = canvasRef.current.width / (type + 2);

                // Přidání vertikální čáry uprostřed plátna
                newLines.vertical.push(position);

                addItem(items, {id: vertIndex, type: 'vertical', position: position});

                setVertIndex(vertIndex + 1);

            } else {

                position = canvasRef.current.height / (type + 2);

                // Přidání horizontální čáry uprostřed plátna
                newLines.horizontal.push(position);

                addItem(items, {id: horIndex, type: 'horizontal', position: position});

                setHorIndex(horIndex + 1);
            }

            setLines(newLines);

            // Odebírání linií
        } else {

            if (type !== 0) {

                setType(type - 1);

                const newLines = {...lines};

                // Odstranění veritkální linie
                if (word === "columnDel") {

                    newLines.vertical.pop();

                    deleteLastItem(items, 'vertical');

                    setVertIndex(vertIndex - 1);

                    // Odstranění horizontální linie
                } else {

                    newLines.horizontal.pop();

                    deleteLastItem(items, 'horizontal');

                    setHorIndex(horIndex - 1);
                }

                setLines(newLines);
            }
        }

        // console.log(items);

        // Překreslení plochy
        drawCanvas();
    };

    // Responzivita plochy
    useEffect(() => {

        window.addEventListener('resize', drawCanvas);

        return () => window.removeEventListener('resize', drawCanvas);
    }, [props.image]);


    /** Vykreslení plochy **/
    const drawCanvas = () => {

        // Inicializace plochy
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Obrázek
        const image = new Image();

        const savedImage = localStorage.getItem('savedImage');

        // console.log(savedImage);

        let isSaved = false;

        // Pokud fotografie není uložená
        if (!savedImage) {

            image.src = props.image;
            setCurrentImage(props.image);
            isSaved = false;

            // Pokud fotografie je uložená
        } else {

            image.src = savedImage;
            setCurrentImage(savedImage);
            isSaved = true;
        }

        // Načtení obrázku
        image.onload = () => {

            // Vlastní responzivita obrázku
            responsivityCheck(canvas, image);

            // Vykreslení obrázku do plochy
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            // Barva linie
            ctx.strokeStyle = 'red';

            // Tloušťka linie
            ctx.lineWidth = 5;

            // Vykreslení vertikálních linií
            lines.vertical.forEach(x => {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            });

            // Vykreslení horizontálních linií
            lines.horizontal.forEach(y => {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            });


            if (!isSaved) {

                // Přidání nové fotky
                localStorage.setItem('savedImage', canvas.toDataURL());
            }
        }
    };

    const responsivityCheck = (canvas, image) => {

        if (image.height > 1000) {

            const prev = image.height;

            image.height = 800;
            image.width *= (800 / prev);
        }

        if (image.width > 1000) {

            const prev = image.width;

            image.width = 800;
            image.height *= (800 / prev);
        }

        // Velikost obrazovky uživatele
        if (window.innerWidth > 1200) {

            canvas.width = image.width;
            canvas.height = image.height;

        } else if (window.innerWidth > 1000 && window.innerWidth < 1200) {

            canvas.width = image.width * 0.75;
            canvas.height = image.height * 0.75;

        } else if (window.innerWidth > 800 && window.innerWidth < 1000) {

            canvas.width = image.width * 0.5;
            canvas.height = image.height * 0.5;

        } else {

            canvas.width = image.width * 0.35;
            canvas.height = image.height * 0.35;
        }
    }

    /** Funkce pro kontrolu, zda se linie existuje  **/
    const lineCheck = (hook, index, type, coordinates, newData) => {

        let itemExists = false;

        hook.forEach((x) => {

            if (x.id === index && x.type === type) {
                itemExists = true;
            }

        });

        // Pokud linie nebyla přidána
        if (!itemExists) {

            // Přidání linie
            addItem(items, {id: index, type: type, position: coordinates});

            // Obnovení hodnoty linie
        } else {

            setItems((prevItems) => {

                return prevItems.map((item) =>
                    item.id === index && item.type === type
                        ? {...item, ...newData}
                        : item
                );
            });
        }
    }

    /** Tah je detekován **/
    const handleMouseDown = (e) => {

        const canvas = canvasRef.current;

        // Rozměry plochy
        const rect = canvas.getBoundingClientRect();

        // Výpočet souřadnice tahu
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let closestLine = null;

        lines.vertical.forEach((x, index) => {

            // Výpočet vzdálenosti od vertikální linie
            const distance = Math.abs(mouseX - x);

            if (distance < 5) {

                closestLine = {type: 'vertical', index, x};
            }
        });

        lines.horizontal.forEach((y, index) => {

            // Výpočet vzdálenosti od horizontální linie
            const distance = Math.abs(mouseY - y);

            if (distance < 5) {

                closestLine = {type: 'horizontal', index, y};
            }
        });

        // Přetahování linie
        if (closestLine) {

            setDragging(closestLine);

            // Uložení souřadnic linií
            setStartOffset({x: mouseX - closestLine.x, y: mouseY - closestLine.y});
        }
    };

    /** Tah je v pohybu nad plochou **/
    const handleMouseMove = (e) => {

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let cursor = 'default';

        if (dragging) {

            console.log(`Vertical: ${lines.vertical.join(', ')}`);
            console.log(`Horizontal: ${lines.horizontal.join(', ')}`);

            // Určení typu pohybu tahu
            if (dragging.type === 'vertical') {

                const newX = (mouseX - startOffset.x);

                lines.vertical[dragging.index] = newX;
                lineCheck(items, dragging.index, 'vertical', newX, {
                    id: dragging.index,
                    type: 'vertical',
                    position: newX
                });
                cursor = 'ew-resize';

            } else if (dragging.type === 'horizontal') {

                const newY = (mouseY - startOffset.y);

                lines.horizontal[dragging.index] = newY;
                lineCheck(items, dragging.index, 'horizontal', newY, {
                    id: dragging.index,
                    type: 'horizontal',
                    position: newY
                });
                cursor = 'ns-resize';
            }

            // Aktualizace stavu linií
            setLines({...lines});

            drawCanvas();

            // Pokud uživatel nepřetahuje, ale pohybuje myší
        } else {

            lines.vertical.forEach(x => {
                if (Math.abs(mouseX - x) < 5) cursor = 'ew-resize';
            });

            lines.horizontal.forEach(y => {
                if (Math.abs(mouseY - y) < 5) cursor = 'ns-resize';
            });
        }

        canvas.style.cursor = cursor;
    };

    /** Tah je ukončen **/
    const handleMouseUp = () => {

        setDragging(null);
        setStartOffset(null);
    };

    /** Přidání a odstranění posluchačů událostí myši na canvas **/
    useEffect(() => {

        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, [lines, dragging]);

    /** Vykreslení obrázku a plochy **/
    useEffect(() => {
        drawCanvas();
    }, [props.image]);

    const sortLines = (position) => {

        let temp = 0;

        for (let i = 0; i < position.length; i++) {

            for (let j = i + 1; j < position.length; j++) {

                if (position[i] > position[j]) {

                    temp = position[i];

                    position[i] = position[j];

                    position[j] = temp;
                }
            }
        }
    }

    /** Funkce pro zobrazení jednotlivých částic z fotografie **/
    const getPieces = () => {

        // const itemsVer = items.map(line =>
        //     line.type === 'vertical'
        // );
        //
        // console.log(itemsVer);

        // Nahraná fotografie
        const image = new Image();
        image.src = currentImage;

        items.forEach(line => {

            if (line.type === 'vertical') {

                const w = (line.position * image.width) / canvasRef.current.width;

                positionX.push(w);

            } else {

                const h = (line.position * image.height) / canvasRef.current.height;

                positionY.push(h);
            }
        });

        sortLines(positionX);
        sortLines(positionY);

        console.log(positionX, positionY);


        // Pole pro částice
        const pieces = [];

        console.log("REAL", image.width, image.height)

        // Souřadnicová pole
        const finalPositionX = [0, ...positionX, image.width];
        const finalPositionY = [0, ...positionY, image.height];

        let idImg = 0;

        // Řádky
        for (let i = 0; i < finalPositionY.length - 1; i++) {

            // Sloupce
            for (let j = 0; j < finalPositionX.length - 1; j++) {

                // Pozice x, y na ploše
                const x = finalPositionX[j];
                const y = finalPositionY[i];

                // Šířka a výška částice
                const width = finalPositionX[j + 1] - x;
                const height = finalPositionY[i + 1] - y;

                // Nová plocha
                const pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = width;
                pieceCanvas.height = height;

                // Nová částice
                const pieceContext = pieceCanvas.getContext('2d');
                pieceContext.drawImage(image, x, y, width, height, 0, 0, width, height);

                // Přidání údajů o částicích do pole
                pieces.push({
                    id: idImg,
                    src: pieceCanvas.toDataURL()
                });

                idImg++;
            }
        }


        // Smazání původní plochy
        canvasRef.current.style.display = 'none';

        return (
            <PieceImages>

                {pieces.map(({id, src}) => {

                    // Informace o částicích
                    console.log("Piece info", selectedPieces);

                    // Zvolený prvek uživatelem
                    const selectedPiece = selectedPieces.find(item => item.id === id);

                    return (
                        <div
                            key={id}
                            id={id}
                            onClick={() => handlePieces(id, src)}
                            style={{position: "relative"}}
                        >
                            <img
                                id={id}
                                src={src}
                                alt={`Piece ${id}`}
                            />

                            {selectedPiece && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "15px",
                                        backgroundColor: "var(--color-blue-7)",
                                        border: "1px solid white",
                                        borderRadius: "50%",
                                        width: "25px",
                                        height: "25px",
                                        padding: "5px",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        color: "white",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        display: "flex"
                                    }}
                                >
                                    {selectedPiece.value}
                                </div>
                            )}
                        </div>
                    );
                })}

            </PieceImages>
        );
    }

    /** Funkce se aktivuje v případě, když uživatel klikne na danou vygenerovanou částici **/
    const handlePieces = (id, src) => {

        setSelectedPieces(prevItems => {

            // Částice s číslem
            const existingItem = prevItems.find(item => item.id === id);

            // Uživatel klikne na částici s číslem
            if (existingItem) {

                // Smazání částice s číslem
                const deletedItem = prevItems.filter(item => item.id !== id);

                // Obnovení hodnot u ostatnich částic
                return deletedItem.map((item, index) => ({

                    id: item.id,
                    value: index + 1,
                    src: item.src
                }));

                // Částice nemá žádné číslo
            } else {

                // Přidání čísla pro částici
                return [
                    ...prevItems,
                    {id: id, value: prevItems.length + 1, src: src}
                ];
            }
        });
    };

    /** Prvek časové osy **/
    const ShowTimeline = () => {

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

        /** Spuštění času **/
        const handlePlay = () => setIsPlaying(true);

        /** Zastavení času **/
        const handlePause = () => setIsPlaying(false);

        /** Posunutí času na začátek klipu **/
        const handleBack = () => setCurrentTime(0);

        /** Posunutí času na konec klipu **/
        const handleForward = () => setCurrentTime(videoLength);

        const [barPosition, setBarPosition] = useState(0);

        /** Funkce pro pohyby - DragMove a Click **/
        const handleFunction = (event) => {

            // Časová osa
            const bar = event.currentTarget;

            const mouseX = event.clientX - bar.getBoundingClientRect().left;

            // Výpočet nového času
            const newTime = (mouseX / bar.offsetWidth) * videoLength;

            const newPosition = (mouseX / bar.offsetWidth) * 100;

            if (newTime >= 0 && newTime <= videoLength) {

                setCurrentTime(newTime);
                setBarPosition(newPosition);
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

        // Délka časové osy
        const barWidth = 800;

        // Výpočet měřítka
        const pixelsPerSecond = barWidth / videoLength;

        for (let i = 0; i <= videoLength; i += spacingPoints) {

            checkPoints.push(i);
        }

        return (
            <div style={{
                display: "grid",
                alignItems: "center",
                padding: "20px",
                background: "var(--color-shadow-1)",
                borderRadius: "15px",
                position: "fixed",
                bottom: 0,
                marginBottom: "15px"
            }}>

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

                        {selectedPieces.map(((piece, index) => {

                            const pieceWidth = 100;

                            const gap = (barWidth - (selectedPieces.length * pieceWidth)) / (selectedPieces.length + 1);

                            const left = gap + index * (pieceWidth + gap);

                            return (
                                <ResizableImage
                                    key={piece.id}
                                    piece={piece}
                                    pieceLeft={left}
                                    piecesArray={selectedPieces}
                                />);
                        }))}

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


    return (
        <ZaberyPage>

            <ZaberySidebarContainer>
                <h3 style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: "20px",
                    background: "var(--color-blue-4)",
                    borderRadius: "15px",
                    marginBottom: "10px",
                    letterSpacing: "1px",
                    padding: "15px"

                }}>NÁVOD NA KLIP</h3>

                <ZaberySidebarItem isClicked={activeItem === 'item1'}
                                   onClick={() => handleVisibility('item1', setActiveItem)}>

                    <PiNumberCircleOne style={{height: "35px", width: "35px"}}/> Upravit obrázek

                </ZaberySidebarItem>

                <ZaberySidebarItem isClicked={activeItem === 'item2'}
                                   onClick={() => handleVisibility('item2', setActiveItem)}>

                    <PiNumberCircleTwo style={{height: "35px", width: "35px"}}/> Rozdělení na části

                </ZaberySidebarItem>

                {activeItem === 'item2' && (

                    <PiecesContainer>

                        <p>Sloupce:</p>

                        <div style={{display: "inline-flex", margin: "12px 0 18px 0", width: "100%"}}>

                            <ShowNum>{column}</ShowNum>

                            <AddBtn
                                onClick={() => operationHandler("+", column, setAsColumns, "columnAdd")}>
                                <PlusCircleIcon style={{color: "var(--color-shadow-7)"}}/>
                            </AddBtn>

                            <AddBtn
                                onClick={() => operationHandler("-", column, setAsColumns, "columnDel")}>
                                <MinusCircleIcon style={{color: "var(--color-shadow-7)"}}/>
                            </AddBtn>

                        </div>

                        <p>Řádky:</p>

                        <div style={{display: "inline-flex", margin: "12px 0 18px 0", width: "100%"}}>

                            <ShowNum>{row}</ShowNum>

                            <AddBtn onClick={() => operationHandler("+", row, setAsRows, "rowAdd")}>
                                <PlusCircleIcon style={{color: "var(--color-shadow-7)"}}/>
                            </AddBtn>

                            <AddBtn onClick={() => operationHandler("-", row, setAsRows, "rowDel")}>
                                <MinusCircleIcon style={{color: "var(--color-shadow-7)"}}/>
                            </AddBtn>

                        </div>
                    </PiecesContainer>
                )}

                <ZaberySidebarItem isClicked={activeItem === 'item3'}
                                   onClick={() => handleVisibility('item3', setActiveItem)}>

                    <PiNumberCircleThree style={{height: "35px", width: "35px"}}/> Rozdělit na obrázky

                </ZaberySidebarItem>

                <ZaberySidebarItem isClicked={activeItem === 'item4'}
                                   onClick={() => handleVisibility('item4', setActiveItem)}>

                    <PiNumberCircleFour style={{height: "35px", width: "35px"}}/> Vytvořit klipy

                </ZaberySidebarItem>

                {activeItem === 'item4' &&

                    <PiecesContainer>

                        <p>Zvolit směr:</p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: "5px",
                                padding: "15px"
                            }}>

                            <ArrowBtn isClicked={activeArrow === 'arrow1'}
                                      onClick={() => handleVisibility('arrow1', setActiveArrow)}>
                                <GoArrowUpRight/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow2'}
                                      onClick={() => handleVisibility('arrow2', setActiveArrow)}>
                                <GoArrowRight/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow3'}
                                      onClick={() => handleVisibility('arrow3', setActiveArrow)}>
                                <GoArrowDownRight/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow4'}
                                      onClick={() => handleVisibility('arrow4', setActiveArrow)}>
                                <GoArrowDown/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow5'}
                                      onClick={() => handleVisibility('arrow5', setActiveArrow)}>
                                <GoArrowDownLeft/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow6'}
                                      onClick={() => handleVisibility('arrow6', setActiveArrow)}>
                                <GoArrowLeft/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow7'}
                                      onClick={() => handleVisibility('arrow7', setActiveArrow)}>
                                <GoArrowUpLeft/>
                            </ArrowBtn>

                            <ArrowBtn isClicked={activeArrow === 'arrow8'}
                                      onClick={() => handleVisibility('arrow8', setActiveArrow)}>
                                <GoArrowUp/>
                            </ArrowBtn>

                        </div>

                        <p style={{margin: "5px 0 5px 0"}}>Doba přehrávání:</p>

                        <div style={{
                            display: "block",
                            width: "100%",
                            margin: "auto",
                            textAlign: "center"
                        }}>

                            <TimeInput type={"range"} min={"0"} max={"60"} value={rangeValue}
                                       onChange={(e) => {
                                           setRangeValue(+e.target.value)
                                       }}/>

                            <label>{rangeValue} s</label>
                        </div>

                    </PiecesContainer>}

            </ZaberySidebarContainer>

            <Foto id={"Foto"}>
                <canvas ref={canvasRef}></canvas>

                {/* Vybrané částice */}
                {activeItem === 'item3' && getPieces()}

                {activeItem === 'item4' && <ShowTimeline/>}

            </Foto>

            {/*<ClipTimeline>*/}


            {/*</ClipTimeline>*/}

        </ZaberyPage>
    );
}

export default Zabery;

