import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ThumbIcon from "../res/images/upvote.png";
import Col from 'react-bootstrap/Col';
import Stack from "react-bootstrap/Stack"

function PostModal(props) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [editMode, toggleEditMode] = useState(false)
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("")

    useEffect(() => {
        setComments([])
        setNewComment("")
        const getComments = async () => {
            if (props.postData.length <= 0) {
                return
            }
            console.log("Haetaan id:lla", props.postData.id)
            const response = await fetch(`http://localhost:3002/api/comments/${props.postData.id}`);
            const result = await response.json();
            setComments(result);
        }
        getComments()
    }, [props.postData.id, props.postData.length]);


    if (props.postData.length <= 0) {
        return <div></div>
    }


    const isOwner = props.postData.User.username === JSON.parse(localStorage.getItem('user'));

    /**
     * Toiminto postauksen editoinnin aloitusta varten
     */
    const handleEdit = () => {
        setTitle(props.postData.title)
        setDescription(props.postData.description)
        toggleEditMode(true)
    }

    /**
     * Toiminto postauksen poistamista varten
     */
    const handleDelete = () => {
        toggleEditMode(false)
        props.handleDelete(props.postData.id)
    }

    /**
     * Toiminto modaalin sulkemista varten
     */
    const handleClose = () => {
        toggleEditMode(false)
        props.handleClose()
    }

    /**
     * Toiminto postauksen tallentamiseen muokkauksen yhteydessä
     */
    const handleSave = () => {
        toggleEditMode(false)
        props.handleSave(props.postData.id, title, description);
    }

    const handleComment = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token === null) {
            return
        }
        const response = await fetch("http://localhost:3002/api/comment", {
            headers: {
                "Content-Type": "application/json", "Authorization": "Bearer " + token
            },
            body: JSON.stringify({postId: props.postData.id, comment: newComment}),
            method: "POST"
        })
        if (response.ok) {
            const result = await response.json()
            const commentToArr = {...result, User: {username: JSON.parse(localStorage.getItem('user'))}}
            setComments([...comments, commentToArr])
        }
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{!editMode ? props.postData.title :
                        <input value={title} onChange={e => setTitle(e.target.value)}></input>}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{!editMode ? props.postData.description :
                        <textarea style={{width: "100%", height: "12em"}} value={description}
                                  onChange={e => setDescription(e.target.value)}></textarea>}</p>
                    <h3>{props.postData.upvotes}<img className={"thumbsUpModal"} src={ThumbIcon} alt={"Thumbs up"}/>
                    </h3>
                </Modal.Body>
                <Modal.Footer>
                    <Col>
                        {isOwner && <Button variant="danger" onClick={handleDelete}> Delete </Button>}
                        {isOwner && <Button variant="primary" onClick={handleEdit}> Edit </Button>}
                    </Col>
                    <Col>
                        {editMode && <Button variant="primary" onClick={handleSave}> Save Changes </Button>}
                    </Col>
                    <Col style={{flex: 0}}>
                        <Button variant="secondary" onClick={handleClose}> Close </Button>{" "}
                    </Col>
                </Modal.Footer>
                <Stack style={{margin: "0 10px"}} direction={"horizontal"}><input style={{width: "85%"}}
                                                                                  className={"me-auto"} type={"text"}
                                                                                  onChange={(e) => setNewComment(e.target.value)}/><Button
                    onClick={handleComment} variant="primary">Send</Button>
                </Stack>
                <Stack style={{margin: "0 10px"}} gap={3}>
                    {comments.length === 0 ? <div>No comments yet</div> : comments.map(comment =>
                        <div style={{padding: "0.5em"}} key={comment.id}
                             className="bg-light border">{comment.User.username}: {comment.content}
                        </div>
                    )}
                </Stack>
            </Modal>
        </>
    );
}

export default PostModal;