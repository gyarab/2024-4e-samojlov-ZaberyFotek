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
    ZaberySidebarItem
} from "./ZaberyComponents";
import {PiNumberCircleFour, PiNumberCircleOne, PiNumberCircleThree, PiNumberCircleTwo} from "react-icons/pi";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/16/solid";

function Zabery(props) {

    let [vertIndex, setVertIndex] = useState(0);

    let [horIndex, setHorIndex] = useState(0);

    // Přidávání jednotlivých linií
    const [items, setItems] = useState([]);

    /** Funkce pro přidání nové linie **/
    const addItem = (newItem) => {

        const updatedItems = [...items, newItem];

        console.log('Updated Items:', updatedItems);

        setItems(updatedItems);
    };

    /** Funkce pro odstranění linie **/
    const deleteItemById = (id, type) => {

        setItems((prevItems) => {

            console.log('Deleted Items:' , prevItems.filter(item => item.id !== id && item.type !== type));

            return prevItems.filter(item => item.id !== id && item.type !== type);
        });
    };

    // Aktivní prvek v seznamu
    const [activeItem, setActiveItem] = useState(null);

    // Funkce pro zobrazení jednoho prvku
    const handleVisibility = (item) => {
        setActiveItem(prevActiveItem => (prevActiveItem === item ? null : item));
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

            // Přidání sloupce
            if (word === "columnAdd") {

                // Přidání vertikální čáry uprostřed plátna
                newLines.vertical.push(canvasRef.current.width / (type + 2));

                addItem({id: vertIndex, type: 'vertical', x: canvasRef.current.width / (type + 2)});

                setVertIndex(vertIndex);

                console.log(vertIndex);

            } else {

                // Přidání horizontální čáry uprostřed plátna
                newLines.horizontal.push(canvasRef.current.height / (type + 2));

                addItem({id: horIndex, type: 'horizontal', x: canvasRef.current.height / (type + 2)});

                setHorIndex(horIndex);
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

                    deleteItemById(vertIndex, 'vertical');

                // Odstranění horizontální linie
                } else {

                    newLines.horizontal.pop();

                    deleteItemById(horIndex, 'horizontal');
                }

                setLines(newLines);
            }
        }

        console.log(items);

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

        // Obsah obrázku
        image.src = props.image;

        // Načtení obrázku
        image.onload = () => {

            // Vlastní responzivita obrázku
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
        };

    };

    /** Funkce pro kontrolu, zda se linie existuje  **/
    const lineCheck = (hook, index, type, coordinates, newData) => {

        let itemExists = false;

        let idLine = 0;

        let typeLine = '';

        hook.forEach((x) => {

            if (x.id === dragging.index && x.type === dragging.type) {

                idLine = x.id;
                typeLine = x.type;
                itemExists = true;
            }
        });

        // Pokud linie nebyla přidána
        if (!itemExists) {

            // Přidání linie
            addItem({id: index, type: type, x: coordinates});

        // Obnovení hodnoty linie
        } else {

            // Funkce pro obnovení proměnné items
            setItems((prevItems) => {

                const index = prevItems.findIndex((item) => item.id === idLine && item.type === typeLine);

                // Prvek je nalezen
                if (index !== -1) {

                    const updatedItems = [...prevItems];

                    // Obnovení hodnoty
                    updatedItems[index] = { ...updatedItems[index], ...newData };

                    return updatedItems;
                }

                return prevItems;
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

                lines.vertical[dragging.index] = mouseX - startOffset.x;

                lineCheck(items, dragging.index, 'vertical', mouseX - startOffset.x, {id: dragging.index, type: 'vertical', x: mouseX - startOffset.x});

                cursor = 'ew-resize';

                setVertIndex(dragging.index);

            } else if (dragging.type === 'horizontal') {

                lines.horizontal[dragging.index] = mouseY - startOffset.y;

                lineCheck(items, dragging.index, 'horizontal', mouseY - startOffset.y, {id: dragging.index, type: 'horizontal', x: mouseY - startOffset.y});

                cursor = 'ns-resize';

                setHorIndex(dragging.index);
            }

            console.log(items);

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

    const getPieces = () => {

        const canvas = canvasRef.current;

        let context = canvas.getContext("2d");
        const image = new Image();

        // Obsah obrázku
        image.src = props.image;

        context.drawImage(image, 10, 10,
            300, 175, 0, 0, 100, 175);
    }

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
                                   onClick={() => handleVisibility('item1')}>

                    <PiNumberCircleOne style={{height: "35px", width: "35px"}}/> Rozdělení na části

                </ZaberySidebarItem>

                {activeItem === 'item1' && (

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

                {/* Vybrané částice */}
                {/*{activeItem === 'item2' && (getPieces())}*/}

                <ZaberySidebarItem isClicked={activeItem === 'item2'}
                                   onClick={() => handleVisibility('item2')}>

                    <PiNumberCircleThree style={{height: "35px", width: "35px"}}/> Rozdělit na obrázky

                </ZaberySidebarItem>

                <ZaberySidebarItem>

                    <PiNumberCircleFour style={{height: "35px", width: "35px"}}/> Vytvořit klipy

                </ZaberySidebarItem>

            </ZaberySidebarContainer>

            <Foto id={"Foto"}>
                <canvas ref={canvasRef}></canvas>
            </Foto>

        </ZaberyPage>
    );
}

export default Zabery;

