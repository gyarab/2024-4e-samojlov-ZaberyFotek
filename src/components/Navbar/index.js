import React from 'react';
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink

} from './NavbarComponents'


function Navbar({ toggle }) {

    return (
        <Nav>
            <NavLink to={"/"}>

                <h1>Logo</h1>

            </NavLink>

            <div onClick={toggle}>
                <Bars/>
            </div>

            <NavMenu>

                <NavLink to={"o-projektu"}>O projektu</NavLink>
                <NavLink to={"sluzby"}>Služby</NavLink>
                <NavLink to={"kontakt"}>Kontakt</NavLink>
                <NavLink to={"prihlaseni"}>Přihlášení</NavLink>

            </NavMenu>

            <NavBtn>

                <NavBtnLink to={""}>Vyzkoušet nyní</NavBtnLink>

            </NavBtn>

        </Nav>
    );
}

export default Navbar;