import {Route, Routes, useLocation} from "react-router-dom";
import Transition from "../../Transition";
import Home from "../../pages/Home/Home";
import Oprojektu from "../../pages/O projektu/Oprojektu";
import {AnimatePresence} from "framer-motion";
import React from "react";
import Zabery from "../../pages/Zabery/Zabery";

function AnimatedRoutes() {

    const location = useLocation();

    return (

        <AnimatePresence mode="wait">

            <Routes location={location} key={location.pathname}>

                <Route path="/" element={<Transition Component={Home}/>}/>
                <Route path="o-projektu" element={<Transition Component={Oprojektu}/>}/>
                <Route path="zabery" element={<Transition Component={Zabery}/>}/>

            </Routes>

        </AnimatePresence>

    );
}

export default AnimatedRoutes;

