var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send("From Get home router");

});

router.get('/about', (req, res) => {
    res.send("About my app");

})

module.exports = router;