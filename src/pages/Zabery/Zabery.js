import React, {useEffect, useRef, useState} from 'react';
import {
    AddBtn,
    Foto,
    PiecesContainer,
    ShowNum,
    TextZ,
    HorizontalLine,
    ZaberyPage,
    ZaberySidebarContainer,
    ZaberySidebarItem, FotoContainer, CanvasImage
} from "./ZaberyComponents";
import {PiNumberCircleOne, PiNumberCircleTwo} from "react-icons/pi";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/16/solid";

function Zabery(props) {

    const [isVisible, setIsVisible] = useState(false);
    const [row, setAsRows] = useState(0);
    const [column, setAsColumns] = useState(0);

    // Ukládání dat o liniích
    const [lines, setLines] = useState({vertical: [], horizontal: []});

    const [dragging, setDragging] = useState(null);

    // Inicializace plochy
    const canvasRef = useRef(null);

    const [startOffset, setStartOffset] = useState(null);

    /** Funkce pro přidání nebo odebrání řádků **/
    const operationHandler = (operation, type, setType, word) => {

        // Přidávání linií
        if (operation === "+") {

            setType(type + 1);

            // Akutální počet linií
            const newLines = {...lines};

            // Přidání sloupce
            if (word === "columnAdd") {

                // Přidání vertikální čáry uprostřed plátna
                newLines.vertical.push(canvasRef.current.width / (type + 2));

            } else {

                // Přidání horizontální čáry uprostřed plátna
                newLines.horizontal.push(canvasRef.current.height / (type + 2));
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

                    // Odstranění horizontální linie
                } else {
                    newLines.horizontal.pop();
                }

                setLines(newLines);
            }
        }

        // Překreslení plochy
        drawCanvas();
    };

    useEffect(() => {
        function handleResize() {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth * 0.75;
                drawCanvas();
            }
        }

        handleResize(); // Initial call to set size and draw canvas

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, [props.image]);

    /** Vykreslení plochy **/
    const drawCanvas = () => {

        // Inicializace plochy
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Obrázek
        const image = new Image();

        // Obsah obrázku
        image.src = props.image;

        // Načtení obrázku
        image.onload = () => {

            // Nastavení parametrů plochy na parametry obrázku
            canvas.width = window.innerWidth * 0.75;
            canvas.height = image.height;

            // Vykreslení obrázku do plochy
            ctx.drawImage(image, 0, 0,canvas.width, canvas.height);

            // Barva linie
            ctx.strokeStyle = 'red';

            // Tloušťka linie
            ctx.lineWidth = 10;

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
        };

    };

    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let closestLine = null;

        let minDistance = Infinity;

        lines.vertical.forEach((x, index) => {

            const distance = Math.abs(mouseX - x);

            if (distance < minDistance) {

                minDistance = distance;
                closestLine = {type: 'vertical', index, x};
            }
        });

        lines.horizontal.forEach((y, index) => {

            const distance = Math.abs(mouseY - y);

            if (distance < minDistance) {
                minDistance = distance;
                closestLine = {type: 'horizontal', index, y};
            }
        });

        if (closestLine) {

            setDragging(closestLine);

            if (closestLine.type === 'vertical') {

                setStartOffset({x: mouseX - closestLine.x, y: mouseY});

            } else {

                setStartOffset({x: mouseX, y: mouseY - closestLine.y});
            }
        }
    };

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let cursor = 'default';

        if (dragging) {

            console.log(`Vertical lines: ${lines.vertical.join(', ')}`);
            console.log(`Horizontal lines: ${lines.horizontal.join(', ')}`);

            if (dragging.type === 'vertical') {

                lines.vertical[dragging.index] = mouseX - startOffset.x;
                cursor = 'ew-resize';

            } else if (dragging.type === 'horizontal') {

                lines.horizontal[dragging.index] = mouseY - startOffset.y;
                cursor = 'ns-resize';
            }

            setLines({...lines});
            drawCanvas();

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

    const handleMouseUp = () => {

        setDragging(null);
        setStartOffset(null);
    };

    // Set up event listeners for mouse actions on the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        // Clean up event listeners on component unmount
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, [lines, dragging]);

    // Vykreslení obrázku a plochy
    useEffect(() => {
        drawCanvas();
    }, [props.image]);

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

                <ZaberySidebarItem isClicked={isVisible} onClick={() => setIsVisible(!isVisible)}>

                    <PiNumberCircleOne style={{height: "35px", width: "35px"}}/> Rozdělení na části

                </ZaberySidebarItem>

                {isVisible && (

                    <PiecesContainer>

                        <p>Sloupce:</p>

                        <div style={{display: "inline-flex", margin: "12px 0 18px 0", width: "100%"}}>

                            <ShowNum>{column}</ShowNum>

                            <AddBtn onClick={() => operationHandler("+", column, setAsColumns, "columnAdd")}>
                                <PlusCircleIcon style={{color: "var(--color-shadow-7)"}}/>
                            </AddBtn>

                            <AddBtn onClick={() => operationHandler("-", column, setAsColumns, "columnDel")}>
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

                <ZaberySidebarItem>

                    <PiNumberCircleTwo style={{height: "35px", width: "35px"}}/> Upravit obrázek

                </ZaberySidebarItem>

            </ZaberySidebarContainer>

            <Foto id={"Foto"}>
                <canvas ref={canvasRef}></canvas>
            </Foto>

        </ZaberyPage>
    );
}

export default Zabery;


/* make on added lines  horizontal/vertical draggable effect: import React, {useEffect, useRef, useState} from 'react';
import {
AddBtn,
Foto,
PiecesContainer,
ShowNum,
TextZ, HorizontalLine,
ZaberyPage,
ZaberySidebarContainer,
ZaberySidebarItem
} from "./ZaberyComponents";
import {PiNumberCircleOne, PiNumberCircleTwo} from "react-icons/pi";
import {DefaultBtn, PlusIcon} from "../Home/HomeElements";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/16/solid";

function Zabery(props) {

const [isVisible, setIsVisible] = useState(false);

// Počet řádků
const [row, setAsRows] = useState(1);

// Počet sloupců
const [column, setAsColumns] = useState(1);


// Přidat/Odebrat sloupce/řádky
const operationHandler = (operation, type, setType, word) => {

const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');

if (operation === "+") {

setType(type + 1);

if (word === "columnAdd") {

// Přidání vertikální linie
drawLine(canvas, ctx, (canvas.width / 2), 0, (canvas.width / 2), canvas.height);

} else {

// Přidání horizontální linie
drawLine(canvas, ctx, 0, (canvas.height / 2), canvas.width, (canvas.height / 2));
}

} else {

if (type !== 1) {

setType(type - 1);

if (word === "columnDel" || word === "rowDel") {

ctx.clearRect(0, 0, canvas.width, canvas.height);

}

const image = new Image();

drawImage(image, canvas, ctx);
}
}
};

const drawImage = (image, canvas, ctx) => {

// Nastavení obsahu obrázku
image.src = props.image;

image.onload = () => {

// Nastavení velikosti plochy na velikost obrázku
canvas.width = image.width;
canvas.height = image.height;

// Vykreslení fotografie uživatele
ctx.drawImage(image, 0, 0);

ctx.beginPath();

// drawLine(canvas, ctx);
};
}

/** Funkce pro přidání linie **/

/*
const drawLine = (canvas, ctx, startX, startY, endX, endY) => {

    // Počáteční bod
    ctx.moveTo(startX, startY);

    // Konečný bod
    ctx.lineTo(endX, endY);

    // Barva
    ctx.strokeStyle = 'red';

    // Šířka
    ctx.lineWidth = 5;

    ctx.stroke();
}

/** Inicializace plochy **/
/*
const canvasRef = useRef(null);

useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const image = new Image();

    drawImage(image, canvas, ctx);


}, [props.image]);

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

            <ZaberySidebarItem isClicked={isVisible} onClick={() => setIsVisible(!isVisible)}><PiNumberCircleOne
                style={{height: "35px", width: "35px"}}/>Rozdělení na části</ZaberySidebarItem>

            {isVisible && (
                <PiecesContainer>
                    <p>Sloupce:</p>

                    <div style={{display: "inline-flex", margin: "12px 0 18px 0", width: "100%"}}>
                        <ShowNum>{column}</ShowNum>
                        <AddBtn
                            onClick={() => operationHandler("+", column, setAsColumns, "columnAdd")}><PlusCircleIcon
                            style={{color: "var(--color-shadow-7)"}}/></AddBtn>
                        <AddBtn
                            onClick={() => operationHandler("-", column, setAsColumns, "columnDel")}><MinusCircleIcon
                            style={{color: "var(--color-shadow-7)"}}/></AddBtn>
                    </div>

                    <p>Řádky:</p>

                    <div style={{display: "inline-flex", margin: "12px 0 18px 0", width: "100%"}}>
                        <ShowNum>{row}</ShowNum>
                        <AddBtn onClick={() => operationHandler("+", row, setAsRows, "rowAdd")}><PlusCircleIcon
                            style={{color: "var(--color-shadow-7)"}}/></AddBtn>
                        <AddBtn onClick={() => operationHandler("-", row, setAsRows, "rowDel")}><MinusCircleIcon
                            style={{color: "var(--color-shadow-7)"}}/></AddBtn>
                    </div>

                </PiecesContainer>
            )}

            <ZaberySidebarItem><PiNumberCircleTwo style={{height: "35px", width: "35px"}}/> Upravit
                obrázek</ZaberySidebarItem>

        </ZaberySidebarContainer>

        <Foto>

            {/*<img src={props.image} alt={"Vaše fotografie"} />*/
/*
            <canvas
                ref={canvasRef}
            >

            </canvas>

        </Foto>

    </ZaberyPage>
);
}

export default Zabery; */