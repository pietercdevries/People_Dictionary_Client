var DashboardController = function ($scope, $http) {
    var availableTags = new Array();
    var server = "http://localhost:5001/api/people";

    var $loading = $('#loadingDivOverlay');

    $scope.loadData = function () {
        $loading.show();

        var searchValue = "";
        if($scope.searchValue != null ){
            searchValue = $scope.searchValue
        };

        $http.get(server + "?name=" + searchValue + "&speed=" + $scope.speed)
            .then(onSuccess, onError);
    };

    var onSuccess = function(response) {
        $scope.totalPages = Math.ceil(response.headers[0] / 10)
        $scope.people = response.data;
        addAutocompleteOptions(response.data);
        $loading.hide();
    };

    var onError = function(reason) {
        $scope.httpError = reason;
    };

    var addAutocompleteOptions = function(people){
        availableTags = new Array();

        $.each(people, function(key,value) {
            if(availableTags.indexOf(value.FirstName) < 0) {
                availableTags.push(value.FirstName);
            }

            if(availableTags.indexOf(value.LastName) < 0) {
                availableTags.push(value.LastName);
            }
        });

        $(".autocomplete").autocomplete({
            source: availableTags
        }).focus();
    }

    $scope.loadData();

    $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - new Date(birthday).getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
};