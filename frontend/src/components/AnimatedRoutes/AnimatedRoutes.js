import {Route, Routes, useLocation} from "react-router-dom";
import Transition from "../../Transition";
import Home from "../../pages/Home/Home";
import Oprojektu from "../../pages/O projektu/Oprojektu";
import {AnimatePresence} from "framer-motion";
import React, {useState} from "react";
import Zabery from "../../pages/Zabery/Zabery";
import Login from "../../pages/Prihlaseni/Login";
import SignUp from "../../pages/Registrace/SignUp";
import ForgotPassword from "../../pages/ZapomenuteHeslo/ForgotPassword";

function AnimatedRoutes(props) {

    const location = useLocation();

    const [image, setImage] = useState(null)

    return (

        <AnimatePresence mode="wait">

            <Routes location={location} key={location.pathname}>

                <Route path="/" element={<Home setImage={setImage}/>}/>
                <Route path="o-projektu" element={<Oprojektu />}/>
                <Route path="zabery" element={<Zabery image={image}/>}/>
                <Route path="prihlaseni" element={<Login />}/>
                <Route path="registrace" element={<SignUp />}/>
                <Route path="zapomenute-heslo" element={<ForgotPassword />}/>

            </Routes>

        </AnimatePresence>

    );
}

export default AnimatedRoutes;

