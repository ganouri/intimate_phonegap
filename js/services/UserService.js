(function(angular) {
    'use strict';

    angular.module('App')
        .service("UserService", function (DataService, CacheService, StorageService, $window) {
            console.log('UserService');

            var _user = _init();

            function _init(){
                //console.log('_init');
                return {
                    name : null,
                    email : angular.fromJson($window.localStorage.getItem('user.logged')) || null,
                    authenticated : false,
                    contacts : {}/*[
                        {name:{givenName:'Alex',familyName:'Girard'}, email: 'alex@g.com'},
                        {name:{givenName:'Sophie',familyName:'Lacourt'}, email: 'sophie@g.com'}
                    ]*/,
                    rooms : [],
                    token : undefined
                };
            };

            function _set(attr, value){
                //CacheService.setUser(attr, value);
                _user[attr] = value;
            };

            function _hashPassword(email, password, pwdHashed){
                var pwd = pwdHashed ? password : md5(password);
                return md5(':' + email + ':' + pwd +':')
            };

            var _login = function(params, success, error){

                if(    angular.isUndefined(params) 
                    || angular.isUndefined(params.email) 
                    || angular.isUndefined(params.password) 
                  ){error('Missing email or password'); return;};

                DataService.login({
                        user: params.email,
                        authHash: _hashPassword(params.email, params.password, false)
                    }, function(data){

                        var user = {
                            email: params.email,
                            token: data.payload
                        };

                        _set('email', user.email);
                        _set('logged', true);
                        _set('authenticated', true);
                        _set('token', user.token);

                        StorageService.put('user.logged', user.email);

                        _getDetails({
                            token: _user.token
                        }, function(data){

                            DataService.userRooms({
                                    token: _user.token
                                }, function(data){
                                    //console.log('userRooms');
                                    //console.log(data)

                                    _set('rooms', data.payload);

                                    DataService.userContacts({
                                            token: _user.token
                                        }, function(data){
                                            //console.log('userContacts');
                                            //console.log(data)

                                            _set('contacts', data.payload);

                                            success();
                                            
                                        }, error
                                    );
                                }, error
                            );

                            /*var roomsIdList = Object.keys(data.payload.rooms);
                            if(roomsIdList.length > 0){

                                //todo: loop over each one or build a _getRoomsDetails taking a array of IDs
                                _getRoomDetails({
                                    token: _user.token,
                                    roomId: roomsIdList[0]
                                }, function(data){
                                    console.log(data);
                                    //bubble
                                    success(data);
                                }, error);
                            }else{
                                //bubble
                                success(data);
                            }*/
                            
                        }, error);

                        
                    }, error
                );
            };

            var _logout = function(params, success, error){
                StorageService.clear();
                _init();
                success();
            };

            var _getDetails = function(params, success, error){

                if(    angular.isUndefined(params) 
                  ){error('Missing user info'); return;};

                DataService.userDetails({
                        token: _user.token
                    }, function(data){
                        success(data);
                    }, error
                );
            };

            var _getRoomDetails = function(params, success, error){

                if(    angular.isUndefined(params) 
                    || angular.isUndefined(params.roomId) 
                ){error('Missing room details'); return;};

                DataService.roomDetails({
                        token: _user.token,
                        room: params.roomId
                    }, function(data){
                        var coorList = Object.keys(data.payload.corr);
                        //console.log(coorList);
                        //.get(AppConfig.CFG.URI + '/secure/'+params.token+'/room/'+params.room+"/resource/"+params.rescId+"/media/"+params.mediaId)

                        //blob
                        success(data);
                    }, error
                );
            };

            function _getRoom(params, success, error){
                if(    angular.isUndefined(params) 
                    || angular.isUndefined(params.email)
                  ){error('Missing contact email'); return;};

                //todo: LOOK for room with user before consuming service
                DataService.getRoom({
                        token: _user.token,
                        room: _user.email+":"+params.email
                    }, function(data){
                        /*
                        var roomId = data.payload;
                        _user.room[roomId] = 
                        */
                        success(data)
                    }, error
                );
            };

            function _userContact(params, success, error){
                DataService.userContacts({
                    token: _user.token
                }, function(data){
                    _set('contacts', data.payload);
                    success(data);
                }, error);
            }

            return {
                signup: function (params, success, error) {

                    if(    angular.isUndefined(params) 
                        || angular.isUndefined(params.email) 
                        || angular.isUndefined(params.password) 
                      ){error('Missing email or password'); return;};

                    DataService.signup({
                            nickname: params.email.indexOf('@') > -1 ? params.email.substr(0, params.email.indexOf('@')) : params.email,
                            email: params.email,
                            password: params.password
                        }, function(data){

                            _login({
                                email: params.email,
                                password: params.password
                            }, success, error);

                        }, error
                    );

                },
                login: _login,
                logout: _logout,
                getDetails: _getDetails,
                getUser: function(){
                    return {
                        authenticated: _user.authenticated,
                        rooms: _user.rooms,
                        contacts: _user.contacts,
                        email: _user.email
                    };
                },
                createResc: function(params, success, error){
                    /*
                    1/ Upload ressource
                    2/ Create ressource
                    3/ get room id
                    4/ link room to ressource
                    */
                    if(    angular.isUndefined(params) 
                        || angular.isUndefined(params.email)
                        || angular.isUndefined(params.rescStorageId)
                        || angular.isUndefined(params.filename)
                      ){error('Missing details'); return;};

                    var email = params.email;

                    //console.log(document.getElementById(params.rsrcId));
                    //console.log(_getBase64Image(document.getElement));

                    //todo: CALLBACK HELL evolve Dataservice methods to fit promises
                    DataService.uploadResc({
                        token: _user.token,
                        resc: StorageService.get(params.rescStorageId),
                        filename: params.filename
                    }, function(data){

                        var mediaId = data.payload;

                        //todo: create ressource
                        DataService.createRsrc({
                            token: _user.token,
                            type: 'image',
                            mediaId: mediaId
                        }, function(data){

                            var rescId = data.payload._id;
                            
                            //todo: getRoom first from cache
                            DataService.getRoom({
                                token: _user.token,
                                type: 'email',
                                room: _user.email+':'+email
                            }, function(data){

                               var roomId = data.payload;

                                //todo: link ressource to room
                                DataService.ascResc({
                                    token: _user.token,
                                    roomId: roomId,
                                    rescId: rescId
                                }, function(data){
                                    //todo: create ressource
                                    //console.log(data);
                                    success({payload: data.payload, roomId: roomId, rescId: rescId})
                                }, error); //ascResc
                            }, error); //getRoom
                        }, error); //createRsrc
                    }, error); //uploadResc

                },
                getRoomDetails: _getRoomDetails,
                addContact: function(params, success, error){
                    //console.log(params);

                    var contact = {
                        type: 'email',
                        email: params.email
                    };

                    if(    angular.isUndefined(params) 
                        || angular.isUndefined(params.email)
                      ){error('Missing contact email'); return;};

                    DataService.addContact({
                        token: _user.token,
                        type: 'email',
                        value: params.email
                    }, function(data){
                        //todo: update server API to give back user data (unless we need target user approval) to avoid a request
                        DataService.userContacts({
                                token: _user.token
                            }, function(data){
                                _set('contacts', data.payload);
                                success(data);
                            }, error
                        );
                    }, error);
                },
                inviteContact: function(params, success, error){
                    DataService.inviteContact({
                        token: _user.token,
                        type: params.type,
                        contact: params[params.type]
                    }, function(data){
                        //todo: update server API to give back user data (unless we need target user approval) to avoid a request
                        _userContact(params, success, error);
                    }, error);
                }
            };
        });

})(this.angular);