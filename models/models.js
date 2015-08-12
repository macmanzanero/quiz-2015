var path = require('path');

// Postgres DATABASE_URL
//DATABASE_URL = postgres://wqvmnmmwiwqrqi:2rANAt9MYeQt_dBcn9mcJTeFk0@ec2-107-21-125-143.compute-1.amazonaws.com:5432/da4ejrqvqsfhfs
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
//					{dialect: "sqlite", storage: "quiz.sqlite"});

var sequelize = new Sequelize(DB_name, user, pwd, {	
	dialect: dialect,
	protocol: protocol,
	port: port,
	host: host,
	storage: storage,	//	Sólo para SQLite (.env) 
	omitNull: true	   	//	Sólo para Postgress
});

// Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
// Importar la definición de la tabla Comentarios de comment.js
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);
//var Comment = sequelize.import(path.join(__dirname, 'comment'));

// Se define la relación 1-a-N entre Quiz y Comment
Comment.belongsTo(Quiz);	// Indica que un Comment pertenece a Quiz
Quiz.hasMany(Comment);		// Indica que un Quiz puede tener muchos comments

// Exportar la definición de la Quiz y Comentarios
exports.Quiz = Quiz;
exports.Comment = Comment;

// sequelize.sync() crea e inicializa la tabla de preguntas en la BD
sequelize.sync().then(function() {
	// then (..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if (count === 0) {
		//if (count < 2) {
			Quiz.create({ pregunta: 'Capital de Italia', respuesta: 'Roma', tematica: 'humanidades'});
			Quiz.create({ pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tematica: 'humanidades'})			
			.then(function(){console.log('Base de datos inicializada')});
		} else {console.log('No carga datos')};
	});
});