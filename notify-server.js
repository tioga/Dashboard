(function() {

  var app = angular.module('dashboardApp');
  app.controller('NotifyServerController', ['$scope', '$http', function($scope, $http){
    var self = this;
    self.domain = {};

    //var username = "admin";
    //var password = "North2South!";

    // $http.defaults.headers.common['Authorization'] = "Basic " + authdata;

    //$http({
    //  method: "GET",
    //  url: "https://prod.stcg.net/notify-server/api/v1/client/",
    //  headers: {
    //    'Authorization': authdata
    //  }
    //}).then(function successCallback(response) {
    //  console.log(response);
    //}, function errorCallback(response) {
    //  console.log(response);
    //});

    //$http.get().success(function(data) {
    //  self.domain = data;
    //  console.log(self.domain);
    //});

  }]);

})();


