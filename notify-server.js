(function() {

  var app = angular.module('dashboardApp');
  app.controller('NotifyServerController', ['$scope', '$http', function($scope, $http){
    var self = this;
    self.domain = {};

    self.offset = 0;
    self.limit = 5;
    self.notifications = {};

    self.authentication = {
      username: "admin",
      password: "North2South!",
      signedIn: false
    };


    self.signOut = function() {
      self.authentication.signedIn = false;
    };


    self.signIn = function() {
      $http.defaults.headers.common.Authorization = "Basic " + encode(self.authentication.username+":"+self.authentication.password);
      var url = "https://prod.stcg.net/notify-server/api/v1/client/sign-in";
      $http.get(url).then(self.signInSuccess, self.errorHandler);
    };
    self.signInSuccess = function(response) {
      self.authentication.signedIn = true;
      self.domain = response.data;
      self.loadNotifications();
    };


    self.next = function() {
      self.offset += self.notifications.size;
      self.loadNotifications();
    };
    self.previous = function() {
      self.offset -= self.notifications.size;
      self.loadNotifications();
    };

    self.loadNotifications = function() {
      var url = "https://prod.stcg.net/notify-server/api/v1/client/notifications?offset="+self.offset+"&limit="+self.limit;
      $http.get(url).then(self.loadNotificationsSuccess, self.errorHandler);
    };
    self.loadNotificationsSuccess = function(response) {
      self.notifications = response.data;

      for (var i = 0; i < self.notifications.results.length; i++) {
        var result = self.notifications.results[i];
        result.traits = [];

        angular.forEach(result.traitMap, function(value, key){
          var object = {
            key: key,
            value: value
          };
          result.traits.push(object);
        });
      }
      console.log(self.notifications);
    };


    self.errorHandler = function(response) {
      console.log("Failure");
      console.log(response);
    };


  }]);

})();


