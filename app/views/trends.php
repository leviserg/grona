<div class="row mt-3">
    <div class="col-lg-9">
        <div id="chartdiv_1" class="py-1 px-1" style="height:400px; width:100%"></div>
    </div>
    <div class="col-lg-3">
        <div class="card" style="height:100%">
            <div class="card card-header text-center pt-2 pb-1">
                <h6 class="text-info">Выбор графика</h6>
            </div>
            <div class="card card-body py-0">
                <div class="form-group form-inline mt-3 pt-4 mb-2">
                    <label for="tr_line_1" class="row-form-label text-info text-left">Выбрать линию </label>
                    <select class="form-control form-control-md mb-2 text-center text-info mr-0 ml-auto" name="tr_line_1" id="tr_line_1" style="width:50%">
                        <!--
                        <option value="1" selected="selected">Линия 1</option>
                        <option value="2">Линия 2</option>
                        -->
                    </select>
                    <label for="rep" class="row-form-label text-info text-left">Выбрать оборудование </label>
                    <select class="form-control form-control-md mb-2 text-center text-info mr-0 ml-auto" name="tr_equip_1" id="tr_equip_1" style="width:50%">
                        <!--
                        <option value="1" selected="selected">Машина 1</option>
                        <option value="2">Машина 2</option>
                        <option value="3">Машина 3</option>
                        <option value="4">Машина 4</option>
                        -->
                    </select>
                    <p for="sensorslist" class="row-form-label text-info text-left my-2">Выбрать датчик</p>
                    <div class="container ml-3" id="tr_sens_1">
                        <!--
                            <label class="checkcontainer">Имя датчика 1
                                <input type="radio" name="sensors_1" value="1" data-id="1">
                                <span class="checkmark"></span>
                            </label>
                            <label class="checkcontainer">Имя датчика 2
                                <input type="radio" name="sensors_1" value="2" data-id="2">
                                <span class="checkmark"></span>
                            </label>
                        -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row mt-3">
    <div class="col-lg-9">
        <div id="chartdiv_2" class="py-1 px-1" style="height:400px; width:100%"></div>
    </div>
    <div class="col-lg-3">
        <div class="card" style="height:100%">
            <div class="card card-header text-center pt-2 pb-1">
                <h6 class="text-info">Выбор графика</h6>
            </div>
            <div class="card card-body py-0">
                <div class="form-group form-inline mt-3 pt-4 mb-2">
                    <label for="tr_line_1" class="row-form-label text-info text-left">Выбрать линию </label>
                    <select class="form-control form-control-md mb-2 text-center text-info mr-0 ml-auto" name="tr_line_2" id="tr_line_2" style="width:50%">
                    </select>
                    <label for="rep" class="row-form-label text-info text-left">Выбрать оборудование </label>
                    <select class="form-control form-control-md mb-2 text-center text-info mr-0 ml-auto" name="tr_equip_2" id="tr_equip_2" style="width:50%">
                    </select>
                    <p for="sensorslist" class="control-label text-info my-2">Выбрать датчик</p>
                    <div class="container-fluid ml-3" id="tr_sens_2">
                    </div>
                </div>
            </div>
        </div>        
    </div>
</div>

<script src="public/js/develop/trendscripts.js"></script>