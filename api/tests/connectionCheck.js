const db = require("../services/db");

/**
 * Tarkistaa yhteyden tietokannan kanssa
 * @returns {Promise<void>}
 */
async function checkDBConnection() {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = checkDBConnection;