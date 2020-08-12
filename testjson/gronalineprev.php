<?php

	$ret = [];
	$names = ["Frich 1", "Поточная линия 2", "Поточная линия 3", "Поточная линия 4", "Поточная линия 5", "Поточная линия 6", "Поточная линия 7"];
	$sensNames = ["Питание", "Готовность", "Запущено", "Авария", "В ремонте", "Наличие продукта", "Конвеер 1", "Конвеер 2", "Механизм 3",
					"Готовность приема", "Подача включена", "Механизм 4", "Задвижка 5", "Что-то другое", "Что-нибудь еще","И это тоже"];
	$subtr = 1;

	if(is_numeric($_GET["id"])){
		$ret['name'] = $names[$_GET["id"]-1];
		$ret['sensors'] = [];
		$sensCount = 12;
		if(isset($_GET["seldate"])){
			$seldate = new DateTime($_GET["seldate"]);
			for($i=0; $i<$sensCount; $i++){
				$ret['sensors'][$i] = array(
					"sensid" => $i + 1,
					"sensname" => $sensNames[$i],
					"sensval" => rand(0,50)%2,
					"sensalm" => ($i==3) ? 1 : 0,
					"sensmaint" => ($i==4) ? 1 : 0,
					"lastupd" =>$seldate->sub(new DateInterval("PT{$subtr}H"))->format('Y-m-d H:i:s'),
					"lastper" => 3600 * ($i + 1)
				);
			}
		}
	}

	echo json_encode($ret);
?>