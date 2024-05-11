import React, {useState, useEffect} from 'react';
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink

} from './NavbarComponents'


function Navbar({toggle}) {

    /** Zdroj: https://github.com/cyrus8050/yt-react-navbar-transition/blob/master/src/Navbar.js **/

    const [show, setShow] = useState(true)
    const controlNavbar = () => {

        console.log(window.scrollY);

        if (window.scrollY > 250) {

            setShow(false)

        } else {

            setShow(true)
        }
    }

    useEffect(() => {

        controlNavbar();

        window.addEventListener('scroll', controlNavbar)

        return () => {
            window.removeEventListener('scroll', controlNavbar)
        }

    }, []);


    if (show) {

        return (

            <Nav>

                <NavLink to={"/"}>

                    <div>Logo</div>

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
}

export default Navbar;