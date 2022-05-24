import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Registration from "./pages/Registration"
import Auctions from "./pages/Auctions";

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/register" element={<Registration/>}/>
                        <Route path="/" element={<Auctions/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
