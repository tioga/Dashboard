(function() {

  var app = angular.module('dashboardApp', []);

  //app.directive('tsLabel', function() {
  //  return {
  //    restrict: "E"
  //  }
  //});
  //
  //app.directive('tsLabel', function () {
  //  return {
  //    restrict: 'E',
  //    replace: true,
  //    template: '<span>{{value}}</span>',
  //    link: function(scope, elem, attrs) {
  //      console.log("Attributes");
  //      console.log(attrs);
  //    }
  //  }
  //});

  app.directive("tsDate", function() {
    return {
      scope: {
        v: "@"
      },
      restrict: "E",
      replace: true,
      template: "<span>{{date}}</span>",
      link: function (scope, element, attrs) {
        var date = scope.v;
        if (!date) return;

        var year = date.substring(0, 4);
        var month = date.substring(5, 7);
        var day = date.substring(8, 10);
        scope.date = month + "-" + day + "-" + year;
      }
    };
  });

  app.directive("tsTime", function() {
    return {
      scope: {
        v: "@"
      },
      restrict: "E",
      replace: true,
      template: "<span>{{time}}</span>",
      link: function (scope, element, attrs) {
        var time = scope.v;
        if (!time) return;

        var hour = time.substring(11, 13);
        var min = time.substring(14, 16);
        var sec = time.substring(17, 19);
        var part = (hour < 12) ? "am" : "pm";
        if (hour == 0) hour = 12;
        if (hour > 12) hour -= 12;

        scope.time = hour +":"+ min+":"+sec+" "+part;
      }
    };
  });


  app.controller('DashboardController', ['$scope', '$http', function($scope, $http){
    var self = this;

    self.defaults = {
      server: {
        root: "https://prod.stcg.net",
        notifyRoot: "/notify-server/api/v1",
        pushRoot: "/push-server/api/v1",
        jobsRoot: "/jobs-agent/api/v1"
      },
      authentication: {
        username: "admin",
        password: "North2South!"
      }
    };

    var activeRequests = 0;
    angular.element(document.querySelector("#blocking-ui")).css("display", "none");

    $scope.$on("httpRequest", function(event) {
      activeRequests++;
      angular.element(document.querySelector("#please-wait")).css("display", "table");
    });

    $scope.$on("httpResponse", requestCompleted);

    $scope.$on("httpRequestError", function(event, args){
      requestCompleted(event);
      handleHttpError(event, args);
    });

    $scope.$on("httpResponseError", function(event, args){
      requestCompleted(event);
      handleHttpError(event, args);
    });

    function handleHttpError(event, args) {
      var msg = args.status + " " + args.statusText + ": " + args.data;
      if (args.status == 401) msg = "Invalid username or password";

      angular.element(document.querySelector("#error-msg .blocking-content")).html(msg);
      angular.element(document.querySelector("#error-msg")).css("display", "table");
    }

    function requestCompleted (event) {
      activeRequests = Math.max(0, activeRequests-1);
      if (activeRequests == 0) {
        angular.element(document.querySelector("#please-wait")).css("display", "none");
      }
    }

  }]);


  app.directive("appTabs", function() {
    return {
      restrict: "E",
      templateUrl: "apps-tabs.html",
      controller: function() {
        this.tab = 3;

        this.isSet = function(checkTab) {
          return this.tab === checkTab;
        };

        this.setTab = function(activeTab) {
          this.tab = activeTab;
        };
      },
      controllerAs: "appsTab"
    };
  });


  app.config(function ($httpProvider, $provide) {
    $provide.factory('httpInterceptor', function ($q, $rootScope) {
      return {
        'request': function (config) {
          // intercept and change config: e.g. change the URL
          // config.url += '?nocache=' + (new Date()).getTime();
          // broadcasting 'httpRequest' event
          $rootScope.$broadcast('httpRequest', config);
          return config || $q.when(config);
        },
        'response': function (response) {
          // we can intercept and change response here...
          // broadcasting 'httpResponse' event
          $rootScope.$broadcast('httpResponse', response);
          return response || $q.when(response);
        },
        'requestError': function (rejection) {
          // broadcasting 'httpRequestError' event
          $rootScope.$broadcast('httpRequestError', rejection);
          return $q.reject(rejection);
        },
        'responseError': function (rejection) {
          // broadcasting 'httpResponseError' event
          $rootScope.$broadcast('httpResponseError', rejection);
          return $q.reject(rejection);
        }
      };
    });
    $httpProvider.interceptors.push('httpInterceptor');
  });

})();


var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function encode(input) {

  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;

  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output = output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);

  return output;
}