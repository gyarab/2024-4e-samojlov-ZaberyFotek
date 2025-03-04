import React, {useEffect, useState} from 'react';
import {Bars, Nav, NavBtn, NavBtnLink, NavLink, NavMenu, UserProfile} from './NavbarComponents'
import {useLocation, useNavigate} from "react-router-dom";

/** Funkce zobrazující navigační panel **/
function Navbar({toggle}) {

    /** Zdroj: https://github.com/cyrus8050/yt-react-navbar-transition/blob/master/src/Navbar.js **/

    const [show, setShow] = useState(true)

    /** Zobrazení Navbaru podle osy Y **/
    const controlNavbar = () => {

        if (window.scrollY > 250) {

            setShow(false)

        } else {

            setShow(true)
        }
    }

    const loggedInUser = localStorage.getItem("user");

    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/ucet") {
            console.log("Logged in user when on /ucet:", loggedInUser);
        }
    }, [location, loggedInUser]);

    console.log(loggedInUser);

    const data = JSON.parse(loggedInUser);

    const firstLetter = data?.username?.charAt(0);

    const [icon, setIcon] = useState(data?.image || false);

    console.log("icon", icon, "first", firstLetter);

    useEffect(() => {
        if (data?.image) {
            const loadedIcon = new Image();
            loadedIcon.src = data.image;

            loadedIcon.onload = () => setIcon(data.image);
            loadedIcon.onerror = () => setIcon(false);
        }
    }, [data?.image]);

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

    }, [loggedInUser, data]);

    /** Zjištění chyby při načtení obrázku **/
    const handleImageError = (event) => {
        console.error("Chyba načtení fotografie", event.target.src);
        setIcon(false);
    };


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

                <NavLink to={"/o-projektu"}>O projektu</NavLink>
                <NavLink to={"/kontakt"}>Kontakt</NavLink>
                <NavLink to={"/"}>Vyzkoušet nyní</NavLink>

            </NavMenu>

            <NavBtn>

                {loggedInUser ?

                    (icon ?
                        <UserProfile to={"/ucet"}
                        >
                            <img
                                src={icon.toString()}
                                alt={'Ikona Google'}
                                onError={handleImageError}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                referrerPolicy="no-referrer"
                            />
                        </UserProfile> :
                        <UserProfile style={{background: '#fc555f'}} to={"/ucet"}>{firstLetter}</UserProfile>) :

                    <NavBtn>
                        <NavLink to={"/prihlaseni"}>Přihlášení</NavLink>
                        <NavBtnLink to={"/registrace"}>Registrace</NavBtnLink>
                    </NavBtn>}

            </NavBtn>

        </Nav>
    );

}

export default Navbar;