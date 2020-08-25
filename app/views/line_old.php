<div class="mt-3"></div>
<span style="display:none" id="lineId"><?php echo $id; ?></span>
<div class="pt-0 pb-2 text-info text-center">
    <h3><b id="lineName"></b></h3>
</div>
<div class="row">
    <div class="col-lg-4">
        <div class="card px-0 mx-0 pb-0 mb-0">
            <div class="card card-header text-justify pb-1 pt-1">
                <div class="row my-0 py-0">
                    <a class="btn btn-sm btn-outline-info border-0" href="home" data-toggle="tooltip" title="Назад"><i class="fa fa-home mx-1 pt-2"></i></a>
                    <h5 class="text-info ml-auto mr-auto mt-2">Датчики</h5>
                    <div class="text-right ml-auto mr-1 pr-1">
                        <span class="text-sm text-info align-middle mr-2" id="sshprdt">Отображать данные</span>
                        <div class="btn-group btn-group-justify pt-1 pb-1 my-0" role="group" aria-label="no">
                            <button type="button" class="btn btn-sm btn-outline-info" style="width: 100px" id="sshprd">Предыдущие</button>
                            <button type="button" class="btn btn-sm btn-info" style="width: 100px" id="sshcrd">Текущие</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card card-body py-0">
                <table class="table table-sm table-hover row-border pb-2 mb-2" style="width:100%"><!-- table-bordered stripe-->
                    <thead>
                        <tr>
                            <th class="fit"></th>
                            <th class="fit-wide text-left text-info pr-4"><small><b>Оборудование</b></small></th>
                            <th class="fit-wide text-left text-info pr-4"><small><b>Название</b></small></th>
                            <th class="fit text-center text-info"><small><b>Время изменения</b></small></th>
                            <th class="fit text-center text-info"><small><b>Статус</b></small></th>
                            <th class="fit text-center text-info"><small><b>Длительность</b></small></th>
                        </tr>
                    </thead>
                    <tbody id="senstable" class="mb-0 pb-0">      
                    </tbody>
                </table>            
            </div>
        </div>   
    </div>
    <div class="col-lg-4">
        <div class="card">
            <div class="card card-header text-justify pb-1 pt-1">
                <div class="row my-0 py-0">
                    <h5 class="text-info ml-auto mr-auto mt-2">Эффективность оборудования</h5>
                </div>
            </div>
            <div class="card card-body py-0">
                <div class="row my-2">
                    <div class="col-sm-12" id="chartdiv" style="height:360px"></div>
                </div>
                <hr class="my-1 py-1"/>
                <div class="form-group row mx-2 px-2 mt-3 mb-2">
                    <label for="rep" class="col-sm-4 col-form-label text-info text-right"><h5>Рассчитать за </h5></label>
                    <div class="col-sm-6">
                        <select class="form-control form-control-md mb-2 text-center text-info" name="rep" id="rep">
                            <option value="0" selected="selected">смену</option>
                            <option value="1">сутки</option>
                            <option value="2">неделю</option>
                            <option value="3">месяц</option>
                            <option value="4">задать вручную</option>
                        </select>
                    </div>
                    <div class="col-sm-2 pl-2">
                        <span class="text-muted small"><small id="from"></small></span>
                        <span class="text-muted small"><small id="to"></small></span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12 text-center">
                        <div class="text-info text-monospace mt-2">
                            <h5><b class="mr-1 text-md">Доступность</b> = 
                                (<span class="totalsethours"></span> ч. - <span class="pausehours"></span> ч.) / <span class="totalsethours"></span> ч. = <span class="avail"></span>
                            </h5>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12 text-center">
                        <div class="text-info text-monospace mt-2">
                            <h5><b class="mr-1 text-md">Производительность</b> = 
                                (<span class="totalgetcounts"></span> / (<span class="totalsethours"></span> ч. - <span class="pausehours"></span> ч.)) / <span class="totalsetcounts"></span> = <span class="prod"></span>
                            </h5>
                        </div>
                    </div>                
                </div>
                <div class="row">
                    <div class="col-sm-12 text-center">
                        <div class="text-info text-monospace mt-2">
                            <h5><b class="mr-1 text-md">Качество</b> = 
                                <span class="qualgetcounts"></span> / <span class="totalgetcounts"></span> = <span class="qual"></span>
                            </h5>
                        </div>
                    </div>                
                </div>
                <hr class="my-1 py-0"/>
                <div class="row pb-3">
                    <div class="col-sm-12 text-center">
                        <div class="text-info text-monospace mt-2">
                            <h5><b class="text-md">
                                    OEE = <span class="avail"></span> * <span class="prod"></span> * <span class="qual"></span> = <span class="oeeres"></span>
                                </b>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>     
    </div>
    <div class="col-lg-4">
        <div class="card px-0 mx-0">
            <div class="card card-header text-justify pb-1 pt-1">
                <div class="row my-0 py-0">
                    <h5 class="text-info ml-auto mr-auto mt-2">Отчеты</h5>
                </div>
            </div>
            <div class="card card-body py-0 px-0">
                <!-- <div class="pl-2 pr-1" style="overflow-y:auto;"> -->
                    <table class="table table-sm table-responsive row-border hover" style="height:656px;"><!-- table-bordered stripe-->
                        <thead style="position: sticky; top: 0; background-color:white; width:100%">
                            <tr>
                                <th class="fit"><small>Время пуска</small></th>
                                <th class="fit"><small>Время останова</small></th>
                                <th class="fit"><small>Простой</small></th>
                                <th class="fit"><small>Тип остан</small></th>
                                <th class="fit-wide"><small>Причина останова</small></th>
                            </tr>
                        </thead>
                        <tbody id="linetable" class="mb-0 pb-0" style="max-height:600px; overflow-y:auto;">      
                        </tbody>
                    </table>
                <!-- </div> -->
            </div>
        </div>     
    </div>
</div>

<script src="public/js/develop/linepage.js"></script>