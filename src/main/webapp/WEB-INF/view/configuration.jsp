<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri="tags/customtag.tld" prefix="ct"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="common/top.jsp"></jsp:include>
</head>
<body>
	<jsp:include page="common/header.jsp"></jsp:include>

	<input type="hidden" id=pKeyList />
	<input type="hidden" id=providerKeyList />
	<input type="hidden" id=providerVideoKeyList />

	<div class="container-fluid padding-container margin-Topbottom">
		<div style="min-height:30px;">
			<span id="gridError" style="color:red; font-size: 15px;padding-left:10px;"></span>
		</div>
		<div class="row gx-2">

			<div class="col-md-6 col-lg-6 ">
				<div class="">
					<h4 style="font-weight: bold; background: #E3DEDD; width: 100%">Global Keys</h4>

					<ct:dataGrid dataSource="${gConfigKeys}" keyField="configKey" id="dgGlobalConfig" name="dgGlobalConfig" startRecord="${gStartRecord}" currentPage="${gCurrentPage}" pageSize="${gPageSize}" gridHeight="${gGridHeight}" totalRecords="${gCount}">
						<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
						<ct:textColumn dataField="configKey" headerText="Key" width="40" maxLength="35" tooltipPosition="right" />
						<ct:textColumn dataField="configValue" headerText="Value" width="20" />
						<ct:textColumn dataField="description" headerText="Description" width="40" />

					</ct:dataGrid>

				</div>

				<div>&nbsp;</div>
				<div class="">
					<h4 style="font-weight: bold; background: #E3DEDD; width: 100%">Provider Keys</h4>
					<ct:dataGrid dataSource="${pConfigKeys}" keyField="configKey" id="dgProviderConfig" name="dgProviderConfig" startRecord="${pStartRecord}" currentPage="${pCurrentPage}" pageSize="${pPageSize}" gridHeight="${pGridHeight}" totalRecords="${pCount}">
						<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
						<ct:textColumn dataField="providerName" headerText="Provider Name" width="30" maxLength="35" tooltipPosition="right" />
						<ct:textColumn dataField="configKey" headerText="Key" width="40" maxLength="35" tooltipPosition="right" />
						<ct:textColumn dataField="configValue" headerText="Value" width="30" />

					</ct:dataGrid>
				</div>

				<div>&nbsp;</div>


				<div class="">
					<h4 style="font-weight: bold; background: #E3DEDD; width: 100%">Provider Video Keys</h4>
					<div style="display:flex;">
						<div style="font-weight: bold;">Provider Name</div>



						<div style="padding-left: 15px;width:50%;">
							<ct:dataSelect placeHolder="Select Provider" dataSource="${gridProviderList}" valueField="id" textField="providerName" id="gridProvider" name="gridProvider" maxLength="35">

							</ct:dataSelect>
						</div>

						<div style="width:120px;cursor: pointer;">
							<button type="button" class="search-btn" onclick="javascript:searchProviderVideoKeys()">Search</button>
						</div>
					</div>
					<div style="margin-top: 10px">
						<ct:dataGrid dataSource="${pvConfigKeys}" keyField="configKey" id="dgProviderVideoConfig" name="dgProviderVideoConfig" startRecord="${pvStartRecord}" currentPage="${pvCurrentPage}" pageSize="${pvPageSize}" gridHeight="${pvGridHeight}" totalRecords="${pvCount}">
							<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
							<ct:textColumn dataField="videoName" headerText="Video Name" width="30" maxLength="35" tooltipPosition="right" />
							<ct:textColumn dataField="configKey" headerText="Key" width="40" maxLength="35" tooltipPosition="right" />
							<ct:textColumn dataField="configValue" headerText="Value" width="30" />

						</ct:dataGrid>
					</div>
				</div>


			</div>


			<div class="col-md-6 col-lg-6">

				<div class="config-div" id="configDiv">
					<form autocomplete="off" class="form-container" id="configForm">

						<h4 style="font-weight: bold; background: #E3DEDD; width: 100%">Add New Configuration Key</h4>

						<div id="msgSpan" style="color:red; font-size: 15px;min-height:20px;">${message}</div>

						<div style="width:100%;">
							<label for="providerName"><b>Provider Name<span style="color:red;">*</span></b></label>

							<div style="margin-top: 5px">
								<ct:dataSelect height="350" placeHolder="Select Provider" dataSource="${providersSelect}" onchangeFunction="configProviderChange(this)" valueField="id" textField="providerName" id="selectProvider" name="selectProvider" maxLength="35">

								</ct:dataSelect>
							</div>

						</div>

						<div style="margin-top: 10px;">
							<label for="videoName"><b>Video Name </b></label>
							<div id="videoDiv">

								<ct:dataSelect height="350" placeHolder="Select Video" dataSource="${videosSelect}" valueField="id" textField="label" id="selectVideo" name="selectVideo" maxLength="35">

								</ct:dataSelect>
							</div>
						</div>

						<div>
							<label for="configKey"><b>Key<span style="color:red;">*</span></b></label><br>

							<ct:dataSelect placeHolder="Select Key" dataSource="${configSelect}" onchangeFunction="changeInputType(this)" tooltipField="description" valueField="configKey" textField="configKey" id="configKey" name="configKey" additionalField="configType" maxLength="35">

							</ct:dataSelect>
							<!-- <select id="configKey" class="configKey" onchange="changeInputType(this)">
								<option disabled selected>Select Key</option>
								<option data-type="boolean">FullScreen</option>
								<option data-type="number">InitialDelayTime</option>
								<option data-type="number">InitialFragmentsToActivemq</option>
								<option data-type="boolean">Mini-Player</option>
								<option data-type="text">NextButtonShowText</option>
								<option data-type="number">NextButtonShowTime</option>
								<option data-type="boolean">PlayBackSpeed</option>
								<option data-type="number">PlayerDelayTime</option>
								<option data-type="number">PlayFragmentsToActivemq</option>
								<option data-type="text">PreviousButtonShowText</option>
								<option data-type="number">PreviousButtonShowTime</option>
								<option data-type="boolean">Resolution</option>
								<option data-type="boolean">ShowLanguages</option>
								<option data-type="boolean">ShowTheaterMode</option>
								<option data-type="boolean">ShowVideoDescription</option>
								<option data-type="number">VideoDescriptionLength</option>
								<option data-type="number">VideoForwardSeconds</option>
								<option data-type="number">VideoPreviewImageSeconds</option>
								<option data-type="number">VideoRewindSeconds</option>
								<option data-type="chooseColor">WatermarkColor</option>
							</select> -->
						</div>


						<div id="inputDiv" style="display:none;width:95%;">
							<label for="configValue"><b>Value <span style="color:red;">*</span></b></label> <input class="configValue" type="text" oninput="validateInput(event)" onkeydown="if(event.key==='.'){event.preventDefault();}" onKeypress="updateInputType(event)" name="configValue" id="configValue" required />
						</div>
						<div id="booleanDiv" style=" display:none;">
							<label for="configValue"><b>Value <span style="color:red;">*</span></b></label><br> <select id="booleanConfigValue" class="configValue">
								<option value="" disabled selected class="d-none">Select Value</option>
								<option>True</option>
								<option>False</option>
							</select>
						</div>
						<div id="watermarkColorDiv" style=" display:none;">
							<label for="configValue"><b>Value <span style="color:red;">*</span></b></label><br> <select id="watermarkConfigValue" class="configValue">
								<option value="" disabled selected class="d-none">Select Color</option>
								<option>Black</option>
								<option>Blue</option>
								<option>Cyan</option>
								<option>Gray</option>
								<option>Green</option>
								<option>Magenta</option>
								<option>Orange</option>
								<option>Pink</option>
								<option>Red</option>
								<option>White</option>
								<option>Yellow</option>
							</select>
						</div>

						<div style="margin-top: 10px;width:120px;">
							<button type="button" class="btnSubmit" id="submitButton" onclick="javascript:saveProviderConfig(event)">Submit</button>

						</div>
					</form>
				</div>
			</div>
		</div>


	</div>


	<script type="text/javascript">
		document.onclick = function(e) {
			//debugger;
			var obj = e.target;
			//console.log(obj);

			var id = obj.getAttribute("id");
			var process = true;
			//console.log(id)
			if (id != null && id == "selectProviderSelectDiv") {
				//console.log("inside");
				process = false;
				hideSelect("selectVideodropdownDiv");
				hideSelect("gridProviderdropdownDiv");
				hideSelect("configKeydropdownDiv");
			}

			if (id != null && id == "gridProviderSelectDiv") {
				//console.log("inside");
				process = false;
				hideSelect("selectProviderdropdownDiv");
				hideSelect("selectVideodropdownDiv");
				hideSelect("configKeydropdownDiv");
			}

			if (id != null && id == "selectVideoSelectDiv") {
				//console.log("inside");
				process = false;
				hideSelect("selectProviderdropdownDiv");
				hideSelect("gridProviderdropdownDiv");
				hideSelect("configKeydropdownDiv");
			}

			if (id != null && id == "configKeySelectDiv") {
				//console.log("inside");
				process = false;
				hideSelect("selectProviderdropdownDiv");
				hideSelect("gridProviderdropdownDiv");
				hideSelect("selectVideodropdownDiv");
			}

			if (process) {
				hideSelect("selectProviderdropdownDiv");
				hideSelect("selectVideodropdownDiv");
				hideSelect("gridProviderdropdownDiv");
				hideSelect("configKeydropdownDiv");

			}

		};
		function validateInput(event) {

			var inputElement = event.target;
			var inputText = inputElement.value;

			if (inputText.length === 1 && inputText === '0') {
				inputElement.value = '';
			}
		}

		function dgGlobalConfigNavigate(strWhere, intPages, gCurrentPage) {

			var gIntPg;

			var baseurl = document.getElementById("baseurl").value;

			gIntPg = returnPage(strWhere, gCurrentPage, intPages)

			var targetIds = [ dgGlobalConfig, dgProviderConfig, dgProviderVideoConfig ];
			var data = {
				gCurrentPage : gIntPg,
				pCurrentPage : 1,
				pvCurrentPage : 1,
				gridHeight : screen.height
			};

			if (gIntPg > 0) {
				//showSpinner();
				commonSearch(baseurl + "/configuration", data, targetIds);

				/* submitFormAction(baseurl.value + "/configuration", {
					gCurrentPage : gIntPg,
					pCurrentPage : 1,
					pvCurrentPage : 1,
					gridHeight: screen.height
				}); */
			}
		}
		function dgProviderConfigNavigate(strWhere, intPages, pCurrentPage) {
			//debugger;

			var pIntPg;

			var baseurl = document.getElementById("baseurl").value;

			pIntPg = returnPage(strWhere, pCurrentPage, intPages)
			var targetIds = [ dgGlobalConfig, dgProviderConfig, dgProviderVideoConfig ];
			var data = {
				pCurrentPage : pIntPg,
				gCurrentPage : 1,
				pvCurrentPage : 1,
				gridHeight : screen.height
			};

			if (pIntPg > 0) {

				//showSpinner();
				commonSearch(baseurl + "/configuration", data, targetIds);

				/* submitFormAction(baseurl.value + "/configuration", {
					pCurrentPage : pIntPg,
					gCurrentPage : 1,
					pvCurrentPage : 1,
					gridHeight: screen.height
				}); */
			}
		}

		function dgProviderVideoConfigNavigate(strWhere, intPages, pCurrentPage) {
			//debugger;

			var pIntPg;

			var baseurl = document.getElementById("baseurl").value;

			var gridProvider = document.getElementById("gridProvider").value;

			pIntPg = returnPage(strWhere, pCurrentPage, intPages);

			var targetIds = [ dgGlobalConfig, dgProviderConfig, dgProviderVideoConfig ];
			var data = {
				pvCurrentPage : pIntPg,
				pCurrentPage : 1,
				gCurrentPage : 1,
				gridProviderId : gridProvider,
				gridHeight : screen.height
			};

			if (pIntPg > 0) {

				//showSpinner();
				commonSearch(baseurl + "/configuration", data, targetIds);

				/* submitFormAction(baseurl.value + "/configuration", {
					pvCurrentPage : pIntPg,
					pCurrentPage : 1,
					gCurrentPage : 1,
					gridProviderId: gridProvider.value,
					gridHeight: screen.height
				}); */
			}
		}
	</script>
</body>
</html>