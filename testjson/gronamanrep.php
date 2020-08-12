<?php
	$ret = [];
	if(is_numeric($_GET["id"])){
		if(isset($_GET["startdate"], $_GET["enddate"])){
			$startdate = new DateTime($_GET["startdate"]);
			$enddate = new DateTime($_GET["enddate"]);
			$interval = $startdate->diff($enddate);

			if($interval->format('%a') > 0){
				$hour1 = $interval->format('%a')*24;
			}
			if($interval->format('%h') > 0){
				$hour2 = $interval->format('%h');
			}

			$hours = $hour1 + $hour2;

			$ret["totalsethours"] = $hours;
			$ret["totalsetcounts"] = 2250; // !!! ../hour
			$ret["pausehours"] = round($ret["totalsethours"] * (mt_rand(5, 20)/100),2);
			$ret["totalgetcounts"] = round($ret["totalsetcounts"]*(mt_rand(80, 99)/100)*($ret["totalsethours"] - $ret["pausehours"]));
			$ret["qualgetcounts"] = round($ret["totalgetcounts"] * (mt_rand(80, 99)/100));

			$ret["avail"] = round(($ret["totalsethours"] - $ret["pausehours"])/$ret["totalsethours"],3);
			$ret["prod"] = round(($ret["totalgetcounts"]/($ret["totalsethours"] - $ret["pausehours"]))/$ret["totalsetcounts"],3);
			$ret["qual"] = round($ret["qualgetcounts"] / $ret["totalgetcounts"],3);

			$ret["oeeres"] = round($ret["avail"] * $ret["prod"] * $ret["qual"],3);
			
		}
	}

	echo json_encode($ret);

?>