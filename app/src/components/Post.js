import React, {useState} from "react";
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert';
import {useNavigate} from "react-router-dom";

export default function Post() {
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const titleLength = [5, 255]
    const [description, setDescription] = useState("")
    const descriptionLength = [15, 2000]
    const [validated, setValidated] = useState(false);
    const [alertError, setAlertError] = useState("");
    /**
     * Toiminto uusi-postaus-lomakkeen lähettämiselle.
     * Validoi kentät ja lähettää backend-palvelimelle POST-kyselyn postauksen tietojen, sekä tokenin kera. Lopuksi tyhjentää kentät ja navigoi pääsivulle
     * @param event
     * @returns {Promise<void>}
     */
    const handleSubmit = async event => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true)

        if (validateInput() === true) {
            const userObject = {
                title: title,
                description: description
            }

            let tokenObj = JSON.parse(localStorage.getItem('token'))

            await axios.post('http://localhost:3002/api/post', userObject,
                {headers: {Authorization: 'Bearer: ' + tokenObj}}).then(response => {
                console.log(response)
                form.reset()
                navigate("/")
            }).catch((error) => {
                console.log(error)
                setAlertError(error.response.data.message)
                setTimeout(() => {
                    setAlertError("")
                }, 4000);
            })
        }
    }

    /**
     * Tarkistaa input-kenttien syötteiden pituudet
     * @returns {boolean}
     */
    const validateInput = () => {
        if (title.trim().length < titleLength[0] || description.trim().length < descriptionLength[0]) {
            setAlertError("Title or description too short")
            setTimeout(() => {
                setAlertError("")
            }, 4000);
            return false
        }
        return true
    }

    return (
        <Form noValidate validated={validated} className="container" onSubmit={handleSubmit}>
            {alertError.length > 0 && <Alert variant="danger">
                {alertError}
            </Alert>}
            <h2>Post idea</h2>
            <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title (min. {titleLength[0]} characters)</Form.Label>
                <Form.Control name="title" required minLength={titleLength[0]} maxLength={titleLength[1]} type="text"
                              placeholder="Some idea" onChange={(evt) => setTitle(evt.target.value)}/>
                <Form.Control.Feedback type="invalid">Please enter a valid title.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description (min. {descriptionLength[0]} characters)</Form.Label>
                <Form.Control name="description" as="textarea" rows={8} required minLength={descriptionLength[0]}
                              maxLength={descriptionLength[1]} type="text" placeholder="Short description of the idea"
                              onChange={(evt) => setDescription(evt.target.value)}/>
                <Form.Control.Feedback type="invalid">Please enter a valid description.</Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}
