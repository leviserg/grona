<?php
	namespace app\core;
    use mysqli;
    use DateTime;

	class Db {

        private function dbconn(){
            return [
                'host' => 'localhost',
                'dbname' => 'gronadb',
                'user' => "root",
                'pwd'  => ""
            ];
        }

        public static function getMainData(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $ret = [];
                    $tblname = "lines";
                    $sql = "select * from `".$tblname."`";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $tblname = "sensors";
                    $recdatecolumn = "lastupd";
                    $startdate = "NOW()";
                    for ($i=0; $i < count($ret); $i++) { 
                        $line_id = intval($ret[$i]['id']);
                        $ret[$i]['sensors'] = [];
                        $sql = "select 
                            `sensors`.`id` as id,
                            `lines`.`id` as lineid,
                            `equips`.`equipname` as equipname,
                            `sensors`.`name` as sensname,
                            `sensors`.`alarm` as alarm,
                            `sensors`.`maintenance` as maintenance, 
                            `sensors`.`tuning` as tuning, 
                            `".$tblname."`.`value` as value,  
                            `".$tblname."`.`".$recdatecolumn."` as lastupd,  
                            TIME_TO_SEC(TIMEDIFF(".$startdate.",`".$tblname."`.`".$recdatecolumn."`)) as timediff,
                            `sensors`.`showonmain` as showonmain                                                                                                               
                        from `".$tblname."`
                            inner join `equips` on `sensors`.`equip_id` = `equips`.`id`
                            inner join `lines` on `equips`.`line_id` = `lines`.`id`
                        where
                            (`lines`.`id`=".$line_id." and `sensors`.`showonmain` is not null)
                        order by `sensors`.`showonmain` asc";
                        $res = $mysqli->query($sql);
                        $ret[$i]['sensors'] = self::getAssocData($res);
                        $res->close();
                    }
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getMainDataFromHistory($seldate){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $ret = [];
                    $tblname = "lines";
                    $sql = "select * from `".$tblname."`";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $tblname = "senshistory";
                    $recdatecolumn = "recdate";
                    $startdate = "'".$seldate."'";
                    for ($i=0; $i < count($ret); $i++) { 
                        $line_id = intval($ret[$i]['id']);
                        $ret[$i]['sensors'] = [];
                        $sql = "select `sensors`.`id` as id, `sensors`.`showonmain` as showonmain
                        from `sensors`
                            inner join `equips` on `sensors`.`equip_id` = `equips`.`id`
                            inner join `lines` on `equips`.`line_id` = `lines`.`id`
                        where
                            `lines`.`id`='".$line_id."'
                        order by `sensors`.`showonmain` asc";
                        $res = $mysqli->query($sql);
                        $line_sensors = self::getAssocData($res);
                        $res->close();
                        $k = 0;
                        for($j=0; $j < count($line_sensors); $j++){
                            if(isset($line_sensors[$j]['showonmain'])){
                                $sql = "select 
                                    `sensors`.`id` as id,
                                    `lines`.`id` as lineid,
                                    `equips`.`equipname` as equipname,
                                    `sensors`.`name` as sensname,
                                    `sensors`.`alarm` as alarm,
                                    `sensors`.`maintenance` as maintenance, 
                                    `sensors`.`tuning` as tuning, 
                                    `senshistory`.`value` as value,  
                                    `senshistory`.`recdate` as lastupd,  
                                    TIME_TO_SEC(TIMEDIFF(".$startdate.",`senshistory`.`recdate`)) as timediff,
                                    `sensors`.`showonmain` as showonmain                                                                                                               
                                from `senshistory`
                                    inner join `sensors` on `senshistory`.`sens_id` = `sensors`.`id`
                                    inner join `equips` on `sensors`.`equip_id` = `equips`.`id`
                                    inner join `lines` on `equips`.`line_id` = `lines`.`id`
                                where
                                    (`senshistory`.`sens_id` = ".$line_sensors[$j]['id']." and `senshistory`.`recdate`<=".$startdate.")
                                order by `senshistory`.`recdate` desc limit 1";
                                $res = $mysqli->query($sql);
                                $ret[$i]['sensors'][$k] = self::getAssocData($res)[0];
                                $res->close();
                                $k++;
                            }
                        }
                    }
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }


        public static function getusers($type = null){
            $db = self::dbconn();
            $tblname = "users";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select `id`,`login`,`password`,`line`,`adm`,`editreport` from `".$tblname."`";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $ret = [];
                    while($data = $res->fetch_assoc()){
                        if(!isset($type)){
                            $temp = [
                                'id'   =>  $data['id'],
                                'login' =>  $data['login'],
                                'password' =>  $data['password'],
                                'line' => $data['line'],
                                'adm' => $data['adm'],
                                'editreport' => $data['editreport']
                            ];
                        }
                        else{
                            $temp = [
                                $type   =>  $data[$type]
                            ];
                        }
                        array_push($ret, $temp);
                    }
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getAlmCount(){
            $db = self::dbconn();
            $tblname = "actalarms";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select count(`id`) from `".$tblname."`";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $rec_id = $res->fetch_row();
                    $res->close();
                    $mysqli->close();
                    return intval($rec_id[0]);
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function loginrecord($user_id){
            $db = self::dbconn();
            $tblname = "usershistory";
            $rec_id = null;
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "insert into `".$tblname."` (`user_id`,`loggedin`) values ('".$user_id."', NOW())";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $mysqli->query($sql);
                    $sql = "select max(id) from `".$tblname."`";
                    $res = $mysqli->query($sql);
                    $rec_id = $res->fetch_row();
                    $res->close();
                    $mysqli->close();
                    return intval($rec_id[0]);
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function logoutrecord($rec_id){
            $db = self::dbconn();
            $tblname = "usershistory";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "update `".$tblname."` set `loggedout` =  now() where `".$tblname."`.`id` = ".$rec_id;
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $mysqli->query($sql);
                    $mysqli->close();
                    return true;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getUserHistRecords(){
            $db = self::dbconn();
            $tblname = "usershistory";
            $linktblname="users";
            $linkkey="user_id";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select
                        `".$tblname."`.`id` as id,
                        `".$linktblname."`.`id` as user_id,
                        `".$linktblname."`.`login` as login,
                        `".$linktblname."`.`line` as line,
                        `".$linktblname."`.`description` as description,
                        `".$tblname."`.`loggedin` as loggedin,
                        `".$tblname."`.`loggedout` as loggedout,
                        `".$tblname."`.`totalstarts` as totalstarts,     
                        `".$tblname."`.`totalalarms` as totalalarms,
                        `lines`.`linename` as linename
                    from
                        `".$tblname."`
                    inner join `".$linktblname."` on `".$tblname."`.`".$linkkey."` = `".$linktblname."`.`id`
                    left join `lines` on `users`.`line` = `lines`.`id`
                    order by `".$tblname."`.`loggedin` desc";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getReportsRecords($userline_id = 0){
            $db = self::dbconn();
            $tblname = "shiftreports";
            $auxcondition = ($userline_id!=0) ? " where `".$tblname."`.`line_id` = ".$userline_id : "";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select
                        `".$tblname."`.`id` as id,
                        `".$tblname."`.`line_id` as line_id,
                        `lines`.`linename` as linename,
                        `users`.`login` as login,
                        `stoptypes`.`name` as `stoptype`,
                        `faultreasons`.`name` as `reason`,
                        `".$tblname."`.`shiftstart` as shiftstart,
                        `".$tblname."`.`linestart` as linestart,
                        `".$tblname."`.`linestop` as linestop,
                        `".$tblname."`.`shiftstop` as shiftstop,
                        (TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`shiftstop`,`".$tblname."`.`shiftstart`)) - TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`linestop`,`".$tblname."`.`linestart`))) as totaltimediff,  
                        (TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`linestop`,`".$tblname."`.`linestart`))/TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`shiftstop`,`".$tblname."`.`shiftstart`))) as oee,
                        `".$tblname."`.`comment` as comment,
                        `".$tblname."`.`edited` as edited
                    from
                        `".$tblname."`
                    left join `users` on `".$tblname."`.`user_id` = `users`.`id`
                    inner join `lines` on `".$tblname."`.`line_id` = `lines`.`id`
                    inner join `stoptypes` on `".$tblname."`.`stop_id` = `stoptypes`.`id`
                    left join `faultreasons` on `".$tblname."`.`fault_id` = `faultreasons`.`id`".$auxcondition." order by `".$tblname."`.`id` desc";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getLocalReportRecords($line_id){
            $db = self::dbconn();
            $tblname = "shiftreports";
            $auxcondition = ($line_id!=0) ? " where `".$tblname."`.`line_id` = ".$line_id : "";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select
                        `".$tblname."`.`id` as id,
                        `users`.`login` as login,
                        `stoptypes`.`name` as `stoptype`,
                        `faultreasons`.`name` as `reason`,
                        `".$tblname."`.`shiftstart` as shiftstart,
                        `".$tblname."`.`shiftstop` as shiftstop,
                        (TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`shiftstop`,`".$tblname."`.`shiftstart`)) - TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`linestop`,`".$tblname."`.`linestart`))) as totaltimediff
                    from
                        `".$tblname."`
                    left join `users` on `".$tblname."`.`user_id` = `users`.`id`
                    inner join `lines` on `".$tblname."`.`line_id` = `lines`.`id`
                    inner join `stoptypes` on `".$tblname."`.`stop_id` = `stoptypes`.`id`
                    left join `faultreasons` on `".$tblname."`.`fault_id` = `faultreasons`.`id`".$auxcondition." order by `".$tblname."`.`id` desc";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getEvents($alm = null){
            $db = self::dbconn();
            $tblname = (isset($alm)) ? "actalarms" : "events";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                
                $sql = "select
                        `".$tblname."`.`id` as id,
                        `lines`.`linename` as linename,
                        `equips`.`equipname` as equipname,                        
                        `".$tblname."`.`category_id` as category_id,
                        `".$tblname."`.`trigtime` as trigtime,
                        `eventcategories`.`name` as category,
                        `sensors`.`name` as sensorname,
                        `".$tblname."`.`comment` as comment
                    from
                        `".$tblname."`
                    inner join `sensors` on `".$tblname."`.`sens_id` = `sensors`.`id`
                    inner join `equips` on `sensors`.`equip_id` = `equips`.`id`
                    inner join `lines` on `equips`.`line_id` = `lines`.`id`
                    inner join `eventcategories` on `".$tblname."`.`category_id` = `eventcategories`.`id`
                    order by `".$tblname."`.`trigtime` desc";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function seedreportrecord($line, $shiftstart, $started, $stopped, $shiftstop, $stoptype = 2){
            $db = self::dbconn();
            $tblname = "shiftreports";
            $shiftstarted = strtotime($shiftstart);
            $linestarted = strtotime($started);
            $linestopped = strtotime($stopped);
            $shiftstopped = strtotime($shiftstop);
            $lineperiod = $linestopped - $linestarted;
            $shiftperiod = $shiftstopped - $shiftstarted;
            $timediff = $shiftperiod - $lineperiod;
            $oee = round($lineperiod/$shiftperiod,3);
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "insert into `".$tblname."`
                    (`line_id`,`shiftstart`,`linestart`,`linestop`,`shiftstop`,`totaltimediff`,`oee`,`stop_id`)
                    values
                    ('".$line."','".$shiftstart."','".$started."','".$stopped."','".$shiftstop."','".$timediff."','".$oee."','".$stoptype."')";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $mysqli->query($sql);
                    $mysqli->close();
                    return true;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        private function getAssocData($res){
            $ret = [];
            while($data = $res->fetch_assoc()){
                foreach($data as $key => $keyval){
                    $temp[$key] = $keyval;
                }
                array_push($ret, $temp);
            }
            return $ret;
        }

        public static function getStopTypes(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $ret = [];
                    $tblnames = ["faultreasons","stoptypes"];
                    foreach($tblnames as $tblname){
                        $sql = "select * from `".$tblname."`";
                        $res = $mysqli->query($sql);
                        $ret[$tblname] = self::getAssocData($res);
                        $res->close();
                    }
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getSelectedReport($rec_id){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $tblname = "shiftreports";
                    $sql = "select 
                            `".$tblname."`.`stop_id` as stop_id,
                            `lines`.`linename` as linename,
                            `".$tblname."`.`shiftstop` as shiftstop
                        from `".$tblname."`
                            inner join `lines` on `".$tblname."`.`line_id` = `lines`.`id`
                        where `".$tblname."`.`id` = ".$rec_id;
                    $res = $mysqli->query($sql);
                    $ret= self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function saveSelectedReport($data){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $tblname = "shiftreports";
                    $sql = "update `".$tblname."` set 
                            `stop_id` = '".$data['stoptype']."',
                            `fault_id` = '".$data['faultreason']."',
                            `user_id` = '".$data['userid']."',
                            `comment` = '".$data['comment']."',
                            `edited` = now()
                        where `".$tblname."`.`id` = ".$data['reportid'];
                    $mysqli->query($sql);
                    $mysqli->close();
                    return $true;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getLineCurData($line_id){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $ret = [];
                    $tblname = "lines";
                    $sql = "select * from `".$tblname."` where `id`='".$line_id."'";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $tblname = "sensors";
                    $recdatecolumn = "lastupd";
                    $startdate = "NOW()";
                    for ($i=0; $i < count($ret); $i++) { 
                        $curline_id = intval($ret[$i]['id']);
                        $ret[$i]['sensors'] = [];
                        $sql = "select 
                            `sensors`.`id` as id,
                            `lines`.`id` as lineid,
                            `equips`.`equipname` as equipname,
                            `sensors`.`name` as sensname,
                            `sensors`.`alarm` as alarm,
                            `sensors`.`maintenance` as maintenance, 
                            `sensors`.`tuning` as tuning, 
                            `".$tblname."`.`value` as value,  
                            `".$tblname."`.`".$recdatecolumn."` as lastupd,  
                            TIME_TO_SEC(TIMEDIFF(".$startdate.",`".$tblname."`.`".$recdatecolumn."`)) as timediff,
                            `sensors`.`showonmain` as showonmain                                                                                                               
                        from `".$tblname."`
                            inner join `equips` on `sensors`.`equip_id` = `equips`.`id`
                            inner join `lines` on `equips`.`line_id` = `lines`.`id`
                        where
                            (`lines`.`id`=".$curline_id.")
                        order by `sensors`.`id` asc";
                        $res = $mysqli->query($sql);
                        $ret[$i]['sensors'] = self::getAssocData($res);
                        $res->close();
                    }
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getLinePrevData($line_id, $seldate){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $ret = [];
                    $tblname = "lines";
                    $sql = "select * from `".$tblname."` where `id`='".$line_id."'";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $tblname = "senshistory";
                    $recdatecolumn = "recdate";
                    $startdate = "'".$seldate."'";
                    for ($i=0; $i < count($ret); $i++) { 
                        $line_id = intval($ret[$i]['id']);
                        $ret[$i]['sensors'] = [];
                        $sql = "select `sensors`.`id` as id, `sensors`.`showonmain` as showonmain
                        from `sensors`
                            inner join `equips` on `sensors`.`equip_id` = `equips`.`id`
                            inner join `lines` on `equips`.`line_id` = `lines`.`id`
                        where
                            `lines`.`id`='".$line_id."'
                        order by `sensors`.`id` asc";
                        $res = $mysqli->query($sql);
                        $line_sensors = self::getAssocData($res);
                        $res->close();
                        for($j=0; $j < count($line_sensors); $j++){
                                $sql = "select 
                                    `sensors`.`id` as id,
                                    `lines`.`id` as lineid,
                                    `equips`.`equipname` as equipname,
                                    `sensors`.`name` as sensname,
                                    `sensors`.`alarm` as alarm,
                                    `sensors`.`maintenance` as maintenance, 
                                    `sensors`.`tuning` as tuning, 
                                    `senshistory`.`value` as value,  
                                    `senshistory`.`recdate` as lastupd,  
                                    TIME_TO_SEC(TIMEDIFF(".$startdate.",`senshistory`.`recdate`)) as timediff,
                                    `sensors`.`showonmain` as showonmain                                                                                                               
                                from `senshistory`
                                    inner join `sensors` on `senshistory`.`sens_id` = `sensors`.`id`
                                    inner join `equips` on `sensors`.`equip_id` = `equips`.`id`
                                    inner join `lines` on `equips`.`line_id` = `lines`.`id`
                                where
                                    (`senshistory`.`sens_id` = ".$line_sensors[$j]['id']." and `senshistory`.`recdate`<=".$startdate.")
                                order by `senshistory`.`recdate` desc limit 1";
                                $res = $mysqli->query($sql);
                                $ret[$i]['sensors'][$j] = self::getAssocData($res)[0];
                                $res->close();
                        }
                    }
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function calcEffParam($line_id, $mode){
            $db = self::dbconn();
            $tblname = "shiftreports";
            if($mode == 0)
                $auxcondition = " where `".$tblname."`.`shiftstop` BETWEEN (NOW() - INTERVAL 1 DAY) AND NOW() and `".$tblname."`.`shiftstop` is not null and `".$tblname."`.`line_id`='".$line_id."'";
            elseif($mode == 1)
                $auxcondition = " where `".$tblname."`.`shiftstop` BETWEEN (NOW() - INTERVAL 2 DAY) AND NOW() and `".$tblname."`.`shiftstop` is not null and `".$tblname."`.`line_id`='".$line_id."'";
            elseif($mode == 2)
                $auxcondition = " where `".$tblname."`.`shiftstop` BETWEEN (NOW() - INTERVAL 8 DAY) AND NOW() and `".$tblname."`.`shiftstop` is not null and `".$tblname."`.`line_id`='".$line_id."'";
            elseif($mode == 3)
                $auxcondition = " where `".$tblname."`.`shiftstop` BETWEEN (NOW() - INTERVAL 32 DAY) AND NOW() and `".$tblname."`.`shiftstop` is not null and `".$tblname."`.`line_id`='".$line_id."'"; 
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select
                            SUM(TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`shiftstop`,`".$tblname."`.`shiftstart`))) as plantime,
                            SUM(TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`linestop`,`".$tblname."`.`linestart`))) as operatetime,
                            SUM((TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`shiftstop`,`".$tblname."`.`shiftstart`)) - TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`linestop`,`".$tblname."`.`linestart`)))) as delay,
                            SUM((TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`linestop`,`".$tblname."`.`linestart`))/TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`shiftstop`,`".$tblname."`.`shiftstart`)))) as eff,
                            COUNT(`".$tblname."`.`shiftstart`) as records
                    from
                        `".$tblname."`".$auxcondition;
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function calcManEffParam($line_id, $startdate, $enddate){
            $db = self::dbconn();
            $tblname = "shiftreports";
            $auxcondition = " where `".$tblname."`.`shiftstop` BETWEEN '".$startdate."' AND '".$enddate."' and `".$tblname."`.`shiftstop` is not null and `".$tblname."`.`line_id`='".$line_id."'";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select
                            SUM(TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`shiftstop`,`".$tblname."`.`shiftstart`))) as plantime,
                            SUM(TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`linestop`,`".$tblname."`.`linestart`))) as operatetime,
                            SUM((TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`shiftstop`,`".$tblname."`.`shiftstart`)) - TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`linestop`,`".$tblname."`.`linestart`)))) as delay,
                            SUM((TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`linestop`,`".$tblname."`.`linestart`))/TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`shiftstop`,`".$tblname."`.`shiftstart`)))) as eff,
                            COUNT(`".$tblname."`.`shiftstart`) as records
                    from
                        `".$tblname."`".$auxcondition;
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getEffLine($line_id){
            $db = self::dbconn();
            $tblname = "shiftreports";
            $auxcondition = " where `".$tblname."`.`shiftstop` is not null and `".$tblname."`.`line_id`='".$line_id."'";
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                $sql = "select
                            (TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`linestop`,`".$tblname."`.`linestart`))/TIME_TO_SEC(TIMEDIFF(`".$tblname."`.`shiftstop`,`".$tblname."`.`shiftstart`))) as value,
                            `".$tblname."`.`shiftstop` as date
                    from
                        `".$tblname."`".$auxcondition." order by `".$tblname."`.`shiftstop` asc";
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getSensorTrendData($sensor_id){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $ret = [];
                    $sql = "select 
                        `sensors`.`id` as id,
                        `lines`.`id` as lineid,
                        `lines`.`linename` as linename,
                        `equips`.`equipname` as equipname,
                        `sensors`.`name` as sensname,
                        `sensors`.`alarm` as alarm                                                                                                              
                    from `sensors`
                        inner join `equips` on `sensors`.`equip_id` = `equips`.`id`
                        inner join `lines` on `equips`.`line_id` = `lines`.`id`
                    where
                        `sensors`.`id`=".$sensor_id;
                    $res = $mysqli->query($sql);
                    $ret['sensor'] = self::getAssocData($res);
                    $res->close();
                    $tblname = "senshistory";
                    $auxcondition = " where `".$tblname."`.`sens_id`='".$sensor_id."'";
                    $sql = "select
                            `".$tblname."`.`value` as value,
                            `".$tblname."`.`recdate` as date
                    from
                        `".$tblname."`".$auxcondition." order by `".$tblname."`.`recdate` asc";
                    $res = $mysqli->query($sql);
                    $ret['data'] = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

        public static function getFirstSelectors(){
            $db = self::dbconn();
            try{
                $mysqli = new mysqli($db['host'],$db['user'],$db['pwd'],$db['dbname']);
                if ($mysqli->connect_errno) {
                    return null;
                }
                else{
                    $ret = [];
                    $sql = "select 
                        `lines`.`id` as line_id,
                        `lines`.`linename` as linename,
                        `equips`.`id` as equip_id,
                        `equips`.`equipname` as equipname,                      
                        `sensors`.`id` as id,
                        `sensors`.`name` as sensname                                                                                                    
                    from `sensors`
                        inner join `equips` on `sensors`.`equip_id` = `equips`.`id`
                        inner join `lines` on `equips`.`line_id` = `lines`.`id`";
                    $res = $mysqli->query($sql);
                    $ret = self::getAssocData($res);
                    $res->close();
                    $mysqli->close();
                    return $ret;
                }
            } catch(mysqli_sql_exception $e){
                return null;
            }
        }

    }
?>