<!DOCTYPE html>
<html lang="en">
<head>
<jsp:include page="common/top.jsp"></jsp:include>

<script type="text/javascript">
	$(document).ready(function() {

		showVideo();
	});
</script>

</head>

<body>
	<jsp:include page="common/header.jsp"></jsp:include>

	<div class="container-fluid padding-container margin-Topbottom">


		<div class="row g-0 px-5">
	      <div class="col-lg-12 col-md-12">
			<div id="videoPlayer"></div>
		</div>
			<input type="hidden" id="playerUrl" value="${playerUrl}" /> 
			<input type="hidden" id="videoId" value="${videoId}" />
			
			<input type="hidden" id="showWatermark" value="${showWatermark}" />
			<input type="hidden" id="userToken" value="${userToken}" />
			<input type="hidden" id="sessiontimeout" value="${sessiontimeout}" />
			<input type="hidden" id=sessionIncrement value="${sessionIncrement}" />
			<input type="hidden" id="providerId" value="${providerId}" />
			<input type="hidden" id="playFromBegin" value="${playFromBegin}" />
			
		</div>

	</div>

	<jsp:include page="common/footer.jsp"></jsp:include>


</body>
</html>


