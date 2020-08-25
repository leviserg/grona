$(document).ready(function(){
    var now = new Date();
    var timetext = now.toLocaleTimeString();
	var day = ("0" + now.getDate()).slice(-2);
	var pday = ("0" + (now.getDate()-1)).slice(-2);	
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = now.getFullYear()+"-"+(month)+"-"+(day);
	var yesterday = now.getFullYear()+"-"+(month)+"-"+(pday);
    var dt = setInterval("getActCount()", 60*1000);
    $('#dpicker').val(today);
	$('#tpicker').val("00:00:00");
	$('#dfnpicker').val(today);
    $('#tfnpicker').val("00:00:00");
	$('#dstpicker').val(yesterday);
    $('#tstpicker').val("00:00:00");
	getCurTime();
	getActCount();

	$('[data-toggle="tooltip"]').tooltip();

	$(window).scroll(function(){
		if ($(this).scrollTop() > 200) {
			$('.scrollup').fadeIn();
		}
		else{
			$('.scrollup').fadeOut();
		}
    });

    $('.scrollup').click(function(){
	    $("html, body").animate({ scrollTop: 0 }, 500);
	    return false;
    });
});
// ----------------------------------------
function ScrollToMark(linkname){
	$('html, body').animate({scrollTop:$(linkname).offset().top}, 1000);
}
// ----------------------------------------
function revMyDateFmt(val){
	var ret = "";
	var year = val.substring(6);
	var month = val.substring(3,5);
	var day = val.substring(0,2);
		ret = year+"-"+month+"-"+day;
	return ret;
}
// ----------------------------------------
function getCurTime(){
    var curdate = new Date();
    var datetext = curdate.toLocaleDateString() + " " + curdate.toLocaleTimeString();
    $('#curtime').text(datetext);
    setTimeout("getCurTime()",1000);
}
// ----------------------------------------
function getActCount(){
	$.ajax({
		type:'GET',
		url: '../app/core/AuxData.php/?almcount',
		cache: false,
		crossDomain: true,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(data){
			var unack = data.data;
			$('#actsum').text(unack);
		},
		error: function(err){
			console.log(err);
		}
	});

}
// ----------------------------------------
function SecToTimeFmt(iSec){
	var hours = parseInt(iSec / 3600).toString();
	if(hours.length < 2)
		hours = "0" + hours;
	return hours + ":" + ("0" + parseInt((iSec%3600)/60).toString()).slice(-2) + ":" + ("0" + (iSec%60).toString()).slice(-2);
}
// ----------------------------------------
function DateToFmtString(date){
	var gdate = new Date(date);
	var day = ("0" + gdate.getDate()).slice(-2);
	var month = ("0" + (gdate.getMonth() + 1)).slice(-2);
	var gdatedate = day + "." + month + "." + gdate.getFullYear();
	var hour = ("0" + gdate.getHours()).slice(-2);
	var minute = ("0" + gdate.getMinutes()).slice(-2);
	var second = ("0" + gdate.getSeconds()).slice(-2);
	var gdatetime = hour + ":" + minute + ":" + second;
	return gdatedate + " " + gdatetime;
}

function GetDateFromStr(str){
	return new Date(str.substring(0,10) + "T" + str.substring(11,19) + "");
}
// --------------------------------------
function sensTableRow(data, size, padding){
    var sRowText = "<tr class='align-middle py-"+padding+" my-0'><td></td><td>Нет данных</td><td class='text-center'>-</td><td class='text-center'>-</td><td class='text-center'>Нет данных</td><td class='text-center'>-</td></tr>";
    if(data != null){
        sRowText = "<tr class='align-middle py-"+padding+" my-0 " + getSensorStatus(data,size).Col + "' data-toggle='tooltip' title='id датчика "+data.id + ' : '+data.equipname+"." +data.sensname+ "'>";
        sRowText += "<td class='fit small mx-0 px-0 py-"+padding+" my-0'>" + getSensorStatus(data,size).Img + "</td>"; // img
        sRowText += "<td class='py-"+padding+" my-0'>" + data.equipname + "</td>";
        sRowText += "<td class='text-center py-"+padding+" my-0'>" + data.sensname + "</td>";
        sRowText += "<td class='text-center py-"+padding+" my-0'>" + getSensorStatus(data,size).Desc + "</td>"; // val text
        sRowText += "<td class='text-center py-"+padding+" my-0'>" + DateToFmtString(data.lastupd) + "</td>";
        sRowText += "<td class='text-center py-"+padding+" my-0'>" + SecToTimeFmt(data.timediff) + "</td>";
        sRowText += "</tr>";
    }
    return sRowText;
}
// --------------------------------------
function getSensorStatus(data, size){
    var sImg;
    var sDesc;
    var sCol = "";
    if(data.value == 1){
        sImg = "sensgreen.png";
        sDesc = (data.alarm == 1 || data.maintenance == 1 || data.tuning == 1) ? "активн" : "ВКЛ";
        sCol = "text-success";
        if(data.alarm == 1){
            sImg = "sensred.png";
            sCol = "text-danger";
        }
        else if (data.maintenance == 1 || data.tuning == 1){
            sImg = "sensmaint.png";
            sCol = "text-primary";
        }
    }
    else{
        sImg = "sensoff.png";
        sDesc = (data.alarm == 1 || data.maintenance == 1 || data.tuning == 1) ? "неактивн" : "ВЫКЛ";
    }
    return {
        Img : "<img src='public/images/"+sImg+"' style='width:"+size+"px; height:"+size+"px;'>",
        Desc: sDesc,
        Col : sCol
    }
}
// --------------------------------------
function createStockChart(elem, chartData, datalen, sGraphTitle, type, maxval, colorNum) {
    console.log(chartData);
    var chart = new AmCharts.AmStockChart();
    // colorNum = 0 - basic text-info;  = 1 - auxiliar text-success; = 2 - alarm color
    var col = ["#17A2B8","#2CA02C","#D62728","#9467BD","#FF00DC","#FF7F0E","#FFD200","#9B3B00","#000000","#9B3B00"];
    var lineType = ["line", "smoothedLine", "step", "column", "candlestick", "ohlc"];
    var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
        categoryAxesSettings.minPeriod = "10SS";
        categoryAxesSettings.equalSpacing = true;
        categoryAxesSettings.parseDates = true;
    chart.categoryAxesSettings = categoryAxesSettings;
    var valueAxesSettings = new AmCharts.ValueAxesSettings();
        valueAxesSettings.minimum = 0;
        valueAxesSettings.maximum = maxval; // 100
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
        graph[i].lineColor = col[colorNum];
        graph[i].valueField = "value" + parseInt(i);
        graph[i].type = lineType[type]; // 0 - line, 1 - smoothedline, 2 - step, 3 - column,  4 - candlestick, 5 - ohlc
        graph[i].lineThickness = 3;
        graph[i].bullet = "round";
        graph[i].noStepRisers = true;
        graph[i].bulletSize = 6;
        graph[i].bulletBorderColor = "white";
        graph[i].bulletBorderAlpha = 1;
        graph[i].bulletBorderThickness = 2;
        graph[i].id = parseInt(i);
        graph[i].fillAlphas = 0.1;   
        if(type==2){
            graph[i].stepDirection = "center";
            graph[i].fillAlphas = 0.8;
        }
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
        scrollbarSettings.graphType = lineType[type];
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

var singleLineColor = ["#17A2B8","#2CA02C","#D62728","#9467BD","#FF00DC","#FF7F0E","#FFD200","#9B3B00","#000000","#9B3B00"];
var singleLineType = ["line", "smoothedLine", "step", "column", "candlestick", "ohlc"];

//elem, chartData, datalen, sGraphTitle, type, maxval, colorNum
function createSingleChart(elem, data, datalen, title, type, maxVal, color) {

	var chart = new AmCharts.AmStockChart();

		chart["export"] = {
		  "enabled": true
		};
		
		var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
		categoryAxesSettings.minPeriod = "ss";
		chart.categoryAxesSettings = categoryAxesSettings;

		var valueAxesSettings = new AmCharts.ValueAxesSettings();
		valueAxesSettings.minimum = 0;
		valueAxesSettings.maximum = maxVal;
		chart.valueAxesSettings = valueAxesSettings;


		var dataSet = new AmCharts.DataSet();

		dataSet.dataProvider = data;
		dataSet.categoryField = "date";
				
		dataSet.fieldMappings = [
			{fromField: "value", toField: "value1"}
		];
				
		chart.dataSets = [dataSet];
		
		var stockPanel1 = new AmCharts.StockPanel();
			stockPanel1.showCategoryAxis = true;
		//	stockPanel1.title = "Температура,°C";
			stockPanel1.percentHeight = 70;
				
		var graph = [];

		for(var i=1; i <= datalen; i++){
            graph[i] = new AmCharts.StockGraph();
            graph[i].title = title;
            graph[i].balloonText = "[[value]]";
            graph[i].useDataSetColors = false;
            graph[i].lineColor = singleLineColor[color];
            graph[i].valueField = "value" + parseInt(i);;
            graph[i].type = singleLineType[type]; // 0 - line, 1 - smoothedLine, 2 - column, 3 - step, 4 - candlestick, 5 - ohlc
            graph[i].lineThickness = 3;
            graph[i].fillAlphas = 0.2;
            graph[i].bullet = "round";
            graph[i].bulletSize = 6;
            graph[i].bulletBorderColor = "white";
            graph[i].bulletBorderAlpha = 2;
            graph[i].bulletBorderThickness = 0;
            graph[i].id = parseInt(i);
            if(type==2){
                graph[i].stepDirection = "left";
            }
            stockPanel1.addStockGraph(graph[i]);
		}
	
		var stockLegend1 = new AmCharts.StockLegend();
			stockLegend1.valueTextRegular = " ";				
			stockPanel1.stockLegend = stockLegend1;	
				
			chart.panels = [stockPanel1];

		var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
			scrollbarSettings.graph = graph[1];
			scrollbarSettings.usePeriod = "10mm";
			scrollbarSettings.updateOnReleaseOnly = false;
			scrollbarSettings.position = "bottom";
			
			chart.chartScrollbarSettings = scrollbarSettings;

		var cursorSettings = new AmCharts.ChartCursorSettings();
			cursorSettings.showNextAvailable = true;
			cursorSettings.cursorColor = singleLineColor[color];
			cursorSettings.valueLineEnabled = false;// true for value hor line
			cursorSettings.valueLineAlpha = 0.5;
			cursorSettings.categoryBalloonDateFormats = [
				{period:"YYYY", format:"YYYY"},
				{period:"MM", format:"MMM, YYYY"},
				{period:"WW", format:"DD MMM YYYY"},
				{period:"DD", format:"DD MMM YYYY"},
				{period:"hh", format:"DD MMM, JJ:NN:SS"},
				{period:"mm", format:"DD MMM, JJ:NN:SS"},
				{period:"ss", format:"DD MMM, JJ:NN:SS"},
				{period:"fff", format:"JJ:NN:SS"}]; // "fff"-milliseconds
			cursorSettings.valueBalloonsEnabled = true;
			cursorSettings.fullWidth = true;
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

		var panelsSettings = new AmCharts.PanelsSettings();
			panelsSettings.mouseWheelZoomEnabled = true;
				
			panelsSettings.usePrefixes = true;
			chart.panelsSettings = panelsSettings;
        chart.write(elem);
}