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
			<input type="hidden" id="serverDate" value="${serverDate}" />
		</div>

		<div class="row g-0">

			<h4 style="font-weight: bold; background: #E3DEDD; width: 100%">&nbsp;Generate User Token</h4>
		</div>

		<div class="row g-0">



			<div class="col-md-4" style="width:100%">

				<div style="margin-top: 10px;width: 40%">
					<label for="providerName"><b>Provider Name<span style="color:red;">*</span></b></label>
				</div>

				<div style="width: 40%">
					<ct:dataSelect height="350" placeHolder="Select Provider" onchangeFunction="uvProviderChange(this);" dataSource="${providerList}" valueField="id" textField="providerName" id="selectProvider" name="selectProvider" maxLength="35">

					</ct:dataSelect>
				</div>

				<div style="width: 40%" class="mt-2">
					<label for="userEmail"><b>User Email<span style="color:red;">*</span></b></label>
				</div>

				<div style="width: 40%">
					<div id="usersDiv">
						<ct:dataSelect height="350" placeHolder="Select User Email" dataSource="${userList}" valueField="id" textField="userEmail" id="selectUser" name="selectUser" maxLength="40">
						</ct:dataSelect>
					</div>
				</div>


<!-- 				<div style="width: 40%"> -->
<!-- 					<input style="width:95%" autocomplete="off" id="userEmail" class="textInput" maxlength="200"> -->
<!-- 				</div> -->
				<div style="display:flex;width:42.2%;" class="mt-2">
					<div style="width:40%;">
						<label><b>From Date<span style="color:red;">*</span></b></label> <input id="fromDate" placeholder="yyyy-mm-dd" type="text" style="cursor: pointer;width:100%;" readonly>
					</div>
					<div style="width:10%;"></div>
					<div style="width:40%;">
						<label><b>End Date<span style="color:red;">*</span></b></label> <input id="endDate" placeholder="yyyy-mm-dd" type="text" style="cursor: pointer;width:100%;" readonly>
					</div>
				</div>

				<!-- 				<div style="width: 40%"> -->
				<!-- 					<label for="sendToEmail"><b>Send To Email<span style="color:red;">*</span></b></label> -->
				<!-- 				</div> -->

				<!-- 				<div style="width: 40%"> -->
				<!-- 					<input style="width:95%" autocomplete="off" id="sendToEmail" class="textInput" maxlength="100"> -->
				<!-- 				</div> -->





				<div style="margin-top: 10px;">
					<button type="button" class="search-btn" id="btnSaveUserToken" style="width:120px;" onclick="javascript:saveUserTokenDelay()">Save Changes</button>
					<span id="gridError" style="color:red; font-size: 15px;padding-left:10px;"></span>
				</div>

			</div>

			<div style="margin-top: 10px;">

				<ct:dataGrid dataSource="${pvList}" keyField="id" id="dgProviderVideos" name="dgProviderVideos" startRecord="${pvStartRecord}" currentPage="${pvCurrentPage}" pageSize="${pvPageSize}" gridHeight="${pvGridHeight}" totalRecords="${pvCount}">
					<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
					<ct:checkboxColumn dataField="sourceId" headerText="Select" width="5" />
					<ct:textColumn dataField="videoName" headerText="Video Name" width="10" maxLength="35" tooltipPosition="right" />
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


	<script type="text/javascript">
		$(document).ready(function() {

			var serverDate = document.getElementById("serverDate").value;

			$("#fromDate").datepicker({
				dateFormat : "yy-m-d",
				minDate : new Date(serverDate),
				setDate : new Date(serverDate)
			});
			$("#endDate").datepicker({
				dateFormat : "yy-m-d",
				minDate : new Date(serverDate),
				setDate : new Date(serverDate)
			});

		});
		document.onclick = function(e) {
			//debugger;
			var obj = e.target;
			//console.log(obj);

			var id = obj.getAttribute("id");
			var process = true;
			
			if (id != null && id == "selectProviderSelectDiv") {
				//console.log("inside");
				process = false;
				hideSelect("selectUserdropdownDiv");
			}

			if (id != null && id == "selectUserSelectDiv") {
				//console.log("inside");
				process = false;
				hideSelect("selectProviderdropdownDiv");
			}

			if (process) {
				hideSelect("selectProviderdropdownDiv");
				hideSelect("selectUserdropdownDiv");
			}

		};

		$(document).ready(function() {

			var selectProvider = document.getElementById("selectProvider");

			if (selectProvider != null) {
				//debugger
				var dropElement = document.getElementById("selectProviderdropdownDiv");
				var chs = dropElement.children;
				setSelectedValues(chs[0], 'selectProvider');
			}

		});

		function dgProviderVideosNavigate(strWhere, intPages, currentPage) {

			var baseurl = document.getElementById("baseurl").value;

			var intPg = returnPage(strWhere, currentPage, intPages)

			var targetIds = [ dgProviderVideos ];
			var data = {
				currentPage : intPg,
				gridHeight : screen.height
			};

			if (intPg > 0) {
				//showSpinner();
				commonSearch(baseurl + "/usertoken", data, targetIds);

			}
		}
	</script>
</body>
</html>