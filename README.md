## People Search Client

This client was made using AngularJS and Bootstrap. You can search people and add new ones. We also added the ability to export the users. This project should demonstrate the ability to load from an API and have it simulate slow speeds.

## Code Example

```javascript
// This controller is in charge of the data and the search.
var DashboardController = function ($scope, $http) {
    var availableTags = new Array(); // This is for the autocomplete list data source.
    var server = "http://localhost:5001/api/people";

    // Declare our loading screen ui element.
    var $loading = $('#loadingDivOverlay');

    // This will load data in the table and the auto complete.
    $scope.loadData = function () {
        $loading.show();

        // When the search bar is empty it returned undefined so we will need to set it to an empty string.
        if ($scope.searchValue == null){
            $scope.searchValue = "";
        }

        // Get the data and add the search value and teh desired speed you wish to return the data.
        $http.get(server + "?name=" + searchValue + "&speed=" + $scope.speed)
            .then(onSuccess, onError);
    };

    // This will be called when the server returns are response.
    var onSuccess = function(response) {
        // Set the people in the scope for the table.
        $scope.people = response.data;

        // Set the auto complete data. We do this every time in case a user was added by another application.
        addAutocompleteOptions(response.data);
        $loading.hide();
    };

    // This is will be used for then the http web request fails.
    var onError = function(reason) {
        // Set the error and show an error on the view using ng-show="httpError"
        $scope.httpError = reason;
        $loading.hide();
    };

    // This will add the autocomplete data to the view and it will initialize it.
    var addAutocompleteOptions = function(people){
        // Go trough all people and add the first and last name to the list.
        $.each(people, function(key,value) {
            // Check fo duplicates.
            if(availableTags.indexOf(value.FirstName) < 0) {
                availableTags.push(value.FirstName);
            }

            // Check for duplicates.
            if(availableTags.indexOf(value.LastName) < 0) {
                availableTags.push(value.LastName);
            }
        });

        // Add the data source and initialize the autocomplete.
        $(".autocomplete").autocomplete({
            source: availableTags
        }).focus();
    }

    // Go load the data now on initial startup.
    $scope.loadData();

    // We saved the date of birth so we want to show the age and we calculate that here.
    // @params birthday This is the date you want to return as age from today.
    $scope.calculateAge = function calculateAge(birthday) {
        var ageDifMs = Date.now() - new Date(birthday).getTime();
        var ageDate = new Date(ageDifMs);

        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
};
```

## Motivation

I wanted to display how you could use bootstrap and AngularJS to create a web application.

## Installation

Place the files on your webserver and adjust the API addresses so it can reach your API server address.

Look in the following files:

1. js/Controllers/AddPersonController.js
2. js/Controllers/DashboardController.js

You will see this line in both controller and need to be adjusted to the adress of the API server.

```js
var server = "http://localhost:5001/api/people";
```

When you are all done you should be able to see the login screen of the people search application.

## Reference

The web application is made using AngularJS and Bootstrap for the UI. I have used Jquery UI for the autocomplete and datepicker components. There are 2 pages and they are the login page and the dashboard. The login screen does not have a controller as it does not do anything at the moement. The dashboard has 2 controllers one for adding users and one for the loading, searching and displaying of people. 

## Contributors

Pieter de Vries

## License

GNU GENERAL PUBLIC LICENSE
Version 2, June 1991

Copyright (C) 1989, 1991 Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.