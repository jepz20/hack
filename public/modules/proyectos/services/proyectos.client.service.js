'use strict';

//Proyectos service used to communicate Proyectos REST endpoints
angular.module('proyectos').factory('Proyectos', ['$resource',
	function($resource) {
		return $resource('proyectos/:proyectoId', { proyectoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.service('CargarArchivo', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
    this.uploadFileToUrl = function(files, uploadUrl){

        var deferred = $q.defer();
        var fd = new FormData();
        var tipo;
        if (files.length > 0) {
            for (var i = files.length - 1; i >= 0; i--) {
                tipo = files[i].type.substring(0,files[i].type.indexOf('/'));
                fd.append(tipo, files[i]);
            }
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(err){
                deferred.reject(err);
            });
        } else {
            deferred.resolve('');
        }
        return deferred.promise;
    };
}]);