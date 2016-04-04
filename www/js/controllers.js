angular.module('cdl.controllers', [])

.controller('LoginCtrl', function ($scope, $state, $stateParams, UserService) {

    // TODO: Remove this hack 
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

.controller('ClientsCtrl', function ($scope, $ionicModal, $timeout, Clients, uuid, clients) {

    $scope.clients = clients;

    $scope.doRefresh = function () {
        Clients.all()
            .then(function(refreshedClients) {
                $scope.clients = refreshedClients;
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.remove = function(clientId) {
        Clients.remove(clientId);
    };

    $ionicModal.fromTemplateUrl('./templates/client-add.html', {
            scope: $scope,
            animation: 'slide-in-up'
        })
        .then(function(modal) {
            $scope.modal = modal;
        });

    $scope.openModal = function() {
        // Reset client obj
        $scope.client = {};
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.saveAndCloseModal = function () {
        Clients.add($scope.client);
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });

})

.controller('ClientDetailCtrl', function($scope, $stateParams, client) {
    $scope.client = client;
});
