const express = require('express');
const router = express.Router();
const deli = require('../models/Delivery');
const alertMessage = require('../helpers/messenger'); //to test flash-messenger
const MySQLStore = require('express-mysql-session');
let config = require('../config/db.js');
const mysql = require('mysql');
const orderItem = require('../models/OrderItem');
const payments = require('../models/payments');
const orderDs = require('../models/orderDetails');
const formNic = require('../models/form');
const sortDel = require('../models/sortDel');
const sequelize = require('sequelize');
const Cuser = require('../models/CUser');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'vidjot_db',
    username: 'itp211',
    password: 'itp211'
});

router.get('/delForm', (req, res) => {
    res.render("enterDb")
});

//throw later when db received
router.post('/enterDb', (req, res) => {
    let cOrderNo = req.body.cOrderNo; //req.body -> retrieve input form fields
    let cName = req.body.cName; //Since the story field size in the videos table is 2000, only the first 2000 characters of the input is retrieved
    let cAddr = req.body.cAddr;
    let cPostal_Code = req.body.cPostal_Code;
    let cEmailAddr = req.body.cEmailAddr;
    let cPhoneNo = req.body.cPhoneNo;
    let delDate = req.body.deliDate.toString();
    let delPickUpTime = req.body.delPickUpTime;
    let delMan = req.body.delMan;
    let cRegion = req.body.region;

    if (cName != "") {
        deli.create({ cOrderNo, cName, cAddr, cPostal_Code, cRegion, cEmailAddr, cPhoneNo, delDate, delPickUpTime, delMan }) //masuk db
        orderItem.create({ cOrderNo, cName, cRegion, delDate, delPickUpTime })
        console.log('luar')
        // .then(deliveries => {
        //                     // alertMessage(res, 'success', delivery.cName + ' added.', 'fas fa-sign-in-alt', true);
        //                     console.log('info created')
        //                     res.redirect('/delivery');
        //                 })
        res.redirect('/delivery/delivery')

    }
    res.render('enterDb')
});

// router.get('/', (req, res) => {

//     console.log("teerr");
// });
router.get('/delivery/:filterDone', (req, res) => {
    console.log("tesyert");
    //sortingDel(req);
    var filterDone = req.params.filterDone;
    if (filterDone != "all") {
        var filter = filterDone;

    }
    else {
        filter = "North" & "East" & "North-East" & "West" & "Central"
    }

    console.log(filter);
    payments.findAll({ //retrieves all videos using the userId defined in the where object in ascending order by title.
        where: {
            cRegion: filter,
            //cOrderNo: payments.id,
        },

        raw: true
    }).then((payments) => { //The promise .then((videos) returns a videos object that contains all records retrieved from Video.findAll.


        // if (payments != '') {
        res.render('delivery/del_admin', { //passing the videos object to display all the videos retrieved.

            //deliveries: deliveries,
            filterDone: filterDone,
            payments: payments




        })
        // }
        //else {
        //   res.render('delivery/redirectEmpty')
        // }

    }).catch(err => console.log(err));
    //got error

});

// router.get('/Empty', (req, res) => {
//     res.render('delivery/redirectEmpty')
// })


router.get('/del_details/:id', (req, res) => {
    var dMId = req.params.id;
    payments.findOne({
        where: {
            id: dMId
        },
    }).then((payments) => {
        //    console.log("videoIdToDelete.user: " + video.userId);
        //    console.log("req.user.id : " + req.user.id);
        console.log(dMId, "tryyyyyyyyyyyyyyyyyy");
        res.render('delivery/del_details', {
            payments: payments
        })
    })
});

router.put('/updateDelDetails/:id', (req, res) => {

    let delDate = req.body.delDate;
    let delPickUpTime = req.body.delPickUpTime;
    let delMan = req.body.delMan;


    payments.update({
        // Set variables here to save to the videos table
        delDate,
        delPickUpTime,
        delMan
    }, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            orderItem.update({
                // Set variables here to save to the videos table
                delDate,
                delPickUpTime,
                delMan
            }, {
                    where: {
                        id: req.params.id
                    }
                })
            res.redirect('/main_s/delivery/all');
        }).catch(err => console.log(err));
});


// // try delivery man home
// router.get('/home', (req, res) => {
//     var d = new Date();

//     //var lastDay = new Date(date.getFullYear(), d.getMonth() + 1, 0);
//     //document.getElementById('trying').innerHTML = lastDay;
//     var month = d.getMonth() + 1;
//     var day = d.getDate();
//     var year = d.getFullYear();
//     // day = day + i;
//     var tmr = day + 1;
//     var tmr2 = day + 2;
//     var tmr3 = day + 3;
//     var tmr4 = day + 4;

//     if (month < 10) {
//         month = '0' + month;
//     }


//     //i++;
//     dateToday = day + "/" + month + "/" + year;
//     dateTmr = tmr + "/" + month + "/" + year;
//     dateTmr2 = tmr2 + "/" + month + "/" + year;
//     dateTmr3 = tmr3 + "/" + month + "/" + year;
//     dateTmr4 = tmr4 + "/" + month + "/" + year;
//     // date="9/07/2019"
//     // console.log(dateToday)
//     orderItem.findAll({

//         where: {

//             delDate: dateToday,
//             // delDate: dateTmr, 
//             // delDate : dateTmr2, 
//             // delDate : dateTmr3, 
//             // delDate : dateTmr4

//         }
//     }).then((deli1) => {
//         orderItem.findAll({

//             where: {


//                 delDate: dateTmr,
//                 // delDate : dateTmr2, 
//                 // delDate : dateTmr3, 
//                 // delDate : dateTmr4

//             }
//         }).then((deli2) => {
//             orderItem.findAll({

//                 where: {


//                     // delDate: dateTmr,
//                     delDate: dateTmr2,
//                     // delDate : dateTmr3, 
//                     // delDate : dateTmr4

//                 }
//             }).then((deli3) => {
//                 orderItem.findAll({

//                     where: {


//                         // delDate: dateTmr,
//                         // delDate : dateTmr2, 
//                         delDate: dateTmr3,
//                         // delDate : dateTmr4

//                     }
//                 }).then((deli4) => {
//                     orderItem.findAll({

//                         where: {


//                             // delDate: dateTmr,
//                             // delDate : dateTmr2, 
//                             // delDate : dateTmr3, 
//                             delDate: dateTmr4

//                         }
//                     }).then((deli5) => {
//                         orderItem.findAll({
//                             where: {
//                                 delDate: dateTmr,
//                             },

//                                 // ItemName : 'item4'
//                                 // delDate : dateTmr2, 
//                                 // delDate : dateTmr3, 
//                                 // cOrderNo : cOrderNo
//                             // where: {


//                             //     // delDate: dateTmr,
//                             //     // delDate : dateTmr2, 
//                             //     // delDate : dateTmr3, 
//                             //     cOrderNo : cOrderNo

//                             // },
//                             raw: true
//                         }).then((order) => {
//                             console.log(order)
//                             for (let index = 0; index < 5; index++) {
//                                 const count = index;

//                             }
//                             res.render('delivery/deliveryHome', {

//                                 deli1: deli1,

//                                 deli2: deli2,
//                                 deli3: deli3,
//                                 deli4: deli4,
//                                 deli5: deli5,

//                                 // technically cn comment the ones below
//                                 dateToday: dateToday,
//                                 dateTmr: dateTmr,
//                                 dateTmr2: dateTmr2,
//                                 // dateTmr:dateTmr, 
//                                 // dateTmr2: dateTmr2, 
//                                 dateTmr3: dateTmr3,
//                                 dateTmr4: dateTmr4,
//                                 order:order,


//                             })
//                         })

//                     })
//                 })
//             })

//             // deli.findAll({
//             // // console.log(deliveries);
//             //     where : {
//             //         delDate : dateTmr
//             //     }
//             //     }).then((deliveries) => {

//         })
//     })
// })

// // })




router.get('/home', (req, res) => {
    // for (i = 0; i < 1000000; i++) {

    // }
    orderDs.findAll({
        include: [formNic, payments],




    }).then((order) => {
        payments.findAll({
            // include:[{payments}],
            // where:{
            //     orderid: payments.id,
            // }

        }).then((payments) => {


            // for (i = 0; i < 1000000; i++) {

            // }
            console.log(order, 'bayar');
            res.render('delivery/deliveryHome', {
                // order: order,
                payments: payments,
                order: order
            })
        })
    })
});

module.exports = router;