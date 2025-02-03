<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri="tags/customtag.tld" prefix="ct"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="common/top.jsp"></jsp:include>
</head>
<body>
	<jsp:include page="common/header.jsp"></jsp:include>
	<div class="container-fluid padding-container margin-Topbottom mainVideoUploadDiv">
		<div class="col-md-4 ">
		<input type="hidden" id ="serverDateTime" value = "${serverDateTime}" />
		</div>
		<div class="col-md-4  ">

			<form class="videoUplaod " id="videoUplaodId">

				<h4 style="font-weight: bold;">&nbsp;Upload Video</h4>
				<span id="msgSpan" style="color:red; font-size: 15px;">${message}</span>

				<div>
					<label for="providerName"><b>Provider Name<span style="color:red;">*</span></b></label>
					<span tabindex = "0">
					<ct:dataSelect height="350" placeHolder="Select Provider" dataSource="${providerList}" valueField="providerName" textField="providerName" id="providerName" name="providerName" maxLength="35">

					</ct:dataSelect>
					</span>
				</div>

				<label><b>Source Id<span style="color:red;">*</span></b></label> <input id="sourceId" class="textInput" maxlength="100"> <label><b>Video Name<span style="color:red;">*</span></b> </label> <input id="videoName" class="textInput" maxlength="100"> <label><b>Video Description</b></label>
				<textarea id="videoDesc" class="textInput" rows="9" cols="50" style="height:100%;resize: none;"></textarea>
				<label><b>Language<span style="color:red;">*</span></b></label> <input id="language" class="textInput" maxlength="50" onkeydown="checkCharacter(event)">
				<div style="display:flex">
					<div style=" margin-right: 21px; width:45%;">
						<label><b>Release Date<span style="color:red;">*</span></b></label> <input id="releaseDate" placeholder="yyyy-mm-dd" type="text" style="cursor: pointer;" readonly>
					</div>
					<div style="width:47%;">
						<label><b>End Date</b></label> <input id="endDate" placeholder="yyyy-mm-dd" type="text" style="cursor: pointer;" readonly>
					</div>
				</div>
				<label><b>Type<span style="color:red;">*</span></b></label> <select id="type" onchange="showSeasons(this)">
					<option value="" disabled selected class="d-none">Select Type</option>
					<option>Movie</option>
					<option>Seasons</option>
				</select>
				<div class="seasonsDiv" id="seasonsId" style="display:none">
					<div style="display:flex">
						<div style=" margin-right: 21px; width:45%;">
							<label><b>Season Number<span style="color:red;">*</span></b></label><br> <input type="number" oninput="this.value = this.value.replace(/[^0-9]/, '')" min="1" id="seasonNumber" class="numberInput">
						</div>
						<div style="width:47%;">
							<label><b>Episode Number<span style="color:red;">*</span></b></label><br> <input oninput="this.value = this.value.replace(/[^0-9]/, '')" type="number" min="1" id="episodeNumber" class="numberInput">
						</div>
					</div>
					<div>
						<label><b>Episode Name<span style="color:red;">*</span></b></label> <input id="episodeName" class="textInput" maxlength="100">

					</div>
				</div>

				<label for="videoType"><b>Video Type<span style="color:red;">*</span></b></label>
				 <select id="videoType" name="videoType" onchange="showInput(this)">
					<option value="" disabled selected class="d-none">Select Video Type</option>
					<option value="file">Video File</option>
					<option value="url">Video URL</option>
				</select>
				<div id="fileInput" style="display:none">
					<label for="videoFile"><b>Upload a Video File<span style="color:red;">*</span></b></label> <input type="file" accept="video/*" id="videoFile" name="videoFile" style="height: 30px;cursor: pointer;" class="videoFileUpload">
				</div>
				<div id="urlInput" style="display:none">
					<label for="videoUrl"><b>Enter a Video URL<span style="color:red;">*</span></b></label> <input type="url" id="videoUrl" name="videoUrl" placeholder="https://example.com/video.mp4">
				</div>

				<label><b>Thumbnail Image Type<i class="material-icons thumbnailInfoIcon" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="Supported image formats are .png, .jpeg, .jpg of width:350 and height:197.">info</i></b></label> <select id="imageType" name="imageType" onchange="showImageInput(this)">
					<option value="" disabled selected class="d-none">Select Image Type</option>
					<option value="file">Image File</option>
					<option value="url">Image URL</option>
				</select>
				<div id="imageFileInput" style="display:none">
					<label for="imageFile"><b>Upload a Image File </b></label> <input type="file" accept="image/*" id="imageFile" name="imageFile" style="height: 30px;" class="imageFileUpload">
				</div>
				<div id="imageUrlInput" style="display:none">
					<label for="imageUrl"><b>Enter a Image URL</b></label> <input type="url" id="imageUrl" name="imageUrl" placeholder="https://example.com/image.png">
				</div>
				<!-- <input id="thumbnailUrl">  -->
<!-- 				<label><b>Provider AuthKey</b></label> <input id="providerAuthkey"> -->

				<div style="margin-top: 10px;width:120px;">
					<button type="button" id="uploadButton" class="btnSubmit mt-2" onclick="uploadVideoDelay()">Upload</button>
				</div>
			</form>
		</div>
		
		<div class="col-md-4 "></div>

	</div>
	<!-- 	<input type="hidden" id="playerSchedularUrl" -->
	<%-- 		value="${playerSchedularUrl}" /> --%>

</body>
<script type="text/javascript">
	$(document).ready(function() {
		 
		var serverDateTime =  document.getElementById("serverDateTime").value;
		var serverDate = new Date(serverDateTime);
		$("#releaseDate").datepicker({
			dateFormat : "yy-mm-dd",
			defaultDate : serverDate,
			minDate : serverDate,
		});
		$("#endDate").datepicker({
			dateFormat : "yy-mm-dd",
			defaultDate : serverDate,
			minDate : serverDate,
		});

		var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
		var popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
			return new bootstrap.Popover(popoverTriggerEl)
		})

	});

	document.onclick = function(e) {
		//debugger;
		var obj = e.target;
		//console.log(obj);

		var id = obj.getAttribute("id");
		var process = true;
		//console.log(id)
		if (id != null && id == "providerNameSelectDiv") {
			//console.log("inside");
			var errorMsg = document.getElementById("msgSpan");
			errorMsg.textContent = "";
			process = false;
		}

		if (process) {
			hideSelect("providerNamedropdownDiv");
		}
	};
</script>


</html>