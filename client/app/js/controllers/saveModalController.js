var app = angular.module('slideshows');

app.controller('saveModalController', ['$scope', '$modalInstance', 'savingConfig', 'dataSource', function ($scope, $modalInstance, savingConfig, dataSource) {

    $scope.dataSource = dataSource;
    $scope.savingConfig = savingConfig;

    $scope.newSavingConfig = angular.copy($scope.savingConfig);

    $scope.ok = function () {
        $modalInstance.close($scope.newSavingConfig);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.showOverwriteOption = false;

    $scope.$watch('newSavingConfig.source', function(){
        onDataSourceChange();
    });

    function onDataSourceChange(){
        if($scope.savingConfig.source === $scope.newSavingConfig.source && $scope.savingConfig.id && $scope.savingConfig.id.length != 0) {
            $scope.showOverwriteOption = true;
            $scope.newSavingConfig.overwrite = true;
        } else {
            $scope.showOverwriteOption = false;
            $scope.newSavingConfig.overwrite = false;
        }
    }

    onDataSourceChange();

}]);