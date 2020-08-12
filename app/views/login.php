<br/>
<div class="row mt-4 mr-auto ml-auto d-flex justify-content-center">
		<div style="width:400px;">
			<div class="card card-login">
				<div class="card-header">Форма входа <small><i>( admin admin || user user )</i></small></div>
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
				</div>
			</div>
		</div>
</div>