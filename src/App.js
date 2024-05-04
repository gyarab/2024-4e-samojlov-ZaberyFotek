import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Oprojektu from "./pages/Oprojektu";

function App() {

    return (
        <Router>

            <Routes>

                <Route path="/" element={<Home />}/>
                <Route path="/o-projektu" element={<Oprojektu />}/>

            </Routes>


        </Router>
    );
}

export default App;
