var updatePeriod = 3600;

$(document).ready(function(){
    reportTableShow();
});

// *******************
// **** functions ****
// *******************

function reportTableShow() {

    var oTable = $('#data-table').DataTable({
        processing: false, // true for on-line
        serverSide: false, // true for on-line
        ajax: '../testjson/gronareports.php',
        columns: [
            { data: 'id', name: 'id' },                             // - 0
            { data: 'created',                                      // - 1
                name: 'created',
                "render": function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }
            },
            { data: 'line', name : 'line' },                        // - 2
            { data: 'startdate',                                    // - 3
                name: 'startdate',
                "render": function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }
            },
            { data: 'stopdate',                                     // - 4
                name: 'stopdate',
                "render": function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }            
            },
            { data: 'delay',                                        // - 5
                name: 'delay',
                "render": function ( data, type, full, meta ) {
                    //return moment(data).format('DD HH:mm:ss');
                    return SecToTimeFmt(data);
                }
            },
            { data: 'type', name: 'type' },                         // - 6
            { data: 'reason', name: 'reason' },                     // - 7
            { 
                data : {
                    'edited':'edited',
                    'id':'id'
                },
                name : 'id',
                'render': function(data, type, row, meta){
                    if(type === 'display'){
                        if(data.edited == 0){
                            data = '<button type="submit" class="btn btn-xs btn-info edit my-0 pb-1 pt-0" style="width:90%" data-id="'+data.id+'" id="'+data.id+'"><small>Править</small></button>';
                        }
                        else{
                            data = '<button class="btn btn-xs btn-secondary disabled my-0 pb-1 pt-0" style="width:90%" disabled><small>Завершено<small></button>';
                        }
                    }
                    return data;
                }
            },
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
                targets: [0,5,6],
                className: 'dt-body-center'
            },
            {
                targets: [7],
                className: 'small'
            },
            {
                targets: [1],
                className: 'pl-4 ml-4'
            }
        ],
        language: {
            search: "Поиск в описании : ",
            processing:     "Загружаю данные...",
            lengthMenu:     "<b class='ml-3'>ОТЧЕТЫ. </b>Отображать _MENU_ записей",
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
        "lengthMenu": [ 12, 20, 50, 200 ],
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

    $('#data-table tbody').on('click', '.edit', function(elem){
        editReport(elem);
    });

    setInterval( function () {
        oTable.ajax.reload( null, false );
    }, updatePeriod*1000 );

}

function editReport(elem){
    swal("Извините,\nя сейчас в разработке :)", "Здесь будет форма для правки причины останова...", "success");
    $target = $(elem.target);
    const id = $target.attr('data-id');
    if(id){
        swal("Правка", "Извините \n я сейчас в разработке :)\nЗдесь будет форма для правки\nпричины останова по отчету id=" + id, "success");
        /*
        $.ajax({
            type:'POST',
            url:'../avtostella/alarms/ack/' + id + '?_token={{ csrf_token() }}',
            cache: false,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'xml',
            success: function(){
                swal("Квитирование события...", "Нажмите ОК для продолжения", "success")
                .then(function(value){
                    oTable.ajax.reload( null, false );
                    getActUnackCount();
                });
            },
            error: function(err){
                console.log(err);
            }
        });
        */
    }
    else{
        swal("Не могу открыть форму правки", "Попробуйте еще раз.", "warning");
    }
}