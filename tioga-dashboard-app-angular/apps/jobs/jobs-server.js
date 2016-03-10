(function() {

  var app = angular.module('dashboardApp');
  var mod = app.controller('JobsServer', ['$scope', '$http', function($scope, $http) {
    var self = this;

    self.tab = 1;

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

    self.jobs = [];
    self.requests = [];


    self.isTabSet = function(value) {
      return self.tab == value;
    };
    self.setTab = function(value) {
      self.tab = value;
    };


    self.loadRequests = function() {
      var url = self.getJobsUrl() + "/client/requests";
      $http.get(url).then(self.loadRequestsSuccess);
    };
    self.loadRequestsSuccess = function(response) {
      self.requests = response.data;
    };


    self.loadJobs = function() {
      var url = self.getJobsUrl() + "/client/jobs";
      $http.get(url).then(self.loadJobsSuccess);
    };
    self.loadJobsSuccess = function(response) {
      self.jobs = response.data;
    };


    self.signOut = function() {
      self.authentication.signedIn = false;
    };
    self.signIn = function() {
      console.log("Job Server login is disabled")
      //$http.defaults.headers.common.Authorization = "Basic " + encode(self.authentication.username+":"+self.authentication.password);
      //var url = self.getJobsUrl() + "/client/sign-in";
      //$http.get(url).then(self.signInSuccess);
    };
    self.signInSuccess = function(response) {
      self.authentication.signedIn = true;
      self.domain = response.data;
      self.loadJobs();
      self.loadRequests();
    };

    self.getJobsUrl = function() {
      return self.defaults.server.jobsRoot;
    };

    $scope.init = function(defaults) {
      self.defaults = defaults;
      self.authentication.username = defaults.authentication.username;
      self.authentication.password = defaults.authentication.password;

      if (self.authentication.username && self.authentication.password) {
        self.signIn(); // If we have credentials, use 'em.
      }
    };

  }]);

  //mod.directive('myDirective', function () {
  //  return {
  //    restrict: 'E',
  //    replace: true,
  //    templateUrl: 'apps/jobs/jobs-definition.html',
  //    controller: function() {
  //
  //    }
  //  }
  //});

})();


