<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri="tags/customtag.tld" prefix="ct"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="common/top.jsp"></jsp:include>
</head>
<body>
	<jsp:include page="common/header.jsp"></jsp:include>

	<div class="container-fluid padding-container margin-Topbottom">

		<div class="row g-0">


			<div style="min-height:30px;">
				<span id="gridError" style="color:red; font-size: 15px;padding-left:10px;"></span> <input type="hidden" id="updateId" />
			</div>

			<div class="row g-0">

				<h4 style="font-weight: bold;background: #E3DEDD; width: 100%">&nbsp;Aspect Ratios</h4>
				<div class="d-flex">
					<div class="col-lg-6">
						<div class="row  g-0">
							<div class="col-lg-12 ">
								<label><b>Provider Name</b></label> <input autocomplete="off" id="providerValue" class="textInput ms-2" maxlength="100" value="${inputProvider}" onkeyup="searchAspectRatios()" style="height:30px;width:70%;margin-top:3px;">
							</div>
						</div>
					</div>
					<div class="col-lg-6">
						<div class="d-flex  float-end">
							<div style="padding-left: 15px;">
								<button type="button" class="search-btn" onclick="javascript:showAspectRatio()">Add Aspect Ratio</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="row g-0" style="min-height:15px;"></div>

			<div class="row g-0">

				<div class="col-md-12 col-lg-12 ">


					<ct:dataGrid dataSource="${apectRatioList}" keyField="id" id="dgAspectRatios" name="dgAspectRatios" startRecord="${startRecord}" currentPage="${currentPage}" pageSize="${pageSize}" gridHeight="${gridHeight}" totalRecords="${count}">
						<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
						<ct:actionColumn dataField="id" imgAction="images/edit.png" headerText="Edit" width="5" title="Edit" />
						<ct:textColumn dataField="providerName" headerText="Provider Name" width="35" />
						<ct:textColumn dataField="aspectRatio" headerText="Aspect Ratio" width="15" />
						<ct:textColumn dataField="width" dataFormat="######" headerText="Width" width="10" />
						<ct:textColumn dataField="height" dataFormat="######" headerText="Height" width="10" />
						<ct:textColumn dataField="videoBitrate" headerText="Video Bitrate" width="15" />
						<ct:textColumn dataField="audioBitrate" headerText="Audio Bitrate" width="15" />
					</ct:dataGrid>

				</div>

			</div>




			<div class="modal fade" id="aspectRatioModal" tabindex="-1" role="dialog" aria-labelledby="aspectRatioModal" aria-hidden="true">
				<div class="modal-dialog modal-md">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title" id="myModalLabel"><span id="mode">Add Aspect Ratio</span></h4>
							<button type="button" class="close" onclick="javascript:hideAspectRatio()">&times;</button>
						</div>
						<div class="modal-body">
							<span id="modalError" style="color:red; font-size: 15px;"></span>


							<div style="width:93%">
								<label class="me-2"><b>Provider Name<span class="req-field">*</span></b></label>
								<ct:dataSelect height="400" placeHolder="Select Provider" dataSource="${providerList}" valueField="id" textField="providerName" id="selectProvider" name="selectProvider" maxLength="36">

								</ct:dataSelect>

							</div>

							<div style="margin-top: 10px;width:93%;">
								<label class="me-2"><b>Aspect Ratio<span style="color:red;">*</span></b></label>
								<ct:dataSelect height="350" placeHolder="Select Aspect Ratio" dataSource="${aspectRatioSelect}" onchangeFunction="aspectRatioChange(this)" valueField="aspectRatio" textField="aspectRatio" id="selectAspectRatio" name="selectAspectRatio" maxLength="35">

								</ct:dataSelect>

							</div>

							<div style="margin-top: 10px;width:93%;">
								<label for="widthHeightDiv"><b>WidthXHeight <span style="color:red;">*</span></b></label>
								<div id="widthHeightDiv">

									<ct:dataSelect height="350" placeHolder="Select WidthxHeight" dataSource="${aspectRatioWidthHeightSelect}" valueField="widthHeight" textField="widthHeight" id="selectAspectRatioWidthHeight" name="selectAspectRatioWidthHeight" maxLength="35">

									</ct:dataSelect>
								</div>
							</div>


							<div style="padding-top:10px;">
								<label for="videoBitrate"><b>Video Bitrate<span style="color:red;">*</span></b></label>
							</div>
							<div>
								<input type="text" maxlength="9" oninput="validateInputNumber(event)" onKeypress="updateInputNumber(event)" onkeydown="if(event.key==='.'){event.preventDefault();}" name="videoBitrate" id="videoBitrate" required />
								<label class="me-2"><b>&nbsp;k</b></label>								
							</div>

							<div style="padding-top:10px;">
								<label for="audioBitrate"><b>Audio Bitrate<span style="color:red;">*</span></b></label>
							</div>
							<div>
								<input type="text" maxlength="9" oninput="validateInputNumber(event)" onKeypress="updateInputNumber(event)" onkeydown="if(event.key==='.'){event.preventDefault();}" name="audioBitrate" id="audioBitrate" required />
								<label class="me-2"><b>&nbsp;k</b></label>		
							</div>
						</div>
						<div class="modal-footer text-center">
							<button type="button" class="search-btn" id="btnSaveAspectRatio" style="width:150px;" onclick="javascript:saveAspectRatio('${baseurl}')">Save Changes</button>
						</div>
					</div>
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
				hideSelect("selectAspectRatiodropdownDiv");
				hideSelect("selectAspectRatioWidthHeightdropdownDiv");			
			}
	
			if (id != null && id == "selectAspectRatioSelectDiv") {
				//console.log("inside");
				process = false;
				hideSelect("selectProviderdropdownDiv");
				hideSelect("selectAspectRatioWidthHeightdropdownDiv");			
			}
	
			if (id != null && id == "selectAspectRatioWidthHeightSelectDiv") {
				//console.log("inside");
				process = false;
				hideSelect("selectProviderdropdownDiv");
				hideSelect("selectAspectRatiodropdownDiv");
			
			}
	
			
			if (process) {
				hideSelect("selectProviderdropdownDiv");
				hideSelect("selectAspectRatiodropdownDiv");
				hideSelect("selectAspectRatioWidthHeightdropdownDiv");	
			}
		}	
		
		
		var videoBitrate = document.getElementById("videoBitrate");
		var audioBitrate = document.getElementById("audioBitrate");
		
		videoBitrate.addEventListener('paste', e => e.preventDefault());
		audioBitrate.addEventListener('paste', e => e.preventDefault());
	
		function validateInputNumber(event) {
	
			var inputElement = event.target;
			var inputText = inputElement.value;
	
			if (inputText.length === 1 && inputText === '0') {
				inputElement.value = '';
			}
		}
		
		function updateInputNumber(event) {
			var inputElement = event.target;
			var inputText = inputElement.value;
			
			var keyCode = event.which ? event.which : event.keyCode;
			if (!(keyCode >= 48 && keyCode <= 57 && keyCode !== 13)) {
				event.preventDefault();
			}
			
		}
		
		function dgAspectRatiosNavigate(strWhere, intPages, currentPage) {

			var intPg;

			var baseurl = document.getElementById("baseurl").value;

			intPg = returnPage(strWhere, currentPage, intPages);
			var targetIds = [ dgAspectRatios ];
			var data = {
				currentPage : intPg,
				gridHeight : screen.height
			};

			if (intPg > 0) {

				//showSpinner();
				commonSearch(baseurl + "/aspectratios", data, targetIds);

				//submitFormAction(baseurl.value + "/aspectratios", {currentPage : intPg, gridHeight: screen.height});
			}
		}
		
		function dgAspectRatiosAction(id) {
			//showSpinner();
			//alert(id);
			
			document.getElementById("dgAspectRatiosselectedRow").value = id;
			
			var tBody = document.getElementById("dgAspectRatiostbody");
			
			var selectedRow;
			if (tBody != null) {
				var rowIndex = 0;
				var rows = tBody.rows;//getElementsByTagName('tr');
				for (var t = 0; t < rows.length; t++) {
					rows[t].classList.remove("gridRowBacgroundColor")
					
					if (rows[t].id == id) {
						rowIndex = t;						
						selectedRow = rows[t];
					}
				}
				
				rows[rowIndex].classList.add("gridRowBacgroundColor");
			}		
			
			var providerName =  selectedRow.cells[1].innerText;
			var aspectRatio =  selectedRow.cells[2].innerText;
			var widthHeight =  selectedRow.cells[3].innerText +"x" + selectedRow.cells[4].innerText;
			var videoBitrate =  selectedRow.cells[5].innerText;
			var audioBitrate =  selectedRow.cells[6].innerText;
			
			
			document.getElementById("updateId").value = id;
			setSelectedText("selectProvider", providerName);
			setSelectedText("selectAspectRatio", aspectRatio, widthHeight);				
			
			document.getElementById("videoBitrate").value = videoBitrate.replace("k", "");
			document.getElementById("audioBitrate").value = audioBitrate.replace("k", "");
			
			showEditAspectRatio();

		}
		
		function setSelectedText(selectId, selectText, widthHeight){
			var selectObject = document.getElementById(selectId);

			if (selectObject != null) {
				//debugger
				var dropElement = document.getElementById(selectId+ "dropdownDiv");
				var chs = dropElement.children;

				if (selectText != null && selectText.length > 0) {

					for (let i = 0; i < chs.length; i++) {						
						var dataText = chs[i].getAttribute("data-text");
						if (selectText == dataText) {							
							setSelectedValues(chs[i], selectId);
							if(selectId == "selectAspectRatio"){
								aspectRatioChange(chs[i], widthHeight);
							}
							break;
						}
					}
				} 

			}
		}
	</script>
</body>
</html>

