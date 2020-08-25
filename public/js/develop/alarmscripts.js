    var updatePeriod = 60;

    $(document).ready(function(){
        almTableShow();
    });

// *******************
// **** functions ****
// *******************

function almTableShow() {

    var oTable = $('#data-table').DataTable({
        processing: false, // true for on-line
        serverSide: false, // true for on-line
        ajax: '../app/core/AuxData.php/?alarms',
        columns: [
            { data: 'id', name: 'id' },                             // - 0
            { data: 'trigtime',
                name: 'trigtime',
                "render": function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }
            },                                                      // - 1
            { data: 'linename', name: 'linename' },                 // - 2
            { data: 'equipname', name: 'equipname' },                 // - 2  
            { data: 'sensorname', name: 'sensorname' },                 // - 2           
            { data: 'comment', name: 'comment' },                       // - 3
            { data: 'category', name: 'category' },                   // - 4            
            { data: 'category_id', name: 'category_id' }                        // - 4
        ],
        aoColumnDefs:[
            {
                "searchable": false,
                "aTargets": [0,6]
            },
            {
                "visible": false,
                "aTargets": [0,7]
            },
            {
                targets: [6],
                className: 'dt-body-center'
            },
            {
                targets: [1],
                className: 'pl-4 ml-4'
            }
        ],
        language: {
            search: "Поиск в описании : ",
            processing:     "Загружаю данные...",
            lengthMenu:     "<b class='text-danger mx-3'>АКТИВНЫЕ АВАРИИ. </b>Отображать _MENU_ записей",
            info:           "Отображается от _START_ до _END_ из _TOTAL_ записей",
            infoEmpty:      "Найдено от 0 до 0 из 0 записей",
            infoFiltered:   "(фильтр из _MAX_ записей всего)",
            infoPostFix:    "",
            loadingRecords: "Ожидаю загрузки...",
            zeroRecords:    "Не найдено записей",
            emptyTable:     "Отсутствуют данные для таблицы",
            paginate: {
                first:      "Начало",
                previous:   "Пред",
                next:       "След",
                last:       "Конец"
            },
        },
        "lengthMenu": [ 20, 50, 100, 200 ],
        "createdRow": function ( row, data, index ) {
            var obj = data;
            if ( obj.category_id == 1) { // Alarm
                for(var i = 0; i < 7; i++){
                    $('td', row).eq(i).addClass('text-danger font-weight-bold');                    
                }
            } else if ( obj.category_id == 2) { // Warning
                for(var i = 0; i < 7; i++){
                    $('td', row).eq(i).addClass('text-warning font-weight-bold');                    
                }
            }
        },
        "order": [ 0, 'desc' ],
    });

    setInterval( function () {
        oTable.ajax.reload( null, false );
    }, updatePeriod*1000 );

}