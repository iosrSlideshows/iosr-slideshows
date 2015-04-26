var schemaDefinitions = require('./schemas.js');
var mongoose = require('mongoose');

function makeModel(schemaDefinition){
	return mongoose.model(schemaDefinition.name, schemaDefinition.schema)
}
 
module.exports = {

	Slideshow : makeModel(schemaDefinitions.slideshow),

    Slide : makeModel(schemaDefinitions.slide),

    User : makeModel(schemaDefinitions.user)

}