var updatePeriod = 5;



$(document).ready(function(){



    var curId = $("#lineId").text();



    var dt = setInterval("getCurSensData("+curId+")", updatePeriod*1000);



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



    reportTableShow(curId);



});



// *******************

// **** functions ****

// *******************





function getCurSensData(id){

    var lineId = id;

    $.ajax({

        type:'GET',

        url: '../testjson/gronalinecur.php',

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

        url: '../testjson/gronalineprev.php',

        data: { id: lineId, seldate : selectedDate },

        //url: '../testjson/gronahomeprev.php?id= + lineId + '&seldate=' + selectedDate, // equal request

        cache: false,

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



function showSensContent(elem, data){

    var lineTitle = data.name;

    $('#lineName').text(lineTitle);    

    $('#' + elem).empty();

    var sText = "";

    var ii = 0;

    for(var i in data.sensors){

        var tblRowStart = "<tr class='align-middle py-0 my-0' data-toggle='tooltip' title='"+data.sensors[i].sensname+"'>";

        var tblRowEnd = "</tr>";

        sText += tblRowStart;

        var status = data.sensors[i].sensval;

        var sensname = data.sensors[i].sensname;

        var trigTime = data.sensors[i].lastupd;

        var trigPeriod = data.sensors[i].lastper;

        var rowTextColor = (status !=0 && data.sensors[i].sensalm != 0) ? "text-danger" : "";



        sText += getSensSts(status, data.sensors[i].sensalm, data.sensors[i].sensmaint).img;

        sText += "<td class='"+rowTextColor+"'><small>" + sensname +"</small></td>";

        sText += "<td class='text-center "+rowTextColor+"'><small>" + DateToFmtString(trigTime) +"</small></td>";

        sText += getSensSts(status, data.sensors[i].sensalm, data.sensors[i].sensmaint).sts;

        sText += "<td class='text-center "+rowTextColor+"'><small>" + SecToTimeFmt(trigPeriod) +"</small></td>";

        sText += tblRowEnd;

        ii++;

    }

    while(ii<18){

        sText += "<tr class='pt-2 mt-2 pt-0 mt-0'><td></td><td>-</td><td></td><td></td><td></td></tr>";

        ii++;

    }

    $('#' + elem).append(sText);

}



function getSensSts(val, alm, maint){

    var sImg = "";

    var sVal = "";

    var sCol = "";

    if(val !=0 && alm == 0 && maint == 0) 

        sImg = "sensgreen.png";

    else if(val !=0 && maint != 0)

        sImg = "sensmaint.png";

    else if(val !=0 && alm != 0){

        sImg = "sensred.png";

        sCol = "text-danger";

    }

    else

        sImg = "sensoff.png";

    (val!=0) ? sVal = "ВКЛ" :  sVal = "ОТКЛ";

    return {

        img : "<td class='text-center'><img src='public/images/"+sImg+"' style='width:20px; height:20px'></td>",

        sts: "<td class='text-center " + sCol +"'><small>"+sVal+"</small></td>"

    }

}



function getCalcMode(id, selector){

    (selector==4) ? $('#repdates').modal("show") : getAutomRep(id, selector);

}



function getAutomRep(id, selector){

    var lineId = id;

    $.ajax({

        type:'GET',

        url: '../testjson/gronacalcrep.php',

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

        url: '../testjson/gronamanrep.php',

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

    $(".totalsethours").text(data.totalsethours);

    $(".pausehours").text(data.pausehours);

    $(".avail").text(data.avail);

    $(".totalgetcounts").text(data.totalgetcounts); 

    $(".totalsetcounts").text(data.totalsetcounts); 

    $(".prod").text(data.prod);

    $(".qualgetcounts").text(data.qualgetcounts);

    $(".qual").text(data.qual);

    $(".oeeres").text(data.oeeres);    

}



function getTrendData(id){

    var lineId = id;

    $.ajax({

        type:'GET',

        url: '../testjson/gronatrenddata.php',

        data: { id : lineId },

        cache: false,

        crossDomain: true,

        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        success: function(data){

            var length = 1;

            var el = document.getElementById('chartdiv');

            //console.log(data);

            createStockChart(el, data, length, "Общая эффективность оборудования");

        },

        error: function(err){

            console.log(err);

        }

    });

}



function createStockChart(elem, chartData, datalen, sGraphTitle) {

    //$(elem.id).empty();

    var chart = new AmCharts.AmStockChart();



    var col = ["#17A2B8","#FF7F0E","#2CA02C","#D62728","#9467BD","#FF00DC","#FFD200","#9B3B00","#000000","#9B3B00"];

    var lineType = ["line", "smoothedLine", "step", "column", "candlestick", "ohlc"];



    var categoryAxesSettings = new AmCharts.CategoryAxesSettings();

        categoryAxesSettings.minPeriod = "10SS";

        categoryAxesSettings.equalSpacing = true;

        categoryAxesSettings.parseDates = true;

    chart.categoryAxesSettings = categoryAxesSettings;



    var valueAxesSettings = new AmCharts.ValueAxesSettings();

        valueAxesSettings.minimum = 0;

        valueAxesSettings.maximum = 1; // 100

    chart.valueAxesSettings = valueAxesSettings;



    var dataSet = new AmCharts.DataSet();

        dataSet.dataProvider = chartData;

        dataSet.categoryField = "date";

        dataSet.fieldMappings = [

            { fromField: "value", toField: "value1" },

        ];

    chart.dataSets = [dataSet];



    var stockPanel1 = new AmCharts.StockPanel();

        stockPanel1.showCategoryAxis = true;

        stockPanel1.title = "OEE";

        stockPanel1.percentHeight = 100;//70



    var graph = [];



    for(var i=1; i <=datalen; i++){

        graph[i] = new AmCharts.StockGraph();

        graph[i].title = sGraphTitle;

        graph[i].balloonText = "[[value]]%";

        graph[i].useDataSetColors = false;

        graph[i].lineColor = col[i-1];

        graph[i].valueField = "value" + parseInt(i);

        graph[i].type = lineType[1]; // 0 - line, 1 - smoothedline, 2 - step, 3 - column,  4 - candlestick, 5 - ohlc

        graph[i].lineThickness = 3;

        graph[i].bullet = "round";

        graph[i].noStepRisers = true;

        graph[i].bulletSize = 6;

        graph[i].bulletBorderColor = "white";

        graph[i].bulletBorderAlpha = 1;

        graph[i].bulletBorderThickness = 2;

        graph[i].id = parseInt(i);

        stockPanel1.addStockGraph(graph[i]);

    }



    var stockLegend1 = new AmCharts.StockLegend();

        stockLegend1.valueTextRegular = " ";

        stockPanel1.stockLegend = stockLegend1;



        chart.panels = [stockPanel1];



    var scrollbarSettings = new AmCharts.ChartScrollbarSettings();

        scrollbarSettings.graph = graph[1];

        scrollbarSettings.usePeriod = "10ss";//10mm

        scrollbarSettings.updateOnReleaseOnly = false;

        scrollbarSettings.position = "bottom";

        scrollbarSettings.graphType = "line";

        scrollbarSettings.autoGridCount = true;

        

        chart.chartScrollbarSettings = scrollbarSettings;



    var cursorSettings = new AmCharts.ChartCursorSettings();

        cursorSettings.showNextAvailable = true;

        cursorSettings.cursorColor = "#17A2B8";

        cursorSettings.valueLineEnabled = false; // true

        cursorSettings.valueLineAlpha = 0.5;



        cursorSettings.categoryBalloonDateFormats = [

            {period:"YYYY", format:"YYYY"},

            {period:"MM", format:"DD MMM YYYY JJ:NN:SS"},

            {period:"WW", format:"DD MMM JJ:NN:SS"},

            {period:"DD", format:"DD MMM JJ:NN:SS"},

            {period:"hh", format:"DD MMM JJ:NN:SS"},

            {period:"mm", format:"DD MMM JJ:NN:SS"},

            {period:"ss", format:"DD MMM JJ:NN:SS"},

            {period:"fff", format:"DD MMM JJ:NN:SS"}

        ]; // "fff"-milliseconds

        

        cursorSettings.valueBalloonsEnabled = true;

        cursorSettings.fullWidth = false;

        cursorSettings.cursorAlpha = 0.1;



    chart.chartCursorSettings = cursorSettings;

    

    var periodSelector = new AmCharts.PeriodSelector();

        periodSelector.position = "bottom";

        periodSelector.dateFormat = "YYYY-MM-DD JJ:NN:SS";

        periodSelector.inputFieldWidth = 120;

        periodSelector.inputFieldsEnabled = false;

        periodSelector.periods = [

            { period: "DD", count: 1, label: "1 день" },

            { period: "DD", selected: true, count: 5, label: "5 дней" },

            { period: "MM", count: 1, label: "1 месяц" },

            { period: "YYYY", count: 1, label: "1 год" },

            { period: "MAX", label: "Все" }

        ];



    chart.periodSelector = periodSelector;

    

    chart.dataDateFormat = "YYYY-MM-DD JJ:NN:SS";



    var panelsSettings = new AmCharts.PanelsSettings();

        panelsSettings.mouseWheelZoomEnabled = false;

        panelsSettings.usePrefixes = true;



    chart.panelsSettings = panelsSettings;



    chart.write(elem.id);

    chart.validateNow();

    //$(elem.id).fadeIn(1000);

}



function reportTableShow(id) {

    var lineId = id;

    $.ajax({

        type:'GET',

        url: '../testjson/gronareports.php',

        data: { id: lineId},

        cache: false,

        crossDomain: true,

        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        success: function(data){

            //console.log(data);

            showLineTableContent('linetable', data.data);

        },

        error: function(err){

            console.log(err);

        }

    });

}



function showLineTableContent(elem, data){

    $('#' + elem).empty();

    var sText = "";

    for(var i in data){

        var sCol = (data[i].stoptype == "Авария") ? 'text-danger' : '';

        var trStart = "<tr class='align-middle py-0 my-0 "+sCol+"' data-toggle='tooltip' title='"+data[i].id+"'>";

        var trEnd = "</tr>";

        sText += trStart;

        var started = data[i].startdate;

        var stopped = data[i].stopdate;

        var delay = SecToTimeFmt(data[i].delay);

        var stoptype = data[i].stoptype;

        var reason = data[i].reason;



        // console.log(stoptype + " ; " + reason);



        sText += "<td class='text-left py-0 my-0'><small><small>" + started + "</small></small></td>";

        sText += "<td class='text-left py-0 my-0'><small><small>" + stopped + "</small></small></td>";

        sText += "<td class='text-left py-0 my-0'><small><small>" + delay +"</small></small></td>";

        sText += "<td class='text-left py-0 my-0'><small><small>" + stoptype + "</small></small></td>";

        sText += "<td class='text-left py-0 my-0'><small><small>" + reason + "</small></small></td>";

        sText += trEnd;

    }

    $('#' + elem).append(sText);

}