(function(angular) {
    'use strict';

    angular.module('App')
        .service("DataService", function (AppConfig, CacheService, StorageService, $http, $rootScope){
            console.log('DataService');

            // uploadResc:file:///mnt/sdcard/Android/data/com.intimate_app.hybrid/cache/1377324147284.jpg
            function _uploadPhoto(imageURI, uri, success, error) {
                var options = new FileUploadOptions();
                
                options.fileKey  = "file";
                options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
                options.mimeType = "image/jpeg";

                var params = {};
                params.client = "phonegap";

                options.params = params;

                var ft = new FileTransfer();

                //if( window.navigator.platform != 'Win32' ){
                
                ft.upload(imageURI, encodeURI(uri), success, function(e){
                    //service error
                    error(e);
                }, options); 
                
                /*}else{
                    //ripple environment
                    success({"payload":"8a3f7c20-0320-11e3-bd7e-a16eaf015447"});
                }*/
                
            };

            function _downloadPhoto(imageURI, uri, success, error) {
                var options = new FileUploadOptions();
                
                /*options.fileKey  = "file";
                options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
                options.mimeType = "image/jpeg";

                var params = {};
                params.client = "phonegap";

                options.params = params;*/

                var ft = new FileTransfer();

                //if( window.navigator.platform != 'Win32' ){
                
                ft.download(encodeURI(uri), imageURI, success, function(e){
                    //service error
                    error(e);
                }, options); 
                
                /*}else{
                    //ripple environment
                    success({"payload":"8a3f7c20-0320-11e3-bd7e-a16eaf015447"});
                }*/
                
            };

            return {
                signup: function(params, success, error){
                    $http
                    .post(AppConfig.CFG.URI + '/signup', params)
                    .success(function(data, status, header, config) {

                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error('Failed to signup'); return;};
                        //data.errors[Object.keys(data.errors)[0]]

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                },
                login: function(params, success, error){

                    $http
                    .post(AppConfig.CFG.URI + '/login', params)
                    .success(function(data, status, header, config) {

                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error('Wrong email or password'); return;};

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                    
                },
                userDetails: function(params, success, error){
                     $http
                    .get(AppConfig.CFG.URI + '/secure/'+params.token)
                    .success(function(data, status, header, config) {
                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error('Error getting user details'); return;};

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                },
                getRoom: function(params, success, error){
                    console.log('getRoom');console.log(params);
                    $http
                    .get(AppConfig.CFG.URI + '/secure/'+params.token+'/roomid/'+params.room)
                    .success(function(data, status, header, config) {
                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error('Error getting the room'); return;};

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                },
                userContacts: function(params, success, error){
                    $http
                    .post(AppConfig.CFG.URI + '/secure/'+params.token+'/contacts')
                    .success(function(data, status, header, config) {
                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error('Error getting user contacts'); return;};

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                },
                userRooms: function(params, success, error){
                    $http
                    .post(AppConfig.CFG.URI + '/secure/'+params.token+'/rooms/', {})
                    .success(function(data, status, header, config) {
                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error('Error getting user rooms'); return;};

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                },
                roomDetails: function(params, success, error){
                    $http
                    .get(AppConfig.CFG.URI + '/secure/'+params.token+'/room/'+params.room)
                    .success(function(data, status, header, config) {
                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error('Error getting the room details'); return;};

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                },
                getMedia: function(params, success, error){
                    console.log('getMedia');

                    var uri = AppConfig.CFG.URI + '/secure/'+params.token+'/room/'+params.room+"/resource/"+params.rescId+"/media/"+params.mediaId;

                    // uploadResc:file:///mnt/sdcard/Android/data/com.intimate_app.hybrid/cache/1377324147284.jpg

                    var imageURI = 'file:///mnt/sdcard/Android/data/com.intimate_app.hybrid/cache/'+params.mediaId+'.jpg';
                    _downloadPhoto(imageURI, uri, function(r){
                        console.log('success:'+imageURI);
                        success({
                            'mediaId': params.mediaId,
                            'mediaType': params.mediaType,
                            'rescId': params.rescId,
                            'filePath': imageURI
                        });
                    }, error);
                    
                    
                    /*
                    fileTransfer.download(
                        uri,
                        'test.jpg',
                        function(entry) {
                            console.log("download complete: " + entry.fullPath);
                        },
                        function(error) {
                            console.log("download error source " + error.source);
                            console.log("download error target " + error.target);
                            console.log("upload error code" + error.code);
                        },
                        false,
                        {}
                    );*/

                    /*
                    $http
                    .get(AppConfig.CFG.URI + '/secure/'+params.token+'/room/'+params.room+"/resource/"+params.rescId+"/media/"+params.mediaId)
                    .success(function(data, status, header, config) {
                        console.log(status);

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                    */ 
                },
                uploadResc: function(params, success, error){
                    console.log('uploadResc:'+params.resc);

                    //todo: create a phonegap service
                    _uploadPhoto(params.resc, AppConfig.CFG.URI + '/secure/'+params.token+'/media/', function(r){
                        success(JSON.parse(r.response));
                    }, error);
                },
                createRsrc: function(params, success, error){
                    console.log('createRsrc');

                    var form = {
                        type: "basic",
                        media:{
                            type: params.type,
                            content: params.content
                        }
                    };

                    $http
                    .post(AppConfig.CFG.URI + '/secure/'+params.token+'/resource/', form)
                    .success(function(data, status, header, config) {

                        /*
                        payload: Object
                            _id: "fa353810-0322-11e3-bb0d-d179031edbb0"
                            createdOn: 1376293451280
                            lastUpdated: 1376293451280
                            mediaId: "8a3f7c20-0320-11e3-bd7e-a16eaf015447"
                            type: "image"
                            user: "df349990-0320-11e3-bb0d-d179031edbb0"
                        */
                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error('Wrong parameters'); return;};

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                },
                ascResc: function(params, success, error){
                    console.log('ascResc');console.log(params);
                    $http
                    .get(AppConfig.CFG.URI + '/secure/'+params.token+'/room/'+params.roomId+"/asc/"+params.rescId)
                    .success(function(data, status, header, config) {

                        console.log(data);
                        
                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error('Wrong parameters'); return;};

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                },
                userResc: function(params, success, error){

                    $http
                    .post(AppConfig.CFG.URI + '/secure/'+params.token+'/resources/')
                    .success(function(data, status, header, config) {
                        
                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error('Wrong parameters'); return;};

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                },
                addContact: function(params, success, error){
                    $http
                    .get(AppConfig.CFG.URI + '/secure/'+params.token+'/contact/add/'+params.value)
                    .success(function(data, status, header, config) {

                        console.log(data);

                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error(data.errors[Object.keys(data.errors)[0]], Object.keys(data.errors)[0]); return;};

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                },
                inviteContact: function(params, success, error){
                    $http
                    .get(AppConfig.CFG.URI + '/secure/'+params.token+'/contact/invite/'+params.contact)
                    .success(function(data, status, header, config) {

                        console.log(data);

                        if(    angular.isUndefined(data) 
                            || angular.isUndefined(data.payload) 
                            || angular.isDefined(data.errors) 
                        ){error(data.errors[Object.keys(data.errors)[0]]); return;};

                        //bubble
                        success(data);
                    })
                    .error(function(data, status, headers, config) {
                        error(status);
                    });
                }
            };
        });

})(this.angular);