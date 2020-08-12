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
        ajax: '../testjson/gronaactalarms.php',
        columns: [
            { data: 'id', name: 'id' },                             // - 0
            { data: 'appeared',
                name: 'appeared',
                "render": function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }
            },                                                      // - 1
            { data: 'line', name: 'line' },                         // - 2
            { data: 'descr', name: 'descr' },                       // - 3
            { data: 'categ', name: 'categ' }                        // - 4
        ],
        aoColumnDefs:[
            {
                "searchable": false,
                "aTargets": [0]
            },
            {
                "visible": false,
                "aTargets": [0]
            },
            {
                targets: [0,4],
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
            lengthMenu:     "<b class='ml-3'>АВАРИИ. </b>Отображать _MENU_ записей",
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
        "lengthMenu": [ 15, 30, 60, 120 ],
        "createdRow": function ( row, data, index ) {
            var obj = data;
            if ( obj.categ == "Авария") {
                for(var i = 0; i < 5; i++){
                    $('td', row).eq(i).addClass('text-danger font-weight-bold');                    
                }
            } else if ( obj.categ == "Предупреждение") {
                for(var i = 0; i < 5; i++){
                    $('td', row).eq(i).addClass('text-warning font-weight-bold');                    
                }
            }
            if ( obj.acknowledged != null ) {
                for(var i = 0; i < 5; i++){
                    $('td', row).eq(i).removeClass('font-weight-bold');                    
                }
            }
        },
        "order": [ 0, 'desc' ],
    });

    setInterval( function () {
        oTable.ajax.reload( null, false );
    }, updatePeriod*1000 );

}