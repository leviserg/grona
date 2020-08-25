$(document).ready(function(){

    loadFirstSelectors();

});

function getSensorData(chartdiv, id, color){
    var sensId = id;
    var chartType = 2; // ["line", "smoothedLine", "step", "column", "candlestick", "ohlc"]
    $.ajax({
        type:'GET',
        //url: '../testjson/gronatrenddata.php',
        //data: { id : lineId },
        url: '../app/core/AuxData.php',
        data: { sensor : sensId},
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            var length = 1;
            var sensor = data.data.sensor[0];
            var trenddata = data.data.data;
            var sTitle = sensor.linename + ". " + sensor.equipname + ". " + sensor.sensname;
            var col = (sensor.alarm == 1) ? 2 : color;
            //var el = document.getElementById(chartdiv);
            //createStockChart(el, trenddata, length, sTitle, chartType, 1.1, col);
            var el = chartdiv;
            createSingleChart(el, trenddata, length, sTitle, chartType, 1.1, col);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function loadFirstSelectors(){
    $.ajax({
        type:'GET',
        url: '../app/core/AuxData.php',
        data: { sensordata : true},
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            FillSelectors(data);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function FillSelectors(data){
    var JSONdata = data.data;
    var sensLnGroup = jLinq.from(JSONdata).group("line_id");
    var sensEqGroup = jLinq.from(JSONdata).group("equip_id");

    elems = [["#tr_line_1","#tr_equip_1","#tr_sens_1"],["#tr_line_2","#tr_equip_2","#tr_sens_2"]];
    var sText = "";

    $("#tr_line_1").empty();
    $("#tr_line_2").empty();
    var EqGroup = [];
    for(var id in sensLnGroup){
        sText += "<option value='" + sensLnGroup[id][0].line_id + "'>" + sensLnGroup[id][0].linename + "</option>";
        EqGroup[id] = jLinq.from(JSONdata).equals("line_id", sensLnGroup[id][0].line_id).group("equip_id");
    }
    EqGroup.shift();

    $("#tr_line_1").append(sText);
    $("#tr_line_2").append(sText);
    $("select#tr_line_1 option[value='1']").attr("selected","selected");
    $("select#tr_line_2 option[value='2']").attr("selected","selected");

    $("#tr_equip_1").empty();
    $("#tr_equip_2").empty();

    var EqSensGroup = [];
    for(var i = 0; i < EqGroup.length; i++){
        EqSensGroup[i] = [];
        var j = 0;
        for(var id in EqGroup[i]){
            EqSensGroup[i][j] = EqGroup[i][id];
            j++;
        }
        if(i < 2){
            var pageIndex = Number(i + 1);
            selectLineEquip(pageIndex, EqGroup[i]);
            selectEquipSens(pageIndex, EqSensGroup[i][0]);
            getSensorData('chartdiv_' + pageIndex, EqSensGroup[i][0][0].id, i);
            $("input[name=sensors_"+pageIndex+"][value=" + EqSensGroup[i][0][0].id + "]").prop('checked', true);
        }
    }
// --------- line selectors ---------

    $("select#tr_line_" + 1).bind("change",function(){
        var selItem = this.value;
        var elem = 1;
        var data = EqGroup[Number(selItem - 1)];
        var sensdata = EqSensGroup[Number(selItem - 1)][0];
        selectLineEquip(elem, data);
        selectEquipSens(elem, sensdata); 
        getSensorData('chartdiv_' + elem, sensdata[0].id, 0);
        $("input[name=sensors_"+elem+"][value=" + sensdata[0].id + "]").prop('checked', true);
        $("input[name='sensors_1']").bind("click",function(){
            getSensorData('chartdiv_1',$(this).data("id"), 0);
        });      
    });

    $("select#tr_line_" + 2).bind("change",function(){
        var selItem = this.value;
        var elem = 2;
        var data = EqGroup[Number(selItem - 1)];
        var sensdata = EqSensGroup[Number(selItem - 1)][0];
        selectLineEquip(elem, data);
        selectEquipSens(elem, sensdata);
        getSensorData('chartdiv_' + elem, sensdata[0].id, 1);
        $("input[name=sensors_"+elem+"][value=" + sensdata[0].id + "]").prop('checked', true);        
        $("input[name='sensors_2']").bind("click",function(){
            getSensorData('chartdiv_2',$(this).data("id"), 1);
        });
    });

    //console.log(sensEqGroup);

// --------- equip selectors ---------


    $("select#tr_equip_" + 1).bind("change",function(){
        var selItem = this.value;
        var elem = 1;
        var data = sensEqGroup[selItem];
       selectEquipSens(elem, data);
       getSensorData('chartdiv_' + elem, data[0].id, 0);
       $("input[name=sensors_"+elem+"][value=" + data[0].id + "]").prop('checked', true); 
       $("input[name='sensors_1']").bind("click",function(){
            getSensorData('chartdiv_1',$(this).data("id"), 0);
        });
    });

    $("select#tr_equip_" + 2).bind("change",function(){
        var selItem = this.value;
        var elem = 2;
        var data = sensEqGroup[selItem];
       selectEquipSens(elem, data);
       getSensorData('chartdiv_' + elem, data[0].id, 1);
       $("input[name=sensors_"+elem+"][value=" + data[0].id + "]").prop('checked', true); 
       $("input[name='sensors_2']").bind("click",function(){
            getSensorData('chartdiv_2',$(this).data("id"), 1);
        });
    });


    $("input[name='sensors_1']").bind("click",function(){
        getSensorData('chartdiv_1',$(this).data("id"), 0);
    });

    $("input[name='sensors_2']").bind("click",function(){
        getSensorData('chartdiv_2',$(this).data("id"), 1);
    });

}


function selectLineEquip(elem, data){
    $("#tr_equip_" + elem).empty();
    //$("#tr_sens_" + elem).empty();
    var sText = "";
    for(var id in data){
        sText += "<option value='" + data[id][0].equip_id + "'>" + data[id][0].equipname + "</option>";
    }
    $("#tr_equip_" + elem).append(sText);
}

function selectEquipSens(elem, data){
    
    $("#tr_sens_" + elem).empty();
    var sText = "";
    for(var id in data){
        sText += "<label class='checkcontainer my-2 ml-0 pl-0 text-info text-left'>" + data[id].sensname;
        sText +=  "<input type='radio' name='sensors_"+elem+"' value='"+data[id].id+"' data-id='"+data[id].id+"'>";
        sText += "<span class='checkmark'></span></label>";
    }
    $("#tr_sens_" + elem).append(sText);
    
}
