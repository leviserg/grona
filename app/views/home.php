<div class="mt-4">
    <div class="row">
        <div class="col-md-8 text-muted">
            <div class="card">
                <div class="card card-header py-0">
                    <ul class="list-inline mt-1 pt-1">
                        <li class="list-inline-item pl-0">
                            <img src="public/images/off.png" style="width:20px; height:20px">
                            <span class="pr-1"><small>- отключена</small></span>
                        </li>
                        <li class="list-inline-item pl-4">
                            <img src="public/images/pow.png" style="width:20px; height:20px">
                            <span class="pr-1"><small>- подано питание</small></span>
                        </li>
                        <li class="list-inline-item pl-4">
                            <img src="public/images/ready.png" style="width:20px; height:20px">
                            <span class="pr-1"><small>- готовность</small></span>
                        </li>
                        <li class="list-inline-item pl-4">
                            <img src="public/images/on_0.png" style="width:20px; height:20px">
                            <span class="pr-1"><small>- работа без продукта</small></span>
                        </li>
                        <li class="list-inline-item pl-4">
                            <img src="public/images/on_1.png" style="width:20px; height:20px">
                            <span class="pr-1"><small>- работа с продуктом</small></span>
                        </li> 
                        <li class="list-inline-item pl-4">
                            <img src="public/images/alm.png" style="width:20px; height:20px">
                            <span class="pr-1"><small>- авария</small></span>
                        </li>
                        <li class="list-inline-item pl-4">
                            <img src="public/images/maint.png" style="width:20px; height:20px">
                            <span class="pr-1"><small>- ремонт</small></span>
                        </li>                                                      
                    </ul>
                </div>            
            </div>     
        </div>
        <div class="col-md-4 text-right mt-2">
            <span class="text-info align-middle mr-3" id="shprdt">Отображать данные</span>
            <div class="btn-group btn-group-justify" role="group" aria-label="no">
                <button type="button" class="btn btn-outline-info" style="width: 140px" id="shprd">Предыдущие</button>
                <button type="button" class="btn btn-info" style="width: 140px" id="shcrd">Текущие</button>
            </div>
        </div>
    </div>
</div>
<div class="card mt-4">
    <div class="card card-header py-2">
        <h5 class="text-center text-info">Поточные линии</h5>
    </div>
    <div class="card card-body py-0">
        <table class="table table-hover row-border" style="width:100%"><!-- table-bordered stripe-->
            <thead>
                <tr>
                    <th class="fit"></th>
                    <th class="fit-wide text-left">Название</th>
                    <th class="fit-wide text-center">Статус</th>
                    <th class="fit-wide text-center">Время</th>
                    <th class="fit-wide text-center">Длительность</th>
                    <th class="fit-wide text-center">Эффективность смены</th>
                </tr>
            </thead>
            <tbody id="hometable" class="mb-0 pb-0">        
            </tbody>
        </table>
    </div>
</div>
<script src="public/js/develop/homepage.js"></script>