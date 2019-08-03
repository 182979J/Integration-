const express = require('express');
const router = express.Router();
const User = require('../models/aUser');
const alertMessage = require('../helpers/messenger');
var bcrypt = require('bcryptjs');
const passport = require('passport');
const fs = require('fs');
const upload = require('../helpers/imageUpload');
const ensureAuthenticated = require("../helpers/auth")



// Login Form POST => /user/login
router.post('/login', (req, res, next) => {
    // randomPass = Math.random().toString(36).replace('0.', '')
    // console.log(randomPass)

    passport.authenticate('local', {
        successRedirect: '/user/profile/:id', // Route to /video/listVideos URL
        failureRedirect: '/staffLogin', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error
        message using the message given by the strategy's verify callback, if any.
        When a failure occur passport passes the message object as error */
    })(req, res, next);
});

// router.post('/register', (req, res) => {

//     let errors = [];
//     // Retrieves fields from register page from request body
//     let { staffNo,email, password, password2 } = req.body;

//     if (staffNo == 

//     // Checks if both passwords entered are the same
//     if (password !== password2) {
//         errors.push({ text: 'Passwords do not match' });
//     }

//     // Checks that password length is more than 4
//     if (password.length < 4) {
//         errors.push({ text: 'Password must be at least 4 characters' });
//     }
//     if (errors.length > 0) {
//         res.render('user/register', {
//             errors,
//             staffNo,
//             email,
//             password,
//             password2
//         });
//     } else {
//         // If all is well, checks if user is already registered
//         User.findOne({ where: { staffNo: req.body.staffNo } })
//             .then(user => {
//                 if (user) {
//                     // If user is found, that means email has already been
//                     // registered
//                     res.render('user/register', {
//                         error: user.staffNo + ' already registered',
//                         staffNo,
//                         email,
//                         password,
//                         password2
//                     });
//                 } else {
//                     // Encrypt the password
//                     var salt = bcrypt.genSaltSync(10);
//                     var hashedPassword = bcrypt.hashSync(password, salt);
//                     password = hashedPassword;

//                     // Create new user record
//                     User.create({ staffNo, password })
//                         .then(user => {
//                             alertMessage(res, 'success', user.staffNo + ' added. Please login', 'fas fa-sign-in-alt', true);
//                             res.redirect('/staffLogin');
//                         })
//                         .catch(err => console.log(err));
//                 }
//             });
//     }
// });
    
// router.get('/profile/:id', ensureAuthenticated, (req, res) =>{
// 	User.findOne({
// 	// where: {
// 	// 	id: req.user.id
// 	// },
	
// 	// raw: true
// }).then((users) => {
// 	res.render('user/profile', {
// 		users: users
// 	});
// }).catch(err => console.log(err));

// })

// router.get('/profile/:id', (req, res) =>{

// 	res.render('user/profile');
// });






// router.get('/getTemp/:id', ensureAuthenticated, (req, res) => {
//     let { staffNo,email, password} = req.body;
//     let user=req.params.id;
//     User.findOne({ where: { staffNo: req.body.staffNo } })
//             .then(user => {
//                 if (user) {
//                     if(user.password != null)
//                     { 
//                         res.render('user/register', {
//                                 error: user.staffNo + ' already registered',
//                                 staffNo,
//                                 email,
//                                 password
//                         });       
//                     }
//                     else{

//                         if(email == user.email)
//                         {
//                             res.render('user/register', {
//                                 error: user.email + 'used. Please use another email!',
//                                 staffNo,
//                                 email,
//                                 password
//                         });        
//                         }
//                         else{
//                                 var tempPass = Math.random().toString(36).replace('0.','0')
//                                 console.log(tempPass)
//                                 User.update({
//                                     password: tempPass,
//                                 }, {
//                                         where: {
//                                             id: req.params.id
//                                         },
//                                 }).then((users) => {

//                                     }).catch(err => console.log(err));
//                             }
//                         }
//                     }
//                 })
//             });
                        

                


            router.post('/register', (req, res) => {

                let errors = [];
                // Retrieves fields from register page from request body
                let { staffNo, password, password2 } = req.body;
                let type = "admin";
            
                // Checks if both passwords entered are the same
                if (password !== password2) {
                    errors.push({ text: 'Passwords do not match' });
                }
            
                // Checks that password length is more than 4
                if (password.length < 4) {
                    errors.push({ text: 'Password must be at least 4 characters' });
                }
                if (errors.length > 0) {
                    res.render('user/register', {
                        errors,
                        staffNo,
                        password,
                        password2,
                        type
                    });
                } else {
                    // If all is well, checks if user is already registered
                    User.findOne({ where: { staffNo: req.body.staffNo } })
                        .then(user => {
                            if (user) {
                                // If user is found, that means email has already been
                                // registered
                                res.render('user/register', {
                                    error: user.staffNo + ' already registered',
                                    staffNo,
                                    password,
                                    password2,
                                    type
                                });
                            } else {
                                // Encrypt the password
                                var salt = bcrypt.genSaltSync(10);
                                var hashedPassword = bcrypt.hashSync(password, salt);
                                password = hashedPassword;
            
                                // Create new user record
                                User.create({ staffNo, password, type })
                                    .then(user => {
                                        alertMessage(res, 'success', user.staffNo + ' added. Please login', 'fas fa-sign-in-alt', true);
                                        res.redirect('/staffLogin');
                                    })
                                    .catch(err => console.log(err));
                            }
                        });
                }
            });



// 			// where: {
// 			// 	id: req.user.id
// 			// },

// 			raw: true
	


// router.post('/register', (req, res) => {

//     let errors = [];
//     // Retrieves fields from register page from request body
//     let { staffNo,email, password, password2 } = req.body;
//     let user=req.params.id;
//     User.findOne({ where: { staffNo: req.body.staffNo } })
//             .then(user => {
//                 if (user) {
//                     if(user.password != null)
//                     { 
//                         res.render('user/register', {
//                                 error: user.staffNo + ' already registered',
//                                 staffNo,
//                                 email,
//                                 password,
//                                 password2
//                         });       
//                     }
//                      else{

//                         if(email == user.email)
//                         {
//                             res.render('user/register', {
//                                 error: user.email + 'used. Please use another email!',
//                                 staffNo,
//                                 email,
//                                 password,
//                                 password2
//                         });        
//                         }

//                         else
//                         {
//                             // let user=req.params.id;
//                             // password = Math.random().toString(36).replace('0.', '');
//                             // console.log(password)
//                             // var salt = bcrypt.genSaltSync(10);
//                             // var hashedPassword = bcrypt.hashSync(password, salt);
//                             // password = hashedPassword;

//                             User.update({
//                                 staffNo,
//                                 email,
//                                 password,
//                                 password2
//                             }, {
//                                 where: {
//                                     id: user
//                                 }
//                             }).then(() => {
//                                 res.redirect('/staffLogin');
//                             }).catch(err => console.log(err));
//                         }
//                      } 
//                 }
//             });

//         });

//     // Checks if both passwords entered are the same
    

    router.get('/profile/:id', (req, res) =>{

        res.render('user/profile');
    });
    
    router.get('/editProfile/:id', (req, res) =>{
    
        res.render('user/editProfile');
    });
    
    
    router.put('/editProfile/:id', (req, res) => {
    
        // Retrieves fields from register page from request body
        // let {staffName, phoneNo, email, profImg} = req.body;
        // let profileURL=req.body.profileURL;
        let staffName = req.body.staffName;
        let phoneNo=req.body.phoneNo;
        let email=req.body.email;
        let posterURL=req.body.posterURL;
        var user=req.params.id;
        User.update({
            staffName,
            phoneNo,
            email,
            posterURL
        }, {
            where: {
                id: user
            }
        }).then(() => {
            res.redirect('/user/profile/:id');
        }).catch(err => console.log(err));
                
    });
    
    router.post('/upload', ensureAuthenticated, (req, res) => {
        // Creates user id directory for upload if not exist
        
        if (!fs.existsSync('./public/uploads/' + req.user.id)) {
            fs.mkdirSync('./public/uploads/' + req.user.id);
           
        }
    
        upload(req, res, (err) => {
            if (err) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                if (req.file === undefined) {
                    res.json({ file: '/img/no-image.jpg', err: err });
                } else {
                    res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
                }
            }
        });
    })

router.post('/register', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/', (req, res) => {
    const title = 'I\'m at the user router!';
    res.render('index', { title: title }) // renders views/index.handlebars
});

module.exports = router;