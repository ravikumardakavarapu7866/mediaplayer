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

			<h4 style="font-weight: bold;background: #E3DEDD; width: 100%"">&nbsp;Consumer Process</h4>
			<div style="display:flex;">
				<div class="form-label me-2">User Email</div>
				<input autocomplete="off" tabindex="1" id="userValue" class="textInput" maxlength="100" value="${inputEmail}" onkeyup="searchConsumerProcessUser()" style="height:30px;width:34%;margin-top:3px;">

				<div class="form-label me-2" style="padding-left: 15px">Video Name</div>
				<input autocomplete="off" tabindex="2" id="videoValue" class="textInput" maxlength="100" value="${inputVideo}" onkeyup="searchConsumerProcessVideo()" style="height:30px;width:34%;margin-top:3px;">

			</div>

		</div>

		<div class="row g-0" style="min-height: 15px;"></div>

		<div class="row g-0">
			<span id="gridError" style="color:red; font-size: 15px;"></span>

			<div class="col-md-12 col-lg-12 ">

				<ct:dataGrid dataSource="${consumerProcessList}" keyField="id" id="dgConsumerProcess" name="dgConsumerProcess" startRecord="${startRecord}" currentPage="${currentPage}" pageSize="${pageSize}" gridHeight="${gridHeight}" totalRecords="${count}">
					<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />

					<ct:textColumn dataField="userEmail" headerText="User Email" width="20" />
					<ct:textColumn dataField="timeStamp" headerText="Time Stamp" width="10" />
					<ct:textColumn dataField="videoName" headerText="Video Name" width="25" />
					<ct:textColumn dataField="height" headerText="Resolution" width="10" dataFormat="######" />
					<ct:textColumn dataField="fileName" headerText="File Name" width="10" />
					<ct:textColumn dataField="processSeconds" headerText="Process (ms)" width="10" dataFormat="######" />
					<ct:textColumn dataField="updatedDate" headerText="Chunks Processed DateTime" width="15" dataFormat="dd-MMM-yyyy HH:mm:ss" />


				</ct:dataGrid>



			</div>

		</div>
	</div>

	<script type="text/javascript">
		function dgConsumerProcessNavigate(strWhere, intPages, currentPage) {

			var intPg;

			var baseurl = document.getElementById("baseurl").value;

			intPg = returnPage(strWhere, currentPage, intPages)

			if (intPg > 0) {
				//showSpinner();
				var userValue = document.getElementById('userValue').value.trim();

				var videoValue = document.getElementById('videoValue').value.trim();
				var targetIds = [ dgConsumerProcess ];

				var data = {
					currentPage : intPg,
					userValue : userValue,
					videoValue : videoValue,
					gridHeight : screen.height
				};

				commonSearch(baseurl + "/consumerprocess", data, targetIds);

				/* submitFormAction(baseurl.value + "/consumerprocess", {
					currentPage : intPg,
					userValue : userValue,
					videoValue : videoValue,
					gridHeight : screen.height
				}); */
			}
		}
	</script>
</body>
</html>