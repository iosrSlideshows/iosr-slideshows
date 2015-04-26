var model = require('./models/models.js');

var log;

function prepareResponse(err, data){

	if(err){
		log.error(err);
		return err.message;
	}

	return {dbResult : data};
}

function createSlideshow(slideshowObj, res){
    slideshowObj.creation_date = new Date();

    model.Slideshow.create( slideshowObj, function(err, slideshow) {
        if(err){
            res.status(400).json(err.message);
        } else {
            res.status(201).location('/slideshows/' + slideshow._id).json({dbResult : slideshow._id});
        }
    });
}

function getUser(req) {
    if(req.isAuthenticated()){
        return req.user;
    }
    return null;
}

module.exports = function(app, logger, passport){

	log = logger;

	app.get('/slideshows', function(req, res) {

		model.Slideshow.find({}, 'document_name', function(err, slideshows){

			res.json(prepareResponse(err, slideshows));

		});
			
	})

	app.put('/slideshows', function(req, res) {
        var slideshowObj = req.body;

        var slidesArray = slideshowObj.slides;
        if(slidesArray && slidesArray.length !== 0){
           model.Slide.create( slidesArray, function(err) {
                if(err) {
                    res.status(400).json(err.message);
                    return;
                }

                var slidesIds = [];
                for(var i = 1; i < arguments.length; i++){
                    slidesIds.push(arguments[i]["_id"]);
                }

                slideshowObj.slides = slidesIds;
                createSlideshow(slideshowObj, res);
           });
        } else {
            createSlideshow(slideshowObj, res);
        }

	})

	app.delete('/slideshows/:slideshow_id', function(req, res){

		model.Slideshow.remove({ _id : req.params.slideshow_id }, function(err, slide){

            if(err) {
                res.status(404).json(err.message);
            } else {
                res.status(200).location('/slideshows/' + slideshow_id).json({dbResult : slideshow_id});
            }

		})

	})

	app.get('/slideshows/:slideshow_id', function(req, res){

		model.Slideshow.findOne({ _id : req.params.slideshow_id }).populate('slides').populate('content').exec(function(err, slide){
            if(err) {
                res.status(404).json(err.message);
            } else {
                res.status(200).json({dbResult : slide});
            }
		})

	})

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/#/login?success=true',
            failureRedirect : '/#/login?success=false'
        })
    );

    app.get('/logout', function(req, res) {
        req.logout();
    });

    app.get('/profile', function(req, res) {
        var user = getUser(req);
        if(user) {
            res.status(200).json(
                {
                    name: user.name,
                    email: user.email
                });
        } else {
            res.status(401).json("User not logged in");
        }
    });

}