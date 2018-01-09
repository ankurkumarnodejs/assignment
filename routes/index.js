var express = require('express');
var router = express.Router();
var State = require('../model/state.js');
var Customer = require('../model/customer.js');



	/* GET home page. */
		router.get('/', function(req, res, next) {
		State.find({},(err, data) => {
		res.render('index', { title: 'State List', states: data });
		});	
		});


		router.get('/main', function(req, res, next) {
		State.distinct('state', function( err, results ){	
		Customer.find({}).exec((err, data)=> {
		res.render('main', { title: 'Customer List', states: results, customers: data});
		});
		});
		});


		router.get("/edit/:Id",  function(req, res, next){		
		Customer.findById(req.params.Id, function(err, data){
		console.log(data);
         res.render('update', { title: 'Update', customer: data});
		})
		});

		router.get("/filters",  function(req, res, next){	
		console.log(req.query);	
		State.distinct('district', {state: req.query.state}, (err, data) => {
		if(data){
		res.json(data);
		}
		});	
		});

		router.get("/filterd",  function(req, res, next){		
		State.distinct('taluka' , {district: req.query.district}, (err, data) => {
		if(data){
		res.json(data);
		}
		});		
		});
		
		/* GET home page. */
		router.post('/state', function(req, res, next) {	  
			var stateData = new State(req.body);
			stateData.save(function(err){
				if(err) {
				res.redirect('/');
				} else {
				res.redirect('/');
				}
			});		
		});

		router.post("/addcustomer",  function(req, res, next){		
		var customerData = new Customer(req.body);
			customerData.save(function(err){
				if(err) {
				res.redirect('/main');
				} else {
				res.redirect('/main');
				}
		});	
		});

		router.get("/delete/:Id",  function(req, res, next){		
		Customer.findByIdAndRemove(req.params.Id, function(err, data){
		res.redirect('/main');
		});
		});

		router.post("/update",  function(req, res, next){		
		Customer.update({_id: req.body.id}, req.body , function(err,data){
		res.redirect('/main');
		});	

		});



module.exports = router;
