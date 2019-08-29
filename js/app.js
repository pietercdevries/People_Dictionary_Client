(function() {
    var app = angular.module('searchPeopleApp', []);

    app.controller('DashboardController', ['$scope', '$http', DashboardController]);
    app.controller('AddPersonController', ['$scope', '$http', '$timeout', AddPersonController]);
}());