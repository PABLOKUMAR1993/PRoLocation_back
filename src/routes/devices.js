// Import

const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();


// Rest

/**
 * Method that returns data with coordinates of all devices at the current moment.
 */
router.get("/all", (req, res) => {

    axios.get(`${process.env.API_URL}?user=${process.env.API_USER}&password=${process.env.API_PASS}&metode=${process.env.API_METODE_ALL}`)
        .then(response => {
            console.log(response.data.posts);
            res.send(response.data.posts);
        })
        .catch(error => console.error(error));

});


// Export

module.exports = router;