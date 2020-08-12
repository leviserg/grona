<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="cache-control" content="no-cache">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grona OEE</title>
    <!-- Styles -->
    <link href="public/css/app.css" rel="stylesheet">
    <link href="public/css/datatable.css" rel="stylesheet">
    <link href="public/css/sort.css" rel="stylesheet">
    <link href="public/css/bootstrap.css" rel="stylesheet">
    <link href="public/css/font-awesome.css" rel="stylesheet">
    <link href="public/css/favicon.ico" rel="shortcut icon">
    <link href="public/amcharts/style.css" rel="stylesheet">
    <link href="public/amcharts/export.css" rel="stylesheet">
    <link href="public/css/appstyles.css" rel="stylesheet">
    <!-- Scripts -->
    <script src="public/js/source/html5shiv.js"></script>
    <script src="public/js/source/response.js"></script>
</head>
<body>
    <nav class="navbar navbar-expand-md bg-info navbar-dark">
        <a class="navbar-brand" href="home" data-toggle="tooltip" title="Домой"><i class="fa fa-home mx-2"></i></a>
        <button class="navbar-toggler navbar-toggler-right" type="button"
            data-toggle="collapse" data-target="#navbarResponsive"
            aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <i class="fa fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse justify-content-between" id="navbarResponsive">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link mx-2 px-2" href="alarms" data-toggle="tooltip" title="Аварии"><i class="fa fa-bell mx-2"></i>Аварии</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mx-2 px-2" href="events" data-toggle="tooltip" title="События"><i class="fa fa-list mx-2"></i>События</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mx-2 px-2" href="reports" data-toggle="tooltip" title="Отчеты"><i class="fa fa-file-text mx-2"></i>Отчеты</a>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <?php if (!isset($_SESSION['admin']) || strlen($_SESSION['admin'])==0): ?>
                    <li class="nav-item">
                        <a class="nav-link mr-2" id="loginbtn" data-toggle="tooltip" title="System Login" href="login">Вход</a>
                    </li>
                    <p id="session" style="display:none">0</p>
                <?php else: ?>
                    <li class="nav-item">
                        <span class="nav-link">Вы: <?php echo $_SESSION['admin']?></span>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="logoutnbtn" data-toggle="tooltip" title="System Logout" href="logout">Выход</a>
                    </li>
                    <p id="session" style="display:none">1</p>
                <?php endif; ?>
                <li class="nav-item active">
                    <span class="nav-link" id="curtime"></span>
                </li>
            </ul>
        </div>
    </nav>
    <div class="container-fluid" style="width:97%">

        <script src="public/js/source/jquery.js"></script>
        <script src="public/js/source/jquery.xdomainrequest.min.js"></script>
        <script src="public/js/source/popper.js"></script> 
        <script src="public/js/source/jqueryDataTables.js" defer ></script>
        <script src="public/js/source/bootstrap.js"></script>
        <script src="public/js/source/sweetalert.js"></script>
        <script src="public/js/source/moment.js"></script>
        <script src="public/js/source/datatable.js"></script>
        <script src="public/js/source/jlinq.js"></script>

        <script src="public/amcharts/amcharts.js"></script>
        <script src="public/amcharts/serial.js"></script>
        <script src="public/amcharts/amstock.js"></script>
        <script src="public/amcharts/export.js"></script>
        <?php
            if (!isset($_SESSION['admin']) || strlen($_SESSION['admin'])==0)
                require "app/views/login.php";
            else
                echo $content;
        ?>
    </div>
    <div class="bg-info almstrip">
        <p>Активных аварий 
            <a class="text-white" href="alarms">
                <b><span id="actsum">...</span></b>
            </a> 
        </p>
    </div>

    <a href="#" class="scrollup"></a>

    <div class="mt-5 modal fade modal-fade" id="showhist" tabindex="2">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header mb-0 mt-0">
                    <h5 class="modal-title">Дата и время</h5>
                    <button class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        <div class="form-group">
                            <label for="dpicker" class="small">Выберите дату:</label>
                            <input class="form-control mx-2 text-center" type="text" id="dpicker" placeholder="гггг-мм-дд" maxlength="10"/>
                        </div>
                        <div class="form-group mt-1">
                            <label for="tpicker" class="small">Укажите время:</label>
                            <input class="form-control mx-2 text-center" type="text" id="tpicker" placeholder="чч:мм:сс" maxlength="8"/>
                        </div>
                        <hr/>
                        <input class="btn btn-info mt-1 mb-2 ml-2" id="goto" style="width:45%" type="button" value="Перейти">
                        <button class="btn btn-outline-info mt-1 mb-2 ml-2" style="width:45%" type="button" data-dismiss="modal" aria-label="Close">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-5 modal fade modal-fade" id="repdates" tabindex="2">
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header mb-0 mt-0">
                    <h5 class="modal-title">Дата и время</h5>
                    <button class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        <div class="form-group row">
                            <label for="dstpicker" class="col-sm-6 small">Выберите дату (начало):</label>
                            <input class="form-control col-sm-5 mx-2 text-center" type="text" id="dstpicker" placeholder="гггг-мм-дд" maxlength="10"/>
                        </div>
                        <div class="form-group row mt-1">
                            <label for="tstpicker" class="col-sm-6 small">Укажите время (начало):</label>
                            <input class="form-control col-sm-5 mx-2 text-center" type="text" id="tstpicker" placeholder="чч:мм:сс" maxlength="8"/>
                        </div>
                        <hr/>
                        <div class="form-group row mt-1">
                            <label for="dfnpicker" class="col-sm-6 small">Выберите дату (конец):</label>
                            <input class="form-control col-sm-5 mx-2 text-center" type="text" id="dfnpicker" placeholder="гггг-мм-дд" maxlength="10"/>
                        </div>
                        <div class="form-group row mt-1">
                            <label for="tfnpicker" class="col-sm-6 small">Укажите время (конец):</label>
                            <input class="form-control col-sm-5 mx-2 text-center" type="text" id="tfnpicker" placeholder="чч:мм:сс" maxlength="8"/>
                        </div>
                        <hr/>
                        <input class="btn btn-info mt-1 mb-2 ml-2" id="getrep" style="width:45%" type="button" value="Перейти">
                        <button class="btn btn-outline-info mt-1 mb-2 ml-2" style="width:45%" type="button" data-dismiss="modal" aria-label="Close">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="public/js/develop/appscripts.js"></script>
</body>
</html>