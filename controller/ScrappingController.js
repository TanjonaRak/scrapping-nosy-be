
const scrap = require('../Service/Scrapping');
const utility = require('../utility/utility');


module.exports = {
   
    async getScrappTarif(req, res) {   
        // console.log(" GHBj") 
        console.log(' JUST : ',req.body.justprice)
        let url = req.body.url  
        // let j = req.body.justprice != undefined ? true : false
        let j = req.body.justprice ;

        let today = new Date(await utility.getTimeMadagascar())
        let tomorow = new Date(await utility.getTimeMadagascar())
        today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        tomorow.setDate(tomorow.getDate() + 1)
        tomorow = tomorow.getFullYear() + '-' + (tomorow.getMonth() + 1) + '-' + tomorow.getDate()
        let checkin = req.body.checkin != undefined ? req.body.checkin : today
        let checkout = req.body.checkout != undefined ? req.body.checkout : tomorow
        console.log("URL : ",url)
        let results = await scrap.scrap(url, checkin, checkout, j)
        return res.json({ status: 200, message: 'sucess', data: results })
    },

    async getScrappingCom (req,res){
        let url = req.body.url
        let today = new Date(await utility.getTimeMadagascar())
        let tomorow = new Date(await utility.getTimeMadagascar())
        today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        tomorow.setDate(tomorow.getDate() + 1)
        tomorow = tomorow.getFullYear() + '-' + (tomorow.getMonth() + 1) + '-' + tomorow.getDate()
        let results = await scrap.ScrappCommentaire(url,today,tomorow);
        return res.json({ status: 200, message: 'sucess', data: results })
    },

    async getScrappingAllTarif (req,res){
        let dtDebut = req.body.checkin;
        let dtFin = req.body.checkout;
        let prixMin = req.body.prixMin;
        let prixMax = req.body.prixMax;
        let today = new Date(await utility.getTimeMadagascar())
        let tomorow = new Date(await utility.getTimeMadagascar())
        today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        tomorow.setDate(tomorow.getDate() + 1)
        tomorow = tomorow.getFullYear() + '-' + (tomorow.getMonth() + 1) + '-' + tomorow.getDate()
        let results = [];
        if(dtDebut==="" && dtFin===""){
            console.log('true ************************')
            results = await scrap.ScrappingAllPrix(today,tomorow,prixMin,prixMax);
        }else{
            console.log('false ***********************')
            results = await scrap.ScrappingAllPrix(dtDebut,dtFin,prixMin,prixMax);
        }
        console.log(today," === ",tomorow)
        console.log(dtDebut," === ",dtFin)
        // results = await scrap.ScrappingAllPrix(today,tomorow);
        return res.json({ status: 200, message: 'sucess', data: results })
    },

   
};

const user = { username: 'Ravaka', age: 24 };