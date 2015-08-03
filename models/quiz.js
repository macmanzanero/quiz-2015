// Definición del modelo de Quiz con validación
// Define la tabla Quiz con dos campos de tipo string

module.exports = function(sequelize, DataTypes){
	return sequelize.define(
		'Quiz',
		{ pregunta: {
			type: DataTypes.STRING,
			validate: { notEmpty: {msg: "-> Falta la Pregunta"}}
		  },
		  respuesta: {
			type: DataTypes.STRING,
			validate: { notEmpty: {msg: "-> Falta la Respuesta"}}
		  }
		}
	);
}