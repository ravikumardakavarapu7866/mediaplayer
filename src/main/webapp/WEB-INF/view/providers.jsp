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
			<span id="msgSpan" style="color:red; font-size: 15px; ">${message}</span> 
			<span id="gridError" style="color:red; font-size: 15px;"></span>
			<input type="hidden" id ="dgProviderTokensPage" value = "${currentPage}" />
			<input type="hidden" id ="serverDateTime" value = "${serverDateTime}" />
		</div>

		<div class="row g-0">

			<h4 style="font-weight: bold;background: #E3DEDD; width: 100%">&nbsp;Providers</h4>
			<div class="d-flex">
				<div class="col-lg-6">
					<div class="row  g-0">
						<div class="col-lg-12 ">
							<label><b>Provider Name</b></label> <input autocomplete="off" id="providerValue" class="textInput ms-2" maxlength="100" value="${inputProvider}" onkeyup="searchProviderTokens()" style="height:30px;width:70%;margin-top:3px;">
						</div>
					</div>
				</div>
				<div class="col-lg-6">
					<div class="d-flex  float-end">
						<div style="padding-left: 15px;">						
							
							${addProvider}

						</div>
						<div style="padding-left: 15px;">
							<button type="button" class="search-btn" onclick="javascript:showGenProviderToken()">Generate Provider Token</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row g-0" style="min-height:15px;"></div>

		<div class="row g-0">

			<div class="col-md-12 col-lg-12 ">

				<ct:dataGrid dataSource="${providerTokenList}" keyField="id" id="dgProviderTokens" name="dgProviderTokens" startRecord="${startRecord}" currentPage="${currentPage}" pageSize="${pageSize}" gridHeight="${gridHeight}" totalRecords="${count}">
					<ct:gridPager imgFirst="images/first.gif" imgPrevious="images/previous.gif" imgNext="images/next.gif" imgLast="images/last.gif" />
					<ct:actionColumn dataField="id" imgAction="images/delete2.png" headerText="Delete" width="5" title="Delete Token" />
					<ct:textColumn dataField="providerName" headerText="Provider Name" width="10" maxLength="40" tooltipPosition="right" />
					<ct:textColumn dataField="token" headerText="Provider Token" width="20" maxLength="40" tooltipPosition="left" />
					<ct:textColumn dataField="validFromDate" headerText="From DateTime" dataFormat="dd-MMM-yyyy HH:mm:ss" width="12" />
					<ct:textColumn dataField="validEndDate" headerText="End DateTime" dataFormat="dd-MMM-yyyy HH:mm:ss" width="12" />
					<ct:textColumn dataField="deletedText" headerText="Deleted Token" width="20" />
					<ct:textColumn dataField="sendToEmail" headerText="Send To Email" width="20" />
					
					<ct:textColumn dataField="expirationEmailSentDate" headerText="Expiration Email Sent DateTime" dataFormat="dd-MMM-yyyy HH:mm:ss" width="12" />
					
					<ct:textColumn dataField="createdDate" headerText="Created DateTime" dataFormat="dd-MMM-yyyy HH:mm:ss" width="12" />
				</ct:dataGrid>



			</div>

		</div>



		<div class="modal fade" id="providerModal" tabindex="-1" role="dialog" aria-labelledby="providerModal" aria-hidden="true">
			<div class="modal-dialog modal-md">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title" id="myModalLabel">Add Provider</h4>
						<button type="button" class="close" onclick="javascript:hideAddProvider()">&times;</button>
					</div>
					<div class="modal-body">
						<span id="modalError" style="color:red; font-size: 15px;"></span>
						<div style="display:flex;">
							<label class="me-2"><b>Provider Name<span class="req-field">*</span></b></label> <input autocomplete="off" id="providerName" class="textInput" maxlength="100" style="height:30px;width:250px;margin-top:3px;">
						</div>
					</div>
					<div class="modal-footer text-center">
						<button type="button" class="search-btn" id="btnAddProvider" style="width:150px;" onclick="javascript:saveAddProvider('${baseurl}')">Save Changes</button>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="providerTokenModal" tabindex="-1" role="dialog" aria-labelledby="providerTokenModal" aria-hidden="true">
			<div class="modal-dialog modal-md">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title" id="myModalLabel">Generate Provider Token</h4>
						<button type="button" class="close" onclick="javascript:hideGenProviderToken()">&times;</button>
					</div>
					<div class="modal-body">
						<span id="modalErrorGen" style="color:red; font-size: 15px;"></span>
						<div style="width:93%">
							<label class="me-2"><b>Provider Name<span class="req-field">*</span></b></label>
							<ct:dataSelect height="400" placeHolder="Select Provider" dataSource="${providerList}" valueField="id" textField="providerName" id="selectProvider" name="selectProvider" maxLength="36">

							</ct:dataSelect>

						</div>

						<div class="mt-2">
							<label for="sendToEmail"><b>Send To Email<span style="color:red;">*</span></b></label>
						</div>

						<div>
							<input style="width:88%" autocomplete="off" id="sendToEmail" class="textInput" maxlength="100">
						</div>
						<div style="display:flex" class="mt-2">
							<div style="width:47%;">
								<label><b>From DateTime<span style="color:red;">*</span></b></label> <input id="fromDate" placeholder="yyyy-mm-dd HH:mm" type="text" style="cursor: pointer;" readonly>
							</div>
							<div style="width:47%;">
								<label><b>End DateTime<span style="color:red;">*</span></b></label> <input id="endDate" placeholder="yyyy-mm-dd HH:mm" type="text" style="cursor: pointer;" readonly>
							</div>
						</div>
					</div>

					<button type="button" class="search-btn ms-3" id="btnAddProviderToken" style="width:150px;" onclick="javascript:saveGenProviderToken('${baseurl}')">Save Changes</button>

					<div style="height:300px;"></div>

				</div>
			</div>
		</div>

	</div>

	<script type="text/javascript">
		$(document).ready(function() {
			
			var serverDateTime =  document.getElementById("serverDateTime").value;

			$("#fromDate").datetimepicker({
				format : "Y-m-d H:i",				
				minDateTime : serverDateTime,
				defaultDate : serverDateTime
			});
			$("#endDate").datetimepicker({
				format : "Y-m-d H:i",				
				minDateTime : serverDateTime,
				defaultDate : serverDateTime
			});

		});

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
			}

			if (process) {
				hideSelect("selectProviderdropdownDiv");

			}

		};

		function dgProviderTokensNavigate(strWhere, intPages, currentPage) {

			var intPg;

			var baseurl = document.getElementById("baseurl").value;

			intPg = returnPage(strWhere, currentPage, intPages)

			if (intPg > 0) {
				document.getElementById("dgProviderTokensPage").value = intPg;
				//showSpinner();
				var inputValue = document.getElementById('providerValue').value.trim();
				var targetIds = [ dgProviderTokens ];
				var data = {
					currentPage : intPg,
					providerValue : inputValue,
					gridHeight : screen.height
				}
				commonSearch(baseurl + "/providers", data, targetIds);

			}
		}
		
		function dgProviderTokensAction(id) {
			
			var gridError = document.getElementById("gridError");
			gridError.textContent = "";
			
			var baseurl = document.getElementById("baseurl").value;
			
			var dgDeleteVideosPage = document.getElementById("dgProviderTokensPage").value;
			var inputValue = document.getElementById('providerValue').value.trim();
			
			document.getElementById("dgProviderTokensselectedRow").value = id;

			var tBody = document.getElementById("dgProviderTokenstbody");
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
			
			var message = "Are you sure you want to delete provider token..?";
			
			var confirmBox = document.createElement("div");
			confirmBox.classList.add('confirm-box');
			
			var messageBox = document.createElement("div");
			messageBox.classList.add('message-box');
			messageBox.textContent = message;
			confirmBox.appendChild(messageBox);

			var buttonBox = document.createElement("div");
			buttonBox.classList.add('button-box');
			messageBox.appendChild(buttonBox);

			var yesButton = document.createElement("button");
			yesButton.classList.add('yes-button');
			yesButton.textContent = "Yes";
			buttonBox.appendChild(yesButton);
			yesButton.addEventListener('click', YesButtonClick);

			var noButton = document.createElement("button");
			noButton.classList.add('no-button');
			noButton.textContent = "No";
			buttonBox.appendChild(noButton);
			noButton.addEventListener('click', NoButtonClick)
			
			function YesButtonClick() {
				submitFormAction(baseurl + "/providers", {
					currentPage: dgDeleteVideosPage,
					providerTokenId: id,
					providerValue : inputValue,
					gridHeight: screen.height
				});
				removeConfirmBox();
			}

			function NoButtonClick() {
				removeConfirmBox();
			}

			function removeConfirmBox() {
				document.body.removeChild(confirmBox);
			}
			document.body.appendChild(confirmBox);
		}
	</script>

</body>
</html>