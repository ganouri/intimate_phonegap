(function(angular) {
    'use strict';

    angular.module('App')
        .service("ContactService", function ($rootScope, $q) {


            return {
                create: function () {
                    return navigator.contacts.create()
                },
                find: function (filter) {
                    var deferred = $q.defer();

                    var options = new ContactFindOptions();
                    options.filter = filter;
                    options.multiple = true;
                    var fields = ["displayName", "name", "addresses", "emails"];
                    navigator.contacts.find(fields, function (contacts) {
                        $rootScope.$apply(function () {
                            deferred.resolve(contacts);
                        });

                    }, function (error) {
                        $rootScope.$apply(function () {
                            deferred.reject(error);
                        });
                    });

                    return deferred.promise;
                }
            };
        });

})(this.angular);