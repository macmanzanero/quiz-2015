var path = require('path');

// Postgres DATABASE_URL
// DATABASE_URL = postgres://wqvmnmmwiwqrqi:2rANAt9MYeQt_dBcn9mcJTeFk0@ec2-107-21-125-143.compute-1.amazonaws.com:5432/da4ejrqvqsfhfs
// SQLite DATABASE_URL
//DATABASE_URL = sqlite://:@:/

// process.env.DATABASE_URL
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Cargar el modelo ORM
var Sequelize = require('sequelize');

// Usar BDD SQLite o Postgres
//var sequelize = new Sequelize(null, null, null,
//						{dialect: "sqlite", storage: "quiz.sqlite"});
var sequelize = new Sequelize(DB_name, user, pwd,
	{	dialect: protocol,
		protocol: protocol,
		port: port,
		host: host,
		storage: storage,	//	Sólo para SQLite (.env) 
		omitNull: true	   	//	Sólo para Postgress

	});

// Importar la definición de la tabla Quiz de quiz.js
//var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definición de la tabla Quiz
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

// Exportar la definición de la Quiz 
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa la tabla de preguntas en la BD
sequelize.sync().success(function() {
	// success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count){
		if (count===0) {
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'
						})
			.success(function(){
				console.log('Base de datos inicializada')});
		};
	});
});