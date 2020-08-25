var updatePeriod = 120; // sec

$(document).ready(function(){

    var dt = setInterval("getCurData()", updatePeriod*1000);

    $("#shprd").bind("click",function(elem){
        $('#showhist').modal("show");
    });

    $("#shcrd").bind("click",function(elem){
        window.location.reload();
        /*
        $('#shprd').removeClass('btn-info');
        $('#shprd').addClass('btn-outline-info');
        $('#shcrd').removeClass('btn-outline-info');
        $('#shcrd').addClass('btn-info');
        $('#shprdt').text('Отображать данные');
        getCurData();
        dt = setInterval("getCurData()", updatePeriod*1000);
        */
    });

    $("#goto").bind("click",function(elem){
        clearInterval(dt);
        $('#showhist').modal("hide");
        $('#shcrd').removeClass('btn-info');
        $('#shcrd').addClass('btn-outline-info');
        $('#shprd').removeClass('btn-outline-info');
        $('#shprd').addClass('btn-info');
        var selTime = $('#tpicker').val();
        if(selTime.length < 5){
            selTime += "00:00:00";
        }
        else if(selTime.length <= 7){
            selTime += ":00";
        }
        var strDate = $('#dpicker').val().toString();
        $('#shprdt').text('Данные за ' + strDate.slice(-2) + "." + strDate.slice(5, 7) + "." + strDate.substring(0, 4) + " " + selTime);   
        var gotodate = $('#dpicker').val() + " " + selTime;
        getPrevData(gotodate);
    });

    getCurData();

});

function getCurData(){    
    $.ajax({
        type:'GET',
        url: '../app/core/AuxData.php/?homecurdata',
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            console.log(data);
            showContent('content', data);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function getPrevData(homeseldate){
    var selectedDate = homeseldate;
    $.ajax({
        type:'GET',
        url: '../app/core/AuxData.php',
        data: {homeseldate : selectedDate},
        //url: 'http://main/testjson/gronahomeprev.php?seldate=' + selectedDate, // equal request
        cache: false,
        crossDomain: true,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data){
            console.log(data);
            showContent('content', data);
        },
        error: function(err){
            console.log(err);
        }
    });
}

function showContent(elem, data){
    $('#' + elem).empty();
    var colNum = 2;
    var colClass = parseInt(12/colNum);
    var sText = "";

    var lines = data.data;
    //var sensors = data.data.sensors;
    var divrows = Math.ceil(lines.length / colNum);

//    console.log(data.data);

    for(var i = 0; i < divrows; i++){
        sText += '<div class="row mt-2">';
        for(var j=0; j<colNum; j++){
            var lineIndex = i*colNum + Number(j);
            if(lineIndex<lines.length){
                sText += "<div class='col-md-"+colClass+"'><div class='card mt-2'>";
                sText += "<div class='card card-header text-center py-1'>";
                sText += "<a class='btn btn-outline-info btn-lg border-0 py-1 my-0' href='line_"+lines[lineIndex].id+"'>";
                sText += lines[lineIndex].linename;
                sText += "</a></div>";
                sText += "<div class='card card-body py-0'>";
                sText += "<table class='table table-hover table-sm table-responsive row-border' style='width:100%'>";
                sText += "<thead class='text-muted small font-weight-normal'><tr>";
                sText += "<th class='fit small mx-0 px-0'>.</th>";
                sText += "<th class='col-2 text-left'>Оборудование</th>";
                sText += "<th class='col-1 text-center'>Датчик</th>";
                sText += "<th class='fit text-center'>Статус</th>";
                sText += "<th class='col-2 text-center'>Время</th>";
                sText += "<th class='fit text-center'>Длительность</th>";
                sText += "</tr></thead>";
                sText += "<tbody class='mb-0 pb-0' style='font-size:0.95em'>";
                var sensors = lines[lineIndex].sensors;
                for(var k=0; k < sensors.length; k++){
                    sText += sensTableRow(sensors[k], 18,1);// 18 px image size
                }
                sText += "</tbody></table></div></div></div>";
            }
        }
        sText += '</div>';        
    }
    $('#' + elem).append(sText);
}