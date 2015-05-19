var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function validateContent(contentObj) {
    if(contentObj.type === 'text-field') {

    } else if(contentObj.type === 'image') {

    } else if(contentObj.type === 'circle') {

    } else if(contentObj.type === 'line') {

    }
    return true;
}

module.exports = function(){

    var module = {};

    var content = new Schema({
        type : {type: String, required:true},

        //text
        text: String,

        //image
        url: String,

        //circle, image, text
        position : {
            type : {
                x : Number,
                y : Number
            }
        },

        //image
        size: {
            type : {
                width: Number,
                height: Number
            }
        },

        //circle
        radius: Number,

        //line, circle, text
        color: String,

        //line
        begin: {
            type : {
                x: Number,
                y: Number
            }
        },

        //line
        end: {
            type : {
                x: Number,
                y: Number
            }
        }
    }).pre('save', function (next) {
        var isValid = validateContent(this);
        if (!isValid){
            return next(new Error('Content custom validation error'));
        }
        next();
    });

    var slide =  new Schema({
        theme : String,
        background : {
            type : {
                type : String,
                value : String
            }
        },
        content : [content]
    });

    module.slideshow = {
        name : 'Slideshow',
        schema : new Schema({
            document_name : {type: String, required:true},
            author : {type: Schema.ObjectId, ref: 'User', required: true},
            creation_date : {type: String, required:true},
            last_modification_date: {type: String},
            main_theme : String,
            slides : [slide]
        })
    }


    module.user = {
        name : 'User',
        schema : new Schema({
            profileId : String,
            token : String,
            refreshToken : String,
            email : String,
            name : String
        })
    }

    return module;
};
