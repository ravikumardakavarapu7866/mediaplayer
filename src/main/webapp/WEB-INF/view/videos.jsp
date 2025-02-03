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

		<div style="min-height:30px;">

			<span id="msgSpan" style="color:red; font-size: 15px; margin-left: 10px;"> </span> <span id="gridError" style="color:red; font-size: 15px;margin-left: 10px; "></span>
		</div>

		<div class="row g-0">

			<h4 style="font-weight: bold;background: #E3DEDD; width: 100%">&nbsp;Videos Upload Status</h4>

			<div style="display:flex;">

				<div class="form-label me-2">
					Provider Name
					<!-- 					<span class="req-field">*</span> -->
				</div>

				<input autocomplete="off" id="providerValue" class="textInput" maxlength="100" value="${inputProvider}" onkeyup="searchVideo()" style="height:30px;width:34%;margin-top:3px;">



			</div>

		</div>
		<input type="hidden" id="dgVideosPage" value="${currentPage}" /> <input type="hidden" id="serverDateTime" value="${serverDateTime}" />
		<div class="row g-0" style="min-height:15px;"></div>

		<div class="row g-0">

			<div class="col-md-12 col-lg-12">

				<ct:dataGrid dataSource="${videoMasterList}" actionRowClick="false" keyField="id" id="dgVideos" name="dgVideos" startRecord="${startRecord}" currentPage="${currentPage}" pageSize="${pageSize}" gridHeight="${gridHeight}" totalRecords="${count}">
					<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
					<ct:actionColumn dataField="id" imgAction="images/edit.png" headerText="Edit" width="5" title="Edit" />
					<ct:linkColumn dataField="videoName" headerText="Log" width="10" title="View Log" />
					<ct:textColumn dataField="providerName" headerText="Provider Name" width="10" maxLength="35" tooltipPosition="right" />
					<ct:textColumn dataField="videoName" headerText="Video Name" width="10" maxLength="35" tooltipPosition="right" />
					<ct:textColumn dataField="sourceId" headerText="Source Id" width="6" />
					<ct:textColumn dataField="type" headerText="Type" width="6" />
					<ct:textColumn dataField="language" headerText="Language" width="6" />
					<ct:textColumn dataField="seasonNumber" headerText="Season" width="4" />
					<ct:textColumn dataField="episodeNumber" headerText="Episode" width="4" />
					<ct:textColumn dataField="episodeName" headerText="Episode Name" width="10" maxLength="35" />
					<ct:textColumn dataField="releaseDate" headerText="Release Date" dataFormat="dd-MMM-yyyy" width="7" />
					<ct:textColumn dataField="endDate" headerText="End Date" dataFormat="dd-MMM-yyyy" width="6" />
					<ct:textColumn dataField="activeModified" headerText="Active" width="4" />
					<ct:textColumn dataField="status" headerText="Status" width="5" />
					<ct:textColumn dataField="statusMessage" headerText="Status Message" width="16" maxLength="35" />
					<ct:textColumn dataField="createdDate" headerText="Upload DateTime" dataFormat="dd-MMM-yyyy HH:mm:ss" width="12" />
					<ct:textColumn dataField="videoDescription" headerText="Video Description" width="20" maxLength="35" />
				</ct:dataGrid>

			</div>

		</div>
	</div>
	<div class="modal fade" id="updatePopup" tabindex="-1" role="dialog" aria-labelledby="updateChangesPopup" aria-hidden="true">
		<div class="modal-dialog " style="--bs-modal-width: 800px;">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title" id="myModalLabel">Update</h4>
					<button type="button" class="close" onclick="javascript:hidePopup()">&times;</button>
				</div>
				<div class="modal-body">
					<span id="modalError" style="color:red; font-size: 15px;"></span> <input type="hidden" id="updateVideoMasterId" /> <input type="hidden" id="providerName" />
					<div style="display:flex;margin-top:10px">
						<div class="form-label me-2">
							<b>Type</b>
						</div>
						<b><label id="type" class="textInput" style="height:26px;width:250px; position: absolute;left: 155px;"></label></b>
					</div>
					<div style="display:flex;margin-top:10px">
						<div class="form-label me-2">
							<b>Video Name</b><span style="color:red;">*</span>
						</div>
						<input autocomplete="off" id="videoName" class="textInput" maxlength="100" style="height:26px;width:250px; position: absolute;left: 155px;">
					</div>

					<div style="display:flex;margin-top:10px">
						<div class="form-label me-2">
							<b>Language</b><span style="color:red;">*</span>
						</div>
						<input autocomplete="off" id="language" class="textInput" maxlength="100" style="height:26px;width:250px; position: absolute;left: 155px;" onkeydown="checkCharacter(event)">
					</div>
					<div style="display:flex;margin-top:10px">
						<div class="form-label me-2">
							<b>Release Date</b><span style="color:red;">*</span>
						</div>
						<input id="releaseDate" placeholder="dd-mmm-yyyy" type="text" style="height:26px;width:250px;position: absolute;left: 155px; cursor: pointer;" readonly>
					</div>
					<div style="display:flex;margin-top:10px">
						<div class="form-label me-2">
							<b>End Date</b>
						</div>
						<input id="endDate" placeholder="dd-mmm-yyyy" type="text" placeholder="raaavi" style="height:26px;width:250px;position: absolute;left: 155px; cursor: pointer;" readonly>
					</div>
					<div style="display:flex;margin-top:10px">
						<div class="form-label me-2" id="episodeNameLable">
							<b>Episode Name</b><span style="color:red;">*</span>
						</div>
						<input id="episodeName" class="textInput" maxlength="100" style="height:26px;width:615px;position: absolute;left: 155px;">
					</div>
					<div style="display:flex;margin-top:10px">
						<div class="form-label me-2">
							<b>Video Description</b>
						</div>
						<textarea id="videoDescription" class="textInput" rows="9" style="resize: none;" cols="70"> </textarea>
					</div>
				</div>

				<div class="modal-footer text-center">
					<button type="button" class="search-btn" id="updateChages" style="width:150px;cursor:pointer;" onclick="javascript:updatePopupChanges()">Update changes</button>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="logPopup" tabindex="-1" role="dialog" aria-labelledby="logPopup" aria-hidden="true">
		<div class="modal-dialog" style="--bs-modal-width: 90%;">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title" id="myModalLabel">Log</h4>
					<button type="button" class="close" onclick="javascript:hideLogPopup()">&times;</button>
				</div>
				<div class="modal-body">
					<span id="modalError" style="color:red; font-size: 15px;"></span> 
				
					<div style="display:flex;margin-top:10px">						
						<span id="logVideoName" class="textInput"  style="width:100%;font-weight: bold;"></span>
					</div>
					
					<div style="display:flex;margin-top:10px">						
						<textarea id="logTextArea" class="textInput" rows="19" style="resize: none;width:100%;" cols="90"> </textarea>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<script type="text/javascript">
		function dgVideosNavigate(strWhere, intPages, currentPage) {

			var intPg;

			var baseurl = document.getElementById("baseurl").value;

			intPg = returnPage(strWhere, currentPage, intPages)

			if (intPg > 0) {
				//showSpinner();
				var inputValue = document.getElementById('providerValue').value.trim();
				document.getElementById("dgVideosPage").value = intPg;
				var targetIds = [ dgVideos ];
				var data = {
					currentPage : intPg,
					providerValue : inputValue,
					gridHeight : screen.height
				}

				commonSearch(baseurl + "/videos", data, targetIds);

			}
		}

		function dgVideosAction(id) {
			//showSpinner();
			//alert(id);

			document.getElementById("dgVideosselectedRow").value = id;

			var tBody = document.getElementById("dgVideostbody");

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

			var vidoeNamedataTooltip = '';
			var episodeNamedataTooltip = '';
			var videoDescriptiondataTooltip = '';

			seletedVideoMaterId = selectedRow.cells[0].innerText;
			document.getElementById("updateVideoMasterId").value = id;
			document.getElementById("providerName").value = selectedRow.cells[2].innerText;

			//VidoeName
			if (selectedRow.cells[3].children.length === 1) {
				vidoeNamedataTooltip = selectedRow.cells[3].children.tdSpanValue.getAttribute('data-tooltip');
			}

			if (vidoeNamedataTooltip) {
				document.getElementById("videoName").value = vidoeNamedataTooltip;
			} else {
				document.getElementById("videoName").value = selectedRow.cells[3].innerText;
			}

			//Type
			document.getElementById("type").innerText = selectedRow.cells[5].innerText;
			var type = selectedRow.cells[5].innerText;
			var episodeName = document.getElementById("episodeName");
			var episodeNameLable = document.getElementById("episodeNameLable");

			if (type.toLowerCase() == "movie") {
				episodeName.style.display = "none";
				episodeNameLable.style.display = "none";
			} else {
				episodeName.style.display = "block";
				episodeNameLable.style.display = "block";
			}

			document.getElementById("language").value = selectedRow.cells[6].innerText;

			//EpisodeName
			if (selectedRow.cells[8].children.length === 1) {
				episodeNamedataTooltip = selectedRow.cells[9].children.tdSpanValue.getAttribute('data-tooltip');
			}
			if (episodeNamedataTooltip) {
				document.getElementById("episodeName").value = episodeNamedataTooltip;
			} else {
				document.getElementById("episodeName").value = selectedRow.cells[9].innerText;
			}

			document.getElementById("releaseDate").value = selectedRow.cells[10].innerText;
			document.getElementById("endDate").value = selectedRow.cells[11].innerText.trim();

			//videoDescription
			if (selectedRow.cells[15].children.length === 1) {
				videoDescriptiondataTooltip = selectedRow.cells[16].children.tdSpanValue.getAttribute('data-tooltip');
			}
			if (videoDescriptiondataTooltip) {
				document.getElementById("videoDescription").value = videoDescriptiondataTooltip;
			} else {
				document.getElementById("videoDescription").value = selectedRow.cells[16].innerText;
			}
			showPopup();
		}

		$(document).ready(function() {
			var serverDateTime = document.getElementById("serverDateTime").value;
			var serverDate = new Date(serverDateTime);
			$("#releaseDate").datepicker({
				dateFormat : "dd-M-yy",
				defaultDate : serverDate,
				minDate : serverDate,
			});
			$("#endDate").datepicker({
				dateFormat : "dd-M-yy",
				defaultDate : serverDate,
				minDate : serverDate,
			});

		});

		function dgVideosLink(id) {
			//debugger;

			document.getElementById("dgVideosselectedRow").value = id;			
			
			var tBody = document.getElementById("dgVideostbody");

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
			
			var vidoeNamedataTooltip = '';			

			//VidoeName
			if (selectedRow.cells[3].children.length === 1) {
				vidoeNamedataTooltip = selectedRow.cells[3].children.tdSpanValue.getAttribute('data-tooltip');
			}
			
			if (vidoeNamedataTooltip) {
				document.getElementById("logVideoName").textContent = vidoeNamedataTooltip;
			} else {
				document.getElementById("logVideoName").textContent = selectedRow.cells[3].innerText;
			}
			
			showLogPopup();
		}
		
		
		function showPopup() {
			$('#updatePopup').modal('show');
			var updateChages = document.getElementById("updateChages");
			updateChages.disabled = false;
		}

		function hidePopup() {
			var modalError = document.getElementById("modalError");
			modalError.textContent = "";
			$('#updatePopup').modal('hide');
			var updateChages = document.getElementById("updateChages");
			updateChages.disabled = false;
		}
		
		
		
		function showLogPopup() {
			var modalError = document.getElementById("modalError");
			modalError.textContent = "";
			
			document.getElementById("logTextArea").textContent = "";

			var baseurl = document.getElementById("baseurl").value;

			var idVal = document.getElementById("dgVideosselectedRow").value;

			var data = {
				videoMasterId : idVal,
			}

			var url = baseurl + "/getLog";

			$.ajax({
				type : "POST",
				url : url,
				data : JSON.stringify(data),
				dataType: "json",
				contentType: "application/json",
				success : function(response) {
					//hideSpinner();
					//debugger
					document.getElementById("logTextArea").textContent = response.responseData;					
					
					$('#logPopup').modal('show');

				},
				error : function(error) {
					//hideSpinner();
					modalError.textContent = "Failed to display log";

				}
			});
		}

		function hideLogPopup() {
			var modalError = document.getElementById("modalError");
			modalError.textContent = "";
			$('#logPopup').modal('hide');
		}
	</script>
</body>
</html>