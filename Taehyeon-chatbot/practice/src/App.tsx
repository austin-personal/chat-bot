import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Login from './Login';
import Body from './Body';
import './App.css';

const App: React.FC = () => (
    <Router>
        <Header />
        <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </Router>
);

export default App;