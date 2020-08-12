var updatePeriod = 20;

    $(document).ready(function(){

        var dt = setInterval("getCurData()", updatePeriod*1000);

        $("#shprd").bind("click",function(elem){
            $('#showhist').modal("show");
        });
    
        $("#shcrd").bind("click",function(elem){
            $('#shprd').removeClass('btn-info');
            $('#shprd').addClass('btn-outline-info');
            $('#shcrd').removeClass('btn-outline-info');
            $('#shcrd').addClass('btn-info');
            $('#shprdt').text('Отображать данные');
            getCurData();
            dt = setInterval("getCurData()", updatePeriod*1000);
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

// *******************
// **** functions ****
// *******************


    function getCurData(){
        $.ajax({
            type:'GET',
            url: '../testjson/gronahomecur.php',
            cache: false,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data){
                showContent('hometable', data);
                //console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    }

    function getPrevData(seldate){
        var selectedDate = seldate;
        $.ajax({
            type:'GET',
            url: '../testjson/gronahomeprev.php',
            data: {seldate : selectedDate},
            //url: 'http://main/testjson/gronahomeprev.php?seldate=' + selectedDate, // equal request
            cache: false,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data){
                showContent('hometable', data);
                //console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        });
    }

    function showContent(elem, data){
        $('#' + elem).empty();
        var sText = "";
        for(var i in data){
            var tblRowStart = "<tr class='align-middle py-0 my-0' data-toggle='tooltip' title='"+data[i].name+"'>";
            var tblRowEnd = "</tr>";
            sText += tblRowStart;
            var status = data[i].status;
            var name = data[i].name;
            var link = "line_" + data[i].id;
            var trigTime = data[i].lastupd;
            var trigPeriod = data[i].lastper;
            var eff = data[i].eff;
            sText += getSts(status).img;
            sText += LinkBtn(link, name, status);
            sText += getSts(status).desc;
            sText += "<td class='text-center "+getSts(status).strcol+"'>" + DateToFmtString(trigTime) + "</td>";
            sText += "<td class='text-center "+getSts(status).strcol+"'>" + SecToTimeFmt(trigPeriod) +"</td>";
            sText += "<td class='text-center "+getSts(status).strcol+"'>" + eff +"</td>";
            sText += tblRowEnd;
        }
        $('#' + elem).append(sText);
    }

    function LinkBtn(sLink, sName, iStatus){
        var sRet = "";
        if (iStatus==1)
            sRet = "<td><a href='"+sLink+"' class='btn btn-outline-danger btn-block text-left font-weight-bold py-1 border-0'>"+sName+"</a></td>"; // alarm state
        else if (iStatus==8)
            sRet = "<td><a href='"+sLink+"' class='btn btn-outline-primary btn-block text-left font-weight-bold py-1 border-0'>"+sName+"</a></td>"; // maint state
        else if (iStatus==32)
            sRet = "<td><a href='"+sLink+"' class='btn btn-outline-success btn-block text-left font-weight-bold py-1 border-0'>"+sName+"</a></td>";  // operate                     
        else{
            sRet = "<td><a href='"+sLink+"' class='btn btn-outline-secondary btn-block text-left font-weight-bold py-1 border-0'>"+sName+"</a></td>";
        }
        return sRet;
    }

    function getSts(iStatus){
        var sImg;
        var sDesc;
        var sCol = "";
        switch(iStatus) {
            case 1: sImg = "alm.png"; sDesc = "Авария"; sCol = "text-danger"; break;
            case 2: sImg = "pow.png"; sDesc = "Вкл. питание"; break;
            case 4: sImg = "ready.png"; sDesc = "Готовность"; break;
            case 8: sImg = "maint.png"; sDesc = "В ремонте"; sCol = "text-primary"; break;                             
            case 16: sImg = "on_0.png"; sDesc = "Работа без прод."; break;
            case 32: sImg = "on_1.png"; sDesc = "Работа"; sCol = "text-success"; break;
            default: sImg = "off.png"; sDesc = "Выключено";
        }
        return {
            img : "<td class='text-center'><img src='public/images/"+sImg+"'></td>",
            desc: "<td class='text-center "+sCol+"'>"+sDesc+"</td>",
            strcol : sCol
        }
    }