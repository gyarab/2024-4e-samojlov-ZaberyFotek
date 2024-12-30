const express = require('express');

const router = express.Router();

router.get('/o-projektu', (req, res) => {
    const str = [{
        "name": "Codr Kai",
        "msg": "This is my first tweet!",
        "username": "codrkai"
    }];

    res.end(JSON.stringify(str));

});

router.post('/pridatProjekt', (req, res) => {

    res.end('NA');
});

module.exports = router;