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
		url: '../testjson/gronaactalarms.php',
		data: {
			sum: "1",
		},
		cache: false,
		crossDomain: true,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(data){
			var unack = data;
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