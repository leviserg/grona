<br/>
<div class="row mt-4 mr-auto ml-auto d-flex justify-content-center">
		<div style="width:400px;">
			<div class="card card-login">
				<div class="card-header">Форма входа</div>
				<div class="card-body">
                    <?php
                        if(strlen($vars['wr'])!=0)
                            echo '<p class="text-danger">'.$vars['wr'].'</p>';
                    ?>
					<form action="app/core/Auth.php" method="post">
						<div class="form-group">
							<label for="name">Логин</label>
							<input class="form-control text-center" type="text" name="login" id="name">
						</div>
						<div class="form-group">
							<label for="pwd">Пароль</label>
							<input class="form-control text-center" type="password" name="pwd" id="pwd">
						</div>
						<button type="submit" class="btn btn-primary btn-block">Войти</button>
						<hr/>
					</form>
					<a class="btn btn-success btn-block" href="home">Назад</a>
					<ul class="mt-4 small font-italic text-muted">
						<li><small>Пароль пользователя такой же, как и логин (пока)</small></li>
						<small>------------------------</small>
						<li><small>oper_1 - разрешено редактировать отчеты линии 1</small></li>
						<li><small>oper_2 - разрешено редактировать отчеты линии 2</small></li>
						<li><small>main, eleng - разрешено редактировать отчеты линий 1 и 2, просмотр истории входа пользователей</small></li>
						<li><small>ceo - только просмотр отчетов линий, просмотр истории входа пользователей</small></li>
					</ul>
				</div>
			</div>
		</div>
</div>