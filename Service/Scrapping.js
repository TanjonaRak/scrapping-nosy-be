const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');

let ClusterIsRunning = false;

const createCluster = async () => {
    // console.log(' CLUSTER OPEN IS 2024 ===>>> : ',ClusterIsRunning)

    try {
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 100,
            monitor: true,
            puppeteerOptions: {
                headless: true,
                defaultViewport: false,
                // userDataDir: `./tmp_${clusterId}`,
                dumpio: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            },
        });

        cluster.on("taskerror", (err, data) => {
            console.log(`Error scrapping : ${data}: ${err.message}`);
        });
        ClusterIsRunning = true;
        return cluster;
    } catch (error) {
        console.log(" ===>>> : ", error)
        return;
    }
    // const browser = await puppeteer.launch({args: ['--no-sandbox']});
}



const sleep = (milli) => {
    var startTm = new Date().getTime();
    while (new Date().getTime() < startTm + milli);
}

exports.scrap = async (url, checkin, checkout, justprice) => {
    let cluster = null;
    cluster = await createCluster();

    if (cluster) {
        await cluster.task(async ({ page, data: url }) => {

            url += `?label=msn-aY7Iszp6gVnZlQOce3YZow-80676854031119%3Atikwd-17155439312%3Aloc-110%3Aneo%3Amtp%3Alp110%3Adec%3Aqsbooking+europe+madagascar&checkin=${checkin}&checkout=${checkout}&lang=fr&group_adults=2&group_children=0&no_rooms=1`

            await page.setViewport({ width: 3456, height: 2234 })
            // console.log(" ===>>> GOOO 2 ");
            // await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')
            await page.goto(url, {
                waitUntil: 'load',
                timeout: 60000
            });

            console.log('url 2  :    ===>>> ', url)


            // });
            try {
                //await page.screenshot({ path: './image.jpg', type: 'jpeg' });
                // console.log(" gggggg")
                await page.waitForSelector("div#wrap-hotelpage-top #hotel_address")
                // console.log('url 3  :    ===>>> ', url)

            }
            catch (error) {
                console.error({ error })
                return [{ 'type': 'error', 'message': error }]
            }
            let data = [];
            await page.screenshot({ path: 'web.png' });
            console.log(justprice, " PRICE")
            // justprice = false;
            // console.log('url 4  :    ===>>> ', url)

            if (justprice) {
                // console.log(justprice,'ffggg')
                try {
                    data = await page.$$eval('div#bodyconstraint', els =>
                        els.slice(0, 1).reduce((res, m) => {
                            let r = {}
                            r.comms = [];
                            try {
                                // let comments = $(m).find('ul[id=":r4j:"] li').length
                                // document.querySelectorAll('ul[id=":r4j:"] li').length
                                r.l = document.querySelectorAll('ul[id=":r4j:"]')
                                // r.com = $(m).find('ul[id=":r4j:"]').length  
                                let comments = document.querySelectorAll('div.page-section')[6].children[0].children[4].children[0].querySelectorAll('ul li')[0].children.length
                                r.leng = document.querySelectorAll('div.page-section')[6].children[0].children[4].children[0].querySelectorAll('ul li')[0].children[0].children[0].children.length
                                for (let i = 0; i < 10; i++) {
                                    let e = {};
                                    e.nationality = document.querySelectorAll('div.page-section')[6].children[0].children[4].children[0].querySelectorAll('ul li')[i].querySelectorAll('span')[0].innerText;
                                    e.commentaire = document.querySelectorAll('div.page-section')[6].children[0].children[4].children[0].querySelectorAll('ul li')[i].querySelectorAll('span')[2].innerText;
                                    e.photoUser = document.querySelectorAll('div.page-section')[6].children[0].children[4].children[0].querySelectorAll('ul li')[i].querySelectorAll('img')[0].src;
                                    e.flag = document.querySelectorAll('div.page-section')[6].children[0].children[4].children[0].querySelectorAll('ul li')[i].querySelectorAll('img')[1].src;
                                    e.userName = document.querySelectorAll('div.page-section')[6].children[0].children[4].children[0].querySelectorAll('ul li')[i].querySelector('div div div').innerText.split('\n')[0];
                                    r.comms.push(e);
                                }
                            } catch (error) {
                                r.er = error.message
                                r.comms = [];
                            }
                            try {
                                r.price = $(m).find('#hprt-table tbody tr:first-of-type .hprt-table-cell-price .prco-valign-middle-helper').text().split('€')[1].split("\\")[0];
                            } catch (error) {
                                r.price = 0;
                            }
                            res.push(r)
                            return res;
                        }, [])
                    );
                } catch (error) {
                    return data;
                }
            } else {
                console.log(' XXX VRAI MIDITRA ATO TYYYY ')
                data = await page.$$eval('div#bodyconstraint', els =>
                    els.slice(0, 1).reduce((res, m) => {
                        let r = {}
                        // let hotelname = 
                        r.type = $(m).find('#wrap-hotelpage-top #hp_hotel_name span[data-testid="property-type-badge"]').text()
                        r.title = $(m).find('#wrap-hotelpage-top #hp_hotel_name h2').text()
                        r.description = $(m).find('#property_description_content').text();
                        r.starts = $(m).find('#wrap-hotelpage-top  span[data-testid="rating-stars"]') ? $(m).find('span[data-testid="rating-stars"]').children().length : null
                        r.hasBadge = $(m).find('#wrap-hotelpage-top .bk-icon.-iconset-thumbs_up_square') != undefined
                        let location = $(m).find('#wrap-hotelpage-top p#showMap2 a').data("atlas-latlng")
                        r.location = [
                            location.split(',')[0],
                            location.split(',')[1]
                        ]
                        // console.log("rerere")
                        r.equipements = [];
                        let equipements = $(m).find('div.hotel-facilities__list > .bui-spacer--large');
                        // let equipements = $(m).find('div.hp--popular_facilities');
                        // console.log(equipements," equipements ");
                        for (let i = 0; i < equipements.length; i++) {
                            let eq = {}
                            eq.label = $(equipements[i]).find('.bui-title__text.hotel-facilities-group__title-text').text().replaceAll('\n', '')
                            eq.policy = $(equipements[i]).find('.hotel-facilities-group__policy') != undefined && $(equipements[i]).find('.hotel-facilities-group__policy').text() != "" ? $(equipements[i]).find('.hotel-facilities-group__policy').text().replaceAll('\n', '') : null
                            let group_list = $(equipements[i]).find('ul').children()
                            eq.desc_list = []
                            for (let e = 0; e < group_list.length; e++) {
                                eq.desc_list.push($(group_list[e]).find('.bui-list__description').text().replaceAll('\n', ''))
                            }
                            r.equipements.push(eq)
                        }
                        r.equis = [];
                        let equs = $(m).find('div.hp--popular_facilities');
                        for (let i = 0; i < equs.length; i++) {
                            let group_list = $(equs[i]).find('ul').children();
                            for (let n = 0; n < group_list.length; n++) {
                                let eq = {};
                                eq.title = $(group_list[n]).find('span div span').text().replaceAll('\n', '').trim();
                                eq.icon = $(group_list[n]).find('svg').html().trim();
                                r.equis.push(eq);
                            }
                        }
                      
                        let equisAll = document.querySelectorAll('div.page-section')[9].children[0].children[0].children[0].children[1].querySelectorAll('ul li');
                        for (let i = 0; i < equisAll.length; i++) {
                            // let equis = document.querySelectorAll('div[data-testid="property-section--content"]')[2].children[1].children[i].innerText.split('\n');
                            // for(let n = 1;n<equis.length;n++){
                            let e = {};
                            e.title = equisAll[i].querySelectorAll('span')[2].innerText;
                            e.icon = "icon.png"
                            r.equis.push(e);
                        }
                        // r.etoile = 0;
                        // let EtoileHT = $(m).find('span.a455730030');
                        // r.PL2  =document.querySelectorAll('div[data-testid="property-section--content"]')[2].innerText;
                        // r.equipementsVraiMarque = document.querySelectorAll('div[data-testid="property-section--content"]')[3].children[0].innerText;
                        r.type = [{ nom: $(m).find('a.bui_breadcrumb__link_masked').text().split('(')[1].split(')')[0] }];
                        // r.note = 
                        r.g = $(m).find('span[class="hp__hotel_ratings pp-header__badges pp-header__badges--combined"]')[0];
                        // let GPSpan = $(EtoileHT[0]).find('span').children();
                        r.etoile = document.querySelectorAll('span[class="hp__hotel_ratings pp-header__badges pp-header__badges--combined"]')[0].querySelectorAll('span div')[2].children[0].children.length
                        r.note = document.querySelectorAll('div[data-testid="review-score-right-component"] div')[1].innerText.split(' ')[document.querySelectorAll('div[data-testid="review-score-right-component"] div')[1].innerText.split(' ').length - 1]
                        // .innerText.split(' ')[document.querySelectorAll('div[data-testid="review-score-right-component"]')[0].children[0].innerText.split(' ').length-1];
                        // r.note = document.querySelectorAll('div.ac4a7896c7')[0].innerText.split(' ')[document.querySelectorAll('div.ac4a7896c7')[0].innerText.split(' ').length - 1];
                        // r.avis = document.querySelectorAll('span.a3b8729ab1')[1].innerText.split(' ')[0];
                        r.avis = document.querySelectorAll('div[data-testid="review-score-right-component"] div div')[3].innerText.split(' ')[0];
                        // <div class=​"e98ee79976 daa8593c50 fd9c2cba1d">​<div class=​"f13857cc8c e6314e676b a287ba9834">​…​</div>​<div class=​"b290e5dfa6 a5cc9f664c c4b07b6aa8">​69 expériences vécues​</div>​</div>​   
                        r.comms = [];

                        let comments = $(m).find('.featured_reviewer')
                        r.comments = []
                        for (let i = 0; i < comments.length; i++) {
                            let c = {}
                            c.content = $(comments[i]).find('.trackit').text().replaceAll('\n', '')
                            c.user = $(comments[i]).find('.bui-avatar-block__title').text().replaceAll('\n', '')
                            c.from = $(comments[i]).find('.bui-avatar-block__subtitle').text().replaceAll('\n', '').trim()
                            r.comments.push(c)
                        }
                        res.push(r)
                        return res;
                    }, [])
                );

                // await page.click('div.k2-hp--gallery-header button')
                // document.querySelector('div.k2-hp--gallery-header button').click()
                await page.waitForSelector('div.k2-hp--gallery-header button', { visible: true });
                console.log(" LOG ====>>> : ")
                await page.screenshot({ path: 'web3.png' });

                await page.evaluate(() => {
                    document.querySelector('div.k2-hp--gallery-header button').scrollIntoView();
                });

                // Cliquer sur l'élément
                await page.click('div.k2-hp--gallery-header button', { delay: 200});

                await page.screenshot({ path: 'web2.png' });

                await page.waitForSelector('.bh-photo-modal-opened')

                console.log(" VITA INI 3")

                let albums = await page.$$eval('a.bh-photo-modal-grid-item-wrapper img', els =>
                    els.map((x) => {
                        return { photo: x.src }
                    }))
                albums = await albums.filter((x) => x != "")
                //// console.log({albums})
                data[0]["albums"] = albums
            }
            //await browser.close()
            // console.log("scrapping completed...")
            return data[0]
        })
        let result;
        try {
            result = await cluster.execute(url)
            // result = await cluster.execute(url)

        }
        catch (error) {
            console.error({ error })
            return [{ 'type': 'error', 'message': error }]
        }
        await cluster.idle();
        await cluster.close();
        ClusterIsRunning = false;
        return result
    } else {
        return [{ 'type': 'error', 'message': "Cluster not found" }]
    }

}

exports.ScrappCommentaire = async (url, checkin, checkout) => {
    const cluster = await createCluster();
    let justprice = false;
    await cluster.task(async ({ page, data: url }) => {
        await page.setViewport({ width: 3456, height: 2234 })
        // console.log(" ===>>> GOOO 2 ");
        // await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')
        // console.log(" ===>>> GOOO 3");

        console.log('url  :    ===>>> ', url += "?checkin=" + checkin + "&" + checkout + "=" + checkout + "&lang=fr&group_adults=2&group_children=0&no_rooms=1&activeTab=main#tab-reviews")


        await page.goto(url += "?checkin=" + checkin + "&checkout=" + checkout + "&lang=fr&group_adults=2&group_children=0&no_rooms=1&activeTab=main#tab-reviews", {
            waitUntil: 'load',
            timeout: 60000
        });



        // });
        try {
            //await page.screenshot({ path: './image.jpg', type: 'jpeg' });
            // console.log(" gggggg")
            await page.waitForSelector("div#wrap-hotelpage-top #hotel_address")
            // console.log('url 3  :    ===>>> ', url)

        }
        catch (error) {
            console.error({ error })
            return [{ 'type': 'error', 'message': error }]
        }
        let data = [];
        //await page.screenshot({path: 'web.png'});
        // console.log(justprice, " PRICE")
        if (justprice === true) {
            // console.log('ffggg')
            try {
                data = await page.$$eval('div#bodyconstraint', els =>
                    els.slice(0, 1).reduce((res, m) => {
                        let r = {}
                        r.comms = [];

                        for (let i = 0; i < 10; i++) {
                            let e = {};
                            e.commentaire = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('span')[1]?.innerText;
                            e.userName = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('span.ceb980c8bb')[0]?.innerText;
                            e.photoUser = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('div.c82435a4b8 img.e3fa9175ee')[0]?.src;
                            e.flag = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('div.abf093bdfe img')[0]?.src;
                            e.nationality = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('div.abf093bdfe img')[0]?.alt;
                            r.comms.push(e);
                        }
                        r.price = $(m).find('#hprt-table tbody tr:first-of-type .hprt-table-cell-price .prco-valign-middle-helper').text().split('€')[1].split("\\")[0];
                        res.push(r)
                        return res;
                    }, [])
                );
            } catch (error) {
                return 0;
            }
        } else {
            data = await page.$$eval('div#bodyconstraint', els =>
                els.slice(0, 1).reduce((res, m) => {
                    let r = {}


                    r.comms = [];
                    for (let i = 0; i < 10; i++) {
                        let e = {};
                        e.commentaire = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('span')[1]?.innerText;
                        e.userName = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('span.ceb980c8bb')[0]?.innerText;
                        e.photoUser = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('div.c82435a4b8 img.e3fa9175ee')[0]?.src;
                        e.flag = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('div.abf093bdfe img')[0]?.src;
                        e.nationality = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('div.abf093bdfe img')[0]?.alt;
                        r.comms.push(e);
                    }

                    res.push(r)
                    // sleep(5000)
                    return res;
                }, [])
            );



        }
        return data[0];
    })
    let result;
    try {
        result = await cluster.execute(url)
    }
    catch (error) {
        console.error({ error })
        return [{ 'type': 'error', 'message': error }]
    }

    // let COM = document.getElementById('reviewCardsSection');
    await cluster.idle();
    await cluster.close();
    return result;
}


function getScrapping() {
    let element = document.querySelector('div[data-capla-component-boundary="b-search-web-searchresults/SearchResultsDesktop"]').children[1].children[2].children[1].children[1].children[2].querySelectorAll('div[data-testid="property-card"]')
    return element;
}

let enter = 0;
let b = "";
async function autoScroll(page) {
    // console.log(getScrapping().length)
    b = "button";
    // enter = 5;
    // try {
    //     enter=6
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 1000;
            // b = "button";
            // enter = 5;
            const timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                setTimeout(300)
                totalHeight += distance;
                // let lenRes  = document.querySelector('div[data-capla-component-boundary="b-search-web-searchresults/SearchResultsDesktop"]').children[1].children[2].children[1].children[1].children[2].querySelectorAll('div[data-testid="property-card"]').length;
                // console.log(" LPL :" , lenRes)
                // if(document.querySelectorAll('div[style="--bui_box_spaced_padding--s: 4;"]')[lenRes+1]){
                let button = document.querySelectorAll('div[style="--bui_box_spaced_padding--s: 4;"]')[document.querySelectorAll('div[style="--bui_box_spaced_padding--s: 4;"]').length - 1].querySelector('button');
                // let button  = document.querySelectorAll('div.fa298e29e2')[document.querySelectorAll('div.fa298e29e2').length-1].querySelector('button')
                // const newLocal = b = "button";
                // enter = 5;
                if (button.querySelector('span').innerText === "Afficher plus de résultats") {
                    button.click();
                    // enter = 2;
                }
                // }
                // document.querySelectorAll()
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }

            }, 300);
        });
    });
    // } catch (error) {
    //     console.log(error)
    // }
    // console.log(getScrapping().length)
}




exports.ScrappingAllPrix = async (checkin, checkout, prixMin, prixMax) => {
    // console.log('ETO 1');
    let cluster = null;
    cluster = await createCluster();
    //console.log('ETO 1');

    let justprice = false;
    let url = "https://www.booking.com/searchresults.nl.html?ss=Nosy+Be&ssne=Nosy+Be&ssne_untouched=Nosy+Be&label=msn-aY7Iszp6gVnZlQOce3YZow-80676854031119%3Atikwd-17155439312%3Aloc-110%3Aneo%3Amtp%3Alp110%3Adec%3Aqsbooking+europe+madagascar&aid=393655&lang=fr&sb=1&src_elem=sb&src=index&dest_id=13888&dest_type=region&checkin=" + checkin + "&checkout=" + checkout + "&group_adults=2&no_rooms=1&group_children=0&nflt=price%3DEUR-" + prixMin + "-" + prixMax + "-1&order=price"
    ///==>>// let url = "https://www.booking.com/searchresults.fr.html?ss=+Nosy+Be%2C+Madagascar&ssne=Nosy+Be&ssne_untouched=Nosy+Be&aid=1445132&label=gen173rf-1FCAsokQFCDWxlLW1veWEtYmVhY2hIDVgDaJEBiAEBmAENuAEXyAEM2AEB6AEB-AEDiAIBogIOMTI3LjAuMC4xOjgwMDCoAgO4AufUsbIGwAIB0gIkYzA3YTU0NzUtNjhhMi00ZjVkLWFhNGEtMDUzZWJkMDUzMTE12AIF4AIB&no_rooms=1&highlighted_hotels=2434866&checkin="+checkin+"&checkout="+checkout+"&nflt=price%3DEUR-"+prixMin+"-"+prixMax+"-1&order=price";
    // let url = "https://www.booking.com/searchresults.fr.html?ss=+Nosy+Be%2C+Madagascar&ssne=Nosy+Be&ssne_untouched=Nosy+Be&aid=304142&label=gen173rf-1FCAsokQFCDWxlLW1veWEtYmVhY2hIDVgDaJEBiAEBmAENuAEXyAEM2AEB6AEB-AEDiAIBogIOMTI3LjAuMC4xOjgwMDCoAgO4AufUsbIGwAIB0gIkYzA3YTU0NzUtNjhhMi00ZjVkLWFhNGEtMDUzZWJkMDUzMTE12AIF4AIB&no_rooms=1&highlighted_hotels=2434866&checkin="+checkin+"&checkout="+checkout+"&nflt=price%3DEUR-"+prixMin+"-"+prixMax+"-1&order=price";
    // let url = "https://www.booking.com/searchresults.fr.html?ss=Madagascar&ssne=Madagascar&ssne_untouched=Madagascaraid=1445132&label=gen173rf-1FCAsokQFCDWxlLW1veWEtYmVhY2hIDVgDaJEBiAEBmAENuAEXyAEM2AEB6AEB-AEDiAIBogIOMTI3LjAuMC4xOjgwMDCoAgO4AufUsbIGwAIB0gIkYzA3YTU0NzUtNjhhMi00ZjVkLWFhNGEtMDUzZWJkMDUzMTE12AIF4AIB&no_rooms=1&highlighted_hotels=2434866&checkin="+checkin+"&checkout="+checkout+"&nflt=price%3DEUR-"+prixMin+"-"+prixMax+"-1&order=price";
    console.log(url);

    // let url =
    if (cluster) {
        await cluster.task(async ({ page, data: url }) => {
            await page.setViewport({ width: 3456, height: 2234 })
            // console.log(" ===>>> GOOO 2 ");
            // await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')
            // console.log(" ===>>> GOOO 3");
            // console.log('url  :    ===>>> ', url )
            // console.log(" ERREUR 1 ***")
            // console.log(url," <<<==== URL VRR ");
            await page.goto(url, {
                waitUntil: 'load',
                timeout: 0,
                // { waitUntil: 'networkidle2' }
            });
            // console.log(" ERREUR 2 ***")
            let data = [];
            await page.screenshot({ path: 'web.png' });
            // console.log(justprice, " PRICE")
            if (justprice === true) {
                // console.log('ffggg')
                try {
                    data = await page.$$eval('div#bodyconstraint', els =>
                        els.slice(0, 1).reduce((res, m) => {
                            let r = {}
                            r.comms = [];
                            for (let i = 0; i < 10; i++) {
                                let e = {};
                                e.commentaire = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('span')[1]?.innerText;
                                e.userName = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('span.ceb980c8bb')[0]?.innerText;
                                e.photoUser = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('div.c82435a4b8 img.e3fa9175ee')[0]?.src;
                                e.flag = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('div.abf093bdfe img')[0]?.src;
                                e.nationality = document.querySelectorAll('ul.fc49408fea li')[i].querySelectorAll('div.abf093bdfe img')[0]?.alt;
                                r.comms.push(e);
                            }
                            r.price = $(m).find('#hprt-table tbody tr:first-of-type .hprt-table-cell-price .prco-valign-middle-helper').text().split('€')[1].split("\\")[0];
                            res.push(r)
                            return res;
                        }, [])
                    );
                } catch (error) {
                    return 0;
                }
            } else {
                // console.log(" MIDITRA AUTO SCROLL")
                await autoScroll(page);
                // console.log(b," MADE ETO ",enter)
                // let button = document.querySelectorAll('div.c82435a4b8')[document.querySelectorAll('div.c82435a4b8').length-1].querySelector('button.a83ed08757');
                data = await page.$$eval('div#bodyconstraint', els =>
                    els.slice(0, 1).reduce((res, m) => {
                        let r = {}
                        // let but = document.querySelectorAll('div.c82435a4b8')[99].querySelector('button.a83ed08757');
                        // r.l = document.querySelectorAll('div.efa3f4d6ac').length-1;
                        // let dataRes = document.querySelector('div[data-capla-component-boundary="b-search-web-searchresults/SearchResultsDesktop"]').children[1].children[2].children[1].children[1].children[2].querySelectorAll('div[data-testid="property-card"]');
                        let dataRes = document.querySelectorAll('div[data-testid="property-card"]');

                        r.l = dataRes.length;

                        r.tarifAll = []
                        // let dataAll = document.querySelectorAll('div.efa3f4d6ac');
                        let dataAll = dataRes;
                        r.t = dataAll.length;
                        for (let i = 0; i < dataAll.length; i++) {
                            let tarif = {};
                            tarif.name = dataAll[i].querySelectorAll('a')[1].querySelector('div[data-testid="title"]').innerText;
                            try {
                                tarif.price = dataAll[i].querySelector('span[data-testid="price-and-discounted-price"]').innerText;
                            } catch (error) {
                                tarif.error = error.message;
                                tarif.price = "€ 0";
                            }
                            r.tarifAll.push(tarif);
                        }
                        // let name = document.querySelectorAll('a.a78ca197d0')[0].querySelector('div.f6431b446c').innerHTML
                        res.push(r)
                        // sleep(5000)
                        return res;
                    }, [])
                );
            }

            return data[0];
        })
        let result;
        try {
            result = await cluster.execute(url)
        }
        catch (error) {
            console.error({ " ERROR IS ICI : ": error })
            return [{ 'type': 'error', 'message': error }]
        } finally {
            await cluster.idle();
            await cluster.close();
        }
        // let COM = document.getElementById('reviewCardsSection');
        ClusterIsRunning = false;
        return result;
    } else {
        return [{ 'type': 'error', 'message': "Cluster not found" }]
    }

}
