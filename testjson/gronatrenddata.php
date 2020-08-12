<?php

	$ret = [];
	$subtr = 8;
	if(is_numeric($_GET["id"])){
		$datacount = 500 + $_GET["id"]*50;
		$seldate = new DateTime();
		$sumtr = $subtr * $datacount;
		$date = $seldate->sub(new DateInterval("PT{$sumtr}H"));
		for($i=0; $i<$datacount; $i++){
			$ret[$i] = array(
				"value" => round(mt_rand(65,99)/100,3),
				"date" => $date->add(new DateInterval("PT{$subtr}H"))->format('Y-m-d H:i:s')
			);
		}
	}
	echo json_encode($ret);
?>