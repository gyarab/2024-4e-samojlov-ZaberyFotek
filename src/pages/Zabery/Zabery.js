import React, {useEffect, useRef, useState} from 'react';
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


    const [x, setAsX] = useState(false);

    // Přidat/Odebrat sloupce/řádky
    const operationHandler = (operation, type, setType) => {

        if (operation === "+") {

            setType(type + 1);

        } else {

            if (type !== 1){

                setType(type - 1);
            }
        }
    };

    return (

        <ZaberyPage>

            <ZaberySidebarContainer>

                <h3 style={{textAlign: "center", color: "white", fontSize: "20px", background: "var(--color-blue-4)", borderRadius: "15px", marginBottom: "10px", letterSpacing: "1px", padding: "15px"}}>NÁVOD NA KLIP</h3>

                <ZaberySidebarItem isClicked={isVisible} onClick={() => setIsVisible(!isVisible)}><PiNumberCircleOne style={{height: "35px", width: "35px"}} />Rozdělení na části</ZaberySidebarItem>

                {isVisible && (
                    <PiecesContainer>
                        <p>Sloupce:</p>

                        <div style={{display: "inline-flex", margin: "12px 0 18px 0", width: "100%"}}>
                            <ShowNum>{column}</ShowNum>
                            <AddBtn onClick={() => operationHandler("+", column, setAsColumns)}><PlusCircleIcon style={{color: "var(--color-shadow-7)"}}/></AddBtn>
                            <AddBtn onClick={() => operationHandler("-", column, setAsColumns)}><MinusCircleIcon style={{color: "var(--color-shadow-7)"}}/></AddBtn>
                        </div>

                        <p>Řádky:</p>

                        <div style={{display: "inline-flex", margin: "12px 0 18px 0", width: "100%"}}>
                            <ShowNum>{row}</ShowNum>
                            <AddBtn onClick={() => operationHandler("+", row, setAsRows)}><PlusCircleIcon style={{color: "var(--color-shadow-7)"}}/></AddBtn>
                            <AddBtn onClick={() => operationHandler("-", row, setAsRows)}><MinusCircleIcon style={{color: "var(--color-shadow-7)"}}/></AddBtn>
                        </div>

                    </PiecesContainer>
                )}

                <ZaberySidebarItem><PiNumberCircleTwo style={{height: "35px", width: "35px"}}/> Upravit
                    obrázek</ZaberySidebarItem>

            </ZaberySidebarContainer>

            <Foto>

                <img src={props.image} alt={"Vaše fotografie"} />

                <HorizontalLine />

            </Foto>

        </ZaberyPage>
    );
}

export default Zabery;