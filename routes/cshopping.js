const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')
const paymentt = require('../models/payment');
const wishlist = require('../models/wishlist');
const user = require('../models/aUser');
const ensureAuthenticated = require('../helpers/auth');
const moment = require('moment');
// const connection=require('../config/DBConfig');
const shopIt = require('../models/stockRecord');
// const shopIt= require('../models/shopp.csv');
const Feedback = require('../models/Feedback');
const cart = require('../models/cart');
const orderd = require('../models/order_detail'); 
const Orderhistory = require('../models/Orderhistory');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
//const total=0.00;



router.get('/paymenttype', (req, res) => {
	res.render('shoppingg/typeofpayment')
});

router.get('/paymentcash', (req, res) => {
	cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include: [{
				model: shopIt, as: "stockrec",
				required: true
			}]

		})
		.then((carttp) => {
			 
			var total=0.00;
			for (i = 0; i < carttp.length; i++) {
				//let quantity=parseInt(cartt[i].form.quantity-parseInt(cartt[i].quantity))
				total+=parseInt(carttp[i].quantity)*parseFloat(carttp[i].stockrec.price);
				}
				const Rtotal=total.toFixed(2);

	res.render('shoppingg/bycash',{
		Rtotal:Rtotal
	})
			})
});

router.get('/paymentcreditcard', (req, res) => {
	cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include: [{
				model: shopIt, as: "stockrec",
				required: true
			}]

		})
		.then((carttp) => {
			var total=0.00;
			for (i = 0; i < carttp.length; i++) {
				//let quantity=parseInt(cartt[i].form.quantity-parseInt(cartt[i].quantity))
				total+=parseInt(carttp[i].quantity)*parseFloat(carttp[i].stockrec.price);
				}
				const Rtotal=total.toFixed(2);

	res.render('shoppingg/bycreditcard',{
		Rtotal:Rtotal
	})
})
});


router.post('/cashpaymentdone', (req, res) => {
	cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include: [{
				model: shopIt, as: "stockrec",
				required: true
			}]

		})
		.then((carttp) => {
			var total=0.00;
			for (i = 0; i < carttp.length; i++) {
				//let quantity=parseInt(cartt[i].form.quantity-parseInt(cartt[i].quantity))
				total+=parseInt(carttp[i].quantity)*parseFloat(carttp[i].stockrec.price);
				}
			
				const Rtotal=total.toFixed(2);
	var today = new Date();
	var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() ;
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let datetime = date + ' ' + time;
	let payname = req.body.payname;
	let paycontact = req.body.paycontact;
	let payemail = req.body.payemail;
	let payaddress = req.body.payaddress; 
	let paypostalC = req.body.paypostalC;
	let totalamount=Rtotal;
	let CorCC = "cash";

	let CuserId = req.user.id;
	// Multi-value components return array of strings or undefined
	paymentt.create({
		date,
		time,
		payname,
		paycontact,
		payemail,
		payaddress,
		paypostalC,
		CorCC,
		totalamount,
		CuserId
	}).then((paymenttt) => {

		cart.findAll(
			{
				where: {
					CuserId: req.user.id
				}
				,
				include: [{
					model: shopIt, as: "stockrec",
					required: true
				}]

			})
			.then((cartt) => {
				shopIt.findAll({
				})
				.then((shoppi) => {
				var total=0.00;
				var today = new Date();
				var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() ;
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
				for (i = 0; i < cartt.length; i++) {
					let itemid = cartt[i].itemid;
					let orderid = paymenttt.id;
					let oquantity=cartt[i].quantity;
					let remark=cartt[i].remark;
					let CuserId = req.user.id;
						for (d = 0; d < shoppi.length; d++) {
						if(cartt[i].itemid==shoppi[d].id){
							let itemName=shoppi[d].itemName;
							let price=shoppi[d].price;
							let posterURL=shoppi[d].posterURL;
							Orderhistory.create({
								date,
								time,
								oquantity,
								itemName,
								remark,
								price,
								posterURL,
								CuserId
							})
							
							}}
					



				var total=0.00;
				


					// var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
					// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
					// let datetime = date + ' ' + time;
					let quantity=parseInt(cartt[i].stockrec.quantity-parseInt(cartt[i].quantity))
					total+=parseInt(cartt[i].quantity)*parseFloat(cartt[i].stockrec.price);
					if(quantity<=0){
						quantity=null;
					}

					
					console.log(quantity);
					shopIt.update({
						quantity
					},
					{
						where:{
							id:cartt[i].itemid
						}
					});

					const Rtotal=total.toFixed(2);

				//	let insidequantity=parseInt(ShopIt.quantity)-parseInt(cartt[i].quantity);
				//	shopIt.update({insidequantity})
					orderd.create({
						itemid,
						orderid,
						remark,
						oquantity,
					
						CuserId
					})
					cartt[i].destroy
						( 
						)
					shopIt.findAll({
					})
					.then((form) => {
						
						//console.log(form);
						
						for (c = 0; c < cartt.length; c++) {
							for (d = 0; d < form.length; d++) {
							if(cartt[c].itemid==form[d].id){
								
								let quantity=form[d].quantity-cartt[c].quantity;
								
if(quantity<=0){
						quantity=null;
					}
								form[d].update(quantity);
							// console.log(cartt[c]);
							// console.log(cartt[c].orderid);
							//console.log("hiii");
						
							// if(shopp[c].id==)
							//console.log(shopp[c].id==order);
							}
						}
					}
						
					})
						//console.log(cartt[i].shopIt.quantity);
						// shopIt.quantity-=oquantity;
						// let quantity=shopIt.quantity;
						// shopIt.update(quantity);
						
				}
				

				// res.redirect('shoppingg/success');
				res.render('shoppingg/success');
			})
		})
	})
	})
});



router.post('/creditcardpaymentdone', (req, res) => {
	let expiry=req.body.expiry;
	var d = new Date();
	let month=d.getMonth()+1;
	let thisyear=d.getFullYear();
	let year=thisyear.toString().substr(-2);
	console.log(year.substr(-2));
	let errors = [];
	if (parseInt(expiry.substr(-2))<parseInt(year)) {
	
        errors.push({ text: 'Passwords do not match' });
	}
	else{
	cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include: [{
				model: shopIt, as: "stockrec",
				required: true
			}]

		})
		.then((carttp) => {
			var total=0.00;
			for (i = 0; i < carttp.length; i++) {
				//let quantity=parseInt(cartt[i].form.quantity-parseInt(cartt[i].quantity))
				total+=parseInt(carttp[i].quantity)*parseFloat(carttp[i].stockrec.price);
				}
			
				const Rtotal=total.toFixed(2);
	var today = new Date();
	var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() ;
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let datetime = date + ' ' + time;
	let payname = req.body.payname;
	let paycontact = req.body.paycontact;
	let payemail = req.body.payemail;
	let payaddress = req.body.payaddress;
	let paypostalC = req.body.paypostalC;
	let totalamount=Rtotal;
	let CorCC = "credit card";
	let CCType=req.body.CCType.toString();
	let CuserId = req.user.id;
	// Multi-value components return array of strings or undefined
	paymentt.create({
		date,
		time,
		payname,
		paycontact,
		payemail,
		payaddress,
		paypostalC,
		CorCC,
		totalamount,
		CCType,
		CuserId
	}).then((paymenttt) => {

		cart.findAll(
			{
				where: {
					CuserId: req.user.id
				}
				,
				include: [{
					model: shopIt, as: "stockrec",
					required: true
				}]

			})
			.then((cartt) => {
				shopIt.findAll({
				})
				.then((shoppi) => {
				var total=0.00;
				var today = new Date();
				var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() ;
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
				for (i = 0; i < cartt.length; i++) {
					let itemid = cartt[i].itemid;
					let orderid = paymenttt.id;
					let oquantity=cartt[i].quantity;
					let remark=cartt[i].remark;
					
					let CuserId = req.user.id;
						for (d = 0; d < shoppi.length; d++) {
						if(cartt[i].itemid==shoppi[d].id){
							let itemName=shoppi[d].itemName;
							let price=shoppi[d].price;
							let posterURL=shoppi[d].posterURL;
							Orderhistory.create({
								date,
								time,
								oquantity,
								itemName,
								remark,
								price,
								posterURL,
								CuserId 
							})
							
							}}
					
					
					// var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
					// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
					// let datetime = date + ' ' + time;
					let quantity=parseInt(cartt[i].stockrec.quantity-parseInt(cartt[i].quantity))
					total+=parseInt(cartt[i].quantity)*parseFloat(cartt[i].stockrec.price);
					

					if(quantity<=0){
						quantity=null;
					}
					shopIt.update({
						quantity
					},
					{
						where:{
							id:cartt[i].itemid
						}
					});

					const Rtotal=total.toFixed(2);

					orderd.create({
						itemid,
						orderid,
						oquantity,
						remark,
						CuserId
					})
					
					cartt[i].destroy
						( 
						)
					shopIt.findAll({
					})
					.then((form) => {
						 
						for (c = 0; c < cartt.length; c++) {
							for (d = 0; d < form.length; d++) {
							if(cartt[c].itemid==form[d].id){
								
								let quantity=form[d].quantity-cartt[c].quantity;
							
								if(quantity<=0){
									quantity=null;
								}
								form[d].update(quantity);
							}
						}
					}
						
					})
						
				}
				res.render('shoppingg/success');
			})
		})
	})
	})
}
});




// router.set('view engine','ejs'); 

paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'AS22TI8W9SCHmrJTVJnuBvc8MF5TNZZqIViJ5Qv0eMrWQVyXLRtdI39EuUS5MtRbesTjV4bryTZFEFZZ',
	'client_secret': 'EG-jC2YGoyw--l22hFkSa5uUCBWh2F7IymjzkxPX2ZUSBW1fZzwR3q-8uuXp5FUKlrwZHNl-1RlUQWqF'
});

router.post('/pay', (req, res) => {
	// const total=0;

	cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include:[{
				model: shopIt ,as: "stockrec",
				required:true
			   }]
		})
		.then((carttt) => {
			const listhehe=[];
			var total=0.00;
			for (i = 0; i < carttt.length; i++) {
				const items={}
				items["name"]=carttt[i].stockrec.itemName;
				// items["itemid"]=carttt[i].itemid;
				items["currency"]="SGD";
				items["price"]=carttt[i].stockrec.price;
				// items["price"]= carttt[i].form.price;
				items["quantity"]=carttt[i].quantity;
				console.log(carttt[i].quantity);
				total+=parseInt(carttt[i].quantity)*parseFloat(carttt[i].stockrec.price);
				
				// items["name"]=carttt[i].form.name;
				listhehe.push(items);
				
				//transactions.item_list.items.push({itemid: itemid});

				//let cost =parseFloat(carttt[i].shopp.price);
				// total+=cost;
				//console.log(cost);
			}
			
			//const Rtotal=total.toFixed(2);
			
			//console.log(total);
			const Rtotal=total.toFixed(2);
			//console.log(Rtotal);
			//console.log(listhehe); 
			const create_payment_json = {

				//{
					"intent": "sale",
					"payer": {
					  "payment_method": "paypal"
					},
					"transactions": [
					  {
						"amount": {
						  "total": Rtotal,
						  "currency": "SGD",
						  "details": {
							"subtotal": Rtotal,
							
						  }
						},
						"description": "The payment transaction description.",
						
						"payment_options": {
						  "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
						},
						"soft_descriptor": "ECHI5786786",
						"item_list": {
						  "items":  listhehe
				
						}
					  }
					],
					"note_to_payer": "Contact us for any questions on your order.",
					"redirect_urls": {
					  "return_url": "http://localhost:5000/shopping/success",
					  "cancel_url": "http://localhost:5000/shopping/paymenttype"
					}
				  }

		
			paypal.payment.create(create_payment_json, function (error, payment) {
				if (error) {
					console.log(error);
					throw error;
				} else {
					for (let i = 0; i < payment.links.length; i++) {
						if (payment.links[i].rel === 'approval_url') {
							res.redirect(payment.links[i].href);
		
						}
					}
				}
			});


		})

	



});

router.get('/success', (req, res) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
	
	// const Rtotal = req.query.total;
	//const Rtotal=total.toFixed(2);
	//console.log(Rtotal);

cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include:[{
				model: shopIt ,as: "stockrec",
				required:true
			   }]
		})
		.then((carttt) => {
			const listhehe=[];
			var total=0.00;
			for (i = 0; i < carttt.length; i++) {
				const items={}
				items["name"]=carttt[i].stockrec.itemName;
				// items["itemid"]=carttt[i].itemid;
				items["currency"]="SGD";
				items["price"]=carttt[i].stockrec.price;
				// items["price"]= carttt[i].form.price;
				items["quantity"]=carttt[i].quantity;
				items["remark"]=carttt[i].remark;
				console.log(carttt[i].quantity);
				total+=parseInt(carttt[i].quantity)*parseFloat(carttt[i].stockrec.price);
				
				
				// items["name"]=carttt[i].form.name;
				listhehe.push(items);
				
				//transactions.item_list.items.push({itemid: itemid});

				//let cost =parseFloat(carttt[i].shopp.price);
				// total+=cost;
				//console.log(cost);
			}
			
			//const Rtotal=total.toFixed(2);
			
			//console.log(total);
			const Rtotal=total.toFixed(2);
			//console.log(Rtotal);
			//console.log(listhehe); 
		

	const execute_payment_json = {
		"payer_id": payerId,
		"transactions": [{
			"amount": {
				"currency": "SGD",
				"total": Rtotal
			}
		}]
	}

	var today = new Date();
	var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() ;
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let datetime = date + ' ' + time;
	let payname = req.user.name;
	let paycontact = req.user.contact;
	let payemail = req.user.email;
	let payaddress = req.user.address;
	let paypostalC = req.user.address;
	let CorCC = "credit card";
	let totalamount=Rtotal;
	let transactions = paymentId;
	let CuserId = req.user.id;
	// Multi-value components return array of strings or undefined
	paymentt.create({
		date,
		time,
		payname,
		paycontact,
		payemail,
		payaddress,
		paypostalC,
		transactions,
		CorCC,
		totalamount,
		CuserId
	}).then((paymenttt) => {

		cart.findAll(
			{
				where: {
					CuserId: req.user.id
				},
				include:[{
					model: shopIt ,as: "stockrec",
					required:true
				   }]

			})
			.then((cartt) => {
				shopIt.findAll({
				})
				.then((shoppi) => {
				var total=0.00;
				var today = new Date();
				var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() ;
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
				for (i = 0; i < cartt.length; i++) {
					let itemid = cartt[i].itemid;
					let orderid = paymenttt.id;
					let oquantity=cartt[i].quantity;
					let remark=cartt[i].remark;
					let CuserId = req.user.id;
						for (d = 0; d < shoppi.length; d++) {
						if(cartt[i].itemid==shoppi[d].id){
							let itemName=shoppi[d].itemName;
							let price=shoppi[d].price;
							let posterURL=shoppi[d].posterURL;
							Orderhistory.create({
								date,
								time,
								oquantity,
								itemName,
								remark,
								price,
								posterURL,
								CuserId
							})
							
							}}
					
				
					// var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
					// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
					// let datetime = date + ' ' + time;
					// let items = {};
					// items[i]['item'] = itemid;
					// items[i]['currency'] = 'SGD';
					//quantity=cartt[i].form.quantity
					console.log(cartt[i].stockrec.quantity);
					let quantity=parseInt(cartt[i].stockrec.quantity-parseInt(cartt[i].quantity))
					
					if(quantity<=0){
						quantity=null;
					}
					shopIt.update({
						quantity
					},
					{
						where:{
							id:cartt[i].itemid
						}
					});
					
					orderd.create({
						itemid,
						//datetime,
						oquantity,
						orderid,
						remark,
						CuserId
					})
					cartt[i].destroy
						(

						)
				}

			})
	})
})



		;

	paypal.payment.execute(paymentId, execute_payment_json, function (error, paymentt) {
		if (error) {
			console.log(error.response);
			throw error;
		} else {
			console.log("Get Payment Response");
			console.log(JSON.stringify(paymentt));
			// res.send('success');
			res.render('shoppingg/success')
		}
	});
	
});


});

router.get('/cancel', (req, res) => res.send('Cancelled'));

router.get('/payment', (req, res) => {
	res.render('shoppingg/payment')
});

 
router.get('/shop', (req, res) => {
	// res.render('shoppingg/shop') 
	shopIt.findAll({ // retrieves all videos using the userId defined in the where object in ascending order by title.
	})
		.then((shopp) => {
			res.render('shoppingg/shop', { //passing the videos object to display all the videos retrieved.
				shopp: shopp
			});
		})
		.catch(err => console.log(err));

});

// router.get('/oneitem/:id',(req,res)=>{
// 	var id=req.param.id;

// 			  res.render('shoppingg/oneitem')
// })

router.get('/oneitem/:id', (req, res) => {
	let id = req.param.id;
	shopIt.findOne({ where: { id: req.params.id } })

		.then((shopp) => {
			Feedback.findAll(
				{	where: { productcode: req.params.id},
					include: [{
						model:user, as: "user",
						required: true
					}]
				})
				.then((feedbackk) => {
					var totalrate=parseInt(0);
					var nocustomer=feedbackk.length;
					for(var i=0;i<feedbackk.length;i++){
						totalrate+=parseInt(feedbackk[i].rate);
						console.log(totalrate);
					}
					var average= Math.round(totalrate/feedbackk.length);
					console.log("look here wmhahha ");
					console.log(average);
			res.render('shoppingg/oneitem', { //passing the videos object to display all the videos retrieved.
				feedbackk,
				shopp,
				nocustomer,
				average
			});
		})
	})

})



router.get('/cartfull', (req, res) => {
	// res.render('shoppingg/shop') 
	cart.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			//include: [shopIt,user]
			include: [{
				model: shopIt, as: "stockrec",
				required: true
			}],
			order: [
				['id', 'DESC']
			]
		})
		.then((cart) => {
			var total=0.00;
			for (i = 0; i < cart.length; i++) {
				//let quantity=parseInt(cartt[i].form.quantity-parseInt(cartt[i].quantity))
				total+=parseInt(cart[i].quantity)*parseFloat(cart[i].stockrec.price);
				}
				const Rtotal=total.toFixed(2);

			res.render('shoppingg/cartfull', { //passing the videos object to display all the videos retrieved.
				cart: cart,
				Rtotal:Rtotal
				//   shopp:shopp
			});
		})


})
// 	shopIt.findAll({ 
// 		where: {
// 			itemid: req.cart.itemid
// 		        }
// 	})
// 		  .then((shopp) 
// 		  => { 
// 			  res.render('shoppingg/cartfull', { //passing the videos object to display all the videos retrieved.

// 				  cart:cart,
// 				//   shopp:shopp
// 			  });
// 		  }))


// })

// router.put('/cartPartial',(req,res)=>{
// 	// res.render('shoppingg/shop') 
// cart.findAll({ 
// 	where: {
// 		CuserId: req.user.id
// 	}
// 	// where: { id : req.params.id} 
// 	// retrieves all videos using the userId defined in the where object in ascending order by title.
// })
// 	  .then((cart) => { 
// 		  res.render('partials/_cart', { //passing the videos object to display all the videos retrieved.

// 			  cart:cart
// 		  });
// 	  })
// 	  .catch(err => console.log(err));

// })

router.get('/deletecart/:id', ensureAuthenticated, (req, res) => {
	var cartid = req.params.id;
	cart.findOne({
		where: {
			//CuserId: req.user.id
			id:cartid
		}
	}).then((cartt) => {
		if (cartt.CuserId === req.user.id) {
			cartt.destroy({
				where: {
					id: cartid
				}
			}).then((cart) => {
				let id=req.params.id;
				res.redirect('/shopping/cartfull');
			}).catch(err => console.log(err));
		} else {
			alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
			req.logout();
			res.redirect('/');
		}
	})
});

router.get('/wishlist', (req, res) => {
	let id = req.param.id;
	wishlist.findAll(
		{
			where: {
				CuserId: req.user.id
			}
			,
			include: [{
				model: shopIt, as: "stockrec",
				required: true
			}]
		})

		.then((wish) => {
			console.log("it runnnnnnnnnnnnn");
			res.render('shoppingg/wishlist'
				, {
					wish: wish
				}
			);
		})


})



router.get('/addtowishlist/:id', (req, res) => {
	wishlist.findOne({ where: { itemid: req.params.id } })
		.then(wishlistt => {
			if (wishlistt) {
				alertMessage(res, 'success', 'The item is already in your wishlist.', 'fa fa-hand-peace-o', true);
				res.redirect('/shopping/shop');
			}
			else {
				shopIt.findOne({ where: { id: req.params.id } })
					.then((shopp) => {
						let itemid = shopp.id;
						let CuserId = req.user.id;
						wishlist.create({
							itemid,
							CuserId
						}).then((wishlist) => {
							alertMessage(res, 'success', 'You have successfully added it into your wishlist', 'fa fa-hand-peace-o', true);
							res.redirect('/shopping/shop');
						})
					})
			}
		})
});

router.get('/addtowishlistt/:id', (req, res) => {
	wishlist.findOne({ where: { itemid: req.params.id } })
		.then(wishlistt => {
			if (wishlistt) {
				alertMessage(res, 'success', 'The item is already in your wishlist.', 'fa fa-hand-peace-o', true);
				res.redirect('/shopping/cartfull');
			}
			else {
				shopIt.findOne({ where: { id: req.params.id } })
					.then((shoppp) => {
						 console.log(shoppp);
						let itemid = shoppp.id;
						let CuserId = req.user.id;
						wishlist.create({
							itemid,
							CuserId
						}).then((wishlist) => {
							alertMessage(res, 'success', 'You have successfully added it into your wishlist', 'fa fa-hand-peace-o', true);
							res.redirect('/shopping/cartfull');
						})
					})
			}
		})
});




router.get('/deletewishlist/:id', ensureAuthenticated, (req, res) => {
	var wishid = req.params.id;
	wishlist.findOne({
		where: {
			id: wishid
		}
	}).then((wish) => {

		if (wish.CuserId === req.user.id) {
			wishlist.destroy({
				where: {
					id: wishid
				}
			}).then((wish) => {
				// For icons to use, go to https://glyphsearch.com/
				
				res.redirect('/shopping/wishlist');
			}).catch(err => console.log(err));
		} else {
			// Video does not belong to the current user
			alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
			req.logout();
			res.redirect('/');
		}
	})
});


// function get_oneitem(id){
// 	//for(i = 0; i < shopp.length; i++){
// 	//if(id==i){
// 		router.get('/oneitem/:id',(req,res)=>{
// 			shopIt.findOne({ 	where: { id: req.param.id }
// 				// retrieves all videos using the userId defined in the where object in ascending order by title.
// 			})

// 				  .then((shopp) => { 
// 					  res.render('shoppingg/oneitem', { //passing the videos object to display all the videos retrieved.

// 						  shopp:shopp
// 					  });
// 				  })


// 					})

// 	}
// 	//}


router.post('/paymentdone', (req, res) => {
	var today = new Date();
	var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() ;
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let datetime = date + ' ' + time;
	let payname = req.body.payname;
	let paycontact = req.body.paycontact;
	let payemail = req.body.payemail;
	let payaddress = req.body.payaddress;
	let paypostalC = req.body.paypostalC;
	let CorCC = req.body.CorCC.toString();
	let CCType = req.body.CCType.toString();
	let cardname = req.body.cardname;
	let cardnumber = req.body.cardnumber;
	let expiry = req.body.expiry;
	let scode = req.body.scode;

	let CuserId = req.user.id;
	// Multi-value components return array of strings or undefined
	paymentt.create({
		date,
		time,
		payname,
		paycontact,
		payemail,
		payaddress,
		paypostalC,
		CorCC,
		CCType,
		cardname,
		cardnumber,
		expiry,
		scode,
		CuserId
	}).then((paymenttt) => {
		//for(i=0; i<cart.length ; i++ ){
		cart.findAll(
			{
				where: {
					CuserId: req.user.id
				}

				// ,
				// include:[{
				// 	model: shopIt ,as: "shopp",
				// 	required:true
				//    }]
			})
			.then((cartt) => {
				//console.log(cartt[0]);
				//while(cartt.CuserId==req.user.id){
				// if(cart.length>0){
				// 	console.log("helllo");
				//while(cartt.length>0){
				// 	console.log("looking to see if it work hahahaha");
				// for (i = 0; i < cartt.length; i++){
				// 	console.log(i);
				// 	console.log("narutoooooo mwhaha");
				for (i = 0; i < cartt.length; i++) {
					//if(cartt.CuserId==req.user.id){
					console.log(cartt.itemid);
					//while(cartt.CuserId==req.user.id){
					// for (i = 0; i < cartt.length; i++){
					// 	console.log("1");
					//if(cartt.CuserId==req.user.id){
					let itemid = cartt[i].itemid;
					let orderid = paymenttt.id;
					let CuserId = req.user.id;
					orderd.create({
						itemid,
						orderid,
						CuserId
					})
					cartt[i].destroy
						(
							//{where:{CuserId:req.user.id}}
						)
				}
				//}
				//}
				// 	}
				// }
				//}

				res.redirect('/');
			})
	})
});


router.get('/addtocart/:id', (req, res) => {
	
	cart.findOne({ 
		where: { itemid: req.params.id } ,
		include: [{
			model: shopIt, as: "stockrec",
			required: true
		}]
	
	})
		.then(cartt => {
			if (cartt) {
				let quantity=parseInt(cartt.quantity)+1;
				cartt.update({quantity})
				alertMessage(res, 'success', cartt.stockrec.itemName+" have successfully added into your cart.", 'fa fa-hand-peace-o', true);
				
				res.redirect('/shopping/shop')
			}
			else {

	shopIt.findOne({ where: { id: req.params.id } })
		.then((shopp) => {
			
			let itemid = shopp.id;
			let CuserId = req.user.id;
			let quantity=1;
			//let quantity= parseInt(cart.quantity)+1;
			cart.create({
				itemid,
				quantity,
				CuserId
			}).then((cart) => {
				alertMessage(res, 'success', shopp.itemName+" have successfully added into your cart.", 'fa fa-hand-peace-o', true);
				
          
				//alert(cartt.form.itemName+" have successfully added into your cart.");
				res.redirect('/shopping/shop');
			})
		})
	}
	
})

	// for( c in shopIt){

	// 	console.log(shopIt);
	// 	console.log("stoppppppppppppppppppppppppppppppppp");
	// 	console.log('saving cart 11111111');
	// 	if(c.id==itemId){
	// 		console.log("saving cart 22222222222");
	// shopIt.findAll({ // retrieves all videos using the userId defined in the where object in ascending order by title.
	// })
	// 	  .then((shopp) => { 

	// 		  if (shopp.id==itemId)
	// 		  {
	// 			let name = shopp.name;
	// 			let price = shopp.price;
	// 			cart.create({
	// 				itemId,
	// 				name,
	// 				price
	// 			}).then((cart)=>{
	// 					res.redirect('/');
	// 				})
	// 		  res.redirect('/');}
	// 	  })
	//res.redirect('/');
	// let name = req.c.name;
	// let price = req.c.price;
	// cart.create({
	// 	itemId,
	// 	name,
	// 	price

	// }).then((cart) => {
	// 	res.redirect('/');
	// })

	// Multi-value components return array of strings or undefined


});

router.post('/addtocartt/:id', (req, res) => {
	let quantity=req.body.quantity;
	cart.findOne({ where: { itemid: req.params.id } })
		.then(cartt => {
			if (cartt) {
				let id=req.params.id;
				let remark=req.body.remark;
				let quantity=parseInt(cartt.quantity)+parseInt(req.body.quantity);
				cartt.update({quantity})
				cartt.update({remark})
				alertMessage(res, 'success', "It have successfully added into your cart.", 'fa fa-hand-peace-o', true);
				res.redirect('/shopping/oneitem/'+id);
			}
			else {
	shopIt.findOne({ where: { id: req.params.id } })
		.then((shopp) => {
			
			let id=req.params.id;
			let itemid = shopp.id;
			let CuserId = req.user.id;
			let remark=req.body.remark;
			console.log(quantity);
			cart.create({
				itemid,
				quantity,
				remark,
				CuserId  
			}).then((cart) => {
				alertMessage(res, 'success', "It have successfully added into your cart.", 'fa fa-hand-peace-o', true);
				
				res.redirect('/shopping/oneitem/'+id);
			})
		})
	}
})
});
// router.post('/addtocart/:id', (req, res) => {
//     let itemId=req.param.id;
// 	console.log("saving carttttttttttttttttttt");
// 	let name = req.body.name;
// 	let price = req.body.price;
// 	cart.create({
// 		itemId,
// 		name,
// 		price

// 	}).then((cart) => {
// 		res.redirect('/');
// 	})

// });



module.exports = router;