const express = require('express');

const router = express.Router();




module.exports = (io) => {
    const {
        // VAOVAO
        
        getScrappTarif,
     
        getScrappingCom,
        getScrappingAllTarif
    } = require('../controller/ScrappingController');
    
    router.post('/booking-lower-price', getScrappTarif);
    router.post('/get-comm',getScrappingCom);
    router.post('/get-tarif',getScrappingAllTarif)
    return router;
};
