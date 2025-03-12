import React, {useCallback, useRef, useState} from 'react';
import {
    ArrowIcon,
    DefaultBtn,
    HeadDescription,
    HeadingContainer,
    HomeContainer,
    ImageArea,
    PlusIcon,
    TextDesc,
    TextElements,
} from "./HomeElements";
import {ReactTyped} from "react-typed";
import {Resizable} from "re-resizable";
import {Resizer} from "re-resizable/lib/resizer";
import {useNavigate} from "react-router-dom";

/** Obrazovka - Domovská stránka **/
function Home(props) {

    // Kontrola, zda je tlačítko zobrazeno
    const [isUploadBtnVisible, setIsUploadBtnVisible] = useState(true);

// Změna rozvržení ImageArea
    const [isChanged, changeAreaDisplay] = useState(false);

// Reference na vstupní soubor uživatele
    const fileInputRef = useRef(null);

    /** Výběr souboru uživatele **/
    const fileBtnClick = () => {
        fileInputRef.current.click();
    };

// Obsah fotky (nyní pole pro více obrázků)
    const [imageSrcs, setImageSrcs] = useState([]);

    /** Funkce pro načtení obrázku **/
    const imageUpload = (event) => {
        const files = event.target.files;

        if (files?.length > 3) {
            alert("Maximálně můžete nahrát 3 fotografie.");
            return;
        }

        if (files) {
            const newImageSrcs = Array.from(files).map(file => URL.createObjectURL(file));
            setImageSrcs(prevImages => [...prevImages, ...newImageSrcs]); // Přidání nových obrázků do seznamu
            changeAreaDisplay(!isChanged);
            setIsUploadBtnVisible(false);

            // Reset úložiště
            localStorage.setItem('savedImage', newImageSrcs.toString());
            //props.setImage(newImageSrcs);
        }
    };

// Přesměrování na jinou adresu
    const navigate = useNavigate();

    /** Přesměrování **/
    const redirectPage = () => {
        navigate("/zabery");
    };

// Proměnná pro stav přetahování
    const [isDragging, setIsDragging] = useState(false);

    /** Kurzor se nachází nad plochou **/
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    /** Ukončení přetažení obrázku **/
    const handleDragLeave = () => {
        setIsDragging(false);
    };

    /** Položení obrázku na plochu **/
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files) {
            const newImageSrcs = Array.from(files).map(file => URL.createObjectURL(file));
            setImageSrcs(prevImages => [...prevImages, ...newImageSrcs]);
        }
    };

    return (
        <HomeContainer>

            <TextElements>

                <HeadingContainer>

                    <div> Vytvářím</div>

                    <ReactTyped
                        strings={["klipy", "animace", "přechody", "snímky", "efekty", "videa", "částice"]}
                        typeSpeed={200}
                        loop
                        backSpeed={40}
                        cursorChar="|"
                        showCursor={true}
                        style={{
                            background: "linear-gradient(176deg, #001fff, #d3d7f8)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            WebkitBoxDecorationBreak: "clone",
                            boxDecorationBreak: "clone",
                            textShadow: "none"
                        }}
                    />

                </HeadingContainer>

                <HeadDescription>Vytvořte si perfektní klip z jednoho obrázku</HeadDescription>

            </TextElements>

            <ImageArea
                isClicked={isChanged}
                backgroundIsVisible={isChanged}
                imageHeight={isChanged}
                imageWidth={isChanged}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={isDragging ? "drag-over" : ""}
            >
                {/* Zobrazení všech vybraných obrázků */}
                {imageSrcs.length > 0 && imageSrcs.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Vaše fotografie ${index + 1}`}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            padding: "25px",
                        }}
                    />
                ))}

                {isUploadBtnVisible && (
                    <DefaultBtn onClick={fileBtnClick}>
                        <PlusIcon />
                        <span>Vyberte fotografii</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={imageUpload}
                            ref={fileInputRef}
                            max={3}
                            hidden
                            multiple
                        />
                    </DefaultBtn>
                )}

                {isUploadBtnVisible && <TextDesc>Nebo můžete přetáhnout obrázek sem</TextDesc>}
            </ImageArea>

            {imageSrcs.length > 0 && <DefaultBtn onClick={() => redirectPage()}>Pokračovat <ArrowIcon/> </DefaultBtn>}

        </HomeContainer>
    );
}

export default Home;