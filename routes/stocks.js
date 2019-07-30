const express = require('express');
const router = express.Router();
const User = require("../models/aUser")
const reference = require("../models/reference.js")
const ensureAuthenticated = require("../helpers/auth")
const stockRec = require("../models/stockRecord")


router.get('/viewInstocks', ensureAuthenticated, (req, res) =>{
	stockRec.findAll({
	
	}).then((stockrecs) => {
		res.render('admin/viewInstocks', {
			stockrecs: stockrecs
		});
	}).catch(err => console.log(err));
	
	});


router.get('/deliveryStatusUpdate', ensureAuthenticated, (req, res) =>{
	reference.findAll({
	// where: {
	// 	id: req.user.id
	// },
	
	raw: true
}).then((forms) => {
	res.render('admin/deliveryStatus', {
		forms: forms
	});
}).catch(err => console.log(err));

})

// router.get('/deliveryStatusUpdate/:id', ensureAuthenticated, (req, res) =>{
// 	let reference =req.body.status;
// 	console.log("12345")
//         reference.update({
//             status
//         }, {
//             // where: {
//             //     id: reference
//             // }
//         }).then(() => {
//             res.redirect('/stocks/deliveryStatusUpdate');
//         }).catch(err => console.log(err));
                
//     });


module.exports = router;