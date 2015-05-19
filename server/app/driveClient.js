var google = require('googleapis');
var Promise = require('promise');
var OAuth2 = google.auth.OAuth2;
var request = require('request');

var oauth2Client;

function setUserCredentials(user){
    oauth2Client.setCredentials({
        access_token: user.token,
        refresh_token: user.refreshToken
    });
}

function getDrive(client){
    return google.drive({ version: 'v2', auth: client });
}

module.exports = function(authConfig){

    oauth2Client = new OAuth2(authConfig.clientID, authConfig.clientSecret, authConfig.callbackURL);

    var module = {};

    module.getSlideshows = function(user) {
        return new Promise(function (resolve, reject) {
            setUserCredentials(user);

            var drive = getDrive(oauth2Client);
            drive.files.list(function (err, response) {
                if (err) {
                    reject(err.message);
                } else {
                    var slideshows = [];
                    for (var i = 0, len = response.items.length; i < len; i++) {
                        var file = response.items[i];
                        if (file.fileExtension === 'slideshow' && file.editable && !file.labels.trashed) {
                            slideshows.push({
                                document_name: file.title.split(".")[0],
                                fileId: file.id
                            })
                        }
                    }
                    resolve(slideshows);
                }
            });

        })
    }

    module.getSlideshow = function(user, fileId, res) {
        var getDown = "https://www.googleapis.com/drive/v2/files/"+fileId+"?access_token="+user.token;
        request.get(getDown, function(err,response,body) {
            if (err) {
                res.status(404).json(err.message);
            }

            var downParse = JSON.parse(body);
            request.get({uri:downParse.downloadUrl,headers:{authorization:'Bearer '+user.token}}, function(err, response, body){
                if (err) {
                    res.status(404).json(err);
                }
                var result = JSON.parse(body);
                result._id = fileId;

                res.status(200).json({result : result});
            });

        });
    }

    module.deleteSlideshow = function(user, fileId, res) {
        setUserCredentials(user);

        var drive = getDrive(oauth2Client);
        drive.files.trash({
            'fileId' : fileId
        }, function(err) {
            if (err) {
                res.status(404).json(err.message);
            }
            res.status(200).location('/slideshows/drive/' + fileId).json({result : fileId});
        })
    }

    module.createSlideshow = function(user, slideshow, res) {
        setUserCredentials(user);

        var drive = getDrive(oauth2Client);

        drive.files.insert({
            resource : {
                title: slideshow.document_name + '.slideshow',
                mimeType : 'application/octet-stream'
            },
            media : {
                mimeType : 'application/octet-stream',
                body :  JSON.stringify(slideshow)
            }
        },
        function(err, response){
            if(err){
                res.status(400).json(err.message);
            } else {
                res.status(201).location('/slideshows/drive' + response.id).json({result : response.id});
            }
        });
    }

    module.updateSlideshow = function(user, slideshow, res) {
        setUserCredentials(user);

        var drive = getDrive(oauth2Client);

        drive.files.update({
            'fileId' : slideshow._id,
            'media' : {
                body :  JSON.stringify(slideshow)
            }
        }, function(err, response){
            if(err) {
                res.status(404).json(err.message);
            } else {
                res.status(200).end();
            }
        });
    }

    return module;
}