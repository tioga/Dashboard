(function() {

  var app = angular.module('dashboardApp');
  app.controller('SettingsController', ['$scope', '$http', function($scope, $http){
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

    $scope.init = function(defaults) {
      self.defaults = defaults;
    };

  }]);

})();


