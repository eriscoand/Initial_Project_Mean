'use strict';

var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var product = new Schema({

	name			: { type: String, required: true, index: true },
	selling			: { type: Boolean, default: false, index: true },
	price			: { type: Number, default: 0 },
	photo			: { type: String, default: 'default.jpg' },
	tags			: [{ type: String }]

});
 
mongoose.model( 'Product', product );