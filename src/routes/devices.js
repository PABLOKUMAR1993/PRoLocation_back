// Import

const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();


// Rest

/**
 * Método que devuelve
 */
router.get("/all", (req, res) => {

    axios.get(process.env.API_URL)
        .then(response => {
            console.log(response.data.posts);
            res.send(response.data.posts);
        })
        .catch(error => console.error(error));

});


// Export

module.exports = router;