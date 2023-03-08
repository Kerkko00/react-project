import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

export default function Login(props) {
    const navigate = useNavigate();

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

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
     * Lähettää POST kyselyn backend-palvelimelle parametreina saaduilla kirjautumistiedoilla
     * @param credentials
     * @returns {Promise<AxiosResponse<any>>}
     */
    async function loginUser(credentials) {
        return await axios.post('http://localhost:3002/api/login', credentials);
    }

    /**
     * Toiminto kirjautumislomakkeen painikkeelle.
     * Validoi kentät, jonka jälkeen kutsuu loginUser() -funktiota ja asettaa vastauksena saadut tiedot (token, user) selaimen muistiin.
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

        try {
            const res = await loginUser({
                username,
                password
            });
            console.log("STATUS: ", res.status);
            console.log(res.data)
            setToken(res.data);
            setUser(res.data);
            props.handleLogin();
            navigate("/");
        } catch (error) {
            console.log("STATUS: ", error.response.data);
            //popup
            alert(error.response.data.message)
        }
    }

    return (
        <div className="container">
            <h1>Login</h1>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" required
                                  onChange={e => setUserName(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">
                        Please fill in a username.
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                        We will never share your information
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required
                                  onChange={e => setPassword(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">
                        Please fill in a password.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </div>
    );
}