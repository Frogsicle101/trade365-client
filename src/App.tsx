import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Registration from "./components/Registration"
import Auctions from "./pages/Auctions";
import AuctionPage from "./pages/AuctionPage";
import NotFound from "./pages/NotFound";
import UserPage from "./pages/UserPage";

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/register" element={<Registration/>}/>
                        <Route path="/auctions/:id" element={<AuctionPage/>}/>
                        <Route path="/profile" element={<UserPage/>}/>
                        <Route path="/" element={<Auctions/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
