import React from 'react';
import {Descript, Heading, HomeContainer, TextElements} from "./HomeElements";

export default function Home() {

    return (

        <HomeContainer>

            <TextElements>

                <Heading> Umím vytvořit </Heading>

                <Descript> Tento nástroj dokáže vytvořit z vybraných částí obrázku klip dle vašich představ </Descript>

            </TextElements>

            {/*<UploadArea>*/}

            {/*    <CircleIcon />*/}
            {/*    <PhotoSelectBtn>Vyberte fotografii</PhotoSelectBtn>*/}
            {/*    <p>Nebo sem přetáhněte obrázek</p>*/}

            {/*</UploadArea>*/}

        </HomeContainer>
    );
};