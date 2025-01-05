import React, {useState, useEffect} from 'react';
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink, UserProfile

} from './NavbarComponents'
import {useNavigate} from "react-router-dom";

/** Funkce zobrazující navigační panel **/
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

    // Přesměrování uživatele
    const navigate = useNavigate();

    const loggedInUser = localStorage.getItem("user");

    console.log(loggedInUser);

    // localStorage.clear();

    const data = JSON.parse(loggedInUser);

    const firstLetter = data?.username?.charAt(0);

    const icon = data?.image;

    console.log("icon", icon, "first", firstLetter);

    useEffect(() => {

        controlNavbar();

        window.addEventListener('scroll', controlNavbar);

        // Pokud uživatel není zaregistrovaný, dojde k přesměrování na adresu přihlášení
        // if (!loggedInUser) {
        //     navigate('/prihlaseni');
        // }

        return () => {
            window.removeEventListener('scroll', controlNavbar)
        }

    }, [loggedInUser]);


    return (

        <Nav show={show}>

            <NavLink to={"/"}>

                <img
                    style={{
                        width: "75px",
                        height: "75px"
                    }}
                    src={"zaberyLogo.png"}
                    alt={"Logo - Záběry Fotek"}/>

                <p style={{marginLeft: "15px"}}>Záběry</p>

            </NavLink>

            <div onClick={toggle}>
                <Bars/>
            </div>

            <NavMenu>

                <NavLink to={"o-projektu"}>O projektu</NavLink>
                <NavLink to={"sluzby"}>Služby</NavLink>
                <NavLink to={"kontakt"}>Kontakt</NavLink>
                <NavLink to={""}>Vyzkoušet nyní</NavLink>

            </NavMenu>

            <NavBtn>

                {loggedInUser ?

                    (icon ?
                        <UserProfile to={"ucet"}
                            style={{
                                backgroundImage: `url(${icon})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}/> :
                        <UserProfile style={{background: '#fc555f'}} to={"ucet"}>{firstLetter}</UserProfile>) :

                    <NavBtn>
                        <NavLink to={"prihlaseni"}>Přihlášení</NavLink>
                        <NavBtnLink to={"registrace"}>Registrace</NavBtnLink>
                    </NavBtn>}

            </NavBtn>

        </Nav>
    );

}

export default Navbar;