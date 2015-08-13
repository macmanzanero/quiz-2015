var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'Quiz 2015', resave: false, saveUninitialized: true}));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function(req, res, next) {
    // Guarda el path en session.redir para despues de login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }
    // Hace visible req.session en las vistas
    res.locals.session = req.session;

    // Auto-logout. La sesión se desconecta si usuario inactivo más de 2 minutos
    if (req.session.tiempo) {
        var actual = new Date().getTime();              // hora actual en milisegundos
        var diferencia = actual - req.session.tiempo;   // diferencia de la hora de inicio de sesión y la actual
    
        console.log("HORA ACTUAL: " + actual);
        console.log("QUEDA: " + diferencia);

        if (diferencia > (2 * 60 * 1000)) {             // Si la diferencia es > 2 minutos
            delete req.session.tiempo;                  // elimina la sesión -> desconecta al usuario
            req.session.autoLogout = true;
            res.redirect("/logout");
            console.log("PASA");
        } else {
            req.session.tiempo = actual;                // Actualiza la hora de inicio de sesión
        }
    };

    next();
});

app.use('/', routes);
app.use('/author', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
