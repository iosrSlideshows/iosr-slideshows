module.exports = function(){

    var module = {};

    module.getSlideshows = function(user) {

    }

    module.getSlideshow = function(user, fileId, res) {
        res.end();
    }

    module.deleteSlideshow = function(user, fileId, res) {
        res.end();
    }

    module.createSlideshow = function(user, slideshow, res) {
        res.end();
    }

    module.updateSlideshow = function(user, slideshow, res) {
        res.end();
    }

    return module;
}