(function()
{
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
}());

