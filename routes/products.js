'use strict';

var express = require('express');
var router = express.Router();

var config = require('../config.json');

var forEach = require('async-foreach').forEach;

//Models
var mongoose = require('mongoose');
var Product = mongoose.model('Product');

var jwtAuth = require('../lib/jwtAuth');
router.use(jwtAuth());

//GET ALL PRODUCTS
router.get('/', function(req, res, next){

	//Query string parameters
	var name = req.query.name;

	var selling = req.query.selling;

	var lte = req.query.lte;
	var gte = req.query.gte;

	var tags = req.query.tag;

	var sort = req.query.sort || null;
	var limit = parseInt(req.query.limit) || null;
	var skip = parseInt(req.query.skip) || 0;
  	var fields = req.query.fields || null;

	//Creating filters
	var filter = {};

	//Filtering by name
	if(typeof name !== 'undefined' && name !== ''){
		//Using regular expression 'Start with' with the product name
		filter.name = new RegExp('^'+name, 'i');
	}

	//Filtering by selling or not
	if(typeof selling !== 'undefined' && (selling == 'true' || selling == 'false')) {
		filter.selling = selling;
	}

	//lte (lower than or equal) parameter or gte (greater than or equal) to filter by price range
	if(typeof lte !== 'undefined' && typeof gte !== 'undefined') {
		//Contains lte and gte
		filter.precio = { $lte: lte, $gte: gte };
	}else if(typeof lte === 'undefined' && typeof gte !== 'undefined'){
		//Contains only gte
		filter.precio = { $gte: gte };
	}else if(typeof lte !== 'undefined' && typeof gte === 'undefined'){
		//Contains only lte
		filter.precio = { $lte: lte };
	}

	//Filtering by tags
	if(typeof tags !== 'undefined'){
		//Filtering by only one tag
		if(typeof tags == 'string'){
			var tagList = [];
			tagList.push(tags);
			filter.tags = { '$in' : tagList };
		}else{
			//Filtering by many tags
			filter.tags = { '$in' : tags };
		}
	}

    //adding fields to select
    if(fields !== null){
    	fields = fields.toString().replace(',',' ');
    }

	//creating final query 
    var query = Product.find(filter);
    query.sort(sort);
    query.limit(limit);
    query.skip(skip);
    query.select(fields);

    query.exec(function(err, products) {
		if(err) return next({error: "ERROR!", detail: err });

		//Succes!!
		res.json({success:true, images_folder: config.images_folder, products: products});
    });

});


//GET ALL TAGS
router.get('/tags', function(req, res, next){


	var query = Product.find();
	//Selecting only the tags
	query.select('tags');

	//Executing query
	query.exec(function (err, products){
		if(err) return next({error: "ERROR", detail: err });

		var tags = [];
		forEach(products, function(product) {			
			product.tags.map(function (tag) { 				
				if(!tags.toString().includes(tag)){
					tags.push(tag);
				}
			});
		}, finished);

		function finished(){
			res.json({success:true, tags: tags});
		}

	});

});


//CREATE PRODUCTS
router.post('/', function(req,res,next){

	var product = new Product(req.body);
	product.save(function(err,product){
		if(err) return next({error: "ERROR", detail: err });

		res.json({success:true, product: product});
	});

});


//MODIFY PRODUCTS
router.put('/:id', function(req,res,next){

	var id = req.params.id;
	Product.update({_id: id},req.body,function(err,response){
		if(err) return next({error: "ERROR", detail: err });

		res.json({success:true, response:response});
	});

});

//DELETE PRODUCTS
router.delete('/:id', function(req,res,next){

	var id = req.params.id;
	Product.remove({_id: id},function(err, response) {
		if(err) return next({error: "ERROR", detail: err });
		res.json({success:true, response: response});
	});
	
});

module.exports = router;
