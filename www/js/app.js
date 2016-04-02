// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('cdl', ['ionic', 'cdl.controllers', 'cdl.services', 'kinvey', 'angular-uuid'])
    .config(function($kinveyProvider) {
        $kinveyProvider.init({
            appKey: "", // MUST SET THIS
            appSecret: "" // MUST SET THIS
        });
    })
    .run(function ($ionicPlatform, $rootScope, $state, $kinvey, Clients) {

        $kinvey.ping()
            .then(function(response) {
                console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
            }, function(error) {
                console.log('Kinvey Ping Failed. Response: ' + error.description);
            });

        Clients.init(5 * 60 * 1000); // 5 minutes

        $rootScope.$on('$stateChangeError',
            function(event, toState, toParams, fromState, fromParams, error) {

                console.log('$stateChangeError ' + error && (error.debug || error.message || error));

                // if the error is "noUser" the go to login state
                if (error && error.error === "noUser") {
                    event.preventDefault();
                    $state.go('login', {});
                }
            });

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
                StatusBar.overlaysWebView(true);
            }
        });
    })
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.views.transition('ios');
        $ionicConfigProvider.tabs.style('standard').position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center').positionPrimaryButtons('left');

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                resolve: {
                    user: function(UserService) {
                        return UserService.getActiveUser();
                    }
                }
            })

            // Each tab has its own nav history stack:
            .state('tab.jobs', {
                url: '/jobs',
                views: {
                    'tab-jobs': {
                        templateUrl: 'templates/tab-jobs.html',
                        controller: 'JobsCtrl'
                    }
                }
            })
            .state('tab.clients', {
                url: '/clients',
                views: {
                    'tab-clients': {
                        templateUrl: 'templates/tab-clients.html',
                        controller: 'ClientsCtrl'
                    }
                },
                resolve: {
                    clients: function ($stateParams, Clients) {
                        return Clients.all();
                    }
                }
            })
            .state('tab.client-detail', {
                url: '/clients/:clientId',
                views: {
                    'tab-clients': {
                        templateUrl: 'templates/client-detail.html',
                        controller: 'ClientDetailCtrl'
                    }
                },
                resolve: {
                    client: function ($stateParams, Clients) {
                        return Clients.get($stateParams.clientId);
                    }
                }
            })
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl',
                resolve: {
                    autoLogin: function ($state, UserService) {
                        // Check to see if we have an active user. 
                        // If so then boot straight into app.
                        return UserService.getActiveUser()
                            .then(function(res) {
                                if (!res.error) {
                                    $state.go('tab.jobs');
                                }
                            });
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });
