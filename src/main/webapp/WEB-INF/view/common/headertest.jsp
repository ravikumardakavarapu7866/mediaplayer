<header id="main-header">
	<div class="container-fluid">
		<div class="row header-margin" style="position: relative; z-index:99">
		<div class="col-lg-5 col-sm-5 menu-icontest home-link" style="cursor: default;">
		<span style="cursor:pointer;" class="wui-side-menu-trigger me-2" style="color:#fff;"><i class="material-icons">menu</i></span>
		Welcome&nbsp;${userEmail}</div>
		
		

			<div class="col-lg-2 col-sm-2" style="text-align: center;padding-top:10px;">
				<a onclick="javascript:submitFormAction('${baseurl}/home')">
				 <span><img src="images/Suresby1.png" alt="" class="header-logo"></span></a>
			</div>


			<div class="col-lg-5 col-sm-5">
				<div class="header-right">
					${menuItems}
					<span class="home-link" style="padding-left: 5px;cursor: default;font-weight:400;">${buildTime}</span>
				</div>

			</div>



		</div>

	</div>
</header>

<div id="loadingDiv">
	<div id="loadingContentDiv"></div>
</div>
<input type="hidden" id="baseurl" value="${baseurl}" />
