import React, {useState, useEffect} from 'react'
import './App.css';
import {
    BrowserRouter as Router,
    Routes, Route, Link
} from 'react-router-dom'
import jwt_decode from "jwt-decode"

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Home from './components/Home'
import Post from './components/Post'
import Register from './components/Register'
import Login from './components/Login'

const App = () => {
    const link = {
        margin: 5,
        fontSize: 18
    }

    /**
     * State kirjautumisen näyttämiselle
     */
    const [logged, setLogged] = useState(false);

    /**
     * Tarkastaa 15 sekunnin välein ovatko käyttäjän kirjautumistiedot vanhentuneet
     */
    useEffect(() => {
        const interval = setInterval(() => {
            const tokenString = localStorage.getItem('token');
            if (tokenString !== null) {
                const decodedToken = jwt_decode(tokenString);
                if (Date.now() > decodedToken.exp * 1000) {
                    logout();
                } else {
                    setLogged(true);
                }
            } else {
                setLogged(false);
            }
        }, 15000);
        return () => clearInterval(interval)
    }, []);

    /**
     * Poistaa selaimen localStorage -muistista tokenin
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLogged(false);
    }

    return (
        <Router>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">₱ꞫḸἷ ἷⱭꝪⱯⱿ</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link style={link} to="/">Home</Link>
                            {logged && <Link style={link} to="/post">Post idea</Link>}
                            {!logged && <Link style={link} to="/register">Register</Link>}
                            {!logged && <Link style={link} to="/login">Login</Link>}
                        </Nav>
                        <Nav>
                            {logged &&
                                <Navbar.Text>Signed in as: {JSON.parse(localStorage.getItem('user'))}</Navbar.Text>}
                            {logged && <Link style={link} onClick={logout}>Logout</Link>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>


            <div className="container">
            </div>

            <Routes>
                <Route index element={<Home/>}/>
                <Route path="post" element={<Post/>}/>
                <Route path="register" element={<Register handleRegister={() => setLogged(true)}/>}/>
                <Route path="login" element={<Login handleLogin={() => setLogged(true)}/>}/>
            </Routes>
        </Router>
    )
}

export default App;
