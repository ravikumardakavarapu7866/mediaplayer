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

			<h4 style="font-weight: bold;background: #E3DEDD; width: 100%;padding-left:10px">Video Analysis</h4>

		</div>

		<div style="width:95%;min-height:30px;">			
			<span id="gridError" style="color:red; font-size: 15px;">${message}</span> 
			<input type="hidden" id="dgVideoAnalysisPage" value="${currentPage}" />
		</div>

		<div style="margin-top: 2px;width:400px;">
			<label for="providerId"><b>Provider Name<span class="req-field">*</span></b> </label>

			<ct:dataSelect height="350" placeHolder="Select Provider" dataSource="${providerSelect}" onchangeFunction="videoAnalysisProviderChange(this)" valueField="id" textField="providerName" id="selectProvider" name="selectProvider" maxLength="25">

			</ct:dataSelect>

		</div>
		<div style="margin-top: 10px;width:400px;">
			<label for="videoMasterId"><b>Video Name<span class="req-field">*</span></b> </label>

			<div id="videosDiv">
				<ct:dataSelect height="350" placeHolder="Select Video" dataSource="${videoSelect}" additionalField="sourceId" valueField="id" textField="label" id="selectVideo" name="selectVideo" maxLength="25">

				</ct:dataSelect>
			</div>
		</div>

		<div style="margin-top: 10px;">
			<label for="videoFile"><b>Upload a Video File <span style="color:red;">*</span></b></label>
			<div>
				<input tabindex="0" type="file" id="videoFile" name="imageFile" style="height: 30px;width:400px; margin-bottom:3px;" class=videoFileUpload>
			</div>
		</div>


		<div style="margin-top: 10px;width:120px;">
			<button class="btnSubmit" id="btnVideoUpload" onClick="javascript:saveVideoAnalysis()">Submit</button>
		</div>
		
		<!--         
		<div class="row g-0">

			<div style="display:flex;margin-top: 15px;">

				<label><b>Video Name</b> </label>
				<span style="width:5px;"></span>
				<input autocomplete="off" tabindex="2" id="videoValue" class="textInput" maxlength="100" value="${inputVideo}" onkeyup="searchVideoAnalysisVideo()" style="height:30px;width:34%;margin-top:3px;">

				<span style="width:5px;"></span>
				<label><b>User Email</b> </label>
				<span style="width:5px;"></span>
				<input autocomplete="off" tabindex="1" id="userValue" class="textInput" maxlength="100" value="${inputEmail}" onkeyup="searchVideoAnalysisUser()" style="height:30px;width:34%;margin-top:3px;">


			</div>

		</div>
		 -->

		<div class="col-md-12 col-lg-12 " style="margin-top: 10px;">

			<ct:dataGrid dataSource="${videoAnalysisList}" keyField="id" id="dgVideoAnalysis" name="dgVideoAnalysis" startRecord="${startRecord}" currentPage="${currentPage}" pageSize="${pageSize}" gridHeight="${gridHeight}" totalRecords="${count}">
				<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
				
				<ct:textColumn dataField="fileName" headerText="Uploaded File" width="20" />
				<ct:textColumn dataField="providerName" headerText="Provider Name" width="20" />
				<ct:textColumn dataField="videoName" headerText="Video Name" width="20" />
				<ct:textColumn dataField="processedModified" headerText="Processed" width="5" />
				<ct:textColumn dataField="userEmail" headerText="Matched User Email" width="20"  />
				<ct:textColumn dataField="status" headerText="Status" width="20"  />
				<ct:textColumn dataField="statusMessage" headerText="Status Message" width="20"  />
				
			</ct:dataGrid>



		</div>



	</div>



	<script>
		$(document).ready(function() {
			setVideoAnalysisPage();
		});

		document.onclick = function(e) {
			//debugger;
			var obj = e.target;
			//console.log(obj);

			var id = obj.getAttribute("id");

			var process = true;
			//console.log(id)
			if (id != null && id == "selectProviderSelectDiv") {
				process = false;
				hideSelect("selectVideodropdownDiv");
			}

			if (id != null && id == "selectVideoSelectDiv") {
				process = false;
				hideSelect("selectProviderdropdownDiv");
			}

			if (process) {
				//console.log("outside");
				hideSelect("selectProviderdropdownDiv");
				hideSelect("selectVideodropdownDiv");
			}

		};
		
		function dgVideoAnalysisNavigate(strWhere, intPages, currentPage) {

			var intPg;
			
			var baseurl = document.getElementById("baseurl").value;

			intPg = returnPage(strWhere, currentPage, intPages)
			var targetIds = [ dgVideoAnalysis ];
			var data = {
				currentPage : intPg,				
				gridHeight : screen.height
			}

			if (intPg > 0) {
				document.getElementById("dgVideoAnalysisPage").value = intPg;
				commonSearch(baseurl + "/videoAnalysis", data, targetIds);

			}
		}

	</script>
</body>
</html>
