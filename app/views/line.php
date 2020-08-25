<div class="mt-3"></div>
<span style="display:none" id="lineId"><?php echo $id; ?></span>
<!--
<div class="row pt-1 pb-0 my-0">
    <div class="col-md-12 text-center"><h4 class="text-info" id="lineName"></h4></div>
</div>
-->
<div class="row">
    <div class="col-lg-5">
        <div class="card px-0 mx-0 pb-0 mb-0">
            <div class="card card-header text-justify pb-1 pt-2">
                <div class="row my-0 py-0">
                    <a class="btn btn-sm btn-outline-info border-0" href="home" data-toggle="tooltip" title="Назад"><i class="fa fa-home mx-1 pt-2"></i></a>
                    <h6 class="text-info ml-auto mr-auto mt-2">Датчики</h6>
                    <div class="text-right ml-auto mr-1 pr-1">
                        <span class="text-sm text-info align-middle mr-2" id="sshprdt">Отображать данные</span>
                        <div class="btn-group btn-group-justify pt-1 pb-1 my-0" role="group" aria-label="no">
                            <button type="button" class="btn btn-sm btn-outline-info" style="width: 100px" id="sshprd">Предыдущие</button>
                            <button type="button" class="btn btn-sm btn-info" style="width: 100px" id="sshcrd">Текущие</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card card-body pt-0 pb-1 mb-0">
                <table class="table table-sm table-responsive table-hover row-border pb-0 mb-0" style="width:100%; font-size:0.9em"><!-- table-bordered stripe-->
                    <thead>
                        <tr class="small">
                            <th class="fit"></th>
                            <th class="col-2 text-left text-info">Оборудование</th>
                            <th class="col-1 text-center text-info">Название</th>
                            <th class="fit text-center text-info">Статус</th>
                            <th class="col-2 text-center text-info">Время изменения</th>
                            <th class="fit text-center text-info">Длительность</th>
                        </tr>
                    </thead>
                    <tbody id="senstable" class="mb-0 pb-0">      
                    </tbody>
                </table>            
            </div>
        </div>   
    </div>
    <div class="col-lg-7">
        <div class="row">
            <div class="col-md-8 card card-body bg-light">
                <div id="chartdiv" class="py-1 px-1" style="height:320px; width:100%"></div>
            </div>
            <div class="col-md-4">
                <div class="card" style="height:100%">
                    <div class="card card-header text-center pt-2 pb-1">
                        <h6 class="text-info">Эффективность времени</h6>
                    </div>
                    <div class="card card-body py-0">
                        <div class="form-group row mt-3 pt-4 mb-2">
                            <label for="rep" class="col-sm-5 col-form-label text-info text-left">Рассчитать за </label>
                            <div class="col-sm-7">
                                <select class="form-control form-control-md mb-2 text-center text-info" name="rep" id="rep">
                                    <option value="0" selected="selected">смену</option>
                                    <option value="1">сутки</option>
                                    <option value="2">неделю</option>
                                    <option value="3">месяц</option>
                                    <option value="4">задать вручную</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12 pl-2 text-center">
                                <span class="text-muted small"><small id="from">.</small></span>
                                <span class="text-muted small"><small id="to">.</small></span>
                            </div>
                        </div>
                        <div class="row pt-4">
                            <div class="col-sm-12 mr-auto ml-auto px-2">
                                <table class="table table-sm" style="width:100%">
                                    <tr>
                                        <td class="text-left">Всего время смены</td>
                                        <td class="text-right" id="plantime"></td>
                                    </tr>
                                    <tr>
                                        <td class="text-left">Всего время работы</td>
                                        <td class="text-right" id="operatetime"></td>
                                    </tr>
                                    <tr>
                                        <td class="text-left">Всего простоя</td>
                                        <td class="text-right" id="delaytime"></td>
                                    </tr>
                                        <td class="text-left">Эффективность</td>
                                        <td class="text-right" id="eff"></td>
                                    </tr>
                                    </tr><td></td><td></td></tr>                               
                                </table>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
        <div class="row mt-3 pt-2">
            <div class="col-md-12">
                <table class="table table-sm row-border hover display compact pretty pt-3 mb-3" cellpadding="0" cellspacing="0" style="width:100%; font-size:0.84em" id="data-table" data-page-length='10'><!-- table-bordered stripe-->
                    <thead>
                        <tr class="text-center">
                            <th class="fit">ID</th>
                            <th class="col-1">Начало смены</th>
                            <th class="col-1">Конец смены</th>
                            <th class="fit">Время простоя</th>
                            <th class="col-1">Тип останова</th>
                            <th class="fit">Причина</th>
                            <th class="fit">Завершил</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </div>
</div>

<script src="public/js/develop/linescripts.js"></script>