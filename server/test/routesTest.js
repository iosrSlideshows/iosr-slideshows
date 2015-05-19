var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var sinon = require('sinon');
var model = require('../app/models/models.js');
var Promise = require('promise');

var server = require('../app/server.js');

var passportMock = require('./mock-passport.js');
var driveMock = require('./mock-drive-client.js')();

var testUser = {
    name: { givenName: "_____TESTUSER____Jonathon_____", familyName: "Kresner" }
};
var testUserJSON =
{
    email: "testEmail@domain.com",
    name: testUser.name.givenName,
    token: "testToken",
    profileId: "testProfile",
    refreshToken: "testRefreshToken"
};


var testSlideshowJSON = {
    "document_name": "TestSlideshow",
    "author": null,
    "creation_date": new Date(),
    "slides": []
}

var correctSlideshow = {
    "document_name": "NewSlideshow",
    "slides": [{content : {}}]
}

var nonExistingSlideshowId = 'iDontExistLOLOLOLO';

var driveSlideshows = [
    {
        document_name : "driveSlideshow"
    }
];

describe('Routing', function() {
    var url = 'http://localhost:5555';

    before(function(done) {
        mongoose.connect('mongodb://localhost:27017/');
        console.log("Creating test user");
        var testUserEntity = new model.User(testUserJSON);
        testUserEntity.save(function(err, response){
            console.log("Test user created");
            testUser._id = response._id;

            testSlideshowJSON.author = testUser._id;
            var testSlideshowEntity = new model.Slideshow(testSlideshowJSON);
            testSlideshowEntity.save(function(err, response){
                console.log("Created slideshow for test user");
                testSlideshowJSON._id = response._id;
                server.startMock(passportMock, testUser, driveMock);
                done();
            });

        });

    });

    after(function(done) {
        console.log("Clearing database from test data");
        model.Slideshow.remove({'author' : testUserJSON._id}, function(){
            model.User.remove({'name' : testUserJSON.name}, function(){
                console.log('Cleanup ended');
                done();
            });
        })
    });

    describe('Slideshows', function() {
        it('should return status 200 and slideshows when getting slideshows', function(done){

            sinon.stub(driveMock, "getSlideshows", function(){
                return new Promise(function (resolve, reject) {
                    resolve(driveSlideshows);
                });
            });

            request(url)
                .get('/slideshows')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.result.database.length.should.equal(1);
                    res.body.result.drive.length.should.equal(1);
                    res.body.result.errors.length.should.equal(0);
                    res.body.result.database[0].document_name.should.equal(testSlideshowJSON.document_name);
                    res.body.result.drive[0].document_name.should.equal(driveSlideshows[0].document_name);
                    done();
                });
        });

        it('should return status 404 when getting non existing slideshow', function(done){
           request(url)
               .get('/slideshows/' + nonExistingSlideshowId)
               .end(function(err, res){
                   res.should.have.status(404);
                   done();
               });
        });

        it('should return status 200 and test slideshow when getting existing slideshow', function(done){
           request(url)
               .get('/slideshows/' + testSlideshowJSON._id)
               .end(function(err, res){
                   res.should.have.status(200);
                   res.body.result.document_name.should.equal(testSlideshowJSON.document_name);
                   done();
               });
        });

        it('should return status 201 and new slideshow id when adding correct slideshow', function(done){
            request(url)
                .put('/slideshows')
                .send(correctSlideshow)
                .end(function(err, res) {
                    res.should.have.status(201);
                    var id = res.body.result;
                    should.exist(id);
                    res.headers.location.should.equal('/slideshows/' + id);
                    done();
                })
        });

        it('should return status 400 and error when adding incorrect slideshow', function(done){
            var newSlideshow = {};
            request(url).put('/slideshows').send(newSlideshow).expect(400);
            done();
        });


        it('should return status 404 when trying to update non existing slideshow',function(done){
            var newSlideshow = {

            };
            request(url).post('/slideshows').send(newSlideshow).expect(404);
            done();
        });

        it('should return status 200 when trying to update existing slideshow', function(done){
            request(url).post('/slideshows').send(testSlideshowJSON).expect(200);
            done();
        });

        it('should return status 404 when trying to delete non existing slideshow', function(done){
            request(url).delete('/slideshows/' + nonExistingSlideshowId).expect(200);
            done();
        });

        it('should return status 200 and deleted slideshow id when deleting existing slideshow', function(done){
           request(url)
               .delete('/slideshows/' + testSlideshowJSON._id)
               .end(function(err, res){
                   res.should.have.status(200);
                   res.body.result.should.equal(testSlideshowJSON._id.toString());
                   done();
               })
        });

        it('should return status 200 and profile when user logged in', function(done){
           request(url)
               .get('/profile')
               .end(function(err, res){
                   res.should.have.status(200);
                   res.body.name.givenName.should.equal(testUser.name.givenName);
                   res.body.name.familyName.should.equal(testUser.name.familyName);
                   done();
               })
        });

        it('should call drive client getSlideshow with proper parameters', function(done){
            sinon.stub(driveMock, "getSlideshow", function(user, fileId, res){
                if(user != testUser || fileId != testSlideshowJSON._id) {
                    throw new Error();
                }
                res.end();
            });
            request(url)
                .get('/slideshows/drive/' + testSlideshowJSON._id)
                .end(function(err, res){
                    should.not.exist(err);
                    done();
                });
        });

        it('should call drive client createSlideshow with proper parameters', function(done){
            sinon.stub(driveMock, "createSlideshow", function(user, slideshow, res){
                if(user != testUser || slideshow.document_name != correctSlideshow.document_name) {
                    throw new Error();
                }
                res.end();
            });
            request(url)
                .put('/slideshows/drive')
                .send(correctSlideshow)
                .end(function(err, res){
                    should.not.exist(err);
                    done();
                });
        });

        it('should call drive client deleteSlideshow with proper parameters', function(done){
            sinon.stub(driveMock, "deleteSlideshow", function(user, fileId, res){
                if(user != testUser || fileId != testSlideshowJSON._id) {
                    throw new Error();
                }
                res.end();
            });
            request(url)
                .delete('/slideshows/drive/' + testSlideshowJSON._id)
                .send(correctSlideshow)
                .end(function(err, res){
                    should.not.exist(err);
                    done();
                })
        })

        it('should call drive client updateSlideshow with proper parameters', function(done){
            sinon.stub(driveMock, "updateSlideshow", function(user, slideshow, res){
                if(user != testUser || slideshow.document_name != correctSlideshow.document_name) {
                    throw new Error();
                }
                res.end();
            });
            request(url)
                .post('/slideshows/drive')
                .send(correctSlideshow)
                .end(function(err, res){
                    should.not.exist(err);
                    done();
                });
        });

    });
});