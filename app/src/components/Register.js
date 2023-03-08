import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

export default function Register(props) {
    const navigate = useNavigate();

    const [username, setUserName] = useState("");
    const usernameMinLength = 4
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const passwordMinLength = 8

    const [validated, setValidated] = useState(false);

    /**
     * Asettaa parametrina saadun tokenin selaimen localStorage -muistiin
     * @param data
     */
    function setToken(data) {
        localStorage.setItem('token', JSON.stringify(data.token));
    }

    /**
     * Asettaa parametrina saadun käyttäjätunnuksen selaimen localStorage -muistiin
     * @param data
     */
    function setUser(data) {
        localStorage.setItem('user', JSON.stringify(data.username));
    }

    /**
     * Lähettää POST kyselyn backend-palvelimelle parametreina saaduilla rekisteröitymistiedoilla
     * @param credentials
     * @returns {Promise<AxiosResponse<any>>}
     */
    async function registerUser(credentials) {
        //console.log(credentials);
        return await axios.post('http://localhost:3002/api/register', credentials);
    }

    /**
     * Toiminto rekisteröitymislomakkeen painikkeelle.
     * Validoi kentät, jonka jälkeen kutsuu registerUser() -funktiota ja asettaa vastauksena saadut tiedot (token, user) selaimen muistiin.
     * @param e
     * @returns {Promise<void>}
     */
    const handleSubmit = async e => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        setValidated(true);

        if (validateInput() === true) {
            if (password === verifyPassword) {
                try {
                    const res = await registerUser({
                        username,
                        password
                    });
                    console.log("STATUS: ", res.status);
                    setToken(res.data);
                    setUser(res.data);
                    props.handleRegister();
                    navigate("/");
                } catch (error) {
                    console.log(error);
                    //console.log("STATUS: ", error.response.data);
                    //popup
                    alert(error.response.data.message);
                }
            } else {
                alert("Verified password does not match!");
            }
        }
    }

    /**
     * Tarkistaa käyttäjätunnuksen ja salasanan vähimmäispituuden
     * @returns {boolean}
     */
    const validateInput = () => {
        if (username.trim().length < usernameMinLength || password.trim().length < passwordMinLength ||
            verifyPassword.trim().length < passwordMinLength) {
            alert("Username or password too short")
            return false
        }
        return true
    }

    return (
        <div className="container">
            <h1>Register</h1>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username (min. {usernameMinLength} characters)</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" required minLength={usernameMinLength}
                                  onChange={e => setUserName(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">
                        Please choose a username.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password (min. {passwordMinLength} characters)</Form.Label>
                    <Form.Control type="password" placeholder="Password" required minLength={passwordMinLength}
                                  onChange={e => setPassword(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">
                        Please choose a password.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formVerifyPassword">
                    <Form.Label>Verify Password (min. {passwordMinLength} characters)</Form.Label>
                    <Form.Control type="password" placeholder="Verify password" required minLength={passwordMinLength}
                                  onChange={e => setVerifyPassword(e.target.value)}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </div>

    );
}