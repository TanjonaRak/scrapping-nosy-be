const express = require('express');


const router = express.Router();

module.exports = function (io) {
    
    const Scrapping = require('./ScrappingRoute')(io);

   
    router.use('/scrapping',Scrapping)
    
    return router;
};
