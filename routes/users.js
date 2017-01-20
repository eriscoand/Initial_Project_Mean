'use strict';

var express = require('express');
var router = express.Router();

var config = require('../config.json');

//Models
var mongoose = require('mongoose');
var User = mongoose.model('User');

var jwt = require('jsonwebtoken');
var sha1 = require('sha1');

//METODO POST LOGIN
router.post('/login', function(req, res, next){

	let email = req.body.email; 
	let password = sha1(req.body.password); 

	User.findOne({email: email}, function(err,user){
		if(err) return next({error: "ERROR" });

		if(!user){
			return next({error: "EMAIL NOT FOUND" });
		}else{
			if(user.password != password){
				return next({error: "INCORRECT PASSWORD" });
			}else{
				let token = jwt.sign({id: user},config.jwt.secret,{expiresIn: config.jwt.expires});				
				res.json({success: true, token: token});
			}
		}
	});

});

//CREATING NEW USER
router.post('/', function(req,res,next){

	var user = new User(req.body);

	user.password = sha1(user.password);

	user.save(function(err,user){
		if(err) return next({error: "ERROR SAVING USER!!", detail: err });
		let token = jwt.sign({id: user},config.jwt.secret,{expiresIn: config.jwt.expires});				
		res.json({success: true, token: token});
	});

});

module.exports = router;
