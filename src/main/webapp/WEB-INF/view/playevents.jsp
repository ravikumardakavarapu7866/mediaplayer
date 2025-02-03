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

			<span id="gridError" style="color:red; font-size: 15px;padding-left:10px;"></span>
		</div>

		<div class="row g-0">

			<h4 style="font-weight: bold;background: #E3DEDD; width: 100%">&nbsp;Videos Play Events</h4>
			<div style="display:flex;">
				<div class="form-label me-2">User Email</div>
				<input autocomplete="off" id="userValue" class="textInput" maxlength="100" value="${inputEmail}" onkeyup="searchPlayEventUser()" style="height:30px;width:34%;margin-top:3px;">

				<div class="form-label me-2" style="padding-left: 15px">Video Name</div>
				<input autocomplete="off" id="videoValue" class="textInput" maxlength="100" value="${inputVideo}" onkeyup="searchPlayEventVideo()" style="height:30px;width:34%;margin-top:3px;">

			</div>

		</div>

		<div class="row g-0" style="min-height:15px;">
			<input type="hidden" id="dgPlayEventPage" value="${currentPage}" />
		</div>

		<div class="row g-0">

			<div class="col-md-12 col-lg-12 ">

				<ct:dataGrid dataSource="${playEventList}" actionRowClick="true" highlightFirst="true" keyField="id" id="dgPlayEvent" name="dgPlayEvent" startRecord="${startRecord}" currentPage="${currentPage}" pageSize="${pageSize}" gridHeight="${gridHeight}" totalRecords="${count}">
					<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />

					<ct:actionColumn imgAction="images/view.png" headerText="View" width="5" title="View" />
					<ct:textColumn dataField="userEmail" headerText="User Email" width="25" />
					<ct:textColumn dataField="videoName" headerText="Video Name" width="20" maxLength="35" tooltipPosition="right" />
					<ct:textColumn dataField="providerName" headerText="Provider Name" width="20" maxLength="35" tooltipPosition="right" />
					<ct:textColumn dataField="type" headerText="Video Type" width="10" />
					<ct:textColumn dataField="screenWidth" headerText="Screen Width" width="20" />
					<ct:textColumn dataField="screenHeight" headerText="Screen Height" width="20" />

					<ct:textColumn dataField="userOs" headerText="Operating System" width="20" />
					<ct:textColumn dataField="userBrowser" headerText="Browser" width="20" />
					<ct:textColumn dataField="userIp" headerText="User IP" width="20" />
					<ct:textColumn dataField="userLocation" headerText="User Location" width="20" />

					<ct:textColumn dataField="userTime" headerText="User Time" width="20" />
					<ct:textColumn dataField="userTimeZone" headerText="User Time Zone" width="30" />

					<ct:textColumn dataField="createdDate" headerText="Created Date" width="15" dataFormat="dd-MMM-yyyy HH:mm:ss" />

				</ct:dataGrid>



			</div>

		</div>

		<div class="row g-0">&nbsp;</div>

		<div id="detailsDiv">

			<div class="row g-0">

				<h4 style="font-weight: bold;background: #E3DEDD; width: 100%">Details</h4>


			</div>

			<div class="row g-0">
				<div class="col-md-12 col-lg-12 ">

					<ct:dataGrid dataSource="${playEventDetailList}"  keyField="id" id="dgPlayEventDetail" name="dgPlayEventDetail" startRecord="${dStartRecord}" currentPage="${dCurrentPage}" pageSize="${dPageSize}" gridHeight="${dGridHeight}" totalRecords="${dCount}">


						<ct:textColumn dataField="userEmail" headerText="User Email" width="25" />
						<ct:textColumn dataField="videoName" headerText="Video Name" width="20" maxLength="35" />
						<ct:textColumn dataField="eventType" headerText="Event Type" width="20" />
						<ct:textColumn dataField="start" headerText="Start" width="20" />
						<ct:textColumn dataField="end" headerText="End" width="20" />
						<ct:textColumn dataField="comments" headerText="Comments" width="20" maxLength="35" />
						<ct:textColumn dataField="createdDate" headerText="Created Date" width="15" dataFormat="dd-MMM-yyyy HH:mm:ss" />



					</ct:dataGrid>
				</div>

			</div>

		</div>

	</div>

	<script type="text/javascript">
// 		document.addEventListener("DOMContentLoaded", function() {
// 			var firstTable = document.getElementById('dgPlayEvent');

// 			if (firstTable) {
// 				var firstRow = firstTable.querySelector("tbody tr:not(thead tr)");

// 				if (firstRow) {
// 					firstRow.classList.add("gridRowBacgroundColor"); //style.backgroundColor = 'rgb(165 203 239)';
// 				}
// 			}
// 		});

		function dgPlayEventNavigate(strWhere, intPages, currentPage) {

			var intPg;

			var baseurl = document.getElementById("baseurl").value;

			intPg = returnPage(strWhere, currentPage, intPages)

			if (intPg > 0) {

				document.getElementById("dgPlayEventPage").value = intPg;

				var userValue = document.getElementById('userValue').value.trim();

				var videoValue = document.getElementById('videoValue').value.trim();

				var targetIds = [ dgPlayEvent, dgPlayEventDetail ];
				var data = {
					currentPage : intPg,
					userValue : userValue,
					videoValue : videoValue,
					gridHeight : screen.height
				}

				commonSearch(baseurl + "/playevents", data, targetIds);

			}
		}

		function dgPlayEventAction(id) {
			showSpinner();
			//debugger;

			document.getElementById("dgPlayEventselectedRow").value = id;
			
			var tBody = document.getElementById("dgPlayEventtbody");
			//console.log(tBody);
			//console.log(id);
			if (tBody != null) {
				var rowIndex = 0;
				var rows = tBody.rows;//getElementsByTagName('tr');
				for (var t = 0; t < rows.length; t++) {
					rows[t].classList.remove("gridRowBacgroundColor")
					//console.log( rows[t]);
					if (rows[t].id == id) {
						rowIndex = t;						
					}
				}
				
				//console.log(rowIndex);
				
				rows[rowIndex].classList.add("gridRowBacgroundColor")
				
			}

			var baseurl = document.getElementById("baseurl").value;

			var targetIds = [ dgPlayEventDetail ];
			var page = document.getElementById("dgPlayEventPage").value;
			var data = {
				playEventId : id,
				currentPage : page
			}

			commonSearch(baseurl + "/playevents", data, targetIds);

			//var gridTable = document.getElementById("dgPlayEventDetail");

			// 			var url = baseurl + "/playeventdetails";

			// 			var xhttp = new XMLHttpRequest();

			// 			//	commonSearch(baseurl + "/videoUserEvents", data, targetIds);

			// 			xhttp.onreadystatechange = function() {

			// 				if (this.readyState == 4 && this.status == 200) {
			// 					hideSpinner();
			// 					var responseText = xhttp.responseText;

			// 					var jsonObj = JSON.parse(responseText);

			// 					$('#dgPlayEventDetail').html(jsonObj.playEventDetailsHtml);

			// 					if ((jsonObj.playEventDetailsHtml).indexOf('No records to display!') !== -1) {
			// 						$('#dgPlayEventDetail').parent().css('border', 'none');
			// 					} else {
			// 						$('#dgPlayEventDetail').parent().css('border', '1px solid #1e2024');
			// 					}

			// 					var td = document.getElementById(id);
			// 					if (td != null) {

			// 						var rows = document.querySelectorAll(".gridRowBacgroundColor");

			// 						for (let i = 0; i < rows.length; i++) {
			// 						    let row = rows[i]; 
			// 			                row.classList.remove("gridRowBacgroundColor"); 
			// 			            } 

			// 						var tr = td.parentNode;
			// 						if (tr) {
			// 							tr.classList.add("gridRowBacgroundColor");
			// 						}
			// 					}

			// 					var divScroll = document.getElementById("dgPlayEventDetaildivScroll");
			// 					if (divScroll != null) {
			// 						divScroll.scrollTop = 0;
			// 					}

			// 				}
			// 			};
			// 			var data = JSON.stringify({
			// 				"playEventId" : id
			// 			});

			// 			xhttp.open("POST", url, true);
			// 			xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

			// 			xhttp.send(data);

		}
	</script>
</body>
</html>