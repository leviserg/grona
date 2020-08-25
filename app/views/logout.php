<?php 
    namespace app\core;
	require 'app/core/Db.php';

	if(isset($_SESSION['user']) && count($_SESSION['user'])!=0){
		if(Db::logoutrecord($_SESSION['user']['rec_id'])){
			unset($_SESSION['user']);
		}
		else{
			die('Cannot update record');
		}
	}
	echo require 'login.php';
?>
