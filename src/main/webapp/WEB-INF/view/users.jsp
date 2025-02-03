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

			<span id="gridError" style="color:red; font-size: 15px;padding-left:10px;">${message}</span> 
			<input type="hidden" id="dgUsersPage" value="${currentPage}" />
		</div>

		<div class="row g-0">

			<h4 style="font-weight: bold;background: #E3DEDD; width: 100%">&nbsp;Users</h4>
			<div style="display:flex;">
				<div class="col-lg-6">
					<div class="row g-0">
					<div class="col-lg-12">
						<label><b>User Email</b></label>
							<input autocomplete="off" id="userValue" class="textInput ms-2" maxlength="100" value="${inputEmail}" onkeyup="searchUser()" style="height:30px;width:70%;margin-top:3px;">
						</div>
						
					</div>
				</div>
				<div class="col-lg-6">
					<div class="float-end" style="padding-left: 10px;margin-top:3px;">
						<button type="button" class="search-btn" style="width:180px;" id="btnGenToken" onclick="javascript:showGenerateUserToken()">Generate User Token</button>
					</div>
				</div>
			</div>


		</div>

		<div class="row g-0" style="min-height:15px;"></div>

		<div class="row g-0">

			<div class="col-md-12 col-lg-12">

				<ct:dataGrid dataSource="${userList}" actionRowClick="true" highlightFirst="true" keyField="id" id="dgUsers" name="dgUsers" startRecord="${startRecord}" currentPage="${currentPage}" pageSize="${pageSize}" gridHeight="${gridHeight}" totalRecords="${count}">
					<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
					<ct:actionColumn imgAction="images/view.png" headerText="View" width="5" title="View" />
					<ct:textColumn dataField="userEmail" headerText="User Email" width="10" />
					<ct:textColumn dataField="providerName" headerText="Provider Name" width="10" maxLength="45" tooltipPosition="left" />
					<ct:textColumn dataField="token" headerText="User Token" width="10" maxLength="45" tooltipPosition="left" />
					<ct:textColumn dataField="validFromDate" headerText="From Date" dataFormat="dd-MMM-yyyy" width="12" />
					<ct:textColumn dataField="validEndDate" headerText="End Date" dataFormat="dd-MMM-yyyy" width="12" />

					<ct:textColumn dataField="createdDate" headerText="Created DateTime" dataFormat="dd-MMM-yyyy HH:mm:ss" width="12" />


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

					<ct:dataGrid dataSource="${userTokenVideoList}"  keyField="id" id="dgUserTokenDetail" name="dgUserTokenDetail" startRecord="${dStartRecord}" currentPage="${dCurrentPage}" pageSize="${dPageSize}" gridHeight="${dGridHeight}" totalRecords="${dCount}">

						<ct:textColumn dataField="type" headerText="Type" width="20"  />
						<ct:textColumn dataField="videoName" headerText="Video Name" width="20" maxLength="35" />


					</ct:dataGrid>
				</div>

			</div>

		</div>
	</div>

	<script type="text/javascript">
		function dgUsersNavigate(strWhere, intPages, currentPage) {

			var intPg;
			var userValue = document.getElementById("userValue").value.trim();

			var baseurl = document.getElementById("baseurl").value;

			intPg = returnPage(strWhere, currentPage, intPages)
			var targetIds = [ dgUsers ];
			var data = {
				currentPage : intPg,
				inputValue : userValue,
				gridHeight : screen.height
			}

			if (intPg > 0) {
				document.getElementById("dgUsersPage").value = intPg;
				commonSearch(baseurl + "/users", data, targetIds);

			}
		}

		function dgUsersAction(id) {
			
			var gridError = document.getElementById("gridError");
			gridError.textContent = "";
			//debugger;
			document.getElementById("dgUsersselectedRow").value = id;

			var tBody = document.getElementById("dgUserstbody");
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

			var targetIds = [ dgUserTokenDetail ];
			var page = document.getElementById("dgUsersPage").value;
			var data = {
				userTokenId : id,
				currentPage : page
			}

			commonSearch(baseurl + "/users", data, targetIds);

		}
	</script>
</body>
</html>