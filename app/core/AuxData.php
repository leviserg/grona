<?php
    namespace app\core;
    require 'Db.php';
    $ret = [];

    if(isset($_GET['usershist'])){
        $ret= Db::getUserHistRecords();
    }

    if(isset($_GET['reports'])){
        $ret= Db::getReportsRecords($_GET['userline']);
    }

    if(isset($_GET['localreport'])){
        $ret= Db::getLocalReportRecords($_GET['line']);
    }

    if(isset($_GET['almcount'])){
        $ret= Db::getAlmCount();
    }

    if(isset($_GET['alarms'])){
        $ret= Db::getEvents('alarms');
    }

    if(isset($_GET['events'])){
        $ret= Db::getEvents();
    }

    if(isset($_GET['reportid'])){
        $ret['record']= Db::getSelectedReport($_GET['reportid']);
        $ret['types']= Db::getStopTypes();
    }

    if(isset($_GET['savedreportid'])){
        $postdata = [
            'reportid' => $_GET['savedreportid'],
            'stoptype' => $_GET['stoptype'],
            'faultreason' => $_GET['faultreason'],
            'comment' => $_GET['comment'],
            'userid' => $_GET['userid']         
        ];
        $ret = Db::saveSelectedReport($postdata);
    }

    if(isset($_GET['homecurdata'])){
        $ret= Db::getMainData();
    }

    if(isset($_GET['homeseldate'])){
        $ret= Db::getMainDataFromHistory($_GET['homeseldate']);
    }

    if(isset($_GET['id'])){
        $ret= Db::getLineCurData(intval($_GET['id']));
    }

    if(isset($_GET['id'])){
        if(isset($_GET['seldate']))
            $ret= Db::getLinePrevData(intval($_GET['id']), $_GET['seldate']);
        elseif(isset($_GET['mode']))
            $ret= Db::calcEffParam(intval($_GET['id']), $_GET['mode']);
        elseif(isset($_GET['startdate']) && isset($_GET['enddate']))
            $ret= Db::calcManEffParam(intval($_GET['id']), $_GET['startdate'], $_GET['enddate']); 
        elseif(isset($_GET['effline']))
            $ret= Db::getEffLine(intval($_GET['id']));
    }

    if(isset($_GET['sensor'])){
        $ret= Db::getSensorTrendData(intval($_GET['sensor']));
    }

    if(isset($_GET['sensordata'])){
        $ret= Db::getFirstSelectors(intval($_GET['sensordata']));
    }


	echo json_encode(["data"=>$ret]);
?>