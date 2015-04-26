var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//TODO walidacja customowa
function validateContent(contentObj) {
    if(contentObj.type === 'text-field') {

    } else if(contentObj.type === 'image') {

    } else if(contentObj.type === 'circle') {

    } else if(contentObj.type === 'line') {

    }
    return true;
}

var content = new Schema({
    type : {type: String, required:true},

    text: String,
    position : {
        type : {
            x : Number,
            y : Number
        }
    }
});

content.pre('save', function (next) {
    var isValid = validateContent(this);
    if (!isValid){
        return next(new Error('Content custom validation error'));
    }
    next();
});

module.exports = {

	slideshow : {
		name : 'Slideshow',
		schema : new Schema({
			document_name : {type: String, required:true},
            author : String,
            creation_date : {type: String, required:true},
            last_modification_date: {type: String},
            main_theme : String,
            slides : [
                {type: Schema.ObjectId, ref: 'Slide'}
            ]
		})
	},

    slide : {
        name : 'Slide',
        schema : new Schema({
            theme : String,
            background : {
                type : {
                    type : String,
                    value : String
                }
            },
            content : [content]
        })
    },

    user : {
        name : 'User',
        schema : new Schema({
            id : String,
            token : String,
            email : String,
            name : String
        })
    }

};
