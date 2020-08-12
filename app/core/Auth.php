<?php
    session_start();
    $authdata = require '../config/admin.php';

    if(!empty($_POST)){
        $postdata = [
            'login' => $_POST['login'],
            'password' => $_POST['pwd']
        ];
        foreach ($authdata as $account) {
            if($postdata['login']==$account['login'] && $postdata['password']==$account['password']){
                $_SESSION['admin'] = $postdata['login'];
                $url = 'home';
                header('location: /'.$url);
                die();
            }
        }
        $_SESSION['admin'] = '';
        $url = 'login';
        header('location: /'.$url);
        die();
    }
    exit;
?>