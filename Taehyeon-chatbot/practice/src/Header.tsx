import React from 'react';
import { Link } from 'react-router-dom';
import './css/Header.css';

const Header: React.FC = () => (
    <nav className="navbar">
        <ul className="nav-list">
            <li className="nav-item">
                <Link to="/">Home</Link>
            </li>
            <li className="nav-item">
                <Link to="/login">Login</Link>
            </li>
        </ul>
    </nav>
);

export default Header;
