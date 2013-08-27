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

                            //get rooms
                            DataService.userRooms({
                                    token: _user.token
                                }, function(data){
                                    //console.log('userRooms');
                                    //console.log(data)

                                    var rooms = {};
                                    angular.forEach(data.payload, function(room){
                                        rooms[room._id] = room;
                                    });

                                    _set('rooms', rooms);
                                    //console.log(rooms);
                                    //console.log(_user);
                                    

                                }, error
                            );

                            //get contacts
                            DataService.userContacts({
                                    token: _user.token
                                }, function(data){
                                    //console.log('userContacts');
                                    //console.log(data)

                                    _set('contacts', data.payload);
                                    //console.log(data.payload);
                                    //console.log(_user);

                                }, error
                            );

                            //get resources
                            DataService.userResc({
                                    token: _user.token
                                }, function(data){

                                    var resources = {};
                                    angular.forEach(data.payload, function(resc){
                                        resources[resc._id] = resc;
                                    });

                                    _set('resources', resources);
                                    //console.log(resources);
                                    //console.log(_user);

                                }, error
                            );

                            success(); //call back Controller

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

            var _getRooms = function(params, success, error){

                DataService.userRooms({
                        token: _user.token
                    }, function(data){
                        _set('rooms', data.payload);
                        success(data);
                    }, error
                );
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

            var _getRoomDetails = function(params, success, error, view){
                console.log('_getRoomDetails:'+params.roomId)

                if(    angular.isUndefined(params) 
                    || angular.isUndefined(params.roomId) 
                ){error('Missing room details'); return;};

                var roomId = params.roomId;

                function processRoom(data){
                    //var roomDetailsData = data;
                    var coorList = Object.keys(data.payload.corr);

                    //var rescId = data.payload.corr[coorList[0]].resourceId;

                    angular.forEach(coorList, function(coorId){
                        
                        (function(resc, coorId){

                            //setTimeout(function(){
                                var rescId = resc._id;

                                switch(resc.media.type){
                                    case 'image':
                                        console.log('image, roomId:' +roomId +', rescId:'+rescId);
                                        DataService.getMedia({
                                            token: _user.token,
                                            room: roomId,
                                            rescId: rescId,
                                            mediaId: resc.media.content,
                                            mediaType: resc.media.type
                                        }, function(data){
                                            //StorageService.put('test', data);
                                            //success(roomDetailsData);
                                            view({
                                                'mediaId': data.mediaId, //resc.media.content,
                                                'rescId': data.rescId,
                                                'type': data.mediaType, //resc.media.type,
                                                'filePath': data.filePath //'./img/1b45a010-0c58-11e3-ba4a-cd66d4712bf7.jpg'
                                            });
                                        }, error);

                                    break;
                                    default:
                                        console.log('default');
                                    break;
                                }

                            //}, 2000);
                            
                        })(_user.resources[data.payload.corr[coorId].resourceId], coorId);

                    });

                    console.log('debug');
                    success(data);

                    /*
                    if(coorList[0] && _user.resources[rescId]){

                        var resc = _user.resources[rescId];
                        console.log(resc);

                        switch(resc.media.type){
                            case 'image':
                                console.log('image, roomId:' +roomId +', rescId:'+rescId);
                                DataService.getMedia({
                                    token: _user.token,
                                    room: roomId,
                                    rescId: rescId,
                                    mediaId: resc.media.content
                                }, function(data){
                                    //StorageService.put('test', data);
                                    //success(roomDetailsData);
                                }, error);

                            break;
                            default:
                                console.log('default');
                                success(data);
                            break;
                        }

                    }else{
                        success(data);
                    }
                    */

                    //.get(AppConfig.CFG.URI + '/secure/'+params.token+'/room/'+params.room+"/resource/"+params.rescId+"/media/"+params.mediaId)
                }

                if( angular.isDefined(_user.rooms[roomId]) ){
                    console.log('room read from cache');
                    processRoom({
                        payload: _user.rooms[roomId]
                    });
                }else{
                    DataService.roomDetails({
                            token: _user.token,
                            room: roomId
                        }, processRoom(data), error
                    );
                }
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
            };

            /*function _getResc(params, success, error){

            };

            function _getMedia(params, success, error){
                DataService.media({
                    token: _user.token
                }, function(data){
                    _set('contacts', data.payload);
                    success(data);
                }, error);
            };*/

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
                    /*
                    {
                        authenticated: _user.authenticated,
                        rooms: _user.rooms,
                        contacts: _user.contacts,
                        email: _user.email,
                        resources: _user.resources
                    }
                    */
                    return _user;
                },
                postMessage: function(params, success, error){
                    if(    angular.isUndefined(params) 
                        || angular.isUndefined(params.roomId)
                        || angular.isUndefined(params.content)
                      ){error('Missing details'); return;};

                    DataService.createRsrc({
                        token: _user.token,
                        type: 'text',
                        content: params.content
                    }, function(data){

                        var rescId = data.payload._id;
                        
                        //todo: link ressource to room
                        DataService.ascResc({
                            token: _user.token,
                            roomId: params.roomId,
                            rescId: rescId
                        }, function(data){
                            //todo: create ressource
                            console.log(data);
                            /*var back = {payload: data.payload, roomId: roomId, rescId: rescId};
                            _getRooms({}, function(){
                                success(back);
                            }, error);*/
                            
                        }, error); //ascResc

                    }, error); //createRsrc
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

                        //TODO: add to app-cache to avoid useless download

                        //console.log(data);
                        //var mediaId = '5330dfe0-07d4-11e3-b649-61c8496404cc';
                        var mediaId = data.payload;

                        console.log(mediaId);

                        //create ressource
                        DataService.createRsrc({
                            token: _user.token,
                            type: 'image',
                            content: mediaId
                        }, function(data){

                            var rescId = data.payload._id;
                            
                            //todo: getRoom first from app-cache
                            DataService.getRoom({
                                token: _user.token,
                                type: 'email',
                                room: _user.email+':'+email
                            }, function(data){

                               var roomId = data.payload;

                                //link ressource to room
                                DataService.ascResc({
                                    token: _user.token,
                                    roomId: roomId,
                                    rescId: rescId
                                }, function(data){
                                    //todo: create ressource
                                    //console.log(data);
                                    var back = {payload: data.payload, roomId: roomId, rescId: rescId};
                                    _getRooms({}, function(){
                                        success(back);
                                    }, error);
                                    
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
                },
                getRooms: _getRooms
            };
        });

})(this.angular);