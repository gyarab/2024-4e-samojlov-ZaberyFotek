import React, {useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import Home from './pages/Home/Home';
import Oprojektu from "./pages/O projektu/Oprojektu";
import Navbar from "./components/Navbar/Nav";
import Sidebar from "./components/Sidebar";
import {AnimatePresence} from "framer-motion";
import Transition from "./Transition";
import AnimatedRoutes from "./components/AnimatedRoutes/AnimatedRoutes";

function App() {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    };

    return (

        <Router>

            <Navbar toggle={toggle}/>

            <Sidebar isOpen={isOpen} toggle={toggle}/>

            <AnimatedRoutes />

        </Router>

    );
}


export default App;
