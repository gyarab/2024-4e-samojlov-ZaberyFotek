import React from 'react';
import {
    BtnArea,
    Descript,
    HeadDescription,
    HeadingContainer,
    HomeContainer,
    ImageArea, PlusIcon, TextArea, TextElement,
    TextElements,
    Typing, UploadBtn
} from "./HomeElements";
import {ReactTyped} from "react-typed";
import {Icon} from "../../components/Sidebar/SidebarComponents";
import {FaIcons, FaPlus} from "react-icons/fa";

export default function Home() {

    return (

        <HomeContainer>

            <TextElements>

                <HeadingContainer>

                    <div> Vytvářím klipy</div>

                    {/*<ReactTyped*/}
                    {/*    strings={["klipy", "animace", "přechody"]}*/}
                    {/*    typeSpeed={200}*/}
                    {/*    loop*/}
                    {/*    backSpeed={40}*/}
                    {/*    cursorChar="|"*/}
                    {/*    showCursor={true}*/}
                    {/*    style={{*/}
                    {/*        background: "linear-gradient(176deg, #0075c9, #76c2b6)",*/}
                    {/*        backgroundClip: "text",*/}
                    {/*        WebkitTextFillColor: "transparent",*/}
                    {/*        WebkitBoxDecorationBreak: "clone",*/}
                    {/*        boxDecorationBreak: "clone",*/}
                    {/*        textShadow: "none"*/}
                    {/*    }}*/}
                    {/*/>*/}

                </HeadingContainer>

                <HeadDescription>Vytvořte si perfektní klip z jednoho obrázku</HeadDescription>

            </TextElements>

            <ImageArea>

                <TextArea>

                    <UploadBtn>
                        <PlusIcon/>
                        <span>Vyberte fotografii</span>
                    </UploadBtn>

                    <TextElement>Nebo můžete přetáhnout obrázek sem</TextElement>

                </TextArea>


                {/*<UploadText>*/}


                {/*</UploadText>*/}

            </ImageArea>

            {/*<UploadArea>*/}

            {/*    <CircleIcon />*/}
            {/*    <PhotoSelectBtn>Vyberte fotografii</PhotoSelectBtn>*/}
            {/*    <p>Nebo sem přetáhněte obrázek</p>*/}

            {/*</UploadArea>*/}

        </HomeContainer>
    );
};