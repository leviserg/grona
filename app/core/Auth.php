<?php
    namespace app\core;
    require 'Db.php';
    session_start();
    $authdata = Db::getusers();

    if(!empty($_POST)){
        $postdata = [
            'login' => $_POST['login'],
            'password' => $_POST['pwd']
        ];
        foreach ($authdata as $account) {
            if($postdata['login']==$account['login'] && $postdata['password']==$account['password']){
                $rec_id = Db::loginrecord($account['id']);
                if(!is_null($rec_id)){
                    $_SESSION['user'] = [
                        'id'        =>  intval($account['id']),
                        'login'     =>  $account['login'],
                        'line'      =>  intval($account['line']),
                        'adm'       =>  intval($account['adm']),
                        'editreport'   =>  intval($account['editreport']),
                        'rec_id'    =>  intval($rec_id)
                    ];
                    $url = 'home';
                    header('location: /'.$url);
                    die();
                }
                else{
                    unset($_SESSION['user']);
                    die('Cannot insert record. Please try again');
                }
            }
        }
        $_SESSION['user'] = [];
        $url = 'login';
        header('location: /'.$url);
        die();
    }
    exit;
?>