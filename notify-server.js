(function() {

  var app = angular.module('dashboardApp');
  app.controller('NotifyServerController', ['$scope', '$http', function($scope, $http){
    var self = this;

    self.defaults = {
      server: {
        root: "",
        notifyRoot: "",
        pushRoot: "",
        jobsRoot: ""
      },
      authentication: {
        username: "",
        password: ""
      }
    };

    self.authentication = {
      username: "",
      password: "",
      signedIn: false
    };

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

    self.signOut = function() {
      self.authentication.signedIn = false;
    };


    self.signIn = function() {
      console.log(self.authentication);
      $http.defaults.headers.common.Authorization = "Basic " + encode(self.authentication.username+":"+self.authentication.password);
      var url = self.notifyUrl() + "/client/sign-in";
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
      var url = self.notifyUrl() + "/client/summary";
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
      var url = self.notifyUrl() + "/client/notifications";
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
        // console.log(notification);
        // notification.hideTraits = !(self.traitKey && self.traitKey.key);
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

    self.showAttachment = function(notification, attachment) {
      var url = self.notifyUrl() + "/client/notifications/" + notification.notificationId + "/attachments/" + attachment.name;

      if ("image/jpeg" == attachment.contentType) {
        angular.element(document.querySelector("#image-viewer img")).attr("src", url);
        angular.element(document.querySelector("#image-viewer")).css("display", "table");

      } else {
        window.open(url, '_blank');

      }
    };

    self.notifyUrl = function() {
      return self.defaults.server.root + self.defaults.server.notifyRoot;
    };

    $scope.init = function(defaults) {
      self.defaults = defaults;
      self.authentication = defaults.authentication;

      if (self.authentication.username && self.authentication.password) {
        self.signIn(); // If we have credentials, use 'em.
      }
    };

  }]);

})();


