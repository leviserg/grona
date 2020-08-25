var updatePeriod = 600; // seconds

$(document).ready(function(){
    var curId = $("#lineId").text();
    var dt = setInterval("getCurSensData("+curId+")", updatePeriod*1000);
    localReportTableShow(curId);

    $("#sshprd").bind("click",function(elem){
        $('#showhist').modal("show");
    });

    $("#sshcrd").bind("click",function(elem){
        $('#sshprd').removeClass('btn-info');
        $('#sshprd').addClass('btn-outline-info');
        $('#sshcrd').removeClass('btn-outline-info');
        $('#sshcrd').addClass('btn-info');
        $('#sshprdt').text('Отображать данные');
        getCurSensData(curId);
        dt = setInterval("getCurSensData("+curId+")", updatePeriod*1000);
    });

    $("#goto").bind("click",function(elem){
        clearInterval(dt);
        $('#showhist').modal("hide");
        $('#sshcrd').removeClass('btn-info');
        $('#sshcrd').addClass('btn-outline-info');
        $('#sshprd').removeClass('btn-outline-info');
        $('#sshprd').addClass('btn-info');
        var selTime = $('#tpicker').val();
        if(selTime.length < 5){
            selTime += "00:00:00";
        }
        else if(selTime.length <= 7){
            selTime += ":00";
        }
        var strDate = $('#dpicker').val().toString();
        $('#sshprdt').text('Данные за ' + strDate.slice(-2) + "." + strDate.slice(5, 7) + "." + strDate.substring(0, 4) + " " + selTime);   
        var gotodate = $('#dpicker').val() + " " + selTime;
        getPrevSensData(curId, gotodate);
    });

    $("select[name='rep']").val('0');

    $("select[name='rep']").bind("change",function(){
        getCalcMode(curId, this.value);
    });

    $("#getrep").bind("click",function(elem){
        $('#repdates').modal("hide");
        var selTime = $('#tstpicker').val();
        if(selTime.length < 5){
            selTime += "00:00:00";
        }
        else if(selTime.length <= 7){
            selTime += ":00";
        }
        var startDate = $('#dstpicker').val() + " " + selTime;
        selTime = $('#tfnpicker').val();
        if(selTime.length < 5){
            selTime += "00:00:00";
        }
        else if(selTime.length <= 7){
            selTime += ":00";
        }
        var endDate = $('#dfnpicker').val() + " " + selTime;
        getManualRep(curId, startDate, endDate);
    });

    getCurSensData(curId);
    getAutomRep(curId, 0);
    getTrendData(curId);
});

// *******************
// **** functions ****
// *******************

function getCurSensData(id){
    var lineId = id;
    $.ajax({
        type:'GET',
        url: '../app/core/AuxData.php/',
        cache: false,
        data: {id : lineId},
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            showSensContent('senstable', data);
            //console.log(data);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function getPrevSensData(id, seldate){
    var lineId = id;
    var selectedDate = seldate;
    $.ajax({
        type:'GET',
        url: '../app/core/AuxData.php/',
        data: { id: lineId, seldate : selectedDate },
        //url: '../testjson/gronahomeprev.php?id= + lineId + '&seldate=' + selectedDate, // equal request
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            showSensContent('senstable', data);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function getTrendData(id){
    var lineId = id;
    $.ajax({
        type:'GET',
        //url: '../testjson/gronatrenddata.php',
        //data: { id : lineId },
        url: '../app/core/AuxData.php',
        data: { id : lineId , effline : true},
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            var length = 1;
            var el = document.getElementById('chartdiv');
            //console.log(data.data);
            createStockChart(el, data.data, length, "Эффективность использования оборудования", 1, 1.1, 0);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function showSensContent(elem, data){
    var lineTitle = data.data[0].linename;
    $('#lineName').text(lineTitle);    
    $('#' + elem).empty();
    var sText = "";
    var sensors = data.data[0].sensors;
    for(var k=0; k < sensors.length; k++){
        sText += sensTableRow(sensors[k],15,0); // 10 px img size
    }
    $('#' + elem).append(sText);

}

function localReportTableShow(lineid) {

        var oTable = $('#data-table').DataTable({
            processing: false, // true for on-line
            serverSide: false, // true for on-line
            ajax: '../app/core/AuxData.php/?localreport&line='+lineid,
            columns: [
                { data: 'id', name: 'id' },                                 // - 0
                { data: 'shiftstart',                                      // - 1
                    name: 'shiftstart',
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
                { data: 'stoptype', name : 'stoptype' },                // - 6
                { data: 'reason', name: 'reason' },                     // - 7
                { data: 'login', name: 'login' },
            ],
            aoColumnDefs:[
                {
                    "searchable": false,
                    "aTargets": [0,1,2,3]
                },
                {
                    //"visible": false,
                    //"aTargets": [0]
                },
                {
                    targets: [0,1,2,3,4,5,6],
                    className: 'dt-body-center'
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
            "lengthMenu": [ 10, 20, 50 ],
            "createdRow": function ( row, data, index ) {
                var obj = data;
                if ( obj.stoptype == "Авария") {
                    for(var i = 0; i < 5; i++){
                        $('td', row).eq(i).addClass('text-danger');                    
                    }
                }
            },
            "order": [ 0, 'desc' ],
        });
        setInterval( function () {
            oTable.ajax.reload( null, false );
        }, updatePeriod*10*1000 );
    }

    function getCalcMode(id, selector){
        (selector==4) ? $('#repdates').modal("show") : getAutomRep(id, selector);
    }

    function getAutomRep(id, selector){
        var lineId = id;
        $.ajax({
            type:'GET',
            url: '../app/core/AuxData.php',
            data: { id: lineId, mode : selector },
            cache: false,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data){
                $('#from').empty();
                $('#to').empty();
                showCalcContent(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    }

    function getManualRep(id, start, end){
        var lineId = id;
        $.ajax({
            type:'GET',
            url: '../app/core/AuxData.php',
            data: { id: lineId, startdate : start, enddate : end },
            cache: false,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data){
                $('#from').text("от " + DateToFmtString(start));
                $('#to').text("до " + DateToFmtString(end));
                showCalcContent(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    }

    function showCalcContent(data){
        var indata = data.data[0];
        var records = parseInt(indata.records);
        var plantime = (indata.plantime) ? SecToTimeFmt(indata.plantime) : "нет данных";
        var operatetime = (indata.operatetime) ? SecToTimeFmt(indata.operatetime) : "нет данных";
        var delay = (indata.delay) ? SecToTimeFmt(indata.delay) : "нет данных";
        var eff = (indata.eff && records>0) ? Number(indata.eff / records).toFixed(4) : "нет данных";
        $("#plantime").text(plantime);
        $("#operatetime").text(operatetime);
        $("#delaytime").text(delay);
        $("#eff").text(eff);   
    }
