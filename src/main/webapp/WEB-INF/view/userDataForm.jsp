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
			<span id="gridError" style="color:red; font-size: 15px;padding-left:10px;"></span> <input type="hidden" id="updateId" />
		</div>

		<div class="row g-0">

			<h4 style="font-weight: bold; background: #E3DEDD; width: 100%">&nbsp;User Management</h4>

			<div class="d-flex">
				<div class="col-lg-6">
					<div class="row  g-0">
						<div class="col-lg-12 ">
							<label><b>User Email</b></label> <input autocomplete="off" id="userValue" class="textInput ms-2" maxlength="100" value="${inputEmail}" onkeyup="searchUserStatus()" style="height:30px;width:70%;margin-top:3px;">
						</div>
					</div>
				</div>

				<div class="col-lg-6">
					<div class="d-flex  float-end">
						<div style="padding-left: 15px;">
							<button type="button" class="search-btn" onclick="javascript:showAddUser()">Add User</button>
						</div>

						<div style="padding-left: 15px">
							<button type="button" id="btnActivated" value="true" class="search-btn" style="width:120px;" onclick="javascript:updateUserStatus(this)">Activate</button>
						</div>

						<div style="padding-left: 15px">
							<button type="button" id="btnDeactivated" value="false" class="search-btn" style="width:120px;" onclick="javascript:updateUserStatus(this)">Deactivate</button>
						</div>
					</div>
				</div>
			</div>
		</div>



		<div class="row g-0">



			<div style="margin-top: 7px;">

				<input type="hidden" id="dgUserDataPage" value="${currentPage}" /> <span id="msgSpan" style="color:red; font-size: 15px;margin-left:10px;">${message}</span>

			</div>

		</div>
		<div class="row g-0" style="padding-top:5px;">

			<div class="col-md-12 col-lg-12 ">

				<ct:dataGrid dataSource="${userDetails}" actionRowClick="false" keyField="id" id="dgUserData" name="dgUserData" startRecord="${startRecord}" currentPage="${currentPage}" pageSize="${pageSize}" gridHeight="${gridHeight}" totalRecords="${count}">
					<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
					<ct:actionColumn dataField="id" imgAction="images/edit.png" headerText="Edit" width="5" title="Edit" additionalField="password"  />
					<ct:checkboxColumn dataField="id" headerText="Select" width="1" />
					<ct:textColumn dataField="providerName" headerText="Provider Name" width="30" />
					<ct:textColumn dataField="userEmail" headerText="User Email" width="30" maxLength="35" tooltipPosition="right" />
					<ct:textColumn dataField="role" headerText="User Roles" width="20" maxLength="30" tooltipPosition="right" />
					<ct:textColumn dataField="active" headerText="Active" width="10" maxLength="30" tooltipPosition="right" />

				</ct:dataGrid>
			</div>

		</div>
		<div class="row g-0">
			<div id="myDialog" class="col-md-9 col-lg-9 modalClass"></div>
		</div>

		<div class="modal fade" id="userModal" tabindex="-1" role="dialog" aria-labelledby="userModal" aria-hidden="true">
			<div class="modal-dialog modal-md">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title" id="myModalLabel"><span id="mode">Add User</span></h4>
						<button type="button" class="close" onclick="javascript:hideAddUser()">&times;</button>
					</div>
					<div class="modal-body">
						<span id="modalError" style="color:red; font-size: 15px;"></span>
						<div style="width:93%">
							<label class="me-2"><b>Provider Name<span class="req-field">*</span></b></label>
							<ct:dataSelect height="400" placeHolder="Select Provider" dataSource="${providerList}" valueField="id" textField="providerName" id="selectProvider" name="selectProvider" maxLength="36">

							</ct:dataSelect>

						</div>

						<div style="margin-top: 10px;width:93%;">
							<label class="me-2"><b>Role<span style="color:red;">*</span></b></label>
							<ct:dataSelect height="350" placeHolder="Select Role" dataSource="${rolesList}" valueField="roleName" textField="roleName" id="selectRole" name="selectRole" maxLength="35">

							</ct:dataSelect>

						</div>

						<div class="mt-2">
							<label for="userEamil"><b>User Email<span style="color:red;">*</span></b></label>
						</div>

						<div>
							<input style="width:88%" autocomplete="off" id="userEmail" class="textInput" maxlength="100">
						</div>

						<div class="mt-2">
							<label for="userEamil"><b>User Password<span style="color:red;">*</span></b></label>
						</div>

						<div>
							<input style="width:88%" autocomplete="off" id="userPassword" class="textInput" maxlength="100">
						</div>
					</div>
					<div class="modal-footer text-center">
						<button type="button" class="search-btn" id="btnUser" style="width:150px;" onclick="javascript:saveUser('${baseurl}')">Save Changes</button>
					</div>
				</div>
			</div>
		</div>
	</div>


	<script type="text/javascript">
		document.onclick = function(e) {
			//debugger;
			var obj = e.target;
			//console.log(obj);

			var id = obj.getAttribute("id");
			var process = true;
			//console.log(id)
			if (id != null && id == "selectProviderSelectDiv") {
				//console.log("inside");
				process = false;
				hideSelect("selectRoledropdownDiv");
			}

			if (id != null && id == "selectRoleSelectDiv") {
				//console.log("inside");
				process = false;
				hideSelect("selectProviderdropdownDiv");
			}

			if (process) {
				hideSelect("selectProviderdropdownDiv");
				hideSelect("selectRoledropdownDiv");
			}
		}

		function dgUserDataNavigate(strWhere, intPages, currentPage) {
			var intPg;
			var baseurl = document.getElementById("baseurl").value;
			var errorMsg = document.getElementById("msgSpan");
			errorMsg.textContent = "";
			intPg = returnPage(strWhere, currentPage, intPages)
			var targetIds = [ dgUserData ];
			var data = {
				currentPage : intPg,
				gridHeight : screen.height,
			};

			if (intPg > 0) {
				document.getElementById("dgUserDataPage").value = intPg;
				commonSearch(baseurl + "/getUserDetails", data, targetIds);
			}
		}

		function dgUserDataAction(id, additionlField) {
			//showSpinner();
			//alert(id);

			document.getElementById("dgUserDataselectedRow").value = id;

			var tBody = document.getElementById("dgUserDatatbody");

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

			var providerName = selectedRow.cells[2].innerText;
			var userEmail = selectedRow.cells[3].innerText;
			var	userRole = selectedRow.cells[4].innerText;
			var userPassword = additionlField;

			document.getElementById("updateId").value = id;
			setSelectedText("selectProvider", providerName);
			setSelectedText("selectRole", userRole);

			document.getElementById("userEmail").value = userEmail;
			document.getElementById("userPassword").value = userPassword;

			showEditUser();

		}
		
		function setSelectedText(selectId, selectText){
			var selectObject = document.getElementById(selectId);

			if (selectObject != null) {
				//debugger
				var dropElement = document.getElementById(selectId+ "dropdownDiv");
				var chs = dropElement.children;

				if (selectText != null && selectText.length > 0) {

					for (let i = 0; i < chs.length; i++) {						
						var dataText = chs[i].getAttribute("data-text");
						if (selectText == dataText) {							
							setSelectedValues(chs[i], selectId);							
							break;
						}
					}
				} 

			}
		}
	</script>
</body>
</html>