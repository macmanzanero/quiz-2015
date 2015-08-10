// Definición del modelo de Quiz con validación
// Define la tabla Comentarios con un campo de tipo string

module.exports = function(sequelize, DataTypes){
	return sequelize.define(
		'Comment',
		{ texto: {
			type: DataTypes.STRING,
			validate: { notEmpty: {msg: "-> Falta el Comentario"}}
		  }
		}
	);
}