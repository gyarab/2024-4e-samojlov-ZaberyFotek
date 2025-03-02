import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter as Router} from 'react-router-dom';
import Navbar from "./components/Navbar/Nav";
import Sidebar from "./components/Sidebar";
import AnimatedRoutes from "./components/AnimatedRoutes/AnimatedRoutes";

function App() {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    };

    return (

        <Router basename={"/"}>

            <Navbar toggle={toggle}/>

            <Sidebar isOpen={isOpen} toggle={toggle}/>

            <AnimatedRoutes />

        </Router>

    );
}


export default App;
