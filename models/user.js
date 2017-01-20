'use strict';

var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var user = new Schema({

	username		: { type: String, required: true },
	email			: { type: String, required: true, index: true, unique : true },
	password		: { type: String }, 
	creation		: { type: Date, default: Date.now }

});
 
mongoose.model( 'User', user );