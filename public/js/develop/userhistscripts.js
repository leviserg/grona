var updatePeriod = 60*60;

$(document).ready(function(){
    userHistTableShow();
});

// *******************
// **** functions ****
// *******************

function userHistTableShow() {
    /*
    $.ajax({
        type:'GET',
        url: '../app/core/UsersHist.php',
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            //showContent('hometable', data);
            console.log(data);
        },
        error: function(err){
            console.log(err);
        }
    });
    */
    var oTable = $('#userhist-table').DataTable(
    {
        processing: false, // true for on-line
        serverSide: false, // true for on-line
        ajax: '../app/core/AuxData.php/?usershist',
        columns: [
            { data: 'id', name: 'id' },                             // - 0
            { data: 'login', name: 'login' },                       // - 1
            { data: 'description', name: 'description' },                       // - 1
            { data: 'loggedin',
                name: 'loggedin',
                "render" : function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }
            }, 
            { data: 'loggedout',
                name: 'loggedout',
                "render" : function ( data, type, full, meta ) {
                    if(data)
                        return moment(data).format('DD.MM.YYYY HH:mm:ss');
                    else
                        return '-';
                }
            },                                                   // - 1
            { data: 'linename',
                name: 'linename',
                "render" : function ( data, type, full, meta ) {
                    if(data)
                        return data;
                    else
                        return '-';
                }
            },                         // - 2
            { data: 'totalstarts', name: 'totalstarts' },                       // - 3
            { data: 'totalalarms', name: 'totalalarms' }                        // - 4
        ],
        aoColumnDefs:[
            {
                "searchable": false,
                "aTargets": [0]
            },
            {
                targets: [0,3,4,5,6,7],
                className: 'dt-body-center'
            },
            {
                targets: [1,2],
                className: 'pl-4'
            }
        ],
        language: {
            search: "Поиск в описании : ",
            processing:     "Загружаю данные...",
            lengthMenu:     "<b class='ml-3'>ИСТОРИЯ ПОЛЬЗОВАТЕЛЕЙ. </b>Отображать _MENU_ записей",
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
        "order": [ 0, 'desc' ],
    }
);
/*
setInterval( function () {
    oTable.ajax.reload( null, false );
}, updatePeriod*1000 );
*/
}