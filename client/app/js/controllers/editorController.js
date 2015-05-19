var app = angular.module('slideshows');

app.controller('editorController', ['$scope', '$stateParams', 'restApiService', 'slideCreator','authService', 'dataSource', '$modal', '$timeout', '$state', function ($scope, $stateParams, restApiService, slideCreator, authService, dataSource, $modal, $timeout, $state) {

	var doc = {slides:[]};
    var source = $stateParams.source;
    var documentId = $stateParams.documentId;
    var savingConfig = {
        name : null,
        source : source,
        id : documentId,
        overwrite : documentId ? true : false
    }

    $scope.activeSlide = null;

    $scope.logout = function(){
        authService.logout();
    };

    $scope.setActiveSlide = function(index){
        $scope.activeSlide = index;
        if(index != null) {
            slideCreator.create("#presentation-window", doc.slides[index]);
        }
    }

	$scope.onSaveAs = function () {
		console.debug("On save as...");

        var saveModalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '/templates/saveModal.html',
            controller: 'saveModalController',
            resolve: {
                savingConfig: function () {
                    return savingConfig;
                }
            }
        });

        saveModalInstance.result.then(function (newSavingConfig) {
            savingConfig = newSavingConfig;
            $scope.onSave();
        }, function () {
            console.debug("Saving canceled");
        });

	};

    $scope.onSave = function() {
        if(savingConfig.name) {
            console.debug("On save...");
            $scope.savingInfo = 'Saving...';

            doc.document_name = savingConfig.name;
            $scope.document_name = doc.document_name;

            if(!savingConfig.overwrite) {
                restApiService.createSlideshow(doc, savingConfig.source).then(function(id){
                    $state.go('app.slideshow', {'documentId': id, 'source': savingConfig.source });
                },
                function(err){
                    $scope.savingInfo = err;
                });
            } else {
                restApiService.updateSlideshow(doc, savingConfig.source).then(function(){
                    $timeout(function(){
                        $scope.savingInfo = 'Last save: ' + (new Date()).toTimeString();
                    }, 3000);
                },
                function(err){
                    $scope.savingInfo = err;
                });

            }
            console.debug("Saving ended");
        } else {
            $scope.onSaveAs();
        }
    };

    $scope.addSlide = function(index){
        doc.slides.splice(index, 0, {});
        setThumbnails(doc.slides);
        $scope.setActiveSlide(index);
    }

    $scope.deleteSlide = function(index){
        doc.slides.splice(index, 1);
        setThumbnails(doc.slides);
        clearPresentationWindow();

        if(doc.slides.length != 0) {
            if(index < doc.slides.length - 1) {
                $scope.setActiveSlide(index);
            } else {
                $scope.setActiveSlide(doc.slides.length - 1);
            }
        }
    }

    function clearPresentationWindow(){
        $scope.activeSlide = null;
        //TODO czyszczenie okna prezentacji
    }

    function setThumbnails(thumbnails) {
        $scope.thumbnails = thumbnails;
        /*
         $scope.thumbnails = [
         {
         title: "jeden"
         },
         {
         title: "dwa"
         },
         {
         title: "trzy"
         }
         ];
         */
    }

    function init() {
        if ($stateParams.documentId) {
            console.debug("Document: " + documentId);

            restApiService.getSlideshow(documentId, source).then(function (response) {
                doc = response;
                $scope.document_name = doc.document_name;
                savingConfig.name = $scope.document_name;
                $scope.setActiveSlide(0);
                setThumbnails(doc.slides);
            });
        } else {
            console.debug("No document parameter - creating new presentation");

            // TODO: creating presentation
            var activeSlide = doc.slides != 0 ? 0 : null;
            $scope.setActiveSlide(activeSlide);
            setThumbnails(doc.slides);
        }
    }

    init();

}]);
