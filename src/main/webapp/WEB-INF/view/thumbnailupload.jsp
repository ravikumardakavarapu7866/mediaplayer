<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib uri="tags/customtag.tld" prefix="ct"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="common/top.jsp"></jsp:include>
</head>
<body>
	<jsp:include page="common/header.jsp"></jsp:include>

	<div class="container-fluid thumbnailContainer">


		<h4 style="font-weight: bold;padding-left:10px">Thumbnail Upload</h4>
		<div style="width:95%;margin-left:10px;min-height:30px;">
		   <span id="msgSpan" style="color:red; font-size: 16px;">${message}</span>
		</div>	


		<div class="videoListDiv">
			<div style="margin-bottom:4px;">
				<label for="providerName"><b>Provider Name<span style="color:red;">*</span></b></label><br>
                <span tabindex="0">
				<ct:dataSelect height="350" placeHolder="Select Provider" dataSource="${providerList}" onchangeFunction="thumbnailProviderChange(this)" valueField="id" textField="providerName" id="selectProvider" name="selectProvider" maxLength="40">

				</ct:dataSelect>
				</span>
			</div>



			<div>
				<label for="videoName"><b>Video Name<span style="color:red;">*</span></b></label>

				<div id="videoDiv">
                    <span tabindex="0">
					<ct:dataSelect height="350" placeHolder="Select Video" dataSource="${videosSelect}" additionalField="sourceId" valueField="id" textField="label" id="selectVideo" name="selectVideo" maxLength="35">

					</ct:dataSelect>
                    </span>

				</div>
			</div>


			<div>
				<label><b>Thumbnail Image Type<span style="color:red;">*</span></b><i class="material-icons thumbnailInfoIcon" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="Supported image formats are .png, .jpeg, .jpg of width:350 and height:197.">info</i></label> <select tabindex = "0" class="thumbnailImageType"
					id="imageType" name="imageType" onchange="showImageInput(this)">
					<option value="" disabled selected class="d-none">Select Image Type</option>
					<option value="file">Image File</option>
					<option value="url">Image URL</option>
				</select>
			</div>
			<div id="imageFileInput" style="display:none">
				<label for="imageFile"><b>Upload a Image File <span style="color:red;">*</span></b></label> <br> <input tabindex = "0" type="file" accept="image/*" id="imageFile" name="imageFile" style="height: 30px;width:400px; margin-bottom:3px;" class="imageFileUpload">
			</div>
			<div id="imageUrlInput" style="display:none">
				<label for="imageUrl"><b>Enter a Image URL<span style="color:red;">*</span></b></label> <br> <input  tabindex = "0" class="thumbnailImageUrl" type="url" id="imageUrl" name="imageUrl" placeholder="https://example.com/image.png">
			</div>

			<div style="margin-top: 10px;width:120px;">
				<button class="btnSubmit" id="thumbnailUpload" onClick="javascript:saveThumbnailImage()">Submit</button>
			</div>
		</div>



	</div>

</body>
<script>
	
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
			var errorMsg = document.getElementById("msgSpan");
			errorMsg.textContent = "";
			hideSelect("selectVideodropdownDiv");
		}

		if (id != null && id == "selectVideoSelectDiv") {
			//console.log("inside");
			process = false;
			var errorMsg = document.getElementById("msgSpan");
			errorMsg.textContent = "";
			hideSelect("selectProviderdropdownDiv");
		}

		if (process) {
			hideSelect("selectProviderdropdownDiv");
			hideSelect("selectVideodropdownDiv");
		}
	};
	
	var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
	var popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
		return new bootstrap.Popover(popoverTriggerEl)
	})

</script>
</html>
