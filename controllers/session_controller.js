// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

// GET /login -- Formulario de login
exports.new = function(req, res) {
	
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// POST /login -- Crear la sesión
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');

	userController.autenticar(login, password, function(error, user) {
		if (error) {
			req.session.errors = [{"message": 'Se ha producido un ' + error}];
			res.redirect("/login");
			return;
		}

		req.session.user = {id: user.id, username: user.username};

		// En req.session.tiempo guarda la hora de inicio de sesión
		req.session.tiempo = new Date().getTime();
		// Controla si se produce auto-logout
		req.session.autoLogout= false;

		res.redirect(req.session.redir.toString()); // redirect al path anterior al login
	});
};

// DELETE /logout -- Destruye la sesión
exports.destroy = function(req, res) {
	delete req.session.user;

	// Si true, se ha producido el auto-logout y redirect a login
	if (req.session.autoLogout) {
		res.redirect("/login");
	} else {
		// redirect a path anterior a login
		res.redirect(req.session.redir.toString());
	}
};