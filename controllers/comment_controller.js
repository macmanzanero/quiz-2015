// Importa el modelo para acceder a la BD
var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
	res.render('comments/new.ejs', {quizId: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
	var comment = models.Comment.build( { texto: req.body.comment.texto, QuizId: req.params.quizId });
	var errors = comment.validate(); //ya qe el objeto errors no tiene then(

	if (errors){
		var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
		for (var prop in errors) errores[i++]={message: errors[prop]};
			res.render('comment/new.ejs', {comment: comment, quizId: req.params.quizId, errors: err.errors});
	} else {	
		comment
		.save()
		.then( function(){ res.redirect('/quizes/' + req.params.quizId)})	
	}
};
