require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3002;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const testHandler = require('./tests/dbtest');
const syncDBHandler = require('./services/syncDB');
const checkDBConnection = require('./tests/connectionCheck');
const authRouter = require('./routes/auth');
const postRouter = require("./routes/post");
const voteRouter = require("./routes/vote");
const commentRouter = require("./routes/comment")

//Tarkistetaan tietokantayhteys
checkDBConnection()
    //Synkronoidaan tietokanta eli katsotaan että kaikki taulut on luotu ja niiden sarakkeet ovat oikein
    .then(() => syncDBHandler())
//Testataan tietojen lisäämistä tietokantaan
//    .then(() => testHandler())


app.get('/', (req, res) => {
    res.send('Moikka maailma!');
});
//Kaikki posteihin liittyvä käsitellään täällä
app.use("/api", postRouter);

//Kaikki rekisteröintiin ja kirjautumiseen liittyvä käsitellään täällä
app.use('/api', authRouter);

//Kaikki rekisteröintiin ja kirjautumiseen liittyvä käsitellään täällä
app.use('/api', voteRouter);

app.use("/api", commentRouter);

app.listen(PORT, () => {
    console.log(`Servu päällä osoitteessa http://localhost:${PORT}`);
});