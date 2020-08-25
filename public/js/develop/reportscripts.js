var updatePeriod = 3600;

$(document).ready(function(){

    reportTableShow();

    $("#savereport").bind("click",function(elem){
        SaveReport(parseInt($("#reportid").text()));
    });

    $("#comment").bind("input propertychange",function(){
        if(this.value.length > 50){
            $("#comment").removeClass('bg-warning');
            $("#comment").addClass('bg-danger');
        }
        else if(this.value.length >= 45){
            $("#comment").removeClass('bg-danger');
            $("#comment").addClass('bg-warning');
        }
        else if(this.value.length < 45){
            $("#comment").removeClass('bg-danger');
            $("#comment").removeClass('bg-warning');
        }        
    });

});

// *******************
// **** functions ****
// *******************

function reportTableShow() {
/*
    $.ajax({
        type:'GET',
        url: '../app/core/AuxData.php/?reports',
        //url: '../testjson/gronareports.php',
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            console.log(data);
        },
        error: function(err){
            console.log(err);
        }
    });
*/

    var oTable = $('#data-table').DataTable({
        processing: false, // true for on-line
        serverSide: false, // true for on-line
        ajax: '../app/core/AuxData.php/?reports&userline='+$("#userline").text(),
        columns: [
            { data: 'id', name: 'id' },                                 // - 0
            { data: 'linename', name: 'linename' },                     // - 1
            { data: 'shiftstart',                                      // - 1
                name: 'shiftstart',
                "render": function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }
            },
            { data: 'linestart',                                      // - 1
                name: 'linestart',
                "render": function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }
            },
            { data: 'linestop',                                      // - 1
                name: 'linestop',
                "render": function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }
            },
            { data: 'shiftstop',                                      // - 1
                name: 'shiftstop',
                "render": function ( data, type, full, meta ) {
                    return moment(data).format('DD.MM.YYYY HH:mm:ss');
                }
            },
            { data: 'totaltimediff',                                      // - 1
                name: 'totaltimediff',
                "render": function ( data, type, full, meta ) {
                    return SecToTimeFmt(data);
                }
            },
            { data: 'oee', name : 'oee' },                // - 6           
            { data: 'stoptype', name : 'stoptype' },                // - 6
            { data: 'reason', name: 'reason' },                     // - 7
            { data: 'comment', name: 'comment' },  
            { data: 'login', name: 'login' },
            { data: 'edited',                                      // - 1
                name: 'edited',
                "render": function ( data, type, full, meta ) {
                    if(data)
                        return moment(data).format('DD.MM.YYYY HH:mm:ss');
                    else
                        return '-';
                }
            },
            { 
                data : {
                    'edited':'edited',
                    'id':'id',
                    'line_id':'line_id'
                },
                name : 'id',
                'render': function(data, type, row, meta){
                    if(type === 'display'){
                        if(data.edited == null){
                            data = '<button type="submit" class="btn btn-xs btn-info edit my-0 px-0 py-0" style="width:90%; font-size: 1.0em;" data-id="'+data.line_id+'" id="'+data.id+'">Править</button>';
                        }
                        else{
                            data = '<button class="btn btn-xs btn-secondary disabled my-0 px-0 py-0" style="width:90%; font-size: 0.85em;" disabled>Завершен</button>';
                        }
                    }
                    return data;
                }
            },
        ],
        aoColumnDefs:[
            {
                "searchable": false,
                "aTargets": [0, 2,3,4,5,6,7,12,13]
            },
            {
                //"visible": false,
                //"aTargets": [0]
            },
            {
                targets: [0,2,3,4,5,6,7,11,12],
                className: 'dt-body-center'
            },
            {
                targets: [10],
                className: 'text-truncate'
            },
            {
                targets: [1],
                className: 'pl-4 ml-4'
            }
        ],
        language: {
            search: "Поиск в описании : ",
            processing:     "Загружаю данные...",
            lengthMenu:     "<b class='text-info mx-3'>ОТЧЕТЫ. </b>Отображать _MENU_ записей",
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
            if ( obj.stoptype == "Авария") {
                for(var i = 0; i < 10; i++){
                    $('td', row).eq(i).addClass('text-danger');                    
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
// ************
function editReport(elem){
    $target = $(elem.target);
    var id = parseInt($target.attr('id'));
    var line_id = parseInt($target.attr('data-id'));
    var userline = parseInt($('#userline').text());
    var usereditrep = parseInt($('#usereditrep').text());

    if(id){
        if((userline==0 && usereditrep==0) || (userline!=0 && userline!=line_id))
            swal("Правка", "Ограничение доступа.\nЗаполнение формы отчета id=" + id + " для линии " + line_id + "\nпредоставлено ответственному персоналу.", "warning");
        else{
            showFormReport(id);
        }
    }
    else{
        swal("Не могу открыть форму правки", "Попробуйте еще раз.", "warning");
    }
}
// ************

function showFormReport(recordid){
    $.ajax({
        type:'GET',
        url: '../app/core/AuxData.php/?reportid=' + recordid,
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            RecordStopType = data.data.record[0].stop_id;
            RecordLine = data.data.record[0].linename;
            RecordStopTime = moment(data.data.record[0].shiftstop).format('DD.MM.YYYY HH:mm:ss');
            FaultReasons = data.data.types.faultreasons;
            StopTypes = data.data.types.stoptypes;
            fillReportForm(RecordStopType, StopTypes, FaultReasons);
            $("#reportid").text(recordid);
            $("#linename").text("Линия : " + RecordLine);
            $("#stoptime").text("Время останова : " + RecordStopTime);
            $('#showreportform').modal("show");
        },
        error: function(err){
            console.log(err);
        }
    });
}
// ************
function fillReportForm(recordStopType, StopTypes, FaultReasons){
    $("select[name='reason']").empty();
    $("select[name='stoptype']").empty();
    for(var id in StopTypes){
        var sAppend = "<option value='"+StopTypes[id].id +"'>" + StopTypes[id].name  + "</option>";
        if(StopTypes[id].id == recordStopType)
            sAppend = "<option value='"+StopTypes[id].id +"' selected='selected'>" + StopTypes[id].name  + "</option>";
        $("select[name='stoptype']").append($(sAppend));
    }

    if(recordStopType==1)
        $("select[name='stoptype']").prop('disabled', 'disabled');
    else
        $("select[name='stoptype']").prop('disabled', '');

    for(var id in FaultReasons){
        var sAppend = "<option value='"+FaultReasons[id].id +"'>" + FaultReasons[id].name  + "</option>";
        if(recordStopType==1 && id==1)
            sAppend = "<option value='"+FaultReasons[id].id +"' selected='selected'>" + FaultReasons[id].name  + "</option>";
        $("select[name='reason']").append($(sAppend));
    }
}

function SaveReport(savedreportid){
    if($('textarea#comment').val().length <= 50 && $('textarea#comment').val().length > 5){
        var sMessage = "Тип останова : " + $("select[name='stoptype'] option:selected").text();
        sMessage += "\nПричина останова: " + $("select[name='reason'] option:selected").text();
        sMessage += "\nКомментарий : ";
        sMessage += "\n" + $("#comment").val();
        sMessage += "\nВерно?";
        swal("Проверка данных.", sMessage ,{
            buttons: ["Нет", "Да"],
            icon: "success",
        })
        .then(function(result){
            if (result) {
                $.ajax({
                    type: 'GET',
                    url: '../app/core/AuxData.php',
                    cache: false,
                    data: { 
                        savedreportid : savedreportid,
                        stoptype : $("select[name='stoptype']").val(),
                        faultreason : $("select[name='reason']").val(),
                        comment : $('textarea#comment').val(),
                        userid : $("#userid").text()
                    },
                    crossDomain: true,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(data){
                        swal("Сохранено", "Ваш отчет успешно сохранен", "success").
                        then(function(res){
                            window.location.reload();
                        })
                    },
                    error: function(err){
                        console.log(err);
                        swal("Ошибка", "Не могу сохранить отчет", "error");
                    }
                });
                $('#showreportform').modal("hide");
            }
        });
    }
    else{
        swal('Ошибка', 'Заполните правильно поле "Комментарий"\n(не меньше 5 символов и не больше 50)', 'warning');
    }
}