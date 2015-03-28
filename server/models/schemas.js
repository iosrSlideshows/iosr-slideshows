var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {

	slideshow : {
		name : 'Slideshow',
		schema : new Schema({
			name : String
		})
	},

};
