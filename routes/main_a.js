const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')
const User = require("../models/aUser")
// const feedB = require("../models/feedback")
const ensureAuthenticated = require("../helpers/auth")
const fs = require('fs');
const upload = require('../helpers/imageUpload');
// router.get('/', (req, res) => {
// 	const title = 'Video Jotter';
// 	res.render('index', { title: title }) // renders views/index.handlebars
// });

// liqi
router.get('/staffLogout', (req, res) => {
	req.logout();
	res.redirect('/staffLogin');
});

router.get('/about', (req, res) => {

	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';

	alertMessage(res, 'success',
		'This is an important message', 'fas fa-sign-in-alt', true);
	alertMessage(res, 'danger',
		'Unauthorised access', 'fas fa-exclamation-circle', false);

	var errorTexts = [
		{ text: "Error message using error object" },
		{ text: "First error message🙅‍♀️" },
		{ text: "Second error message 🚫" },
		{ text: "Third error message⛔" }
	];


	var dev_name = "🧐 Happy 脸😀"
	res.render('about', {
		developer_name: dev_name,
		success_msg: success_msg,
		error_msg: error_msg,
		errors: errorTexts
	}) // renders views/about.handlebars
});

router.get('/staffLogin', (req, res) => {
	res.render('user/login')
});



router.get('/salesRecord', ensureAuthenticated, (req, res) =>{
	User.findAll({
	where: {
		id: req.user.id
	},
	
	raw: true
}).then((user) => {
	// pass object to listVideos.handlebar
	res.render('admin/salesRecord', {
		user: user
	});
}).catch(err => console.log(err));

	// res.render('sale/salesRecord')
})

// router.get('/orders', (req, res) =>{
// 	res.render('sale/orders')
// })

router.get('/orders', ensureAuthenticated, (req, res) =>{
	User.findAll({
	where: {
		id: req.user.id
	},
	
	raw: true
}).then((user) => {
	res.render('admin/orders', {
		user: user
	});
}).catch(err => console.log(err));
})

router.get('/staffRegister', (req, res) => {
	res.render('user/register')
});


// jiaen
router.get('/chome', (req, res) => {
	
	res.render('chome') 
});
router.get('/CRegister', (req, res) => {
	res.render('user/cregister') // renders views/register.handlebars
});

router.get('/', (req, res) => {
	res.render('user/clogin') // renders views/user/login.handlebars
});
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});
module.exports = router;
