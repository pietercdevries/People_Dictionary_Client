var AddPersonController = function ($scope, $http, $timeout) {

    var server = "http://localhost:5001/api/people";

    $scope.getNewUser = function(){
        // Angular has issue with date picker because it has it's own scope. We need to set the date here.
        $scope.DateOfBirth = $(".datepicker").val();

        var dateParts = $scope.DateOfBirth.split('/');
        var dateOfBirth = new Date(dateParts[2], dateParts[0] -1, dateParts[1]);

        $scope.newPerson = {
            FirstName : $scope.FirstName,
            LastName : $scope.LastName,
            StreetAddress : $scope.StreetAddress,
            StreetAddressAdditional : $scope.StreetAddressAdditional,
            City : $scope.City,
            State : $scope.State,
            ZipCode : $scope.ZipCode,
            DateOfBirth : dateOfBirth,
            Interests : $scope.Interests,
            AvatarUrl : $scope.AvatarUrl,
            Active : true,
        };

        var newPersonJson = angular.toJson($scope.newPerson, false);

        $http.post(server, newPersonJson, {headers: {'Content-Type': 'application/json; charset=utf-8', 'responseType': 'text', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE'}})
            .then(onSuccess, onError);
    }

    var onSuccess = function(response) {
        if (response.data == "success"){
            $scope.newUserAlert = "The new user has been added! Reloading Page...";
            $scope.addingUserAlertClass = "alert-success";

            $timeout(function(){location.reload();}, 3000, false);
        }
        else {
            $scope.newUserAlert = "Error! " + response.data;
            $scope.addingUserAlertClass = "alert-danger";
        }
    };

    var onError = function(reason) {
        $scope.newUserAlert = "Error! Could not contact server.";
        $scope.addingUserAlertClass = "alert-danger";
    };
}
