var model = require('./models/models.js');

function prepareResponse(err, data){

	if(err){
		return {
			error : err
		};
	}

	return data;
}

module.exports = function(app){

	app.get('/slideshows', function(req, res) {
		
		model.Slideshow.find(function(err, slideshows){

			res.json(prepareResponse(err, slideshows));

		});
			
	})

	app.post('/slideshows', function(req, res) {

		model.Slideshow.create( req.body, function(err, slideshow) {

			res.json(prepareResponse(err, slideshow));

		});

	})

	app.delete('/slideshows/:slideshow_id', function(req, res){

		model.Slideshow.remove({
			_id : req.params.slideshow_id
		}, function(err, slide){

			res.json(prepareResponse(err, slide));
			
		})

	})

}