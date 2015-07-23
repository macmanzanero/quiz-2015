// Definición del modelo del Quiz
// Define la tabla Quiz con dos campos de tipo string

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Quiz',
		{ pregunta: DataTypes.STRING,
		  respuesta: DataTypes.STRING,
		});
}