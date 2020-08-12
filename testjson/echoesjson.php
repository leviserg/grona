<?php
	$data = [];
	$data[0] = array("id" =>1, "quantity" =>4, "name" => "boots");
	$data[1] = array("id" =>2, "quantity" =>3, "name" => "cars");
	$data[2] = array("id" =>3, "quantity" =>2, "name" => "toys");
	$data[3] = array("id" =>4, "quantity" =>5, "name" => "suits");		
	echo json_encode($data);
?>