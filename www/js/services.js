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

                return deferred;
            }
        };
    })

.factory('Clients', function() {
        var clients = [
            {
                id: 0,
                name: 'Mr Thomson',
                address: ['23 Castlemains Crescent', 'Uddingston', 'Glasgow'],
                postcode: 'G71 7ND',
                phone: '07764491827',
                email: 'thomsoar@me.com',
                commercial: false
            }
        ];

        return {
            all: function () {
                return clients;
            },
            remove: function (client) {
                clients.splice(clients.indexOf(client), 1);
            },
            get: function (clientId) {
                for (var i = 0; i < clients.length; i++) {
                    if (clients[i].id === parseInt(clientId)) {
                        return clients[i];
                    }
                }

                return null;
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
