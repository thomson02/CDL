angular.module('cdl.services', [])

.service('UserService', function($q, $kinvey) {
        return {
            login: function(user, password) {
                return new $kinvey.User().login(user, password);  
            },

            logout: function() {
                return $kinvey.User.getActiveUser()
                    .then(function(user) {
                        return user.logout();
                    });     
            },

            getActiveUser: function() {
                var deferred = $q.defer();

                $kinvey.User.getActiveUser()
                    .then(function (user) {
                        return deferred.resolve(user);
                    })
                    .catch(function() {
                        return deferred.reject({ error: 'noUser' });
                    });

                return deferred.promise;
            }
        };
    })

.factory('Clients', function($kinvey) {

        var dataStore = $kinvey.DataStore.getInstance('Clients', $kinvey.DataStoreType.Sync);

        function autoSync(wait) {
            dataStore.sync()
                .then(function(result) {
                    console.log("Clients Sync Complete: " + result);
                })
                .catch(function(err) {
                    console.log("Clients Sync Error: " + err);
                })
                .then(function() {
                    setTimeout(autoSync, wait, wait);
                });
        };

        return {
            init: function(wait) {
                autoSync(wait);
            },
            all: function () {
                return dataStore.find(null, { readPolicy: 3, timeout: 15000 })
                    .then(function(res) {
                        res.sort(function (a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
                        return res;
                    });
            },
            remove: function (clientId) {
                return dataStore.removeById(clientId);
            },
            get: function (clientId) {
                return dataStore.findById(clientId, { readPolicy: 3, timeout: 15000 });
            },
            add: function (client) {
                return dataStore.save(client);
            }
        };
    })

.factory('Jobs', function ($kinvey) {
    var dataStore = $kinvey.DataStore.getInstance('Jobs', $kinvey.DataStoreType.Sync);

    function autoSync(wait) {
        dataStore.sync()
            .then(function (result) {
                console.log("Jobs Sync Complete: " + result);
            })
            .catch(function (err) {
                console.log("Jobs Sync Error: " + err);
            })
            .then(function () {
                setTimeout(autoSync, wait, wait);
            });
    };

    return {
        init: function (wait) {
            autoSync(wait);
        },
        all: function () {
            // TODO: Add an ordering to this collection
            return dataStore.find(null, { readPolicy: 3, timeout: 15000 });
        },
        remove: function(jobId) {
            return dataStore.removeById(jobId);
        },
        get: function(jobId) {
            return dataStore.findById(jobId, { readPolicy: 3, timeout: 15000 });
        },
        add: function (job) {
            return dataStore.save(job);
        }
    };
});
