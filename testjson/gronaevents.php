<?php
	$ret = [];
	$names = ["Frich 1", "Поточная линия 2", "Поточная линия 3", "Поточная линия 4", "Поточная линия 5", "Поточная линия 6", "Поточная линия 7"];
	$subtr = 11; // min
	$events = 187;
	$sumtr = $subtr * $events;
	$seldate = new DateTime();
	$date = $seldate->sub(new DateInterval("PT".$sumtr."M"));
	for($i=0; $i<$events; $i++){
		$eventType = $i%3;
		if($eventType == 0){
			$event = ["Включен","Событие"];
		}
		elseif($eventType == 1){
			$event = ["Аварийное отключение","Авария"];
		}
		else{
			$event = ["Предупреждение","Предупреждение"];
		}
		$ret[$i] = array(
			"id" =>$i + 1,
			"appeared" => $date->add(new DateInterval("PT".$subtr."M"))->format('Y-m-d H:i:s'),
			"line" => $names[$i%7],
			"descr" => $event[0]." по датчику ".mt_rand(4, 12).". Механизм ".mt_rand(1, 5),
			"categ" => $event[1]
		);
	}

	echo json_encode(["data"=>$ret]);

?>