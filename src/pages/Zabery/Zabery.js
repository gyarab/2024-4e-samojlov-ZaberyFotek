import React from 'react';
import {Foto, ZaberyPage, ZaberySidebarContainer, ZaberySidebarItem} from "./ZaberyComponents";
import {PiNumberCircleOne, PiNumberCircleTwo} from "react-icons/pi";

function Zabery(props) {

    return (

        <ZaberyPage>

            <ZaberySidebarContainer>

                <h3 style={{textAlign: "center", color: "white", fontSize: "20px", background: "var(--color-blue-4)", borderRadius: "15px", marginBottom: "10px", letterSpacing: "1px", padding: "15px"}}>NÁVOD NA KLIP</h3>

                <ZaberySidebarItem><PiNumberCircleOne style={{height: "35px", width: "35px"}} />Rozdělení na části</ZaberySidebarItem>

                <ZaberySidebarItem><PiNumberCircleTwo style={{height: "35px", width: "35px"}} /> Upravit obrázek</ZaberySidebarItem>

            </ZaberySidebarContainer>

            <Foto>
                <img src={props.image}/>
            </Foto>

        </ZaberyPage>
    );
}

export default Zabery;