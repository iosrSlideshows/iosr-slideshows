var model = require('./models/models.js');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function prepareGetSlideshowsResponse(errors, dbResult, driveResult){
    if(errors.length == 2){
        return errors;
    } else {
        return {
            result : {
                errors: errors,
                database: dbResult,
                drive: driveResult
            }
        };
    }
}

function setup(app, passport, driveClient) {

	app.get('/slideshows', isLoggedIn, function(req, res) {

		model.Slideshow.find({author : req.user._id}, 'document_name', function(err, slideshows){

            var errors = [];
            var dbResult = null;

            if(err) {
                errors.push(err.message);
            } else {
                dbResult = slideshows;
            }

            driveClient.getSlideshows(req.user).then(function(driveSlideshows){
                res.json(prepareGetSlideshowsResponse(errors, dbResult, driveSlideshows));
            },
            function(err){
                errors.push(err);
                res.json(prepareGetSlideshowsResponse(errors, dbResult, null));
            });

		});
	})

	app.put('/slideshows', isLoggedIn, function(req, res) {
        var slideshowObj = req.body;
        slideshowObj.author = req.user._id;
        slideshowObj.creation_date = new Date();
        model.Slideshow.create( slideshowObj, function(err, slideshow) {
            if(err){
                res.status(400).json(err.message);
            } else {
                res.status(201).location('/slideshows/' + slideshow._id).json({result : slideshow._id});
            }
        });
	})

    app.put('/slideshows/drive', isLoggedIn, function(req, res) {
        driveClient.createSlideshow(req.user, req.body, res);
    })

	app.delete('/slideshows/:slideshow_id', isLoggedIn, function(req, res){

		model.Slideshow.remove({ _id : req.params.slideshow_id, author: req.user._id }, function(err, slide){

            if(err) {
                res.status(404).json(err.message);
            } else {
                res.status(200).location('/slideshows/' + req.params.slideshow_id).json({result : req.params.slideshow_id});
            }

		})

	})

    app.delete('/slideshows/drive/:file_id', isLoggedIn, function(req, res){
        driveClient.deleteSlideshow(req.user, req.params.file_id, res);
    })

	app.get('/slideshows/:slideshow_id', isLoggedIn, function(req, res){

		model.Slideshow.findOne({ _id : req.params.slideshow_id, author: req.user._id }, function(err, slide){
            if(err) {
                res.status(404).json(err.message);
            } else {
                res.status(200).json({result : slide});
            }
		})

	})

    app.get('/slideshows/drive/:file_id', isLoggedIn, function(req, res){
        driveClient.getSlideshow(req.user, req.params.file_id, res);
    })

    app.post('/slideshows', isLoggedIn, function(req, res){
        var slideshowObj = req.body;
        slideshowObj.last_modification_date = new Date();

        var id = slideshowObj._id;
        delete slideshowObj._id;

        model.Slideshow.update({'_id' : id}, slideshowObj, function(err, count){
            if(err || count === 0) {
                res.status(404).end();
            } else {
                res.status(200).end();
            }
        })
    })

    app.post('/slideshows/drive', isLoggedIn, function(req, res){
        driveClient.updateSlideshow(req.user, req.body, res);
    })

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email', 'https://www.googleapis.com/auth/drive'], accessType: 'offline', approvalPrompt: 'force' }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/#',
            failureRedirect : '/#'
        })
    );

    app.get('/logout', isLoggedIn, function(req, res) {
        req.logout();
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.redirect('/#');
    });

    app.get('/profile', function(req, res) {
        var user = req.user;
        if(user) {
            res.status(200).json(
                {
                    name: user.name,
                    email: user.email
                });
        } else {
            res.status(204).json("User not logged in");
        }
    });

}

exports.setup = setup;
exports.isLoggedIn = isLoggedIn;