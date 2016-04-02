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

.factory('Clients', function($q, $kinvey) {

        var dataStore = $kinvey.DataStore.getInstance('Clients', $kinvey.DataStoreType.Sync);

        // Sync every 2 mins (I hope!)
        function autoSync() {
            dataStore.sync()
                .then(function(result) {
                    console.log("Client Sync Complete: " + result);
                })
                .catch(function(err) {
                    console.log("Client Sync Error: " + err);
                })
                .then(function() {
                    console.log("Delay");
                    setTimeout(autoSync, 120000);
                });
        };

        autoSync();

        return {
            all: function () {
                return dataStore.find(null, { readPolicy: 3, timeout: 15000 })
                    .then(function(res) {
                        res.sort(function (a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
                        return res;
                    });
            },
            remove: function (client) {
                clients.splice(clients.indexOf(client), 1);
            },
            get: function (clientId) {
                return dataStore.findById(clientId, { readPolicy: 3, timeout: 15000 });
            },
            add: function (client) {
                // TODO: Add validation
                clients.push(client);
            }
        };
    })

.factory('Jobs', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
    var jobs = [
        {
            id: 0,
            clientId: 0,
            scheduledDate: new Date(),
            performedDate: null,
            photos: [],
            comment: ''
        }
    ];

  return {
    all: function() {
      return jobs;
    },
    remove: function(job) {
      jobs.splice(jobs.indexOf(job), 1);
    },
    get: function(jobId) {
      for (var i = 0; i < jobs.length; i++) {
          if (jobs[i].id === parseInt(jobId)) {
          return jobs[i];
        }
      }
      return null;
    }
  };
});
