import React from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Registration from "./pages/Registration"

const rootUrl = "http://localhost:3000/api/vi/"

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="/register" element={<Registration/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;
