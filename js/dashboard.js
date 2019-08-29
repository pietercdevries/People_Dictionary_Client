(function()
{
    var app = angular.module('searchPeopleApp', []);
    var availableTags = new Array();
    var server = "http://localhost:5001/api/people";

    var DashboardController = function ($scope, $http) {
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
            addAutocompleteOptions(response.data);
            $scope.people = response.data;
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

    var AddPersonController = function ($scope, $http, $timeout) {

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

    function init(){
        feather.replace();

        $('.datepicker').datepicker({
            weekStart: 1,
            autoclose: true,
            todayHighlight: true,
        });

        $('.datepicker').datepicker("setDate", new Date());

        $(".export").on('click', function(event) {
            var args = [$('#table-container>table'), 'export.csv'];

            exportTableToCSV.apply(this, args);
        });
    }

    init();

    app.controller('DashboardController', ['$scope','$http', DashboardController]);
    app.controller('AddPersonController', ['$scope','$http', '$timeout', AddPersonController]);
}());

function exportTableToCSV($table, filename) {

    var $rows = $table.find('tr:has(td)'),

        // Temporary delimiter characters unlikely to be typed by keyboard
        // This is to avoid accidentally splitting the actual contents
        tmpColDelim = String.fromCharCode(11), // vertical tab character
        tmpRowDelim = String.fromCharCode(0), // null character

        // actual delimiter characters for CSV format
        colDelim = '","',
        rowDelim = '"\r\n"',

        // Grab text from table into CSV formatted string
        csv = '"' + $rows.map(function(i, row) {
            var $row = $(row),
                $cols = $row.find('td');

            return $cols.map(function(j, col) {
                var $col = $(col),
                    text = $col.text();

                return text.replace(/"/g, '""'); // escape double quotes

            }).get().join(tmpColDelim);

        }).get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim) + '"';

    // Deliberate 'false', see comment below
    if (false && window.navigator.msSaveBlob) {

        var blob = new Blob([decodeURIComponent(csv)], {
            type: 'text/csv;charset=utf8'
        });

        // Crashes in IE 10, IE 11 and Microsoft Edge
        // See MS Edge Issue #10396033
        // Hence, the deliberate 'false'
        // This is here just for completeness
        // Remove the 'false' at your own risk
        window.navigator.msSaveBlob(blob, filename);

    } else if (window.Blob && window.URL) {
        // HTML5 Blob
        var blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8'
        });
        var csvUrl = URL.createObjectURL(blob);

        $(this)
            .attr({
                'download': filename,
                'href': csvUrl
            });
    } else {
        // Data URI
        var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        $(this)
            .attr({
                'download': filename,
                'href': csvData,
                'target': '_blank'
            });
    }
}


