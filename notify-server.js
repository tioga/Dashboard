(function() {

  var app = angular.module('dashboardApp');
  app.controller('NotifyServerController', ['$scope', '$http', function($scope, $http){
    var self = this;
    self.domain = {};

    self.offset = 0;

    self.limit = "10";
    self.limits = ["1","5","10","25","50","100","200","300","400","500"];

    self.pages = [];

    self.topic = {};
    self.traitKey = {};
    self.traitValue = "";
    self.summary = {};

    self.notifications = {
      results: [],
      traitMap: {}
    };

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
      $http.get(url).then(self.signInSuccess);
    };
    self.signInSuccess = function(response) {
      self.authentication.signedIn = true;
      self.domain = response.data;
      self.loadSummary();
      self.loadNotifications();
    };


    self.next = function() {
      self.offset += self.notifications.size;
      self.loadNotifications();
    };
    self.previous = function() {
      if (self.offset == 0) return;
      self.offset = Math.max(0, self.offset-self.notifications.size);
      self.loadNotifications();
    };
    self.toOffset = function(offset) {
      self.offset = offset;
      self.loadNotifications();
    };


    self.loadSummary = function() {
      var url = "https://prod.stcg.net/notify-server/api/v1/client/summary";
      $http.get(url).then(self.loadSummarySuccess);
    };
    self.loadSummarySuccess = function(response) {
      self.summary = response.data;
    };


    self.reloadNotifications = function() {
      self.offset = 0;
      self.loadNotifications();
    };
    self.loadNotifications = function() {
      var config = {
        params: {
          offset: self.offset,
          limit: self.limit,
          topic: (self.topic) ? self.topic.name : "",
          traitKey: (self.traitKey) ? self.traitKey.key : "",
          traitValue: self.traitValue
        }
      };
      var url = "https://prod.stcg.net/notify-server/api/v1/client/notifications";
      $http.get(url, config).then(self.loadNotificationsSuccess);
    };
    self.loadNotificationsSuccess = function(response) {
      self.notifications = response.data;
      rebuildPages();
      updateNotifications();
    };

    function updateNotifications() {
      for (var i = 0; i < self.notifications.results.length; i++) {
        var notification = self.notifications.results[i];
        notification.hideTraits = !(self.traitKey && self.traitKey.key);
        notification.traits = [];

        angular.forEach(notification.traitMap, function(value, key){
          var object = {
            key: key,
            value: value
          };
          notification.traits.push(object);
        });
      }
    }

    function rebuildPages() {
      // rest the pages object
      self.pages = [];

      var limit = parseInt(self.limit);
      for (var i = 0; i <= self.offset; i += limit) {
        self.pages.push({
          offset: i,
          label: (i+limit)/limit
        });
      }

      // If we have more pages than max, then remove 'em
      var removed = false;
      var maxPages = 10;
      while (self.pages.length > maxPages) {
        removed = true;
        self.pages.splice(maxPages/2,1);
      }

      // If we removed something, add gap
      if (removed) {
        self.pages.splice(maxPages/2, 0, {
          offset: -1,
          label: "..."
        });
      }
    }

  }]);

})();


