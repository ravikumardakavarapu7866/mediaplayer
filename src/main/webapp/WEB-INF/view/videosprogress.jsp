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

			<span id="msgSpan" style="color:red; font-size: 15px; margin-left: 10px;"> </span> 
			<span id="gridError" style="color:red; font-size: 15px;margin-left: 10px; "></span>
			<input type="hidden" id="dgVideosProgressPage" value="${currentPage}" />
		</div>

		<div class="row g-0">

			<h4 style="font-weight: bold; background: #E3DEDD; width: 100%">&nbsp;Videos Playback Information</h4>
			<div style="display:flex;">
				<div class="form-label me-2">User Email</div>
				<input autocomplete="off" id="userValue" class="textInput" maxlength="100" value="${inputEmail}" onkeyup="searchVideoProcessUser()" style="height:30px;width:34%;margin-top:3px;">

				<div class="form-label me-2" style="padding-left: 15px">Video Name</div>
				<input autocomplete="off" id="videoValue" class="textInput" maxlength="100" value="${inputVideo}" onkeyup="searchVideoProcessVideo()" style="height:30px;width:34%;margin-top:3px;">

			</div>

		</div>

		<div class="row g-0" style="min-height:15px;"></div>

		<div class="row g-0">

			<div class="col-md-12 col-lg-12">

				<ct:dataGrid dataSource="${videosProgressList}" actionRowClick="true" highlightFirst="true"  keyField="id" id="dgVideosProgress" name="dgVideosProgress" startRecord="${startRecord}" currentPage="${currentPage}" pageSize="${pageSize}" gridHeight="${gridHeight}" totalRecords="${count}">
					<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />

					<ct:actionColumn imgAction="images/view.png" headerText="View" width="5" title="View" />
					<ct:textColumn dataField="userEmail" headerText="User Email" width="25" />

					<ct:textColumn dataField="videoName" headerText="Video Name" width="20"  maxLength="35"/>
					<ct:textColumn dataField="providerName" headerText="Provider Name" width="20"  maxLength="35"/>
					<ct:textColumn dataField="type" headerText="Video Type" width="10" />
					<ct:textColumn dataField="seasonNumber" headerText="Season" width="10" />
					<ct:textColumn dataField="episodeNumber" headerText="Episode" width="10" />
					<ct:textColumn dataField="episodeName" headerText="Episode Name" width="12"  maxLength="35"/>
					<ct:textColumn dataField="currentTime" headerText="Last Position (Seconds)" width="8" dataFormat="######" />
					<ct:textColumn dataField="duration" headerText=" Video Total Duration (Seconds)" width="10" dataFormat="######" />
					<ct:textColumn dataField="createdDate" headerText="Created Date" width="8" dataFormat="dd-MMM-yyyy HH:mm:ss" />
					<ct:textColumn dataField="updatedDate" headerText=" Updated Date" width="10" dataFormat="dd-MMM-yyyy HH:mm:ss" />

				</ct:dataGrid>
			</div>

		</div>

		<div class="row g-0">
			<div id="myDialog" class="col-md-9 col-lg-9 modalClass">${videoUserHtml}</div>
		</div>
	</div>





	<script type="text/javascript">
// 		document.addEventListener("DOMContentLoaded", function() {
// 			var firstTable = document.getElementById('dgVideosProgress');

// 			if (firstTable) {
// 				var firstRow = firstTable.querySelector("tbody tr:not(thead tr)");

// 				if (firstRow) {
// 					firstRow.classList.add("gridRowBacgroundColor");
// 				}
// 			}
// 		});
		function dgVideosProgressNavigate(strWhere, intPages, currentPage) {

			var intPg;

			var baseurl = document.getElementById("baseurl").value;

			intPg = returnPage(strWhere, currentPage, intPages)

			if (intPg > 0) {
				
				document.getElementById("dgVideosProgressPage").value = intPg;

				//showSpinner();
				var userValue = document.getElementById('userValue').value.trim();

				var videoValue = document.getElementById('videoValue').value.trim();
				var targetIds = [ dgVideosProgress ];
				var data = {
					currentPage : intPg,
					userValue : userValue,
					videoValue : videoValue,
					gridHeight : screen.height
				};
				commonSearch(baseurl + "/videosprogress", data, targetIds);
				
			}
		}

		function dgVideosProgressAction(id) {
			document.getElementById( "dgVideosProgressselectedRow").value = id;
			
			var tBody = document.getElementById("dgVideosProgresstbody");
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
		
			var baseurl = document.getElementById("baseurl");

			var url = baseurl.value + "/videouser";

			var xhttp = new XMLHttpRequest();

			var myDialog = document.getElementById("myDialog");

			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var responseText = xhttp.responseText;

					var jsonObj = JSON.parse(responseText);

					myDialog.innerHTML = jsonObj.videoUserHtml;

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

				}
			};

			var data = JSON.stringify({
				"videoDetailProgressId" : id,
			});
			//debugger;

			xhttp.open("POST", url, true);
			xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

			xhttp.send(data);

		}
	</script>
</body>
</html>