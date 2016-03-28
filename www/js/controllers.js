angular.module('cdl.controllers', [])

.controller('LoginCtrl', function ($scope, $state, $stateParams, UserService) {

    $scope.creds = {
        username: '',
        password: ''
    };

    $scope.doLogin = function() {
        UserService.login($scope.creds.username, $scope.creds.password)
            .then(function() {
                $state.go('tab.jobs');
            }, function(_error) {
                alert("error logging in " + _error.description);
            });
    };

    $scope.doLogout = function () {
        UserService.logout()
            .then(function() {
                $state.go('login');
            }, function(error) {
                alert("error logging in " + error.debug);
            });
    };
})

.controller('JobsCtrl', function($scope, $timeout, Jobs) {
    $scope.jobs = Jobs.all();

    $scope.doRefresh = function() {

        $timeout( function() {
            //simulate async response
            var newJob = {
                id: $scope.jobs.length + 1,
                clientId: 0,
                scheduledDate: new Date(),
                performedDate: null,
                photos: [],
                comment: ''
            };

            $scope.jobs.push(newJob);

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);

    };

})

.controller('ClientsCtrl', function($scope, Clients) {
    $scope.clients = Clients.all();

    $scope.remove = function(job) {
        Clients.remove(job);
    };
})

.controller('ClientDetailCtrl', function($scope, $stateParams, Clients) {
    $scope.client = Clients.get($stateParams.clientId);
});
