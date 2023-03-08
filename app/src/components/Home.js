import React, {useState, useEffect} from "react";
import axios from 'axios'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from "react-bootstrap/Stack"
import PostModal from "./Modal"
import ThumbIcon from "../res/images/upvote.png"

export default function Home() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [selectedPost, setSelectedPost] = useState([])

    useEffect(() => {
        getPosts()
    }, [])

    /**
     * Lähettää GET-kutsun backend-palvelimelle ja asettaa vastauksena saadut postaukset stateen.
     */
    const getPosts = () => {
        axios.get('http://localhost:3002/api/posts').then(response => {
            // Asetetaan postaukset
            setPosts(response.data)
            setIsLoading(false);
        }).catch((error) => {
            console.log(error)
        })
    }

    /**
     * Sulkee modaliin avatun postauksen.
     */
    const handleClose = () => setShow(false);

    /**
     * Näyttää valitun postauksen modalissa.
     * @param id
     */
    const handleShow = (id) => {
        setShow(true)
        const post = posts.find(p => p.id === id);
        setSelectedPost(post)
    };

    /**
     * Toiminto postauksen äänestämiselle.
     * Lähettää POST-kyselyn backend-palvelimelle tokenin kera.
     * @param id
     * @returns {Promise<void>}
     */
    const handleUpvote = async (id) => {
        let tokenObj = JSON.parse(localStorage.getItem('token'));
        const response = await fetch(`http://localhost:3002/api/vote/${id}`, {
            headers: {"Authorization": `Bearer ${tokenObj}`},
            method: "POST"
        });
        if (response.status !== 201) {
            const result = await response.json()
            alert(result.message)
            return
        }
        let upvotedPosts = posts.map(post => post.id === id ? {...post, upvotes: post.upvotes + 1} : post);
        setPosts(upvotedPosts);
    }

    /**
     * Toiminto postauksen poistamiseen.
     * Lähettää POST-kyselyn backend-palvelimelle tokenin kera.
     * @param id
     * @returns {Promise<void>}
     */
    const handleDelete = async (id) => {
        let tokenObj = JSON.parse(localStorage.getItem('token'));
        const response = await fetch(`http://localhost:3002/api/post/${id}`, {
            headers: {"Authorization": `Bearer ${tokenObj}`},
            method: "DELETE"
        });
        if (response.status === 200) {
            const filtered = posts.filter(post => post.id !== id);
            setPosts(filtered)
        }
        setShow(false)
    }

    /**
     * Toiminto postauksen tallentamiseen
     * Lähettää PUT-kyselyn backend-palvelimelle tokenin kera.
     * @param id postauksen tunnus
     * @param title postauksen otsikko
     * @param description postauksen kuvaus
     * @returns {Promise<void>}
     */
    const handleSave = async (id, title, description) => {
        let tokenObj = JSON.parse(localStorage.getItem('token'));
        console.log("res1", id, title, description)
        const response = await fetch(`http://localhost:3002/api/post/${id}`, {
            headers: {
                "Authorization": `Bearer ${tokenObj}`,
                "Content-Type": 'application/json'
            }, method: "PUT", body: JSON.stringify({title, description})
        });
        if (response.status === 200) {
        }
        let updatedPosts = posts.map(post => post.id === id ? {
            ...post,
            title: post.title,
            description: post.description
        } : post);
        setPosts(updatedPosts);
        setShow(false)
    }

    return (
        <div className="container">
            <div>
                <h1>Home</h1>
                <Container>
                    {posts.map(post => (
                        <Row className={"post"} key={post.id}><Col onClick={() => handleShow(post.id)}>
                            <h3>{post.title}</h3><p>{post.description}</p></Col><Col xs={3}>
                            <p>by {post.User.username}</p><Stack direction="horizontal"><h3>{post.upvotes}</h3>
                            <button onClick={() => handleUpvote(post.id)} className={"upvoteBtn"}><img
                                className={"thumbsUp"} src={ThumbIcon} alt={"Thumbs up"}/></button>
                        </Stack></Col></Row>
                    ))}
                </Container>
            </div>
            {!isLoading && <PostModal show={show} handleClose={handleClose} handleShow={handleShow}
                                      handleDelete={(id) => handleDelete(id)}
                                      handleSave={handleSave} postData={selectedPost}/>
            }
        </div>
    )
}