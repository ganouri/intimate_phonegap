(function(angular) {
    'use strict';

    angular.module('App')
        .service("CacheService", function ($angularCacheFactory){
            console.log('CacheService');


            var cache = $angularCacheFactory('cache');

            var keyMap = {
                user : 'email'
            };

            /* 
             *keyBuilder()
             * assumption: type is in array [user, room...]
            */
            function keyBuilder(type, params){
                return type + '.' + params[keyMap[type]];
            }

            return {
                getUser: function(user){
                    console.log('CacheService.getUser');
                    console.log(user);
                    return cache.get(keyBuilder('user', user)) || undefined;
                },
                setUser: function(user){
                    console.log('CacheService.setUser');
                    console.log(user);
                    cache.put(keyBuilder('user', user), user);
                }
            };
        });

})(this.angular);