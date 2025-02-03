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
			<span id="gridError" style="color:red; font-size: 15px;"></span>
			<input type="hidden" id ="dgPlayerRequestsPage" value = "${currentPage}" />

		</div>

		<div class="row g-0">

			<h4 style="font-weight: bold;background: #E3DEDD; width: 100%;padding-left:10px">Player Requests</h4>

		</div>

		<div class="row g-0" style="min-height:15px;"></div>

		<div class="row g-0">

			<div class="col-md-12 col-lg-12 ">
				<ct:dataGrid dataSource="${playerRequestList}" keyField="id" id="dgPlayerRequests" name="dgPlayerRequests" startRecord="${startRecord}" currentPage="${currentPage}" pageSize="${pageSize}" gridHeight="${gridHeight}" totalRecords="${count}">
					<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />

					<ct:textColumn dataField="requestUrl" headerText="Request Url" width="10" maxLength="50" tooltipPosition="right" />
					<ct:textColumn dataField="referer" headerText="Referer" width="10" />
					<ct:textColumn dataField="userAgent" headerText="User Agent" width="10" />
					<ct:textColumn dataField="authToken" headerText="Auth Token" width="20" maxLength="50" tooltipPosition="left" />
					<ct:textColumn dataField="authType" headerText="Type" width="20" />
					<ct:textColumn dataField="payload" headerText="Payload" width="20" maxLength="75" tooltipPosition="left" />
					<ct:textColumn dataField="isInternalModified" headerText="Is Internal" width="20" />
					<ct:textColumn dataField="userIp" headerText="User Ip" width="20" />
					<ct:textColumn dataField="statusMessage" headerText="Status Message" width="20" />


					<ct:textColumn dataField="createdDate" headerText="Created DateTime" dataFormat="dd-MMM-yyyy HH:mm:ss" width="12" />
				</ct:dataGrid>
			</div>

		</div>

	</div>

	<script type="text/javascript">
	
	function dgPlayerRequestsNavigate(strWhere, intPages, currentPage) {

		var intPg;

		var baseurl = document.getElementById("baseurl").value;

		intPg = returnPage(strWhere, currentPage, intPages)

		if (intPg > 0) {
			document.getElementById("dgPlayerRequestsPage").value = intPg;
			//showSpinner();
			//var inputValue = document.getElementById('providerValue').value.trim();
			var targetIds = [ dgPlayerRequests ];
			var data = {
				currentPage : intPg,
				//providerValue : inputValue,
				gridHeight : screen.height
			}
			commonSearch(baseurl + "/playerRequests", data, targetIds);

		}
	}
		
	</script>

</body>
</html>