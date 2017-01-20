'use strict';

var mongoose = require('mongoose');
var db = mongoose.connection;

//cargo el fichero de configuraciones para requperar información de la bbdd
var config = require('../config.json');

db.on('error', console.log.bind(console));

db.once('open', function(){
	console.log('MongoDB connection OPEN');
});

//si tiene credenciales las aplico a la cadena de connexión
var credentials = '';
if(config.db_username !== '' || config.db_password !== '' )
	credentials = config.db_username + ':' + config.db_password + '@';

//creo la cadena de connexión a partir de la info en config.json
var connection_string = 'mongodb://' + credentials + config.db_ip + ':' + config.db_port + '/' + config.db_name;

console.log(connection_string);

mongoose.Promise = global.Promise;

mongoose.connect(connection_string);