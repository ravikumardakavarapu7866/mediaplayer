function showVideo() {
	//debugger;
	var showWatermark = document.getElementById("showWatermark").value.trim();
	var playerUrl = document.getElementById("playerUrl").value.trim();
	var userToken = document.getElementById("userToken").value.trim();
	//for inputs validation
	var userInputs = {
		playerUrl: playerUrl,
		showWatermark: showWatermark
	};
	if (validateInputs(userInputs)) {
		if (showWatermark == "2") {
			displayOriginal(userToken);

		} else {
			displayPlayer(userToken);

		}
	} else {
		$('#videoPlayer').html("invalid inputs.");
	}
}

function displayOriginal(userToken) {
	var playerUrl = document.getElementById("playerUrl").value.trim();
	var videoId = document.getElementById("videoId").value.trim();
	var providerId = document.getElementById("providerId").value.trim();

	var showWatermark = document.getElementById("showWatermark").value.trim();
	sessionStorage.setItem("showWatermark", showWatermark);
	sessionStorage.setItem("videoId", videoId);
	sessionStorage.setItem("providerId", providerId);

	$.ajax({
		type: "POST",
		url: playerUrl + "/original",
		headers: {
			"Authorization": userToken
		},
		data: {
			videoId: videoId,
		},
		success: function(result) {
			$('#videoPlayer').html(result);
		}
	});
}


function displayPlayer(userToken) {
	//debugger;
	var showWatermark = document.getElementById("showWatermark").value.trim();
	var playerUrl = document.getElementById("playerUrl").value.trim();

	var videoId = document.getElementById("videoId").value.trim();
	var sessiontimeout = document.getElementById("sessiontimeout").value.trim();
	var sessionIncrement = document.getElementById("sessionIncrement").value.trim();
	var providerId = document.getElementById("providerId").value.trim();
	var playFromBegin = document.getElementById("playFromBegin").value.trim();

	sessionStorage.setItem("showWatermark", showWatermark);
	sessionStorage.setItem("sessiontimeout", sessiontimeout);
	sessionStorage.setItem("sessionIncrement", sessionIncrement);
	sessionStorage.setItem("videoId", videoId);
	sessionStorage.setItem("providerId", providerId);

	//debugger;

	$.ajax({
		type: "POST",
		url: playerUrl + "/run",
		dataType: "json",
		contentType: "application/json",
		headers: {
			"Authorization": userToken
		},
		data: JSON.stringify({
			showWatermark: showWatermark,
			sessionTimeOutValue: sessiontimeout,
			sessionIncrement: sessionIncrement,
			playFromBegin: playFromBegin
		}),
		success: function(result) {
			$('#videoPlayer').html(result);
		},
		error: function(res) {
			$('#videoPlayer').html(res.responseText);
		}
	});
}

function validateEmail(email) {
	var emailRegex = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-\_]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
	return emailRegex.test(email);
}

function submitLoginAction(action) {
	//debugger;
	var form = document.createElement('form');
	form.method = "POST";
	form.action = action;

	var userEmail = document.getElementById("userEmail").value.trim();
	var userPassword = document.getElementById("userPassword").value.trim();

	var errorMessageElement = document.getElementById("p_errorMsg");

	if (userEmail == null || userEmail == "") {
		errorMessageElement.textContent = "Please enter User Email.";
		return errorMessageElement;
	}
	if (userPassword == null || userPassword == "") {
		errorMessageElement.textContent = "Please enter Password.";
		return errorMessageElement;
	}
	// new code		
	var userInputs = {
		email: userEmail,
		password: userPassword
	};
	if (validateInputs(userInputs)) {

		if (validateEmail(userEmail)) {
			errorMessageElement.textContent = ""; // Clear error message
			var hiddenFieldUserEmail = document.createElement('input');
			hiddenFieldUserEmail.type = 'hidden';
			hiddenFieldUserEmail.name = 'userEmail';
			hiddenFieldUserEmail.id = 'userEmail';
			hiddenFieldUserEmail.value = userEmail;

			form.appendChild(hiddenFieldUserEmail);

			var hiddenFieldUserEmail = document.createElement('input');
			hiddenFieldUserEmail.type = 'hidden';
			hiddenFieldUserEmail.name = 'userPassword';
			hiddenFieldUserEmail.id = 'userPassword';
			hiddenFieldUserEmail.value = userPassword;

			form.appendChild(hiddenFieldUserEmail);

			document.body.appendChild(form);

			form.submit();

		} else {
			errorMessageElement.textContent = "Invalid User Email";
		}
	}
}


function submitTestAction(action) {
	//debugger;
	var form = document.createElement('form');
	form.method = "POST";
	form.action = action;

	var selectProvider = document.getElementById("selectProvider");
	var selectVideo = document.getElementById("selectVideo");
	var userToken = document.getElementById("selectVideoAdditional");

	var msgTag = document.getElementById("msgSpan");

	var hiddenProviderId = document.createElement('input');
	hiddenProviderId.type = 'hidden';
	hiddenProviderId.name = 'providerId';
	hiddenProviderId.id = 'providerId';
	hiddenProviderId.value = selectProvider.value;

	form.appendChild(hiddenProviderId);

	var hiddenFieldId = document.createElement('input');
	hiddenFieldId.type = 'hidden';
	hiddenFieldId.name = 'videoMasterId';
	hiddenFieldId.id = 'videoMasterId';
	hiddenFieldId.value = selectVideo.value;

	form.appendChild(hiddenFieldId);

	//debugger;
	var showWatermark = document.getElementsByName("showWatermark");
	var show = "1";
	for (i = 0; i < showWatermark.length; i++) {
		if (showWatermark[i].checked) {
			show = showWatermark[i].value
		}
	}
	var hiddenFieldWatermark = document.createElement('input');
	hiddenFieldWatermark.type = 'hidden';
	hiddenFieldWatermark.name = 'showWatermark';
	hiddenFieldWatermark.id = 'showWatermark';
	hiddenFieldWatermark.value = show;
	form.appendChild(hiddenFieldWatermark);



	var hiddenFieldUserToken = document.createElement('input');
	hiddenFieldUserToken.type = 'hidden';
	hiddenFieldUserToken.name = 'userToken';
	hiddenFieldUserToken.id = 'userToken';
	hiddenFieldUserToken.value = userToken.value;

	form.appendChild(hiddenFieldUserToken);
	document.body.appendChild(form);

	var sessionincrement = document.getElementsByName("sessionincrement");
	var showsessionincrement = "1";
	for (i = 0; i < sessionincrement.length; i++) {
		if (sessionincrement[i].checked) {
			showsessionincrement = sessionincrement[i].value
		}
	}
	var hiddensessionincrement = document.createElement('input');
	hiddensessionincrement.type = 'hidden';
	hiddensessionincrement.name = 'sessionIncrement';
	hiddensessionincrement.id = 'sessionincrement';
	hiddensessionincrement.value = showsessionincrement;
	form.appendChild(hiddensessionincrement);

	var sessiontimeout = document.getElementById("sessiontimeout");
	var hiddensessionidValue = document.createElement('input');
	hiddensessionidValue.type = 'hidden';
	hiddensessionidValue.name = 'sessionTimeOutValue';
	hiddensessionidValue.id = "sessiontimeout";
	hiddensessionidValue.value = sessiontimeout.value;
	form.appendChild(hiddensessionidValue);

	if (sessiontimeout.value == "0") {
		msgTag.textContent = "Enter a valid session time out value"
		sessiontimeout.value = "";
		return msgTag;
	}
	if (sessiontimeout.value == null || sessiontimeout.value == "") {
		msgTag.textContent = "Enter session time out value"
		return msgTag;
	}
	if (sessiontimeout.value != null) {
		var valid = isValidNumber(sessiontimeout.value);
		if (!valid) {
			msgTag.textContent = "Enter a valid number and should be less than 300"
			sessiontimeout.value = "";
			return msgTag;
		}
	}

	form.submit();

}

function isValidNumber(num) {
	// Check if the number is between 0 and 300
	var regex = /^(300|[1-2][0-9]{0,2}|[1-9][0-9]{0,1}|0)$/;
	return regex.test(num);
}

function submitFormAction(action, params) {

	const form = document.createElement('form');
	form.method = "POST";
	form.action = action;

	if (params != null) {
		for (var paramKey in params) {
			if (params.hasOwnProperty(paramKey)) {
				const hiddenFieldParam = document.createElement('input');
				hiddenFieldParam.type = 'hidden';
				hiddenFieldParam.name = paramKey;
				hiddenFieldParam.value = params[paramKey];

				form.appendChild(hiddenFieldParam);
			}
		}
	}
	document.body.appendChild(form);
	form.submit();
}

function submitMenu(e, baseurl) {

	//var baseurl = document.getElementById('baseurl').value;
	let menuText = e.target.innerText;

	let patternAspect = new RegExp('^Aspect Ratios$', 'i');
	let patternAuthorizationFailures = new RegExp('^Authorization Failures$', 'i');
	let patternConfiguration = new RegExp('^Configuration$', 'i');
	let patternConsumer = new RegExp('^Consumer Process$', 'i');
	let patternDelete = new RegExp('^Delete Videos$', 'i');

	let patternPlayerRequests = new RegExp('^Player Requests$', 'i');
	let patternProviders = new RegExp('^Providers$', 'i');
	let patternThumbnail = new RegExp('^Thumbnail Upload$', 'i');
	let patternUpload = new RegExp('^Upload$', 'i');

	let patternUserImpersonate = new RegExp('^User Impersonate$', 'i');
	let patternUserManagement = new RegExp('^User Management$', 'i');
	let patternUserTokens = new RegExp('^User Tokens$', 'i');


	let patternVideoAnalysis = new RegExp('^Video Analysis$', 'i');
	let patternPlayEvents = new RegExp('^Videos Play Events$', 'i');
	let patternVideosProgress = new RegExp('^Videos Playback Information$', 'i');
	let patternVideos = new RegExp('^Videos Upload Status$', 'i');

	if (patternAspect.test(menuText)) {
		submitFormAction(baseurl + "/aspectratios", {
			currentPage: 1,
			gridHeight: screen.height
		});
	} else if (patternAuthorizationFailures.test(menuText)) {
		submitFormAction(baseurl + "/authFailures", {
			currentPage: 1,
			gridHeight: screen.height
		});
	} else if (patternConfiguration.test(menuText)) {
		submitFormAction(baseurl + "/configuration", {
			gCurrentPage: 1,
			pCurrentPage: 1,
			pvCurrentPage: 1,
			gridHeight: screen.height
		});
	} else if (patternConsumer.test(menuText)) {
		submitFormAction(baseurl + "/consumerprocess", {
			currentPage: 1,
			gridHeight: screen.height
		});
	} else if (patternDelete.test(menuText)) {
		submitFormAction(baseurl + "/delete", {
			currentPage: 1,
			gridHeight: screen.height
		});
	} else if (patternPlayerRequests.test(menuText)) {
		submitFormAction(baseurl + "/playerRequests", {
			currentPage: 1,
			gridHeight: screen.height
		});
	} else if (patternProviders.test(menuText)) {
		submitFormAction(baseurl + "/providers", {
			currentPage: 1,
			gridHeight: screen.height
		});
	} else if (patternThumbnail.test(menuText)) {
		submitFormAction(baseurl + "/thumbnailUpload");
	} else if (patternUpload.test(menuText)) {
		submitFormAction(baseurl + "/upload");

	} else if (patternUserImpersonate.test(menuText)) {
		submitFormAction(baseurl + "/userimpersonate");

	} else if (patternUserTokens.test(menuText)) {
		submitFormAction(baseurl + "/users", {
			currentPage: 1,
			gridHeight: screen.height
		});
	} else if (patternUserManagement.test(menuText)) {
		submitFormAction(baseurl + "/getUserDetails", {
			currentPage: 1,
			gridHeight: screen.height
		});

	} else if (patternVideoAnalysis.test(menuText)) {
		submitFormAction(baseurl + "/videoAnalysis", {
			currentPage: 1,
			gridHeight: screen.height
		});

	} else if (patternPlayEvents.test(menuText)) {
		submitFormAction(baseurl + "/playevents", {
			currentPage: 1,
			gridHeight: screen.height
		});
	} else if (patternVideosProgress.test(menuText)) {
		submitFormAction(baseurl + "/videosprogress", {
			currentPage: 1,
			gridHeight: screen.height
		});
	} else if (patternVideos.test(menuText)) {
		submitFormAction(baseurl + "/videos", {
			currentPage: 1,
			gridHeight: screen.height
		});

	}

}

function commonSearch(url, data, gridIds) {
	showSpinner();

	var dgVideosselectedRow = document.getElementById("dgVideosselectedRow");

	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function(response) {
			hideSpinner();
			for (var i = 0; i < gridIds.length; i++) {

				var currentGridId = gridIds[i];
				var gridResponse = $(response);
				//var gridContent = gridResponse.find('#' + currentGridId.id).html();
				var gridContent = gridResponse.find('#' + currentGridId.id + "divParent").html();


				$('#' + currentGridId.id + "divParent").html(gridContent);
				if (gridContent.indexOf('No records to display!') !== -1) {
					$('#' + currentGridId.id).parent().css('border', 'none');
				} else {
					$('#' + currentGridId.id).parent().css('border', '1px solid #1e2024');
				}

				//debugger;
				var divScroll = document.getElementById(currentGridId.id + "divScroll");
				if (divScroll != null) {
					divScroll.scrollTop = 0;
				}

				if (dgVideosselectedRow != null) {
					//debugger;
					var row = document.getElementById(dgVideosselectedRow.value);
					if (row != null) {
						row.classList.add("gridRowBacgroundColor");
						document.getElementById("dgVideosselectedRow").value = dgVideosselectedRow.value;
					}
				}



			}

		},
		error: function(error) {
			hideSpinner();
			var error = document.getElementById("gridError");
			error.textContent = "Failed to display records.";

		}
	});

}

function searchConsumerProcessUser() {

	var baseurl = document.getElementById('baseurl').value;

	var userValue = document.getElementById('userValue').value.trim();

	var videoValue = document.getElementById('videoValue').value.trim();

	var targetIds = [dgConsumerProcess];

	var data = {
		currentPage: 1,
		userValue: userValue,
		videoValue: videoValue,
		gridHeight: screen.height
	};

	if (userValue.length == 0 || userValue.length >= 3) {
		//showSpinner();
		commonSearch(baseurl + "/consumerprocess", data, targetIds);
		//submitFormAction(baseurl + "/consumerprocess", { currentPage: 1, userValue: finalUserValue, videoValue: finalVideoValue, gridHeight: screen.height });
	}

}

function searchConsumerProcessVideo() {

	var baseurl = document.getElementById('baseurl').value;

	var userValue = document.getElementById('userValue').value.trim();

	var videoValue = document.getElementById('videoValue').value.trim();

	var data = {
		currentPage: 1,
		userValue: userValue,
		videoValue: videoValue,
		gridHeight: screen.height
	};
	var targetIds = [dgConsumerProcess];

	if (videoValue.length == 0 || videoValue.length >= 3) {
		//showSpinner();
		commonSearch(baseurl + "/consumerprocess", data, targetIds);
		//submitFormAction(baseurl + "/consumerprocess", { currentPage: 1, userValue: finalUserValue, videoValue: finalVideoValue, gridHeight: screen.height });
	}

}

function searchPlayEventUser() {

	var baseurl = document.getElementById('baseurl').value;

	var userValue = document.getElementById('userValue').value.trim();

	var videoValue = document.getElementById('videoValue').value.trim();

	if (userValue.length == 0 || userValue.length >= 3) {
		//showSpinner();

		var targetIds = [dgPlayEvent, dgPlayEventDetail];
		var data = {
			currentPage: 1,
			userValue: userValue,
			videoValue: videoValue,
			gridHeight: screen.height
		}

		commonSearch(baseurl + "/playevents", data, targetIds);
		//submitFormAction(baseurl + "/playevents", { currentPage: 1, userValue: finalUserValue, videoValue: finalVideoValue, gridHeight: screen.height });
	}

}

function searchPlayEventVideo() {

	var baseurl = document.getElementById('baseurl').value;

	var userValue = document.getElementById('userValue').value.trim();

	var videoValue = document.getElementById('videoValue').value.trim();

	if (videoValue.length == 0 || videoValue.length >= 3) {
		//showSpinner();

		var targetIds = [dgPlayEvent, dgPlayEventDetail];
		var data = {
			currentPage: 1,
			userValue: userValue,
			videoValue: videoValue,
			gridHeight: screen.height
		}

		commonSearch(baseurl + "/playevents", data, targetIds);
		//submitFormAction(baseurl + "/playevents", { currentPage: 1, userValue: finalUserValue, videoValue: finalVideoValue, gridHeight: screen.height });
	}

}



function searchVideoProcessUser() {
	var baseurl = document.getElementById('baseurl').value;
	var userValue = document.getElementById('userValue').value.trim();

	var videoValue = document.getElementById('videoValue').value.trim();

	var data = {
		currentPage: 1,
		userValue: userValue,
		videoValue: videoValue,
		gridHeight: screen.height
	};
	var targetIds = [dgVideosProgress];

	if (userValue.length == 0 || userValue.length >= 3) {
		//showSpinner();
		commonSearch(baseurl + "/videosprogress", data, targetIds);
		//	submitFormAction(baseurl + "/videosprogress", { currentPage: 1, userValue: finalUserValue, videoValue: finalVideoValue, gridHeight: screen.height });
	}

}

function searchVideoProcessVideo() {

	var baseurl = document.getElementById('baseurl').value;
	var userValue = document.getElementById('userValue').value.trim();

	var videoValue = document.getElementById('videoValue').value.trim();

	var data = {
		currentPage: 1,
		userValue: userValue,
		videoValue: videoValue,
		gridHeight: screen.height
	};
	var targetIds = [dgVideosProgress];

	if (videoValue.length == 0 || videoValue.length >= 3) {
		//showSpinner();
		commonSearch(baseurl + "/videosprogress", data, targetIds);
		//submitFormAction(baseurl + "/videosprogress", { currentPage: 1, userValue: finalUserValue, videoValue: finalVideoValue, gridHeight: screen.height });
	}
}

function returnPage(strWhere, currentPage, intPages) {
	var intPg = parseInt(currentPage);

	if (isNaN(intPg)) {
		intPg = 1;
	}

	if ((strWhere == 'F' || strWhere == 'P') && intPg == 1) {
		//alert("You are already viewing first page!");
		return 0;
	} else if ((strWhere == 'N' || strWhere == 'L') && intPg == intPages) {
		//alert("You are already viewing last page!");
		return 0;
	}

	if (strWhere == 'F') {
		intPg = 1;
	} else if (strWhere == 'P') {
		intPg = intPg - 1;
	} else if (strWhere == 'N') {
		intPg = intPg + 1;
	} else if (strWhere == 'L') {
		intPg = intPages;
	}

	if (intPg < 1) {
		intPg = 1;
	}

	if (intPg > intPages) {
		intPg = intPages;
	}

	return intPg;
}


function openAspectForm() {

	document.getElementById("myForm").style.display = "block";
}

function closeAspectForm() {

	document.getElementById("myForm").style.display = "none";
	var form = document.getElementById("popupForm");
	form.reset()
}

//function saveAspectRatio() {
//
//	var baseurl = document.getElementById('baseurl').value;
//	var widthVal = parseInt(document.getElementById("width").value);
//	var heightVal = parseInt(document.getElementById("height").value);
//	var videoBitrateVal = document.getElementById("videoBitrate").value;
//	var audioBitrateVal = document.getElementById("audioBitrate").value;
//
//	submitFormAction(baseurl + "/saveAspectRatio", {
//		widthParam: widthVal,
//		heightParam: heightVal,
//		videoBitrateParam: videoBitrateVal,
//		audioBitrateParam: audioBitrateVal
//	});
//
//}

document.addEventListener('contextmenu', function(event) {
	event.preventDefault();
});

document.addEventListener('keydown', function(event) {
	if (event.ctrlKey && (event.key === 's' || event.key === 'S')) {
		event.preventDefault();
	}
});


function saveProviderConfig(e) {

	// debugger;
	var baseurl = document.getElementById('baseurl').value;
	var selectProvider = document.getElementById("selectProvider");

	var providerId = selectProvider.value;
	var configKey = document.getElementById("configKey");
	var configKeyVal = configKey.value;

	var selectIdAdditionalId = "configKeyAdditional";
	var selectIdAdditional = document.getElementById(selectIdAdditionalId);
	var configKeyType = selectIdAdditional.value

	var msg = document.getElementById("msgSpan");
	var submitButton = document.getElementById("submitButton");

	var gridProvider = document.getElementById("gridProvider");

	var configVal = "";
	var configInput = "";
	if (configKeyType == "boolean") {
		configInput = document.getElementById("booleanDiv");
		var selectedConfig = document.getElementById("booleanConfigValue");
		configVal = selectedConfig.options[selectedConfig.selectedIndex].value;
	} else if (configKeyType == "chooseColor") {
		configInput = document.getElementById("watermarkColorDiv");
		var selectedConfig = document.getElementById("watermarkConfigValue");
		configVal = selectedConfig.options[selectedConfig.selectedIndex].value;
	} else {
		configInput = document.getElementById("inputDiv");
		configVal = document.getElementById("configValue").value;
	}

	var selectVideo = document.getElementById("selectVideo");
	var selectVideoVal = selectVideo.value
	//var selectedOption = configKey.options[configKey.selectedIndex];
	if (configKeyVal == "VideoPreviewImageSeconds" && selectVideoVal != "") {
		var msgTag = document.getElementById("msgSpan");
		msgTag.textContent = "This configuration VideoPreviewImageSeconds done at provider level only please unselect video name";
		return msgTag;
	}
	//debugger;
	msg.textContent = "";
	if (providerId != null && providerId != "" && configKeyType != null && configKeyType != "" && configVal != null && configVal != "") {
		//msg.textContent = "";
		showSpinner();
		submitButton.disabled = true;
		//submitFormAction(baseurl + "/saveConfiguration", {providerParam: providerId,configKeyParam: configKeyVal,configValueParam: configVal,selectVideoParam: selectVideoVal,gridHeight: screen.height	});
		$.ajax({
			type: "POST",
			url: baseurl + "/saveConfiguration",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({
				"providerId": providerId,
				"configKey": configKeyVal,
				"configValue": configVal,
				"selectVideo": selectVideoVal,
				"gridHeight": screen.height
			}),
			success: function(response) {
				//debugger;
				hideSpinner();
				submitButton.disabled = false;
				msg.textContent = response.message;

				setDefaultCombo("selectProvider", "Select Provider");
				setDefaultCombo("selectVideo", "Select Video");
				setDefaultCombo("configKey", "Select Key");
				if (configInput) {
					configInput.style.display = "none";
				}
				if (selectVideoVal != " " && selectVideoVal.length > 0) {

					document.getElementById("providerVideoKeyList").value = response.providerVideoKeys;

					if (gridProvider.value != "" && gridProvider.value.length > 0) {
						var targetIds = [dgProviderVideoConfig];
						var data = {
							pvCurrentPage: 1,
							gridProviderId: gridProvider.value,
							gridHeight: screen.height
						};

						//showSpinner();
						commonSearch(baseurl + "/providerVideosKeysSearch", data, targetIds);

					}


				} else {
					document.getElementById("providerKeyList").value = response.providerKeys;

					var targetIds = [dgProviderConfig];
					var data = { pCurrentPage: 1, gridHeight: screen.height };
					commonSearch(baseurl + "/providerConfig", data, targetIds);

				}


			},
			error: function(res) {
				hideSpinner();
				submitButton.disabled = false;
				msg.textContent = response.message;
			}
		});
	} else {
		//debugger;
		if ((providerId == null || providerId == "") && (configKeyType == null || configVal == "")) {
			msg.textContent = "Enter the required fields.";
		} else if (providerId == null || providerId == "") {
			msg.textContent = "Please select Provider Name.";
		} else if (configKeyType == null || configKeyType == "") {
			msg.textContent = "Please select Key.";
		} else if (configVal == "" || configVal == null) {
			msg.textContent = "Value is Required.";
		}
	}

}


function updateInputType(e) {
	//debugger;
	//var configKeySelect = document.getElementById('configKey');
	var selectIdAdditionalId = "configKeyAdditional";
	var selectIdAdditional = document.getElementById(selectIdAdditionalId);
	var selectedType = selectIdAdditional.value
	//var selectedOption = configKeySelect.options[configKeySelect.selectedIndex];
	//var selectedType = selectedOption.getAttribute('data-type');
	var configInput = document.getElementById('configValue');


	if (selectedType === 'number') {
		configInput.maxLength = 2;
		var keyCode = e.which ? e.which : e.keyCode;
		if (!(keyCode >= 48 && keyCode <= 57 && keyCode !== 13)) {
			e.preventDefault();
		}
	} else {
		configInput.maxLength = 20;
		var key = e.keyCode;
		if (key != 32) {
			var regex = new RegExp("^[a-zA-Z0-9]+$");
			var keypress = String.fromCharCode(!e.charCode ? e.which : e.charCode);
			if ((key >= 48 && key <= 57) || !regex.test(keypress)) {
				e.preventDefault();
			}
		}
	}
}

function changeInputType(obj) {
	//debugger;

	var selectKeyName = obj.getAttribute("data-value");

	var dataType = obj.getAttribute("data-additional") //  objselectedOptions[0].getAttribute('data-type');
	//var boolean = document.getElementById("booleanDiv");
	//var text = document.getElementById("inputDiv");
	var configValue = document.getElementById("configValue");
	//var watermarkColorDiv = document.getElementById("watermarkColorDiv");
	configValue.value = "";

	var watermarkColor = document.getElementById("watermarkConfigValue");
	var selectProviderId = document.getElementById("selectProvider").value;
	//var selectKeyName = document.getElementById("configKey").value;
	//var booleanConfigValue = document.getElementById("booleanConfigValue");
	var saveValue = "";
	var providerKeyList = document.getElementById("providerKeyList");
	var providerVideKeyList = document.getElementById("providerVideoKeyList");
	var selectVideoId = document.getElementById("selectVideo").value;

	//if (selectProviderId != "") {

	if (selectVideoId != "" && providerVideKeyList.value != "") {
		var pvList = JSON.parse(providerVideKeyList.value);
		for (var i = 0; i < pvList.length; i++) {
			var pv = pvList[i];
			if (pv.videoMasterId == selectVideoId) {
				if (pv.configKey == selectKeyName) {
					saveValue = pv.configValue;
					break;
				}

			}

		}
	} else if (providerKeyList.value != "") {
		var pList = JSON.parse(providerKeyList.value);
		for (var i = 0; i < pList.length; i++) {
			var p = pList[i];
			if (p.providerId == selectProviderId) {
				if (p.configKey == selectKeyName) {
					saveValue = p.configValue;
					break;
				}

			}

		}
	}


	resetConfigValues(dataType, saveValue);
	//} 

	/*else {

		//document.getElementById("configKey").selectedIndex = 0; 
		var msgTag = document.getElementById("msgSpan");
		msgTag.textContent = "Select Provider Name.";
		return msgTag;
	}*/
}

function resetConfigValues(dataType, saveValue) {

	var text = document.getElementById("inputDiv");
	var watermarkColorDiv = document.getElementById("watermarkColorDiv");
	var booleanConfigValue = document.getElementById("booleanConfigValue");
	var boolean = document.getElementById("booleanDiv");
	var watermarkColor = document.getElementById("watermarkConfigValue");

	if (dataType === "boolean") {
		text.style.display = "none";
		watermarkColorDiv.style.display = "none";
		booleanConfigValue.value = saveValue;
		boolean.style.display = "block";
	} else if (dataType === "number" || dataType == "text") {
		configValue.value = saveValue;
		boolean.style.display = "none";
		watermarkColorDiv.style.display = "none";
		text.style.display = "block";

		var textInput = document.getElementById("configValue");
		textInput.focus();

	} else if (dataType === "chooseColor") {
		watermarkColor.value = saveValue;
		booleanConfigValue.value = saveValue;
		boolean.style.display = "none";
		text.style.display = "none";
		watermarkColorDiv.style.display = "block";
	}
}

function configProviderChange(obj) {

	showSpinner();
	var providerId = obj.getAttribute("data-value")

	var dataType = obj.getAttribute("data-additional");

	var baseurl = document.getElementById("baseurl");
	//var boolean = document.getElementById("booleanDiv");
	//var text = document.getElementById("inputDiv");
	//var configValue = document.getElementById("configValue");
	//configValue.value = "";

	resetConfigValues(dataType, "");

	$.ajax({
		type: "POST",
		url: baseurl.value + "/getConfigProviderVideos",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify({
			"providerId": providerId
		}),
		success: function(result) {
			//debugger;
			hideSpinner();
			$('#videoDiv').html(result.providerVideoHtml);
			document.getElementById("providerKeyList").value = result.providerKeys;
			document.getElementById("providerVideoKeyList").value = result.providerVideoKeys;

		},
		error: function(res) {
			hideSpinner();
			$('#videoDiv').html(res.responseText);
		}
	});


}

function searchProviderTokens(baseurl) {
	var msg = document.getElementById("msgSpan");
	msg.textContent = "";

	var baseurl = document.getElementById('baseurl').value;
	var inputValue = document.getElementById('providerValue').value.trim();

	var targetIds = [dgProviderTokens];
	var data = {
		currentPage: 1,
		providerValue: inputValue,
		gridHeight: screen.height
	};


	if (inputValue.length === 0 || inputValue.length >= 3) {
		//showSpinner();
		commonSearch(baseurl + "/providers", data, targetIds);
		//submitFormAction(baseurl + "/providers", { currentPage: 1, providerValue: inputValue, gridHeight: screen.height });
	}

}

function searchVideo() {
	var msg = document.getElementById("msgSpan");
	msg.textContent = "";

	var baseurl = document.getElementById('baseurl').value;
	var inputValue = document.getElementById('providerValue').value.trim();

	var targetIds = [dgVideos];
	var data = {
		currentPage: 1,
		providerValue: inputValue,
		gridHeight: screen.height
	}

	if (inputValue.length == 0 || inputValue.length >= 3) {
		//showSpinner();
		commonSearch(baseurl + "/videos", data, targetIds);
		//submitFormAction(baseurl + "/videos", { currentPage: 1, providerValue: inputValue, gridHeight: screen.height });
	}

}

function searchUser() {
	//var msg = document.getElementById("msgSpan");
	//msg.textContent = "";


	var baseurl = document.getElementById('baseurl').value;
	var inputValue = document.getElementById('userValue').value.trim();

	var targetIds = [dgUsers, dgUserTokenDetail];
	var data = {
		currentPage: 1,
		inputValue: inputValue,
		gridHeight: screen.height
	}

	if (inputValue.length == 0 || inputValue.length >= 3) {
		//showSpinner();
		commonSearch(baseurl + "/users", data, targetIds);
		//submitFormAction(baseurl + "/users", { currentPage: 1, inputValue: finalInput, gridHeight: screen.height });
	}
}

function searchProviderVideoKeys() {
	//debugger
	var baseurl = document.getElementById('baseurl').value;
	var gridProvider = document.getElementById("gridProvider");

	if (gridProvider.value != null && gridProvider.value.length > 0) {

		var targetIds = [dgGlobalConfig, dgProviderConfig, dgProviderVideoConfig];
		var data = {
			gCurrentPage: 1,
			pCurrentPage: 1,
			pvCurrentPage: 1,
			gridProviderId: gridProvider.value,
			gridHeight: screen.height
		};

		//showSpinner();
		commonSearch(baseurl + "/configuration", data, targetIds);
	}



	//submitFormAction(baseurl + "/configuration", { pvCurrentPage: 1, gCurrentPage: 1, pCurrentPage: 1, gridProviderId: gridProvider.value });
}

function showInput(select) {
	//debugger;
	var fileInput = document.getElementById('fileInput');
	var urlInput = document.getElementById('urlInput');

	if (select.value === 'file') {
		urlInput.style.display = "none";
		fileInput.style.display = "block";

	} else if (select.value === 'url') {

		fileInput.style.display = "none";
		urlInput.style.display = "block";
	}
}

function showImageInput(select) {
	//debugger;
	var imageFileInput = document.getElementById('imageFileInput');
	var imageUrlInput = document.getElementById('imageUrlInput');

	if (select.value === 'file') {
		imageUrlInput.style.display = "none";
		imageFileInput.style.display = "block";

	} else if (select.value === 'url') {

		imageFileInput.style.display = "none";
		imageUrlInput.style.display = "block";
	}
}

function uploadVideoDelay() {
	var buttonClick = document.getElementById("uploadButton");
	buttonClick.disabled = true;
	showSpinner();

	setTimeout(function() {
		uploadVideo();
	}, 300);
}

function uploadVideo() {
	//debugger;

	//showSpinner();

	var buttonClick = document.getElementById("uploadButton");
	var msgTag = document.getElementById("msgSpan");
	msgTag.textContent = "";

	var providerNameVal = document.getElementById("providerName").value.trim();
	var sourceIdVal = document.getElementById("sourceId").value.trim();
	var videoNameVal = document.getElementById("videoName").value.trim();
	var videoDescVal = document.getElementById("videoDesc").value.trim();
	var languageVal = document.getElementById("language").value.trim();
	var typeVal = document.getElementById("type").value.trim();
	var releaseDateVal = document.getElementById("releaseDate").value.trim();
	var endDateVal = document.getElementById("endDate").value.trim();

	//var providerAuthkeyVal = document.getElementById("providerAuthkey").value.trim();	

	var baseurl = document.getElementById('baseurl').value;
	var url = baseurl + "/fileupload";

	var videoTypeVal = document.getElementById("videoType").value.trim();
	var imageTypeVal = document.getElementById("imageType").value.trim();
	var form = document.getElementById("videoUplaodId");

	if (typeVal == "Seasons") {
		var seasonNumberVal = document.getElementById("seasonNumber").value.trim();
		var episodeNumberVal = document.getElementById("episodeNumber").value.trim();
		var episodeNameVal = document.getElementById("episodeName").value.trim();
		//new code
		var seasonInputs = {
			seasonNumber: seasonNumberVal,
			episodeNumber: episodeNumberVal,
			episodeName: episodeNameVal
		}
		if (!validateInputs(seasonInputs)) {
			hideSpinner();
			msgTag.textContent = "Enter the required fields.";
			buttonClick.disabled = false;
			return;
		}
	}
	//inputs validation
	var userInputs = {
		providerName: providerNameVal,
		sourceId: sourceIdVal,
		videoName: videoNameVal,
		language: languageVal,
		type: typeVal,
		releaseDate: releaseDateVal,
		videoType: videoTypeVal
		/*imageType:imageTypeVal*/
	};
	if (validateInputs(userInputs)) {

		var formData = new FormData();
		formData.append('providerName', providerNameVal);
		formData.append('sourceId', sourceIdVal);
		formData.append('videoName', videoNameVal);
		formData.append('videoDescription', videoDescVal);
		formData.append('language', languageVal);
		formData.append('type', typeVal);
		formData.append('releaseDate', releaseDateVal);
		formData.append('endDate', endDateVal);


		formData.append('seasonNumber', seasonNumberVal);
		formData.append('episodeNumber', episodeNumberVal);
		formData.append('episodeName', episodeNameVal);
		formData.append('videoType', videoTypeVal);
		formData.append('imageType', imageTypeVal);

		/*if (providerNameVal === "" && sourceIdVal === "" && videoNameVal === "" && languageVal === "" && typeVal === "" && releaseDateVal === "" && endDateVal === "" && videoTypeVal === "") {
			hideSpinner();
			msgTag.textContent = "Enter the required fields.";
			buttonClick.disabled = false;
			return;
		}*/
		//debugger;
		if (videoTypeVal == "file") {
			var videoFileInput = document.getElementById("videoFile");
			formData.append('file', videoFileInput.files[0]);
			formData.append('videoUrl', "");
		} else if (videoTypeVal == "url") {
			var videoUrlInput = document.getElementById("videoUrl");
			formData.append('videoUrl', videoUrlInput.value);
			formData.append('file', "");
		} else {
			hideSpinner();
			msgTag.textContent = "Video input is required.";
			buttonClick.disabled = false;
			return;
		}

		if (imageTypeVal == "file") {
			var imageFileInput = document.getElementById("imageFile");
			formData.append('image', imageFileInput.files[0]);
			formData.append('thumbnailUrl', "");
		} else if (imageTypeVal == "url") {
			var imageUrlInput = document.getElementById("imageUrl");
			formData.append('thumbnailUrl', imageUrlInput.value);
			formData.append('image', "");
		}
		$.ajax({
			type: "POST",
			url: url,
			async: false,
			data: formData,
			processData: false,
			contentType: false,
			success: function(response) {
				//debugger;
				hideSpinner();
				if (response.status == "Failed") {
					//console.log(response);
					msgTag.textContent = response.message;
					buttonClick.disabled = false;
				} else if (response.status == "Success") {
					//console.log(response);
					setDefaultCombo("providerName", "Select Provider");
					msgTag.textContent = response.message;
					form.reset();
					buttonClick.disabled = false;
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				//debugger;
				hideSpinner();
				buttonClick.disabled = false;
				//var response = xhr.responseText;
				//var response = xhr.responseText;
				var json = JSON.parse(xhr.responseText);
				if (json.status == "Failed") {
					//console.log(response);
					msgTag.textContent = json.message;

				} else {
					msgTag.textContent = "server responded with status code:" + xhr.status;

				}


			}
		});
	} else {
		hideSpinner();
		msgTag.textContent = "Enter the required fields.";
		buttonClick.disabled = false;
	}
	$(window).scrollTop(0);
}

function showSeasons(e) {

	//debugger;
	var seasons = document.getElementById("seasonsId");
	var type = e.value;
	if (type == "Seasons") {
		seasons.style.display = "block";
	} else {
		seasons.style.display = "none";
	}

}

function checkCharacter(e) {

	var key = e.keyCode;
	if (e.shiftKey && e.keyCode === 9) {
		document.getElementById("videoDesc").focus();
	} else if (e.key === "Tab") {
		document.getElementById("releaseDate").focus();
	}
	if (key != 32 && key != 8) {
		var regex = new RegExp("^[a-zA-Z0-9]+$");
		var keypress = String.fromCharCode(!e.charCode ? e.which : e.charCode);
		if ((key >= 48 && key <= 57) || !regex.test(keypress) || key >= 96 && key <= 105) {
			e.preventDefault();
		}
	}
}

function dropClick() {
	$('#selectVideo').attr('size', 0);
	$('#selectProvider').attr('size', 0);
	$('#selectUser').attr('size', 0);
	$('#gridProvider').attr('size', 0);
}

function showSpinner() {
	document.getElementById("loadingDiv").classList.add("loadingDiv");
	document.getElementById("loadingContentDiv").classList.add("loadingContentDiv");
}

function hideSpinner() {
	document.getElementById("loadingDiv").classList.remove("loadingDiv");
	document.getElementById("loadingContentDiv").classList.remove("loadingContentDiv");
}

//common code for inputs validation
function validateInputs(inputs) {
	for (var key in inputs) {
		var input = inputs[key];
		if (input === '') {
			return false;
		}
	}
	return true;
}

document.addEventListener('click', function(event) {
	//debugger;
	var msgTag = document.getElementById("msgSpan");
	var p_errorMsg = document.getElementById("p_errorMsg");
	var gridError = document.getElementById("gridError");
	var modalError = document.getElementById("modalError");
	var targetElement = event.target;
	var URL = window.location.href;
	menuHighlight(URL);
	if (targetElement.tagName === 'SELECT' || targetElement.tagName === 'TD' || targetElement.closest('select') || (targetElement.tagName === 'INPUT') || (targetElement.closest('INPUT')) || (targetElement.tagName === 'TEXTAREA') || (targetElement.closest('TEXTAREA')) || (targetElement.tagName === 'DIV')) {
		if (msgTag != null && msgTag.textContent != null) {
			msgTag.textContent = "";
		}
		if (p_errorMsg != null) {
			p_errorMsg.innerHTML = "";
			p_errorMsg.innerText = "";
		}
		if (gridError != null && gridError.textContent != null) {
			gridError.textContent = "";
		}
		if (modalError != null && modalError.textContent != null) {
			modalError.textContent = "";
		}
		return;
	}
	var selectElements = document.getElementsByTagName('select');
	for (var i = 0; i < selectElements.length; i++) {
		selectElements[i].size = 0;
	}
});



function menuHighlight(URI) {

	if (URI.endsWith("aspectratios")) {
		var Aspect = document.getElementsByClassName("dropdown-item drop-list-Aspect");
		Aspect[0].style.backgroundColor = "#0d6efd";
		Aspect[0].style.color = " rgb(255, 255, 255)";
	} else if (URI.endsWith("authFailures")) {
		var AuthorizationFailures = document.getElementsByClassName("dropdown-item drop-list-AuthorizationFailures");
		AuthorizationFailures[0].style.backgroundColor = "#0d6efd";
		AuthorizationFailures[0].style.color = " rgb(255, 255, 255)";
	} else if (URI.endsWith("videosprogress")) {
		var Videosplayback = document.getElementsByClassName("dropdown-item drop-list-Videosplayback");
		Videosplayback[0].style.backgroundColor = "#0d6efd";
		Videosplayback[0].style.color = " rgb(255, 255, 255)";
	} else if (URI.endsWith("providers")) {
		var Providers = document.getElementsByClassName("dropdown-item drop-list-Providers");
		Providers[0].style.backgroundColor = "#0d6efd";
		Providers[0].style.color = " rgb(255, 255, 255)";
	} else if (URI.endsWith("playerrequests")) {
		var playerrequests = document.getElementsByClassName("dropdown-item drop-list-PlayerRequests");
		playerrequests[0].style.backgroundColor = "#0d6efd";
		playerrequests[0].style.color = " rgb(255, 255, 255)";

	} else if (URI.endsWith("userimpersonate")) {
		var Users = document.getElementsByClassName("dropdown-item drop-list-UserImpersonate");
		Users[0].style.backgroundColor = "#0d6efd";
		Users[0].style.color = " rgb(255, 255, 255)";

	} else if (URI.endsWith("getUserDetails")) {
		var Users = document.getElementsByClassName("dropdown-item drop-list-UserManagement");
		Users[0].style.backgroundColor = "#0d6efd";
		Users[0].style.color = " rgb(255, 255, 255)";

	} else if (URI.endsWith("users")) {
		var Users = document.getElementsByClassName("dropdown-item drop-list-UserTokens");
		Users[0].style.backgroundColor = "#0d6efd";
		Users[0].style.color = " rgb(255, 255, 255)";
		//	} else if (URI.endsWith("uservideos")) {
		//		var UserVideos = document.getElementsByClassName("dropdown-item drop-list-UserVideos");
		//		UserVideos[0].style.backgroundColor = "#0d6efd";
		//		UserVideos[0].style.color = " rgb(255, 255, 255)";
	} else if (URI.endsWith("consumerprocess")) {
		var Consumer = document.getElementsByClassName("dropdown-item drop-list-Consumer");
		Consumer[0].style.backgroundColor = "#0d6efd";
		Consumer[0].style.color = " rgb(255, 255, 255)";
	} else if (URI.endsWith("configuration")) {
		var Configuration = document.getElementsByClassName("dropdown-item drop-list-Configuration");
		Configuration[0].style.backgroundColor = "#0d6efd";
		Configuration[0].style.color = " rgb(255, 255, 255)";
	} else if (URI.endsWith("upload")) {
		var Upload = document.getElementsByClassName("dropdown-item drop-list-Upload");
		Upload[0].style.backgroundColor = "#0d6efd";
		Upload[0].style.color = " rgb(255, 255, 255)";
	} else if (URI.endsWith("delete")) {
		var Delete = document.getElementsByClassName("dropdown-item drop-list-Delete");
		Delete[0].style.backgroundColor = "#0d6efd";
		Delete[0].style.color = " rgb(255, 255, 255)";
	} else if (URI.endsWith("thumbnailUpload")) {
		var Thumbnail = document.getElementsByClassName("dropdown-item drop-list-Thumbnail");
		Thumbnail[0].style.backgroundColor = "#0d6efd";
		Thumbnail[0].style.color = " rgb(255, 255, 255)";
	} else if (URI.endsWith("playevents")) {
		var playevents = document.getElementsByClassName("dropdown-item drop-list-Videosplayevents");
		playevents[0].style.backgroundColor = "#0d6efd";
		playevents[0].style.color = " rgb(255, 255, 255)";
	} else if (URI.endsWith("videos")) {
		var VideosUpload = document.getElementsByClassName("dropdown-item drop-list-VideosUpload");
		VideosUpload[0].style.backgroundColor = "#0d6efd";
		VideosUpload[0].style.color = " rgb(255, 255, 255)";
	}


}

function submitPlayAction(action, providerId, videoMasterId, userToken, playFromBegin) {
	var form = document.createElement('form');
	form.method = "POST";
	form.action = action;

	var msgTag = document.getElementById("msgSpan");



	var hiddenProviderId = document.createElement('input');
	hiddenProviderId.type = 'hidden';
	hiddenProviderId.name = 'providerId';
	hiddenProviderId.id = 'providerId';
	hiddenProviderId.value = providerId;

	form.appendChild(hiddenProviderId);


	var hiddenFieldId = document.createElement('input');
	hiddenFieldId.type = 'hidden';
	hiddenFieldId.name = 'videoMasterId';
	hiddenFieldId.id = 'videoMasterId';
	hiddenFieldId.value = videoMasterId;

	form.appendChild(hiddenFieldId);



	//debugger;
	var showWatermark = document.getElementsByName("showWatermark");
	var show = "1";
	for (i = 0; i < showWatermark.length; i++) {
		if (showWatermark[i].checked) {
			show = showWatermark[i].value
		}
	}
	var hiddenFieldWatermark = document.createElement('input');
	hiddenFieldWatermark.type = 'hidden';
	hiddenFieldWatermark.name = 'showWatermark';
	hiddenFieldWatermark.id = 'showWatermark';
	hiddenFieldWatermark.value = show;
	form.appendChild(hiddenFieldWatermark);



	var hiddenFieldUserToken = document.createElement('input');
	hiddenFieldUserToken.type = 'hidden';
	hiddenFieldUserToken.name = 'userToken';
	hiddenFieldUserToken.id = 'userToken';
	hiddenFieldUserToken.value = userToken;

	form.appendChild(hiddenFieldUserToken);
	document.body.appendChild(form);

	var sessionincrement = document.getElementsByName("sessionincrement");
	var showsessionincrement = "1";
	for (i = 0; i < sessionincrement.length; i++) {
		if (sessionincrement[i].checked) {
			showsessionincrement = sessionincrement[i].value
		}
	}
	var hiddensessionincrement = document.createElement('input');
	hiddensessionincrement.type = 'hidden';
	hiddensessionincrement.name = 'sessionIncrement';
	hiddensessionincrement.id = 'sessionincrement';
	hiddensessionincrement.value = showsessionincrement;
	form.appendChild(hiddensessionincrement);

	var sessiontimeout = document.getElementById("sessiontimeout");
	var hiddensessionidValue = document.createElement('input');
	hiddensessionidValue.type = 'hidden';
	hiddensessionidValue.name = 'sessionTimeOutValue';
	hiddensessionidValue.id = "sessiontimeout";
	hiddensessionidValue.value = sessiontimeout.value;
	form.appendChild(hiddensessionidValue);

	if (sessiontimeout.value == "0") {
		msgTag.textContent = "Enter a valid session time out value"
		sessiontimeout.value = "";
		return msgTag;
	}
	if (sessiontimeout.value == null || sessiontimeout.value == "") {
		msgTag.textContent = "Enter session time out value"
		return msgTag;
	}
	if (sessiontimeout.value != null) {
		var valid = isValidNumber(sessiontimeout.value);
		if (!valid) {
			msgTag.textContent = "Enter a valid number and should be less than 300"
			sessiontimeout.value = "";
			return msgTag;
		}
	}


	var hiddenPlayFromBegin = document.createElement('input');
	hiddenPlayFromBegin.type = 'hidden';
	hiddenPlayFromBegin.name = 'playFromBegin';
	hiddenPlayFromBegin.id = 'playFromBegin';
	hiddenPlayFromBegin.value = playFromBegin;

	form.appendChild(hiddenPlayFromBegin);

	form.submit();

}

function deleteVideoProcess() {
	var message = "Are you sure you want to delete..?";
	var msg = document.getElementById("msgSpan");
	var baseurl = document.getElementById('baseurl').value;
	var grid = document.getElementById("dgDeleteVideos");
	var checkBoxes = grid.getElementsByTagName("INPUT");
	var selectItems = [];
	for (var i = 0; i < checkBoxes.length; i++) {
		if (checkBoxes[i].checked) {
			selectItems.push(checkBoxes[i].value);
		}
	}

	if (selectItems.length > 0) {
		var confirmBox = document.createElement("div");
		confirmBox.classList.add('confirm-box');

		var messageBox = document.createElement("div");
		messageBox.classList.add('message-box');
		messageBox.textContent = message;
		confirmBox.appendChild(messageBox);

		var buttonBox = document.createElement("div");
		buttonBox.classList.add('button-box');
		messageBox.appendChild(buttonBox);

		var yesButton = document.createElement("button");
		yesButton.classList.add('yes-button');
		yesButton.textContent = "Yes";
		buttonBox.appendChild(yesButton);
		yesButton.addEventListener('click', YesButtonClick);

		var noButton = document.createElement("button");
		noButton.classList.add('no-button');
		noButton.textContent = "No";
		buttonBox.appendChild(noButton);
		noButton.addEventListener('click', NoButtonClick);


		var dgDeleteVideosPage = document.getElementById("dgDeleteVideosPage").value;
		var providerVal = document.getElementById('providerValue').value.trim();

		function YesButtonClick() {
			submitFormAction(baseurl + "/delete", {
				currentPage: dgDeleteVideosPage,
				providerValue: providerVal,
				videoMasterIds: selectItems,
				gridHeight: screen.height
			});
			removeConfirmBox();
		}

		function NoButtonClick() {
			removeConfirmBox();
		}

		function removeConfirmBox() {
			document.body.removeChild(confirmBox);
		}
		document.body.appendChild(confirmBox);

	} else {
		msg.textContent = "Please select a video.";
	}
}

function setTestPage() {
	//debugger;
	var data = sessionStorage.getItem("session-menu");
	if (data == "false") {
		var sessionmenu = document.querySelectorAll('.wui-side-menu');
		sessionmenu[0].classList.toggle('open');
	} else {
		var sessionmenu = document.querySelectorAll('.wui-side-menu');
		var sessionmenu = document.querySelectorAll('.wui-content')
		sessionmenu[0].classList.toggle('pinned');
	}

	var sessionShowWatermark = sessionStorage.getItem("showWatermark");
	var showWatermark = document.getElementsByName("showWatermark");
	if (sessionShowWatermark != null) {
		for (i = 0; i < showWatermark.length; i++) {
			if (showWatermark[i].value === sessionShowWatermark) {
				showWatermark[i].checked = true;
				break;
			}
		}
	} else {
		showWatermark[0].checked = true;
	}

	var sessionSessiontimeout = sessionStorage.getItem("sessiontimeout");
	var sessiontimeout = document.getElementById("sessiontimeout");
	if (sessionSessiontimeout != null) {
		sessiontimeout.value = sessionSessiontimeout;
	} else {
		sessiontimeout.value = 10;
	}

	var sessionSessionIncrement = sessionStorage.getItem("sessionIncrement");
	var sessionIncrement = document.getElementsByName("sessionincrement");
	if (sessionSessionIncrement != null) {
		for (i = 0; i < sessionIncrement.length; i++) {
			if (sessionIncrement[i].value === sessionSessionIncrement) {
				sessionIncrement[i].checked = true;
				break;
			}
		}
	} else {
		sessionIncrement[1].checked = true;
	}

	var sessionProviderId = sessionStorage.getItem("providerId");
	var selectProvider = document.getElementById("selectProvider");

	if (selectProvider != null) {
		//debugger
		var dropElement = document.getElementById("selectProviderdropdownDiv");
		var chs = dropElement.children;

		if (sessionProviderId != null && sessionProviderId.length > 0) {

			for (let i = 0; i < chs.length; i++) {
				chs[i].style.background = "#FFF";
				chs[i].style.color = "#111";
				var dataValue = chs[i].getAttribute("data-value");
				if (sessionProviderId == dataValue) {
					homeProviderChange(chs[i], true);
					setSelectedValues(chs[i], 'selectProvider');
					break;
				}
			}
		} else {
			if (chs != null && chs.length > 0) {
				setSelectedValues(chs[0], 'selectProvider');
			}

		}

	}

	var sessionVideoId = sessionStorage.getItem("videoId");
	var selectVideo = document.getElementById("selectVideo");

	if (selectVideo != null) {
		//debugger
		var dropElement = document.getElementById("selectVideodropdownDiv");
		var chs = dropElement.children;

		if (sessionVideoId != null && sessionVideoId.length > 0) {

			for (let i = 0; i < chs.length; i++) {
				chs[i].style.background = "#FFF";
				chs[i].style.color = "#111";
				var dataValue = chs[i].getAttribute("data-value");
				if (sessionVideoId == dataValue) {
					homeVideoChange(chs[i]);
					setSelectedValues(chs[i], 'selectVideo');
					break;
				}
			}
		} else {

			if (chs != null && chs.length > 0) {
				setSelectedValues(chs[0], 'selectVideo');
				homeVideoChange(chs[0]);
			}
		}
	}

}


function thumbnailProviderChange(obj) {
	//debugger;
	//obj.size = 0;
	//var providerId = obj.value;
	var providerId = obj.getAttribute("data-value");
	var baseurl = document.getElementById("baseurl");
	showSpinner();
	$.ajax({
		type: "POST",
		url: baseurl.value + "/getThumbnailProviderVideos",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify({
			"providerId": providerId
		}),
		success: function(result) {
			//debugger;
			hideSpinner();
			$('#videoDiv').html(result.providerVideoHtml);
		},
		error: function(res) {
			hideSpinner();
			$('#videoDiv').html(res.responseText);
		}
	});

}

function setDefaultCombo(selectId, placeHolder) {

	var dropdownSelectDivId = selectId + "SelectDiv";
	var selectIdAdditionalId = selectId + "Additional";

	var objSelcted = document.getElementById(selectId);
	objSelcted.value = "";

	var dropdownSelect = document.getElementById(dropdownSelectDivId);
	dropdownSelect.innerText = placeHolder;

	var selectIdAdditional = document.getElementById(selectIdAdditionalId);
	selectIdAdditional.value = "";

}

function saveThumbnailImage() {
	//debugger;
	var uploadClick = document.getElementById("thumbnailUpload");
	uploadClick.disabled = true;

	var msgTag = document.getElementById("msgSpan");
	msgTag.textContent = "";

	var baseurl = document.getElementById("baseurl");
	var provider = document.getElementById("selectProvider");
	//var selectVideo = document.getElementById("selectVideo");
	var selectVideoAdditional = document.getElementById("selectVideoAdditional");

	var providerId = provider.value;
	var sourceId = selectVideoAdditional.value
	var thumbnailImageType = document.getElementById("imageType");

	var thumbnailInputs = {
		providerId: providerId,
		sourceId: sourceId,

	};
	if (validateInputs(thumbnailInputs)) {
		var formData = new FormData();
		formData.append("providerId", providerId);
		formData.append("sourceId", sourceId)
		//formData.append("thumbnailImageType", thumbnailImageType.value);

		if (thumbnailImageType.value == "file") {

			var imageFileInput = document.getElementById("imageFile");
			if (imageFileInput.files[0] != null) {
				formData.append('image', imageFileInput.files[0]);
				formData.append('thumbnailUrl', "");
			} else {
				msgTag.textContent = "Thumbnail Image File is required.";
				uploadClick.disabled = false;
				return;
			}


		} else if (thumbnailImageType.value == "url") {

			var imageUrlInput = document.getElementById("imageUrl");
			if (imageUrlInput.value != null && imageUrlInput.value.length > 0) {
				formData.append('thumbnailUrl', imageUrlInput.value);
				formData.append('image', "");
			} else {
				msgTag.textContent = "Thumbnail Image Url is required.";
				uploadClick.disabled = false;
				return;
			}

		}
		$.ajax({
			type: "POST",
			async: false,
			data: formData,
			processData: false,
			contentType: false,
			url: baseurl.value + "/saveThumbnailVideoImage",
			success: function(response) {
				uploadClick.disabled = false;
				//debugger;
				if (response.status == "Failed") {
					msgTag.textContent = response.message;

				} else if (response.status == "Success") {
					msgTag.textContent = response.message;

					setDefaultCombo("selectProvider", "Select Provider");
					setDefaultCombo("selectVideo", "Select Video");

					thumbnailImageType.selectedIndex = 0;
					document.getElementById("imageFileInput").style.display = "none";
					document.getElementById("imageUrlInput").style.display = "none";
					document.getElementById("imageFile").value = "";
					document.getElementById("imageUrl").value = "";
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				//debugger;
				var json = JSON.parse(xhr.responseText);
				uploadClick.disabled = false;
				if (json.status == "Failed") {
					msgTag.textContent = json.message;
				} else {
					msgTag.textContent = "server responded with status code:" + xhr.status;
				}

			}
		});
	} else {
		msgTag.textContent = "Enter the required fields.";
		uploadClick.disabled = false;
	}
}


function orginalPlayerClose() {
	//debugger;
	var parentPageURL = document.referrer;
	if (parentPageURL != "") {
		var form = document.createElement('form');
		form.method = "POST";
		form.action = parentPageURL;
		document.body.appendChild(form);
		form.submit();
	}
}

function searchDeletedProvider() {
	//debugger;
	var msg = document.getElementById("msgSpan");
	msg.textContent = "";

	var baseurl = document.getElementById('baseurl').value;
	var inputValue = document.getElementById('providerValue').value.trim();

	var targetIds = [dgDeleteVideos];
	var data = {
		currentPage: 1,
		providerValue: inputValue,
		gridHeight: screen.height
	};

	if (inputValue.length == 0 || inputValue.length >= 3) {
		//showSpinner();
		commonSearch(baseurl + "/delete", data, targetIds);
		//submitFormAction(baseurl + "/delete", { currentPage: 1, providerValue: finalInput, gridHeight: screen.height });
	}

}

function homeProviderChange(obj, setSession) {

	//debugger;
	showSpinner();

	var providerId = obj.getAttribute("data-value");

	var baseurl = document.getElementById("baseurl");

	sessionStorage.setItem("providerId", providerId);

	//var userEmail = document.getElementById("userEmail").value.trim();

	$.ajax({
		type: "POST",
		url: baseurl.value + "/getHomeProviderVideos",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify({
			"providerId": providerId

		}),
		success: function(result) {
			//debugger;
			$('#videosDiv').html(result.videoSelecItems);

			$('#videoMoviesDiv').html(result.videoMovies);

			$('#videoSeriesDiv').html(result.videoSeries);
			hideSpinner();

			var sessionVideoId = sessionStorage.getItem("videoId");
			var selectVideo = document.getElementById("selectVideo");

			if (selectVideo != null) {
				// debugger
				var dropElement = document.getElementById("selectVideodropdownDiv");
				var chs = dropElement.children;

				if (setSession != null && setSession == true) {

					if (sessionVideoId != null && sessionVideoId.length > 0) {

						for (let i = 0; i < chs.length; i++) {
							chs[i].style.background = "#FFF";
							chs[i].style.color = "#111";

							var dataValue = chs[i].getAttribute("data-value");
							if (sessionVideoId == dataValue) {
								homeVideoChange(chs[i]);
								setSelectedValues(chs[i], 'selectVideo');
								break;
							}
						}
					} else {
						if (chs != null && chs.length > 0) {
							setSelectedValues(chs[0], 'selectVideo');
							homeVideoChange(chs[0]);
						}
					}
				} else {
					if (chs != null && chs.length > 0) {
						setSelectedValues(chs[0], 'selectVideo');
						homeVideoChange(chs[0]);
					}
				}

			}

		},
		error: function(res) {
			console.log(res.responseText);
			hideSpinner();
		}
	});


}

function showAddProvider() {
	document.getElementById('providerName').value = "";
	var modalError = document.getElementById("modalError");
	modalError.textContent = "";
	$('#providerModal').modal('show');
	var gridError = document.getElementById("gridError");
	gridError.textContent = "";
}

function hideAddProvider() {
	$('#providerModal').modal('hide');
}



function saveAddProvider(baseurl) {

	//debugger;
	var btnAddProvider = document.getElementById("btnAddProvider");
	btnAddProvider.disabled = true;

	var modalError = document.getElementById("modalError");
	modalError.textContent = "";

	var gridError = document.getElementById("gridError");
	gridError.textContent = "";

	//var baseurl = document.getElementById("baseurl");
	var providerName = document.getElementById('providerName').value.trim();

	var dataInputs = {
		providerName: providerName
	};

	if (validateInputs(dataInputs)) {
		var formData = new FormData();
		formData.append("providerName", providerName);

		var targetIds = [dgProviderTokens];
		var inputValue = document.getElementById('providerValue').value.trim();
		var data = {
			currentPage: 1,
			providerValue: inputValue,
			gridHeight: screen.height
		};

		$.ajax({
			type: "POST",
			async: false,
			data: formData,
			processData: false,
			contentType: false,
			url: baseurl + "/saveProvider",
			success: function(response) {

				if (response.status == "Failed") {
					modalError.textContent = response.message;
					btnAddProvider.disabled = false;
				} else if (response.status == "Success") {
					gridError.textContent = response.message;
					btnAddProvider.disabled = false;
					showSpinner();

					submitFormAction(baseurl + "/providers", data);

					$('#providerModal').modal('hide');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				var json = JSON.parse(xhr.responseText);
				btnAddProvider.disabled = false;
				if (json.status == "Failed") {
					modalError.textContent = json.message;
				} else {
					modalError.textContent = "server responded with status code:" + xhr.status;
				}

			}
		});
	} else {
		modalError.textContent = "Provider Name is required.";
		btnAddProvider.disabled = false;
	}

}

function showGenProviderToken() {
	//document.getElementById('providerName').value = "";
	var modalError = document.getElementById("modalErrorGen");
	modalError.textContent = "";

	var gridError = document.getElementById("gridError");
	gridError.textContent = "";


	var fromDate = document.getElementById("fromDate");
	fromDate.value = "";
	var endDate = document.getElementById("endDate");
	endDate.value = "";

	setDefaultCombo("selectProvider", "Select Provider");
	var elements = document.getElementsByTagName("input");
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].type != "hidden") {
			if (elements[i].id != "providerValue") {
				elements[i].value = "";
			}

		}
	}

	$('#providerTokenModal').modal('show');

}

function hideGenProviderToken() {
	$('#providerTokenModal').modal('hide');
}


function saveGenProviderToken(baseurl) {

	//debugger;
	showSpinner();
	var btnAddProviderToken = document.getElementById("btnAddProviderToken");
	btnAddProviderToken.disabled = true;

	var modalError = document.getElementById("modalErrorGen");
	modalError.textContent = "";

	var gridError = document.getElementById("gridError");
	gridError.textContent = "";

	//var baseurl = document.getElementById("baseurl");

	//	var dropElement = document.getElementById("clbProvider");
	//	var chs = dropElement.children;
	//	var selectItems = [];
	//	for (var i = 0; i < chs.length; i++) {
	//
	//		var chk = chs[i].children[0];
	//		if (chk.checked) {
	//			selectItems.push(chk.value);
	//		}
	//
	//	}

	var selectProvider = document.getElementById("selectProvider");

	if (selectProvider.value.length == 0) {
		hideSpinner();
		modalError.textContent = "Please select Provider Name.";
		btnAddProviderToken.disabled = false;
		return;
	}


	//if (selectProvider.value.length > 0) {


	var targetIds = [dgProviderTokens];
	var inputValue = document.getElementById('providerValue').value.trim();
	var fromDate = document.getElementById('fromDate').value.trim();
	var endDate = document.getElementById('endDate').value.trim();
	var sendToEmail = document.getElementById('sendToEmail').value.trim();

	if (sendToEmail.length == 0) {
		hideSpinner();
		modalError.textContent = "Please enter Send To Email";
		btnAddProviderToken.disabled = false;
		return;
	}

	if (fromDate.length == 0) {
		hideSpinner();
		modalError.textContent = "Please select From DateTime";
		btnAddProviderToken.disabled = false;
		return;
	}

	if (endDate.length == 0) {
		hideSpinner();
		modalError.textContent = "Please select End DateTime";
		btnAddProviderToken.disabled = false;
		return;
	}

	if (validateEmail(sendToEmail) == false) {

		modalError.textContent = "Invalid send To Email";
		btnAddProviderToken.disabled = false;
		hideSpinner();
		return;
	}


	var data = {
		currentPage: 1,
		providerValue: inputValue,
		gridHeight: screen.height
	};



	//		var json = " [";
	//		for (var i = 0; i < selectItems.length; i++) {
	//			if ((i + 1) == selectItems.length) {
	//				json += "{\"providerId\" : \"" + selectItems[i] + "\",\"validFromDate\" : \"" + fromDate +"\",\"validEndDate\" : \"" + endDate + "\"} ";
	//			}
	//			else {
	//				json += "{\"providerId\" : \"" + selectItems[i] + "\",\"validFromDate\" : \"" + fromDate +"\",\"validEndDate\" : \"" + endDate + "\"}, ";
	//			}
	//		}
	//		json += "] ";

	//console.log(json);



	var dropdownSelectRowId = "selectProviderSelectRow";
	var selectProviderSelectRow = document.getElementById(dropdownSelectRowId);

	var providerName = selectProviderSelectRow.value;

	var dataToPost = {
		providerName: providerName,
		validFromDate: fromDate,
		validEndDate: endDate,
		sendToEmail: sendToEmail
	};

	$.ajax({
		type: "POST",
		async: false,
		data: JSON.stringify(dataToPost),
		processData: false,
		contentType: "application/json",
		url: baseurl + "/saveProviderToken",
		success: function(response) {
			//debugger;
			hideSpinner();
			btnAddProviderToken.disabled = false;
			if (response.status == "Failed") {
				modalError.textContent = response.message;

			} else if (response.status == "Success") {
				gridError.textContent = response.message;
				commonSearch(baseurl + "/providers", data, targetIds);

				$('#providerTokenModal').modal('hide');
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			//debugger;
			hideSpinner();
			btnAddProviderToken.disabled = false;
			var json = JSON.parse(xhr.responseText);

			if (json.status == "Failed") {
				modalError.textContent = json.message;
			} else {
				modalError.textContent = "server responded with status code:" + xhr.status;
			}

		}
	});
	//	} else {
	//		hideSpinner();
	//		modalError.textContent = "Please select provider.";
	//		btnAddProviderToken.disabled = false;
	//	}

}

//function showAssignVideos() {
//	showSpinner();
//	var gridError = document.getElementById("gridError");
//	gridError.textContent = "";
//	var baseurl = document.getElementById('baseurl').value;
//
//	submitFormAction(baseurl + "/uservideosassign", {
//		currentPage: 1,
//		gridHeight: screen.height
//	});
//
//}


function saveUserTokenDelay() {
	var saveButton = document.getElementById("btnSaveUserToken");
	saveButton.disabled = true;
	showSpinner();

	setTimeout(function() {
		saveUserToken();
	}, 300);
}

function saveUserToken() {
	//debugger;
	var gridError = document.getElementById("gridError");
	gridError.textContent = "";
	
	
	var dropdownSelectUserDivId =  "selectUserSelectDiv";

	var userEmail = document.getElementById(dropdownSelectUserDivId).innerText;
	var providerId = document.getElementById("selectProvider").value;
	var grid = document.getElementById("dgProviderVideos");
	var baseurl = document.getElementById('baseurl').value;
	var saveButton = document.getElementById("btnSaveUserToken");
	//var sendToEmail = document.getElementById('sendToEmail').value.trim();

	if (userEmail === '') {
		gridError.textContent = "Please enter User Email";
		saveButton.disabled = false;
		hideSpinner();
		return;
	}

	if (validateEmail(userEmail) == false) {

		gridError.textContent = "Invalid User Email";
		saveButton.disabled = false;
		hideSpinner();
		return;
	}

	var fromDate = document.getElementById('fromDate').value.trim();
	var endDate = document.getElementById('endDate').value.trim();

	if (fromDate.length == 0) {
		hideSpinner();
		gridError.textContent = "Please select From Date";
		saveButton.disabled = false;
		return;
	}

	if (endDate.length == 0) {
		hideSpinner();
		gridError.textContent = "Please select End Date";
		saveButton.disabled = false;
		return;
	}


	//	if (sendToEmail.length == 0) {
	//		hideSpinner();
	//		gridError.textContent = "Please enter Send To Email";
	//		saveButton.disabled = false;
	//		return;
	//	}
	//
	//
	//	if (validateEmail(sendToEmail) == false) {
	//
	//		gridError.textContent = "Invalid Send To Email";
	//		saveButton.disabled = false;
	//		hideSpinner();
	//		return;
	//	}

	var selectItems = [];
	if (grid) {
		var checkBoxes = grid.getElementsByTagName("INPUT");

		for (var i = 0; i < checkBoxes.length; i++) {
			if (checkBoxes[i].type == "checkbox" && checkBoxes[i].checked) {
				selectItems.push(checkBoxes[i].value);
			}
		}
	}

	if (selectItems.length == 0) {
		gridError.textContent = "Please select video";
		saveButton.disabled = false;
		hideSpinner();
		return;
	}

	if (selectItems.length > 1) {
		gridError.textContent = "Please select one video only";
		saveButton.disabled = false;
		hideSpinner();
		return;
	}

	//debugger;


	//var strArray = selectItems.join(',');  // 'A, B, C'

	var url = baseurl + "/saveusertoken";
	//debugger;
	var dataToPost = JSON.stringify({
		providerId: providerId,
		userEmail: userEmail,
		sourceId: selectItems[0],
		validFromDate: fromDate,
		validEndDate: endDate
	});


	//var inputValue = document.getElementById('userValue').value.trim();

	$.ajax({
		type: "POST",
		url: url,
		data: dataToPost,
		processData: false,
		contentType: "application/json",
		success: function(response) {
			//debugger;	
			hideSpinner();
			gridError.textContent = response.message;
			if (response.status == "Success") {

				submitFormAction(baseurl + "/users", {
					currentPage: 1,
					gridHeight: screen.height,
					message: response.message,
					//inputValue: inputValue
				});
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			hideSpinner();
			//debugger;
			saveButton.disabled = false;
			console.log(xhr);
			//var response = xhr.responseText;
			var json = JSON.parse(xhr.responseText);
			if (json.status == "Failed") {
				//console.log(response);
				gridError.textContent = json.message;

			} else {
				gridError.textContent = "server responded with status code:" + xhr.status;

			}

		}
	});

}


function uvProviderChange(obj) {

	var providerId = obj.getAttribute("data-value");

	var baseurl = document.getElementById('baseurl').value;

	var targetIds = [dgProviderVideos];
	var data = {
		currentPage: 1,
		providerId: providerId,
		gridHeight: screen.height
	};

	//showSpinner();
	commonSearch(baseurl + "/providervideos", data, targetIds);
	
	
	
	showSpinner();
	$.ajax({
		type: "POST",
		url: baseurl + "/getProviderUsers",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify({
			"providerId": providerId
		}),
		success: function(result) {
			//debugger;
			hideSpinner();
			$('#usersDiv').html(result.providerUserHtml);
		},
		error: function(res) {
			hideSpinner();
			$('#usersDiv').html(res.responseText);
		}
	});

}


jQuery.event.special.touchstart = {
	setup: function(_, ns, handle) {
		if (ns.includes("noPreventDefault")) {
			handle.originalHandle = handle;
			handle.originalHandle.preventDefault = handle.preventDefault;
			handle.preventDefault = function(event) {
				if (event.originalEvent) {
					event.originalEvent.preventDefault();
				}
				this.originalHandle.preventDefault();
			};
		}
	}
};

function homeVideoChange(obj) {


	var videoId = obj.getAttribute("data-value");

	sessionStorage.setItem("videoId", videoId);

}



/*
function dgVideosAction(videoMasterId) {

	var table = document.getElementById("dgVideos"), rIndex;
	for (var i = 2; i < table.rows.length; i++) {
		table.rows[i].onclick = function() {
			rIndex = this.rowIndex;
			var vidoeNamedataTooltip = '';
			var episodeNamedataTooltip = '';
			var videoDescriptiondataTooltip = '';

			seletedVideoMaterId = this.cells[0].innerText;
			document.getElementById("updateVideoMasterId").value = videoMasterId;
			document.getElementById("providerName").value = this.cells[1].innerText;

			//VidoeName
			if (this.cells[2].children.length === 1) {
				vidoeNamedataTooltip = this.cells[2].children.tdSpanValue.getAttribute('data-tooltip');
			}

			if (vidoeNamedataTooltip) {
				document.getElementById("videoName").value = vidoeNamedataTooltip;
			} else {
				document.getElementById("videoName").value = this.cells[2].innerText;
			}

			//Type
			document.getElementById("type").innerText = this.cells[4].innerText;
			var type = this.cells[4].innerText;
			var episodeName = document.getElementById("episodeName");
			var episodeNameLable = document.getElementById("episodeNameLable");

			if (type.toLowerCase() == "movie") {
				episodeName.style.display = "none";
				episodeNameLable.style.display = "none";
			} else {
				episodeName.style.display = "block";
				episodeNameLable.style.display = "block";
			}

			document.getElementById("language").value = this.cells[5].innerText;

			//EpisodeName
			if (this.cells[8].children.length === 1) {
				episodeNamedataTooltip = this.cells[8].children.tdSpanValue.getAttribute('data-tooltip');
			}
			if (episodeNamedataTooltip) {
				document.getElementById("episodeName").value = episodeNamedataTooltip;
			} else {
				document.getElementById("episodeName").value = this.cells[8].innerText;
			}


			document.getElementById("releaseDate").value = this.cells[9].innerText;
			document.getElementById("endDate").value = this.cells[10].innerText.trim();

			//videoDescription
			if (this.cells[15].children.length === 1) {
				videoDescriptiondataTooltip = this.cells[15].children.tdSpanValue.getAttribute('data-tooltip');
			}
			if (videoDescriptiondataTooltip) {
				document.getElementById("videoDescription").value = videoDescriptiondataTooltip;
			} else {
				document.getElementById("videoDescription").value = this.cells[15].innerText;
			}
			showPopup();
		}


	}

}
*/

function updatePopupChanges() {
	var updateChages = document.getElementById("updateChages");
	updateChages.disabled = false;
	var videoMasterId = document.getElementById("updateVideoMasterId").value.trim();
	var modifiedVideoName = document.getElementById("videoName").value.trim();
	var providerName = document.getElementById("providerName").value.trim();
	var videoDescription = document.getElementById("videoDescription").value.trim();
	var language = document.getElementById("language").value.trim();
	var episodeName = document.getElementById("episodeName").value.trim();
	var releaseDateVal = document.getElementById("releaseDate").value.trim();
	var endDateVal = document.getElementById("endDate").value.trim();
	var typeVal = document.getElementById("type").innerText.trim();

	var baseurl = document.getElementById('baseurl').value;
	var modalError = document.getElementById("modalError");
	var gridError = document.getElementById("gridError");

	var dataInputs = {
		videoName: modifiedVideoName
	};
	if (validateInputs(dataInputs)) {

		var targetIds = [dgVideos];
		var inputValue = document.getElementById('providerValue').value.trim();
		var videoMasterIdVal = document.getElementById("updateVideoMasterId").value.trim();
		var dgVideosPage = document.getElementById("dgVideosPage").value;
		var data = {
			currentPage: dgVideosPage,
			providerValue: inputValue,
			gridHeight: screen.height,
			videoMasterId: videoMasterIdVal
		};

		var dataToPost = JSON.stringify({
			"videoMasterId": videoMasterId,
			"videoName": modifiedVideoName,
			"providerName": providerName,
			"videoDescription": videoDescription,
			"language": language,
			"episodeName": episodeName,
			"releaseDate": releaseDateVal,
			"endDate": endDateVal,
			"type": typeVal

		});

		$.ajax({
			type: "POST",
			async: false,
			data: dataToPost,
			processData: false,
			contentType: "application/json; charset=utf-8",
			url: baseurl + "/updateVideo",
			success: function(response) {
				if (response.status == "Failed") {

					$('#updatePopup').modal('show');
					modalError.textContent = response.message;
				} else if (response.status == "Success") {
					$('#updatePopup').modal('hide');
					gridError.textContent = response.message;
					//showSpinner();
					commonSearch(baseurl + "/videos", data, targetIds);
					modalError.textContent = "";
					$('#updatePopup').modal('hide');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				var json = JSON.parse(xhr.responseText);
				if (json.status == "Failed") {
					$('#updatePopup').modal('show');
					modalError.textContent = json.message;
				} else {
					modalError.textContent = "server responded with status code:" + xhr.status;
				}

			}
		});
	} else {
		modalError.textContent = "Video Name is required.";
	}
}

function showGenerateUserToken() {
	showSpinner();
	var gridError = document.getElementById("gridError");
	gridError.textContent = "";
	var baseurl = document.getElementById('baseurl').value;

	submitFormAction(baseurl + "/usertoken", {
		currentPage: 1,
		gridHeight: screen.height
	});

}

function getUserDetails() {
	var baseurl = document.getElementById('baseurl').value;
	var dgUserDataPage = document.getElementById("dgUserDataPage").value;
	submitFormAction(baseurl + "/getUserDetails", {
		currentPage: dgUserDataPage,
		gridHeight: screen.height
	});
}

function updateUserStatus(obj) {
	var selectedOption = obj.value;

	var btnActivated = document.getElementById("btnActivated");
	var btnDeactivated = document.getElementById("btnDeactivated");

	var modalError = document.getElementById("msgSpan");
	modalError.textContent = "";

	var gridError = document.getElementById("gridError");
	gridError.textContent = "";

	var baseurl = document.getElementById('baseurl').value;

	var grid = document.getElementById("dgUserData");

	var checkBoxes = grid.getElementsByTagName("INPUT");

	var message = "Are you sure you want to proceed..?";

	var selectedUserIds = [];

	for (var i = 0; i < checkBoxes.length; i++) {
		if (checkBoxes[i].checked) {
			selectedUserIds.push(checkBoxes[i].value);
		}
	}

	if (selectedOption != null) {

		if (selectedUserIds.length == 0) {
			modalError.textContent = "Please select User Email.";
			btnActivated.disabled = false;
			btnDeactivated.disabled = false;
			return;
		}

		var confirmBox = document.createElement("div");
		confirmBox.classList.add('confirm-box');

		var messageBox = document.createElement("div");
		messageBox.classList.add('message-box');
		messageBox.textContent = message;
		confirmBox.appendChild(messageBox);

		var buttonBox = document.createElement("div");
		buttonBox.classList.add('button-box');
		messageBox.appendChild(buttonBox);

		var yesButton = document.createElement("button");
		yesButton.classList.add('yes-button');
		yesButton.textContent = "Yes";
		buttonBox.appendChild(yesButton);
		yesButton.addEventListener('click', YesButtonClick);

		var noButton = document.createElement("button");
		noButton.classList.add('no-button');
		noButton.textContent = "No";
		buttonBox.appendChild(noButton);
		noButton.addEventListener('click', NoButtonClick);


		var targetIds = [dgUserData];


		var data = {
			currentPage: 1,
			gridHeight: screen.height
		};


		var dataToPost = JSON.stringify({
			active: selectedOption,
			userIds: selectedUserIds
		});

		function YesButtonClick() {
			$.ajax({
				type: "POST",
				async: false,
				data: dataToPost,
				processData: false,
				contentType: "application/json",
				url: baseurl + "/updateUserStatus",
				success: function(response) {
					btnActivated.disabled = false;
					btnDeactivated.disabled = false;
					if (response.status == "Failed") {
						modalError.textContent = response.message;
						removeConfirmBox();

					} else if (response.status == "Success") {
						gridError.textContent = response.message;
						commonSearch(baseurl + "/getUserDetails", data, targetIds);
						removeConfirmBox();
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					btnActivated.disabled = false;
					btnDeactivated.disabled = false;
					var json = JSON.parse(xhr.responseText);

					if (json.status == "Failed") {
						modalError.textContent = json.message;
						removeConfirmBox();
					} else {
						modalError.textContent = "server responded with status code:" + xhr.status;
					}

				}
			});
		}
		function NoButtonClick() {
			removeConfirmBox();
		}

		function removeConfirmBox() {
			document.body.removeChild(confirmBox);
		}
		document.body.appendChild(confirmBox);

	}
}

function searchUserStatus() {

	var baseurl = document.getElementById('baseurl').value;

	var userValue = document.getElementById('userValue').value.trim();


	if (userValue.length == 0 || userValue.length >= 3) {
		var targetIds = [dgUserData];
		var data = {
			currentPage: 1,
			userValue: userValue,
			gridHeight: screen.height
		}

		commonSearch(baseurl + "/getUserDetails", data, targetIds);
	}

}


function setVideoAnalysisPage() {

	var selectProvider = document.getElementById("selectProvider");

	if (selectProvider != null) {
		//debugger
		var dropElement = document.getElementById("selectProviderdropdownDiv");
		var chs = dropElement.children;

		if (chs != null && chs.length > 0) {
			setSelectedValues(chs[0], 'selectProvider');
		}
	}

	var selectVideo = document.getElementById("selectVideo");

	if (selectVideo != null) {
		//debugger
		var dropElement = document.getElementById("selectVideodropdownDiv");
		var chs = dropElement.children;

		if (chs != null && chs.length > 0) {
			setSelectedValues(chs[0], 'selectVideo');
		}

	}

}


function saveVideoAnalysis() {
	//debugger;
	var uploadClick = document.getElementById("btnVideoUpload");
	uploadClick.disabled = true;

	var msgTag = document.getElementById("gridError");
	msgTag.textContent = "";

	var baseurl = document.getElementById("baseurl");


	var selectProvider = document.getElementById("selectProvider");
	//var selectVideo = document.getElementById("selectVideo");
	var selectVideoAdditional = document.getElementById("selectVideoAdditional");


	var sourceId = selectVideoAdditional.value

	var selectProviderVal = selectProvider.value;
	//var selectVideoVal = selectVideo.value;

	if (selectProviderVal.length > 0) {

	}
	else {
		msgTag.textContent = "Please select provider";
		return msgTag;
	}

	if (sourceId.length > 0) {

	}
	else {
		msgTag.textContent = "Please select video";
		return msgTag;
	}

	var formData = new FormData();

	formData.append('providerId', selectProviderVal);
	formData.append('sourceId', sourceId);

	var videoFile = document.getElementById("videoFile");
	if (videoFile.files[0] != null) {
		formData.append('videoFile', videoFile.files[0]);

	} else {
		msgTag.textContent = "Video File is required.";
		uploadClick.disabled = false;
		return;
	}


	$.ajax({
		type: "POST",
		async: false,
		data: formData,
		processData: false,
		contentType: false,
		url: baseurl.value + "/saveVideoAnalysis",
		success: function(response) {
			uploadClick.disabled = false;
			//debugger;
			if (response.status == "Failed") {
				msgTag.textContent = response.message;

			} else if (response.status == "Success") {
				msgTag.textContent = response.message;
				var targetIds = [dgVideoAnalysis];
				var data = {
					currentPage: 1,
					gridHeight: screen.height
				}
				commonSearch(baseurl.value + "/videoAnalysis", data, targetIds);
			}

		},
		error: function(xhr, textStatus, errorThrown) {
			//debugger;
			var json = JSON.parse(xhr.responseText);
			uploadClick.disabled = false;
			if (json.status == "Failed") {
				msgTag.textContent = json.message;
			} else {
				msgTag.textContent = "server responded with status code:" + xhr.status;
			}

		}
	});

}

function videoAnalysisProviderChange(obj) {

	//debugger;
	showSpinner();

	var providerId = obj.getAttribute("data-value");

	var baseurl = document.getElementById("baseurl");

	$.ajax({
		type: "POST",
		url: baseurl.value + "/getVideoAnalysisProviderVideos",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify({
			"providerId": providerId

		}),
		success: function(result) {
			//debugger;
			$('#videosDiv').html(result.videoSelecItems);

			hideSpinner();

			var selectVideo = document.getElementById("selectVideo");

			if (selectVideo != null) {
				// debugger
				var dropElement = document.getElementById("selectVideodropdownDiv");
				var chs = dropElement.children;
				if (chs != null && chs.length > 0) {
					setSelectedValues(chs[0], 'selectVideo');

				}
			}

		},
		error: function(res) {
			console.log(res.responseText);
			hideSpinner();
		}
	});
}

function searchAspectRatios(baseurl) {
	var msg = document.getElementById("gridError");
	msg.textContent = "";

	var baseurl = document.getElementById('baseurl').value;
	var inputValue = document.getElementById('providerValue').value.trim();

	var targetIds = [dgAspectRatios];
	var data = {
		currentPage: 1,
		providerValue: inputValue,
		gridHeight: screen.height
	};


	if (inputValue.length === 0 || inputValue.length >= 3) {
		//showSpinner();
		commonSearch(baseurl + "/aspectratios", data, targetIds);
		//submitFormAction(baseurl + "/providers", { currentPage: 1, providerValue: inputValue, gridHeight: screen.height });
	}

}


function showEditAspectRatio() {
	//document.getElementById('providerName').value = "";
	var modalError = document.getElementById("modalError");
	modalError.textContent = "";
	$('#aspectRatioModal').modal('show');
	var gridError = document.getElementById("gridError");
	gridError.textContent = "";

	var mode = document.getElementById("mode");
	mode.textContent = "Edit Aspect Ratio";
}


function showAspectRatio() {
	//document.getElementById('providerName').value = "";
	var modalError = document.getElementById("modalError");
	modalError.textContent = "";
	$('#aspectRatioModal').modal('show');
	var gridError = document.getElementById("gridError");
	gridError.textContent = "";

	var mode = document.getElementById("mode");
	mode.textContent = "Add Aspect Ratio";
}

function hideAspectRatio() {
	$('#aspectRatioModal').modal('hide');
}

function aspectRatioChange(obj, widthHeight) {

	showSpinner();

	var aspectRatio = obj.getAttribute("data-value")

	//var dataType = obj.getAttribute("data-additional");

	var baseurl = document.getElementById("baseurl");

	var formData = new FormData();
	formData.append("aspectRatio", aspectRatio);

	//dataType: "json",
	//	contentType: "application/json",

	$.ajax({
		type: "POST",
		url: baseurl.value + "/getAspectRatioWidths",
		data: formData,
		processData: false,
		contentType: false,
		success: function(result) {
			//debugger;
			hideSpinner();
			$('#widthHeightDiv').html(result.aspectRatioWidthsHtml);


			var selectAspectRatioWidthHeight = document.getElementById("selectAspectRatioWidthHeight");

			if (selectAspectRatioWidthHeight != null && widthHeight != null && widthHeight.length > 0) {
				// debugger
				var dropElement = document.getElementById("selectAspectRatioWidthHeightdropdownDiv");
				var chs = dropElement.children;

				for (let i = 0; i < chs.length; i++) {
					//chs[i].style.background = "#FFF";
					//chs[i].style.color = "#111";

					var dataValue = chs[i].getAttribute("data-value");
					if (widthHeight == dataValue) {
						setSelectedValues(chs[i], 'selectAspectRatioWidthHeight');
						break;
					}
				}

			}

		},
		error: function(res) {
			hideSpinner();
			$('#widthHeightDiv').html(res.responseText);
		}
	});

}



function saveAspectRatio(baseurl) {

	//debugger;
	var btnSaveAspectRatio = document.getElementById("btnSaveAspectRatio");
	btnSaveAspectRatio.disabled = true;

	var modalError = document.getElementById("modalError");
	modalError.textContent = "";

	var gridError = document.getElementById("gridError");
	gridError.textContent = "";


	var selectProvider = document.getElementById("selectProvider");

	if (selectProvider.value.length == 0) {
		hideSpinner();
		modalError.textContent = "Please select Provider Name.";
		btnSaveAspectRatio.disabled = false;
		return;
	}


	var selectAspectRatio = document.getElementById("selectAspectRatio");

	if (selectAspectRatio.value.length == 0) {
		hideSpinner();
		modalError.textContent = "Please select Aspect Ratio.";
		btnSaveAspectRatio.disabled = false;
		return;
	}

	var selectAspectRatioWidthHeight = document.getElementById("selectAspectRatioWidthHeight");

	if (selectAspectRatioWidthHeight.value.length == 0) {
		hideSpinner();
		modalError.textContent = "Please select WidthxHeight.";
		btnSaveAspectRatio.disabled = false;
		return;
	}


	var videoBitrateVal = document.getElementById("videoBitrate").value;
	var audioBitrateVal = document.getElementById("audioBitrate").value;

	if (videoBitrateVal.length == 0) {
		hideSpinner();
		modalError.textContent = "Please enter Video Bitrate.";
		btnSaveAspectRatio.disabled = false;
		return;
	}

	if (audioBitrateVal.length == 0) {
		hideSpinner();
		modalError.textContent = "Please enter Audio Bitrate.";
		btnSaveAspectRatio.disabled = false;
		return;
	}



	var selectProviderSelectRow = document.getElementById("selectProviderSelectRow");

	var providerNameVal = selectProviderSelectRow.value;

	var selectAspectRatioSelectRow = document.getElementById("selectAspectRatioSelectRow");
	var aspectRatioVal = selectAspectRatioSelectRow.value;

	var selectAspectRatioWidthHeightSelectRow = document.getElementById("selectAspectRatioWidthHeightSelectRow");
	var widthHeightVal = selectAspectRatioWidthHeightSelectRow.value;

	const myArray = widthHeightVal.split("x");


	var widthVal = parseInt(myArray[0]);
	var heightVal = parseInt(myArray[1]);

	var targetIds = [dgAspectRatios];
	var inputValue = document.getElementById('providerValue').value.trim();
	var data = {
		currentPage: 1,
		providerValue: inputValue,
		gridHeight: screen.height
	};

	var idVal = document.getElementById("updateId").value;

	var dataToPost = {
		id: idVal,
		providerName: providerNameVal,
		aspectRatio: aspectRatioVal,
		width: widthVal,
		height: heightVal,
		videoBitrate: videoBitrateVal,
		audioBitrate: audioBitrateVal
	};

	//debugger;
	$.ajax({
		type: "POST",
		async: false,
		data: JSON.stringify(dataToPost),
		processData: false,
		contentType: "application/json",
		url: baseurl + "/saveAspectRatio",
		success: function(response) {

			if (response.status == "Failed") {
				modalError.textContent = response.message;
				btnSaveAspectRatio.disabled = false;
			} else if (response.status == "Success") {
				gridError.textContent = response.message;
				btnSaveAspectRatio.disabled = false;
				showSpinner();

				//submitFormAction(baseurl + "/aspectratios", data);

				commonSearch(baseurl + "/aspectratios", data, targetIds);

				$('#aspectRatioModal').modal('hide');
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			var json = JSON.parse(xhr.responseText);
			btnSaveAspectRatio.disabled = false;
			if (json.status == "Failed") {
				modalError.textContent = json.message;
			} else {
				modalError.textContent = "server responded with status code:" + xhr.status;
			}

		}
	});

}

function showAddUser() {
	//document.getElementById('providerName').value = "";
	var modalError = document.getElementById("modalError");
	modalError.textContent = "";
	$('#userModal').modal('show');
	var gridError = document.getElementById("gridError");
	gridError.textContent = "";

	var mode = document.getElementById("mode");
	mode.textContent = "Add User";
}

function hideAddUser() {
	$('#userModal').modal('hide');
}

function showEditUser() {
	//document.getElementById('providerName').value = "";
	var modalError = document.getElementById("modalError");
	modalError.textContent = "";
	$('#userModal').modal('show');
	var gridError = document.getElementById("gridError");
	gridError.textContent = "";

	var mode = document.getElementById("mode");
	mode.textContent = "Edit User";
}

function saveUser(baseurl) {

	//debugger;
	var btnUser = document.getElementById("btnUser");
	btnUser.disabled = true;

	var modalError = document.getElementById("modalError");
	modalError.textContent = "";

	var gridError = document.getElementById("gridError");
	gridError.textContent = "";


	var selectProvider = document.getElementById("selectProvider");

	if (selectProvider.value.length == 0) {
		hideSpinner();
		modalError.textContent = "Please select Provider Name.";
		btnUser.disabled = false;
		return;
	}


	var selectRole = document.getElementById("selectRole");

	if (selectRole.value.length == 0) {
		hideSpinner();
		modalError.textContent = "Please select Role.";
		btnUser.disabled = false;
		return;
	}

	var userEmailVal = document.getElementById("userEmail").value;
	var userPasswordVal = document.getElementById("userPassword").value;

	if (userEmailVal.length == 0) {
		hideSpinner();
		modalError.textContent = "Please enter User Email.";
		btnUser.disabled = false;
		return;
	}

	if (userPasswordVal.length == 0) {
		hideSpinner();
		modalError.textContent = "Please enter User Password.";
		btnUser.disabled = false;
		return;
	}



	var selectProviderSelectRow = document.getElementById("selectProviderSelectRow");

	var providerNameVal = selectProviderSelectRow.value;

	var selectRoleSelectRow = document.getElementById("selectRoleSelectRow");
	var roleVal = selectRoleSelectRow.value;

	var targetIds = [dgUserData];
	//var inputValue = document.getElementById('providerValue').value.trim();
	//providerValue: inputValue,
	var data = {
		currentPage: 1,
		gridHeight: screen.height
	};

	var idVal = document.getElementById("updateId").value;

	var dataToPost = {
		id: idVal,
		providerName: providerNameVal,
		roleName: roleVal,
		userEmail: userEmailVal,
		userPassword: userPasswordVal
	};

	//debugger;
	$.ajax({
		type: "POST",
		async: false,
		data: JSON.stringify(dataToPost),
		processData: false,
		contentType: "application/json",
		url: baseurl + "/saveUser",
		success: function(response) {

			if (response.status == "Failed") {
				modalError.textContent = response.message;
				btnUser.disabled = false;
			} else if (response.status == "Success") {
				gridError.textContent = response.message;
				btnUser.disabled = false;
				showSpinner();
				commonSearch(baseurl + "/getUserDetails", data, targetIds);

				$('#userModal').modal('hide');
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			var json = JSON.parse(xhr.responseText);
			btnUser.disabled = false;
			if (json.status == "Failed") {
				modalError.textContent = json.message;
			} else {
				modalError.textContent = "server responded with status code:" + xhr.status;
			}

		}
	});

}

function impProviderChange(obj) {
	//debugger;
	//obj.size = 0;
	//var providerId = obj.value;
	var errorSpan = document.getElementById('errorSpan');
	errorSpan.textContent = "";

	var providerId = obj.getAttribute("data-value");
	var baseurl = document.getElementById("baseurl");
	showSpinner();
	$.ajax({
		type: "POST",
		url: baseurl.value + "/getProviderUsers",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify({
			"providerId": providerId
		}),
		success: function(result) {
			//debugger;
			hideSpinner();
			$('#usersDiv').html(result.providerUserHtml);
		},
		error: function(res) {
			hideSpinner();
			$('#usersDiv').html(res.responseText);
		}
	});

}

function impersonate() {

	//debugger;
	var btnImpersonate = document.getElementById("btnImpersonate");
	btnImpersonate.disabled = true;

	var errorSpan = document.getElementById('errorSpan');
	errorSpan.textContent = "";

	var selectProvider = document.getElementById("selectProvider");

	if (selectProvider.value.length == 0) {
		hideSpinner();
		errorSpan.textContent = "Please select Provider Name.";
		btnImpersonate.disabled = false;
		return;
	}

	var selectUser = document.getElementById("selectUser");

	if (selectUser.value.length == 0) {
		hideSpinner();
		errorSpan.textContent = "Please select User Email.";
		btnImpersonate.disabled = false;
		return;
	}

	var dataToPost = {
		userId: selectUser.value
	};

	//debugger;
	var baseurl = document.getElementById('baseurl').value;
	$.ajax({
		type: "POST",
		async: false,
		data: JSON.stringify(dataToPost),
		processData: false,
		contentType: "application/json",
		url: baseurl + "/impersonate",
		success: function(response) {
			//debugger;
			if (response.status == "Failed") {
				errorSpan.textContent = response.message;
				btnImpersonate.disabled = false;
			} else if (response.status == "Success") {
				errorSpan.textContent = response.message;
				btnImpersonate.disabled = false;
				showSpinner();
				//commonSearch(baseurl + "/getUserDetails", data, targetIds);

				//$('#userModal').modal('hide');
				submitFormAction(baseurl + '/home');
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			//debugger;
			if (xhr.status == 404) {
				errorSpan.textContent = "server responded with status code:" + xhr.status;
			}
			else {
				var json = JSON.parse(xhr.responseText);
				btnImpersonate.disabled = false;
				if (json.status == "Failed") {
					errorSpan.textContent = json.message;
				} else {
					errorSpan.textContent = "server responded with status code:" + xhr.status;
				}
			}


		}
	});


}

