var availableTags = new Array();

var app = angular.module('searchPeopleApp', []);

var dashboardController = app.controller('dashboardController', function($scope, $http) {
    $scope.loadData = function() {
        var searchValue = document.getElementById("search").value;

        $http.get("http://localhost:5001/api/people?name=" + searchValue)
            .then(function (response) {
                if(response == null)
                {
                    $('.no-people').show();
                }
                else
                {
                    $('.no-people').hide();
                }

                $scope.People = response.data;
            });
    }

    $scope.loadData();

    $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - new Date(birthday).getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
});

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

function getSuggestionData(){
    $.ajax({
        url: "http://localhost:5001/api/people/",
        data: {
            name: $( "#search" ).val(),
            offset: 0,
            limit: 10
        },
        success: function( result ) {
            var obj = JSON.parse(result);

            $.each(obj, function(key,value) {
                var searchValue = $( "#search" ).val();
                if (value.FirstName.toString().toLocaleLowerCase().indexOf(searchValue.toLowerCase()) >= 0)
                {
                    // Prevent duplicates
                    if (availableTags.includes(value.FirstName) == false) {
                        availableTags.push(value.FirstName);
                    }
                }
                else
                {
                    // Prevent duplicates
                    if (availableTags.includes(value.LastName) == false) {
                        availableTags.push(value.LastName);
                    }
                }
            });
        }
    });
}

$(document).ready(function() {
    feather.replace();

    $('.datepicker').datepicker({
        weekStart: 1,
        autoclose: true,
        todayHighlight: true,
    });
    $('.datepicker').datepicker("setDate", new Date());

    $("#search").on('keydown past', function(event) {
        availableTags = new Array();
        getSuggestionData();

        $(".autocomplete").autocomplete({
            source: availableTags
        });
    });

    $(".export").on('click', function(event) {
        // CSV

        var args = [$('#table-container>table'), 'export.csv'];

        exportTableToCSV.apply(this, args);
    });
});

