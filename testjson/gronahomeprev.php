<?php
	$ret = [];
	$names = ["Frich 1", "Поточная линия 2", "Поточная линия 3", "Поточная линия 4", "Поточная линия 5", "Поточная линия 6", "Поточная линия 7"];
	$statuses = [0,1,2,4,8,16,32]; // 1-alarm, 2-powerOn, 4-ready, 8-maintenance, 16-run-prod, 32-run+prod, 0-powerOff
	$subtr = 29; // min
	if(isset($_GET["seldate"])){
		$seldate = new DateTime($_GET["seldate"]);
		for($i=0; $i<count($names); $i++){
			$ret[$i] = array(
				"id" =>$i + 1,
				"name" => $names[$i],
				"status" => $statuses[mt_rand(0,6)],
				"lastupd" => $seldate->sub(new DateInterval("PT".$subtr."M"))->format('Y-m-d H:i:s'),
				"lastper" => $subtr * 60 * ($i + 1),
				"eff" => round(mt_rand(600, 999)/1000,3)
			);
		}
	}
	echo json_encode($ret);
?>