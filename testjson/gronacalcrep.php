<?php
	$ret = [];
	if(is_numeric($_GET["id"])){
		if(is_numeric($_GET["mode"])){
			$curId = $_GET["id"];
			$curMode = $_GET["mode"];

			switch ($curMode) {
			    case 0: // shift
			        $ret["totalsethours"] = 8.0;
			        break;
			    case 1: // day
			        $ret["totalsethours"] = 24.0;
			        break;
			    case 2: // week
			        $ret["totalsethours"] = 120.0;
			        break;
			    case 3: // month
			        $ret["totalsethours"] = 500.0;
			        break;
			}
			
			$ret["totalsetcounts"] = $_GET["id"]*100 + 2000; // !!! ../hour
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