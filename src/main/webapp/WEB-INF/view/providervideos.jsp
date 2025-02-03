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

				<ct:dataGrid dataSource="${pvList}" keyField="id" id="dgProviderVideos" name="dgProviderVideos" startRecord="${pvStartRecord}" currentPage="${pvCurrentPage}" pageSize="${pvPageSize}" gridHeight="${pvGridHeight}" totalRecords="${pvCount}">
					<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
					<ct:checkboxColumn dataField="sourceId" headerText="Select" width="5" />
					<ct:textColumn dataField="videoName" headerText="Video Name" width="10" maxLength="35" tooltipPosition="top" />
					<ct:textColumn dataField="type" headerText="Type" width="6" />
					<ct:textColumn dataField="language" headerText="Language" width="6" />
					<ct:textColumn dataField="seasonNumber" headerText="Season" width="4" />
					<ct:textColumn dataField="episodeNumber" headerText="Episode" width="4" />
					<ct:textColumn dataField="episodeName" headerText="Episode Name" width="10" maxLength="35" />
					<ct:textColumn dataField="releaseDate" headerText="Release Date" dataFormat="dd-MMM-yyyy" width="7" />
					<ct:textColumn dataField="endDate" headerText="End Date" dataFormat="dd-MMM-yyyy" width="6" />

				</ct:dataGrid>

			</div>

		</div>
	</div>


</body>
</html>