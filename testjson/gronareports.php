<?php
	$ret = [];
	$names = ["Frich 1", "Поточная линия 2", "Поточная линия 3", "Поточная линия 4", "Поточная линия 5", "Поточная линия 6", "Поточная линия 7"];
	$subtr = 8; // hour
	$reports = 280;
	$sumtr = $subtr * $reports;
	$curdate = new DateTime();
	$date = $curdate->sub(new DateInterval("PT".$sumtr."H"));

	if(isset($_GET['id'])){
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
		for($i=0; $i<$reports; $i++){
			$created = $date->add(new DateInterval("PT".$subtr."H"));
			$line = $names[$i%7];
			$_date = new DateTime($created->format('Y-m-d H:i:s'));
			$startdate = $_date->sub(new DateInterval("PT".(420 + mt_rand(0,55))."M"));
			$_date = new DateTime($created->format('Y-m-d H:i:s'));
			$stopdate = $_date->sub(new DateInterval("PT".mt_rand(0,15)."M"));
			$delay = $stopdate->getTimestamp() - $startdate->getTimestamp();
			$type = '';
			$reason = '';
			($i%5 == 0) ? $type = "Авария" : $type = "Планов останов";
			($i%5 == 0) ? $reason = "Авария" : $reason = "Какая-то причина останова";
			$edited = ($i%5 != 0);
			$ret[$i] = array(
				"id" =>$i + 1,
				"created" => $created->format('Y-m-d H:i:s'),
				"line" => $line,
				"startdate" => $startdate->format('Y-m-d H:i:s'),
				"stopdate" => $stopdate->format('Y-m-d H:i:s'),
				"delay" => $delay,
				"type" => $type,
				"reason" => $reason,
				"edited" => $edited
			);
		}
	}

	echo json_encode(["data"=>$ret]);

?>