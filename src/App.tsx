import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Registration from "./components/Registration"
import Auctions from "./pages/Auctions";
import AuctionPage from "./pages/AuctionPage";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/register" element={<Registration/>}/>
                        <Route path="/auctions/:id" element={<AuctionPage/>}/>
                        <Route path="/" element={<Auctions/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
