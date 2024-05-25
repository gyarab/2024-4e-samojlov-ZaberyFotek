import React, {useRef, useState} from 'react';
import {
    HeadDescription,
    HeadingContainer,
    HomeContainer,
    ImageArea,
    LoadedImage,
    PlusIcon,
    TextDesc,
    TextElements,
    UploadBtn
} from "./HomeElements";
import {ReactTyped} from "react-typed";

export default function Home() {

    const [isUploadBtnVisible, setIsUploadBtnVisible] = useState(true);

    // Změna rozvržení ImageArea
    const [isChanged, changeAreaDisplay] = useState(false);

    // Reference na vstupní soubor uživatele
    const fileInputRef = useRef(null);

    /** Výběr souboru uživatele **/
    const fileBtnClick = () => {
        fileInputRef.current.click();
    };

    const [imageSrc, setImageSrc] = useState(null);

    /** Funkce pro načtení obrázku **/
    const imageUpload = (event) => {

        // načtený soubor
        const file = event.target.files[0];

        if (file) {

            // Přečtení souboru
            const reader = new FileReader();

            reader.onload = (e) => {

                // Funkce pro načtení obsahu obrázku, imageSrc je získaná URL obrázku
                setImageSrc(e.target.result);
            };

            // přečtení souboru jako URL
            reader.readAsDataURL(file);
            changeAreaDisplay(!isChanged);
            setIsUploadBtnVisible(false);
        }
    };


    return (

        <HomeContainer>

            <TextElements>

                <HeadingContainer>

                    <div> Vytvářím</div>

                    <ReactTyped
                        strings={["klipy", "animace", "přechody"]}
                        typeSpeed={200}
                        loop
                        backSpeed={40}
                        cursorChar="|"
                        showCursor={true}
                        style={{
                            background: "linear-gradient(176deg, #001fff, #d3d7f8)",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            WebkitBoxDecorationBreak: "clone",
                            boxDecorationBreak: "clone",
                            textShadow: "none"
                        }}
                    />

                </HeadingContainer>

                <HeadDescription>Vytvořte si perfektní klip z jednoho obrázku</HeadDescription>

            </TextElements>

            <ImageArea isClicked={isChanged}>

                {/* Načtená fotografie */}
                {imageSrc && <img src={imageSrc} alt="Vaše fotografie"
                                  style={{width: '100%', height: '100%', objectFit: 'contain'}}/>}


                {isUploadBtnVisible && (<UploadBtn onClick={fileBtnClick}>

                        <PlusIcon/>
                        <span>Vyberte fotografii</span>

                        {/* Vstup uživatele - obrázek */}
                        <input type="file" accept="image/*" onChange={imageUpload} ref={fileInputRef} hidden/>

                    </UploadBtn>)
                }

                {isUploadBtnVisible && <TextDesc>Nebo můžete přetáhnout obrázek sem</TextDesc>}

            </ImageArea>

        </HomeContainer>
    );
};