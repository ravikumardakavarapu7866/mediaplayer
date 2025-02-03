<%@ taglib uri="tags/customtag.tld" prefix="ct"%>
<!DOCTYPE html>
<html lang="en">
<head>
<jsp:include page="common/top.jsp"></jsp:include>
</head>

<body>

	<jsp:include page="common/headertest.jsp"></jsp:include>

	<div class="container-fluid margin-Topbottom">

		<div class="wui-side-menu open pinned" data-wui-theme="dark">
			<div class="wui-side-menu-header menu-menu">
				<span style="cursor:pointer;" class="wui-side-menu-trigger d-none"><i class="material-icons">menu</i></span> <a href="#" class="wui-side-menu-pin-trigger d-none"> <i class="material-icons ">push_pin</i>
				</a>
			</div>

			<div class="wui-content-main">
				<div class="ms-2">
					<span class="errorMessage  mb-1" id="p_errorMsg"> ${errorMessage}</span> 
					<input type="hidden" id="userEmail" value="${userEmail}" /> 				
					<span id="msgSpan" style="color:red; font-size: 15px;"></span>
				</div>
			</div>
			<div class="wui-side-menu-items">
				<div class="ms-2 mb-2">
					<label for="showWatermark" class="form-label">Show Watermark<span class="req-field">*</span>
					</label>
					<div class="">
						<input type="radio" name="showWatermark" value="0" checked />&nbsp;No <input type="radio" name="showWatermark" value="1" />&nbsp;Yes <input type="radio" name="showWatermark" value="2" />&nbsp;OriginalVideo
					</div>
				</div>
				<div class="ms-2 mb-2">
					<label for="sessiontimeout" class="form-label">Session Timeout (min)<span class="req-field">*</span>
					</label>

					<div class="">
						<input type="text" id="sessiontimeout" style="width:95%;" placeholder="Enter value in mins" value="10" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" autocomplete="off" name="sessiontimeout" />
					</div>
				</div>
				<div class="ms-2 mb-2">
					<label for="sessionincrement" class="form-label">Session-increment<span class="req-field">*</span>
					</label>
					<div class="">
						<input type="radio" name="sessionincrement" value="0" />&nbsp;No <input type="radio" name="sessionincrement" value="1" checked />&nbsp;Yes
					</div>
				</div>
				<div class="ms-2 mb-2">
					<label for="providerId" class="form-label">Provider Name<span class="req-field">*</span>
					</label>

					<ct:dataSelect height="350" placeHolder="Select Provider" dataSource="${providersSelect}" onchangeFunction="homeProviderChange(this)" valueField="id" textField="providerName" id="selectProvider" name="selectProvider" maxLength="25">

					</ct:dataSelect>

				</div>
				<div class="ms-2 mb-2">
					<label for="videoMasterId" class="form-label">Video Name<span class="req-field">*</span>
					</label>
					
					<div id="videosDiv">
						<ct:dataSelect height="350" additionalField="userToken" placeHolder="Select Video" dataSource="${videoSelecItems}" onchangeFunction="homeVideoChange(this)" valueField="id" textField="label"  id="selectVideo" name="selectVideo" maxLength="25">

						</ct:dataSelect>
					</div>
				</div>
				<div class="mt-2" style="text-align:right;margin-right: 13px;">
					<button type="button" class="play-btn me-1" onclick="javascript:submitTestAction('${baseurl}/play')">Play</button>
				</div>

			</div>
		</div>
		
		<div class="wui-content menu-menu">
		    <div id="hasVideosDiv" style="color:red; font-size: 25px;font-weight:bold;" >${hasVideos}</div>
			<div id="videoMoviesDiv">${videoMovies}</div>
			<div id="videoSeriesDiv">${videoSeries}</div>
		</div>

		<div class="wui-overlay"></div>

	</div>

	<script>
		$(document).ready(function() {
			setTestPage();
		});

		/* Kristuff.WebUI.SideMenu */
		(function(window, undefined) {
			'use strict';
			// responsive pinnable sidemenu component
			var sideMenu = function(el) {
				var htmlSideMenu = el, htmlSideMenuPinTrigger = {}, htmlSideMenuPinTriggerImage = {}, htmlOverlay = {};
				var init = function() {
					htmlSideMenuPinTrigger = el.querySelector('.wui-side-menu-pin-trigger');
					htmlSideMenuPinTriggerImage = htmlSideMenuPinTrigger.querySelector('i.fa');
					htmlOverlay = document.querySelector('.wui-overlay');
					Array.prototype.forEach.call(document.querySelectorAll('.wui-side-menu-trigger'), function(elmt, i) {
						elmt.addEventListener('click', function(e) {
							e.preventDefault();
							toggleMenuState();
						}, false);
					});
					htmlSideMenuPinTrigger.addEventListener('click', function(e) {
						e.preventDefault();
						toggleMenuPinState();
					}, false);
					htmlOverlay.addEventListener("click", function(e) {
						htmlSideMenu.classList.remove('open');
					}, false);
					window.addEventListener("resize", checkIfNeedToCloseMenu, false);
					checkIfNeedToCloseMenu();
				};
				var toggleMenuState = function() {
					htmlSideMenu.classList.toggle('open');
					menuStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('open'));
				};
				var toggleMenuPinState = function() {
					htmlSideMenu.classList.toggle('pinned');
					htmlSideMenuPinTriggerImage.classList.toggle('fa-rotate-90');
					if (htmlSideMenu.classList.contains('pinned') !== true) {
						htmlSideMenu.classList.remove('open');
					}
					menuPinStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('pinned'));
				};
				var checkIfNeedToCloseMenu = function() {
					var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
					if (width <= 767 && htmlSideMenu.classList.contains('open') === true) {
						htmlSideMenu.classList.remove('open');
						menuStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('open'));
					}
					if (width > 767 && htmlSideMenu.classList.contains('pinned') === false) {
						htmlSideMenu.classList.remove('open');
						menuStateChanged(htmlSideMenu, htmlSideMenu.classList.contains('open'));
					}
				};
				var menuStateChanged = function(element, state) {
					var evt = new CustomEvent('menuStateChanged', {
						detail : {
							open : state
						}
					});
					element.dispatchEvent(evt);
					if(state == true){
						sessionStorage.setItem("session-menu",true);						
					}else{
						sessionStorage.setItem("session-menu",false);	
					}
				};
				var menuPinStateChanged = function(element, state) {
					var evt = new CustomEvent('menuPinStateChanged', {
						detail : {
							pinned : state
						}
					});
					element.dispatchEvent(evt);
				};
				init();
				return {
					htmlElement : htmlSideMenu,
					toggleMenuState : toggleMenuState,
					toggleMenuPinState : toggleMenuPinState
				};
			};

			window.SideMenu = sideMenu;
		})(window);

		var documentReady = function(fn) {
			if (document.readyState != 'loading') {
				fn();
			} else {
				document.addEventListener('DOMContentLoaded', fn);
			}
		};

		documentReady(function() {
			var sample = new SideMenu(document.querySelector('.wui-side-menu'))
			sample.htmlElement.addEventListener('menuPinStateChanged', function(e) {
				document.querySelector('#events').innerHTML += 'menuPinStateChanged , menu pinned? => ' + e.detail.pinned + '<br>';
			}, false);
		});

		document.onclick = function(e) {
			//debugger;
			var obj = e.target;
			//console.log(obj);

			var id = obj.getAttribute("id");

			var process = true;
			//console.log(id)
			if (id != null && id == "selectProviderSelectDiv") {
				process = false;
				hideSelect("selectVideodropdownDiv");
			}

			if (id != null && id == "selectVideoSelectDiv") {
				process = false;
				hideSelect("selectProviderdropdownDiv");
			}

			if (process) {
				//console.log("outside");
				hideSelect("selectProviderdropdownDiv");
				hideSelect("selectVideodropdownDiv");
			}

		};
	</script>
</body>
</html>


