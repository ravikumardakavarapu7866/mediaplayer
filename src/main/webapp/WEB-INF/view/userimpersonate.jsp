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
			<h4 style="font-weight: bold;background: #E3DEDD; width: 100%">&nbsp;User Impersonate</h4>
		</div>

		<div class="row g-0" style="min-height:30px;">
			<span id="errorSpan" style="color:red; font-size: 16px;">${message}</span>
		</div>

		<div class="row g-0" style="margin-to:5px;">
			<div class="col-lg-6">
				<label for="providerName"><b>Provider Name<span style="color:red;">*</span></b></label>
				<ct:dataSelect height="350" placeHolder="Select Provider" dataSource="${providerList}" onchangeFunction="impProviderChange(this)" valueField="id" textField="providerName" id="selectProvider" name="selectProvider" maxLength="40">
				</ct:dataSelect>
			</div>
		</div>

		<div class="row g-0" style="margin-top:10px;">
			<div class="col-lg-6">
				<label for="userEmail"><b>User Email<span style="color:red;">*</span></b></label>
				<div id="usersDiv">
				<ct:dataSelect height="350" placeHolder="Select User Email" dataSource="${userList}" valueField="id" textField="userEmail" id="selectUser" name="selectUser" maxLength="40">
				</ct:dataSelect>
				</div>
			</div>
		</div>


		<div style="margin-top:20px;width:120px;">
			<button type="button" class="search-btn" id="btnImpersonate" onClick="javascript: impersonate()">Impersonate</button>
		</div>

	</div>

</body>
<script>
	document.onclick = function(e) {
		//debugger;
		var obj = e.target;		

		var id = obj.getAttribute("id");
		var process = true;
		//console.log(id)
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
</script>
</html>
