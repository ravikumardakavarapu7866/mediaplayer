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

			<h4 style="font-weight: bold; background: #E3DEDD; width: 100%">&nbsp;Delete Videos</h4>
			<div style="display:flex;">

				<div class="form-label me-2">Provider Name</div>
				<input id="providerValue" class="textInput" maxlength="100" value="${inputProvider}" onkeyup="searchDeletedProvider()" style="height:30px;width:34%;margin-top:3px;">

			</div>
			<div style="margin-top: 7px;">

				<button type="button" class="search-btn" style="width:120px;" onclick="javascript:deleteVideoProcess()">Delete</button>

				<span id="msgSpan" style="color:red; font-size: 15px;margin-left:10px;">${message}</span>
				<input type="hidden" id ="dgDeleteVideosPage" value = "${currentPage}" />
			</div>

		</div>
		<div class="row g-0" style="padding-top:5px;">

			<div class="col-md-12 col-lg-12 ">

				<ct:dataGrid dataSource="${activeVideoMasterList}" keyField="id" id="dgDeleteVideos" name="dgDeleteVideos" startRecord="${startRecord}" currentPage="${currentPage}" pageSize="${pageSize}" gridHeight="${gridHeight}" totalRecords="${count}">
					<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
					<ct:checkboxColumn dataField="id" headerText="Select Video" width="5" />
					<ct:textColumn dataField="providerName" headerText="Provider Name" width="10" maxLength="30" tooltipPosition="right" />
					<ct:textColumn dataField="type" headerText="Type" width="6" />
					<ct:textColumn dataField="videoName" headerText="Video Name" width="10" maxLength="30" tooltipPosition="right" />
					<ct:textColumn dataField="activeModified" headerText="Active" width="4" />
					<ct:textColumn dataField="language" headerText="Language" width="7" />
					<ct:textColumn dataField="seasonNumber" headerText="Season" width="4" />
					<ct:textColumn dataField="episodeNumber" headerText="Episode" width="4" />
					<ct:textColumn dataField="episodeName" headerText="Episode Name" width="10"  maxLength="30" tooltipPosition="left" />
					<ct:textColumn dataField="releaseDate" headerText="Release Date" dataFormat="dd-MMM-yyyy" width="7" />
					<ct:textColumn dataField="endDate" headerText="End Date" dataFormat="dd-MMM-yyyy" width="7" />

				</ct:dataGrid>
			</div>

		</div>
		<div class="row g-0">
			<div id="myDialog" class="col-md-9 col-lg-9 modalClass"></div>
		</div>
	</div>


	<script type="text/javascript">
		function dgDeleteVideosNavigate(strWhere, intPages, currentPage) {

			var intPg;

			var baseurl = document.getElementById("baseurl").value;
			var errorMsg = document.getElementById("msgSpan");
			errorMsg.textContent = "";
			var providerVal = document.getElementById('providerValue').value.trim();
			intPg = returnPage(strWhere, currentPage, intPages)
			var targetIds = [ dgDeleteVideos ];
			var data = {
				currentPage : intPg,
				gridHeight : screen.height,
				providerValue : providerVal
			};

			if (intPg > 0) {
				document.getElementById("dgDeleteVideosPage").value = intPg;
				commonSearch(baseurl + "/delete", data, targetIds);
				/* submitFormAction(baseurl + "/delete", {
					currentPage : intPg,
					gridHeight: screen.height
				}); */
			}
		}
	</script>

</body>
</html>