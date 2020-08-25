<div class="container-fluid pt-4 mb-4" style="width:100%">
    <table class="table table-sm table-responsive row-border hover display compact pretty pt-3 mb-3" cellpadding="0" cellspacing="0" style="width:100%; font-size:0.84em" id="data-table" data-page-length='20'><!-- table-bordered stripe-->
        <thead>
            <tr class="text-center">
                <th class="fit">ID</th>
                <th class="col-1">Участок</th>
                <th class="col-1">Начало смены</th>
                <th class="col-1">Время пуска</th>
                <th class="col-1">Время останова</th>
                <th class="col-1">Конец смены</th>
                <th class="fit">Время простоя</th>
                <th class="fit">Эффективность</th>
                <th class="col-1">Тип останова</th>
                <th class="fit">Причина</th>
                <th>Комментарий</th>
                <th class="fit">Пользователь</th>
                <th class="col-1">Заполнено</th>
                <th class="fit">Правка</th>
            </tr>
        </thead>
    </table>
</div>

<div class="mt-5 modal fade modal-fade" id="showreportform" tabindex="2">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header mb-0 mt-0">
                <h5 class="modal-title">Завершение отчета <span id="reportid"></span></h5>
                <button class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container mb-2">
                    <div class="row mb-4">
                        <div class="col-4"><b id="linename"></b></div>
                        <div class="col-8"><span id="stoptime"></span></div>
                    </div>
                    <div class="form-group">
                        <label for="stoptype" class="control-label text-info">Тип останова</label>
                        <select class="form-control  mb-2" name="stoptype" id="stoptype"></select>
                        <label for="reason" class="control-label text-info">Причина останова</label>
                        <select class="form-control  mb-2" name="reason" id="reason"></select>
                        <label for="comment" class="control-label text-info">Комментарий</label>
                        <textarea class="form-control" id="comment" rows="1"></textarea>
                        <hr/>
                        <input class="btn btn-info pt-1 mr-2 pr-2" style="width:47%" id="savereport" type="submit" value="Сохранить">
                        <button class="btn btn-outline-info pt-1 ml-2 pl-2" style="width:47%" type="button" data-dismiss="modal" aria-label="Close">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="public/js/develop/reportscripts.js"></script>