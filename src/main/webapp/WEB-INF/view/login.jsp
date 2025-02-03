<!DOCTYPE html>
<html lang="en">
<head>
<jsp:include page="common/top.jsp"></jsp:include>
</head>

<body>
	<header id="main-header">
		<div class="container-fluid">
			<div class="row header-margin">
				<div class="col-lg-5 home-link"></div>

				<div class="col-lg-2" style="text-align: center;"></div>

				<div class="col-lg-5 header-right">
					<div class="header-right">
						<%-- <span class="home-link" style="padding-left: 5px;cursor: default;">${buildTime}</span> --%>
					</div>
				</div>
			</div>
		</div>

		</div>
	</header>
	<div class="container-fluid padding-container margin-Topbottom">

		<div class="container">

			<div class="row justify-content-center">
				<div class="col-xxl-4 col-lg-5">

					<div class="login-card">


						<div class="pt-4 pb-1 text-center">
							<a href="javascript:void(0)"> <span><img src="images/Suresby.png" alt="" class="logo-auth"></span>
							</a>
						</div>

						<div class="p-4">
							<div class="text-center w-75 m-auto"></div>
							<div>
								<span class="errorMessage" id="p_errorMsg"> ${errorMessage}</span>
							</div>
							<form>

								<div class="mb-3 text-center">


									<label for="userEmail" class="form-label">User Email<span class="req-field">*</span>
									</label>
									<div>
										<input type="text" id="userEmail" name="userEmail" style="width: 100%;" autocomplete="off" maxlength="200"/>
									</div>
								</div>
								
								<div class="mb-3 text-center">

									<label for="password" class="form-label">Password<span class="req-field">*</span>
									</label>
									<div>
										<input type="password" id="userPassword" name="userPassword" style="width: 100%;" autocomplete="off" maxlength="100" />
									</div>
								</div>

								<div class="mb-3 pt-4 text-center">

									<button type="button" class="login-btn" onclick="javascript:submitLoginAction('${baseurl}/login')">Login</button>

								</div>

							</form>


						</div>
					</div>


				</div>
			</div>

		</div>

	</div>


</body>

<script>
	var loginButton = document.querySelector(".login-btn");

	document.addEventListener("keydown", function(event) {
		if (event.key === "Enter" && event.target !== loginButton) {
			loginButton.focus();
		}
	});
	
	document.addEventListener('DOMContentLoaded', function() {
	    sessionStorage.clear();
	});
</script>

</html>
