// Importa el modelo para acceder a la BD
var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
	console.log("PASA POR LOAD DE COMMENTS");
	models.Comment.find({
		where: { id: Number(commentId)}})
	.then(
		function(comment) {
			if (comment) {
				req.comment = comment;
				next();
			} else {
				next(new Error('No existe commentId=' + commentId))
			}
		}
	).catch(function(error) {next(error);});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
	console.log("PASA POR NEW DE COMMENTS");
	res.render('comments/new.ejs', {quizId: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
	var comment = models.Comment.build( { texto: req.body.comment.texto, QuizId: req.params.quizId });
	var errors = comment.validate(); //ya qe el objeto errors no tiene then(

	console.log("PASA POR CREATE DE COMMENTS");

	if (errors){
		var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
		for (var prop in errors) errores[i++]={message: errors[prop]};
			res.render('comments/new.ejs', {comment: comment, quizId: req.params.quizId, errors: err.errors});
	} else {	
		comment
		.save()
		.then( function(){ res.redirect('/quizes/' + req.params.quizId)})	
	}
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
  req.comment.publicado = true;
  
  console.log("LLEGA A PUBLISH DE COMMENTS");
  
  req.comment.save( {fields: ["publicado"]})
    .then( function(){ res.redirect('/quizes/'+req.params.quizId);} )
    .catch(function(error){next(error)});

};
