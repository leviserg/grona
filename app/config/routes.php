<?php
	$pd = null; // parent directory
	return [
		$pd => [
			'view' => 'home'
		],
		$pd.'home' => [
			'view' => 'home'
		],
		$pd.'line_{id:\d+}' => [
			'view' => 'line',
			'id' => '{id}'
		],	
		$pd.'alarms' => [
			'view' => 'alarms'
		],
		$pd.'events' => [
			'view' => 'events'
		],
		$pd.'reports' => [
			'view' => 'reports'
		],
		$pd.'login' => [
			'view' => 'login'
		],
		$pd.'logout' => [
			'view' => 'logout'
		],
	];
?>