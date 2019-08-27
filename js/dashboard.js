var availableTags = new Array();

var app = angular.module('searchPeopleApp', []);
app.controller('dashboardController', function($scope, $http) {
    $http.get("https://localhost:5001/api/people/")
        .then(function(response) {
            $scope.People = response.data;
        });
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
        url: "https://localhost:5001/api/people/",
        data: {
            name: $( "#search" ).val(),
            offset: 0,
            limit: 10
        },
        success: function( result ) {
            var obj = JSON.parse(result);

            $.each(obj, function(key,value) {
                availableTags.push(value.FirstName + " " + value.LastName);
            });
        }
    });
}

$(document).ready(function() {
    getSuggestionData();

    $(".autocomplete").autocomplete({
        source: availableTags
    });

    $(".export").on('click', function(event) {
        // CSV

        var args = [$('#table-container>table'), 'export.csv'];

        exportTableToCSV.apply(this, args);
    });
});

