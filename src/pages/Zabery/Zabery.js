import React, {useEffect, useRef, useState} from 'react';
import {
    AddBtn,
    Foto,
    PiecesContainer,
    ShowNum,
    ZaberyPage,
    ZaberySidebarContainer,
    ZaberySidebarItem
} from "./ZaberyComponents";
import {PiNumberCircleOne, PiNumberCircleTwo} from "react-icons/pi";
import {MinusCircleIcon, PlusCircleIcon} from "@heroicons/react/16/solid";

function Zabery(props) {

    const [isVisible, setIsVisible] = useState(false);
    const [row, setAsRows] = useState(0);
    const [column, setAsColumns] = useState(0);

    // Ukládání dat o liniích
    const [lines, setLines] = useState({vertical: [], horizontal: []});

    // Inicializace plochy
    const canvasRef = useRef(null);

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

        // Překreslení plochy
        drawCanvas();
    };

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
            canvas.width = image.width;
            canvas.height = image.height;

            // Vykreslení obrázku do plochy
            ctx.drawImage(image, 0, 0);

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

            <Foto>
                <canvas ref={canvasRef}></canvas>
            </Foto>

        </ZaberyPage>
    );
}

export default Zabery;