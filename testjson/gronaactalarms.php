<?php
	$ret = [];
	$names = ["Frich 1", "Поточная линия 2", "Поточная линия 3", "Поточная линия 4", "Поточная линия 5", "Поточная линия 6", "Поточная линия 7"];
	$subtr = 11; // min
	$alarms = 32;
	$sumtr = $subtr * $alarms;
	$seldate = new DateTime();
	$date = $seldate->sub(new DateInterval("PT".$sumtr."M"));
	$faults = 0;
	for($i=0; $i<$alarms; $i++){
		$alm = ($i%2 == 1) ? ["Аварийное отключение","Авария"] : ["Предупреждение","Предупреждение"];
		$ret[$i] = array(
			"id" =>$i + 1,
			"appeared" => $date->add(new DateInterval("PT".$subtr."M"))->format('Y-m-d H:i:s'),
			"line" => $names[$i%7],
			"descr" => $alm[0]." по датчику ".mt_rand(4, 12).". Механизм ".mt_rand(1, 5),
			"categ" => $alm[1]
		);
		if($i%2 == 1){
			$faults++;
		}
	}

	if(isset($_GET["sum"])){
		die(json_encode($faults));
	}
	echo json_encode(["data"=>$ret]);

?>