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

			<div class="col-md-12 col-lg-12">

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


</body>
</html>