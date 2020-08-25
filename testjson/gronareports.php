<?php
    namespace app\core;
	require '../app/core/Db.php';
	use DateTime;
	use DateInterval;

	$ret = [];
	$names = ["Frich 1", "Поточная линия 2", "Поточная линия 3", "Поточная линия 4", "Поточная линия 5", "Поточная линия 6", "Поточная линия 7"];
	$users = Db::getusers('login');
	$subtr = 8; // hour
	$reports = 280;
	$sumtr = $subtr * $reports;
	$curdate = new DateTime();
	$date = $curdate->sub(new DateInterval("PT".$sumtr."H"));

	if(isset($_GET['id'])){
		// for line page
		for($i=0; $i<intval($reports/count($names)); $i++){
			$created = $date->add(new DateInterval("PT".$subtr."H"));
			$_date = new DateTime($created->format('Y-m-d H:i:s'));
			$startdate = $_date->sub(new DateInterval("PT".(420 + mt_rand(0,55))."M"));
			$_date = new DateTime($created->format('Y-m-d H:i:s'));
			$stopdate = $_date->sub(new DateInterval("PT".mt_rand(0,15)."M"));
			$delay = $stopdate->getTimestamp() - $startdate->getTimestamp();
			$type = '';
			$reason = '';
			($i%5 == 0) ? $type = "Авария" : $type = "План";
			($i%5 == 0) ? $reason = "Аварийн причина" : $reason = "Какая-то причина останова";
			$ret[$i] = array(
				"id" =>$i + 1,
				"created" => $created->format('Y-m-d H:i:s'),
				"startdate" => $startdate->format('Y-m-d H:i:s'),
				"stopdate" => $stopdate->format('Y-m-d H:i:s'),
				"delay" => $delay,
				"stoptype" => $type,
				"reason" => $reason,
			);
		}
	}
	else{
		// for reports page
		for($i=0; $i<$reports; $i++){
			$line = $i%2 + 1;
			$created = $date->add(new DateInterval("PT".$subtr."H"));
			$_date = new DateTime($created->format('Y-m-d H:i:s'));
			$shiftstart = $_date->sub(new DateInterval("PT".(480)."M")); // 8 hr	
			$_date = new DateTime($created->format('Y-m-d H:i:s'));
			$linestart = $_date->sub(new DateInterval("PT".(420 + mt_rand(30,55))."M"));
			$_date = new DateTime($created->format('Y-m-d H:i:s'));
			$linestop = $_date->sub(new DateInterval("PT".mt_rand(10,25)."M"));
			$_date = new DateTime($created->format('Y-m-d H:i:s'));
			$shiftstop = $_date->sub(new DateInterval("PT".mt_rand(0,9)."M"));			
			($i%4==0) ? $alm = 1 : $alm = 2;
			Db::seedreportrecord($i%2 + 1,$shiftstart->format('Y-m-d H:i:s'),$linestart->format('Y-m-d H:i:s'),$linestop->format('Y-m-d H:i:s'),$shiftstop->format('Y-m-d H:i:s'),$alm);
		}
	}

	echo json_encode(["data"=>$ret]);

?>