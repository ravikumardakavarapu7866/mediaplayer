

function showSelect(selectId) {
	//debugger;
	var dropdownDivId = selectId + "dropdownDiv";
	var dropdownSelectDivId = selectId + "SelectDiv";

	setSelectedObject(selectId, dropdownDivId);

	var dropdown = document.getElementById(dropdownDivId);
	if (dropdown) {
		var dropdownSelect = document.getElementById(dropdownSelectDivId);

		var rect = dropdownSelect.getBoundingClientRect();
		var width = Math.floor(rect.width);

		dropdown.style.width = width + "px";

		var mode = dropdown.style.display;

		if (mode == "none") {
			dropdown.style.display = "block";
		}
		else {
			dropdown.style.display = "none";
		}
	}


}

function hideSelect(dropdownDivId) {
	//debugger;
	var dropdown = document.getElementById(dropdownDivId);
	if (dropdown) {
		dropdown.style.display = "none";
	}
	//dropdown.classList.toggle('hidden');


}

function setSelected(obj, selectId) {
	//debugger;
	var dropdownDivId = selectId + "dropdownDiv";
	var dropdown = document.getElementById(dropdownDivId);
	if (dropdown) {
		dropdown.style.display = "none";
	}

	setSelectedValues(obj, selectId);

}

function setSelectedValues(obj, selectId) {
	//debugger;	

	var dropdownSelectDivId = selectId + "SelectDiv";
	var selectIdAdditionalId = selectId + "Additional";

	var dataValue = obj.getAttribute("data-value");
	var dataText = obj.getAttribute("data-text");
	var dataAdditional = obj.getAttribute("data-additional");
	var dataTip = obj.getAttribute("data-tip");

	var objSelcted = document.getElementById(selectId);
	objSelcted.value = dataValue;

	var dropdownSelect = document.getElementById(dropdownSelectDivId);
	dropdownSelect.innerText = dataText;

	var selectIdAdditional = document.getElementById(selectIdAdditionalId);
	selectIdAdditional.value = dataAdditional;
	
	
	var dropdownSelectRowId = selectId + "SelectRow";
	var dropdownSelectRow = document.getElementById(dropdownSelectRowId);
	
	var label = dataText;
	if(dataTip != null && dataTip.length > 0){
		label = dataTip;
	}
		
	dropdownSelectRow.value = label;
}

function hoverDiv(obj, selectId, maxLength) {

	obj.style.background = "#0d6efd";
	obj.style.color = "#FFF";

	//debugger;

	var rect = obj.getBoundingClientRect();
	var dataTip = obj.getAttribute("data-tip");

	if (dataTip != null && dataTip.length > 0 && maxLength > 0) {
		//debugger;
		//console.log(obj);
		//console.log(rect);

		var tooltipDivId = selectId + "tooltipDiv";
		var tooltipDiv = document.getElementById(tooltipDivId);
		if (tooltipDiv) {

			//console.log(dataTip.length);
			//console.log(maxLength);
			var left = Math.floor(rect.x) + 20;
			var lines = Math.floor(dataTip.length / maxLength);

			if (lines == 0) {
				lines = 1;
			}

			//console.log(lines)
			var pos = (lines * rect.height) + 7;

			var top = Math.floor(rect.y) - pos;

			tooltipDiv.style.top = top + "px";
			if(maxLength==36) {
			tooltipDiv.style.left = 60 + "px";
			}
			else {
				tooltipDiv.style.left = left + "px";
			}
			tooltipDiv.innerText = dataTip;

			tooltipDiv.style.display = "block";
		}
	}

}

function hoverDivOut(obj, selectId) {

	var dropdownDivId = selectId + "dropdownDiv";

	setSelectedObject(selectId, dropdownDivId);

	var tooltipDivId = selectId + "tooltipDiv";
	var tooltipDiv = document.getElementById(tooltipDivId);
	if (tooltipDiv) {
		tooltipDiv.style.display = "none";
	}

}

function setSelectedObject(selectId, dropdownDivId) {
	var objSelcted = document.getElementById(selectId);

	var dataValue;
	var dropElement = document.getElementById(dropdownDivId);
	var chs = dropElement.children;
	for (let i = 0; i < chs.length; i++) {
		chs[i].style.background = "#FFF";
		chs[i].style.color = "#111";

		dataValue = chs[i].getAttribute("data-value");

		if (objSelcted.value == dataValue) {

			chs[i].style.background = "#0d6efd";
			chs[i].style.color = "#FFF";

		}
	}
}

function hoverGrid(obj, gridId, maxLength) {

	//obj.style.background = "#0d6efd";
	//obj.style.color = "#FFF";

	//debugger;

	var rect = obj.getBoundingClientRect();
	var dataTip = obj.getAttribute("data-tooltip");
	var dataTipPosition = obj.getAttribute("data-tooltip-position");

	if (dataTip != null && dataTip.length > 0 && maxLength > 0) {
		//debugger;
		//console.log(obj);
		//console.log(rect);

		var tooltipDivId = gridId + "tooltipDiv";
		var tooltipDiv = document.getElementById(tooltipDivId);
		if (tooltipDiv) {
			var left = Math.floor(rect.x);
			var lines = Math.floor(dataTip.length / maxLength);

			if (lines == 0) {
				lines = 1;
			}

			//console.log(lines)
			var pos = (lines * rect.height);

			var top = Math.floor(rect.y) - pos;

			//console.log(pageSize);
			//console.log(lineNumber);

			//var bottom = (pageSize - lineNumber) * 30;

			//var bottom = Math.floor(rect.y) + ;

			//console.log(top);

			//tooltipDiv.style.bottom = "100px";

			//tooltipDiv.style.bottom = bottom + "px";
			tooltipDiv.style.top = top + "px";

			tooltipDiv.innerText = dataTip;

			if (dataTipPosition == "left") {

				left = Math.floor(rect.x) - 370;
			} else {
				left = Math.floor(rect.x) + Math.floor(rect.width);
			}

			tooltipDiv.style.left = left + "px";

			tooltipDiv.style.display = "block";
			
			//tooltipDiv.style.width = "500px";
		}
	}

}

function hoverGridOut(obj, gridId) {

	var tooltipDivId = gridId + "tooltipDiv";
	var tooltipDiv = document.getElementById(tooltipDivId);
	if (tooltipDiv) {
		tooltipDiv.style.display = "none";
	}

}


function gridRowIn(obj) {

	obj.classList.add("gridRowBacgroundColor");


}


function gridRowOut(obj, gridId, rowId) {
	//debugger;
	var hiddenId = document.getElementById(gridId + "selectedRow").value;
	if (hiddenId != rowId) {
		obj.classList.remove("gridRowBacgroundColor");
	}

}




function enterMouse(obj, selectId) {
	var rect = obj.getBoundingClientRect();
	var dataTip = obj.getAttribute("data-tip");
	var type = "";

	if (dataTip != null && dataTip.length > 0) {
		var tooltipDivId = selectId + "tooltipDiv";
		var tooltipDiv = document.getElementById(tooltipDivId);
		if (tooltipDiv) {
			var left =  Math.floor(rect.x) + 20;
			var lines = Math.floor(dataTip.length / 30);

			if (lines == 0) {
				lines = 1;
			}

			var pos = (lines * 30);


			var top =  Math.floor(rect.y) - pos;
			type = obj.getAttribute("type");
			if(type != "" && type == "VideoDescription"){
				var left = Math.floor(rect.x);
				if (lines > 2) {
						tooltipDiv.style.top = 235 + "px";
					}else{
						tooltipDiv.style.top = top + "px";
					}
				
				tooltipDiv.style.left = left + "px";
			}else{
				tooltipDiv.style.top = top + "px";
				tooltipDiv.style.left = left + "px";
			}
			
			tooltipDiv.innerText = dataTip;

			tooltipDiv.style.display = "block";
		}
	}

}

function leaveMouse(obj, selectId) {
	var tooltipDivId = selectId + "tooltipDiv";
	var tooltipDiv = document.getElementById(tooltipDivId);
	if (tooltipDiv) {
		tooltipDiv.style.display = "none";
	}

}



function hoverCheckedList(obj, id, maxLength) {

	//obj.style.background = "#0d6efd";
	//obj.style.color = "#FFF";

	//debugger;

	var rect = obj.getBoundingClientRect();
	var dataTip = obj.getAttribute("data-tooltip");

	if (dataTip != null && dataTip.length > 0 && maxLength > 0) {
		//debugger;
		//console.log(obj);
		//console.log(rect);

		var tooltipDivId = id + "tooltipDiv";
		var tooltipDiv = document.getElementById(tooltipDivId);
		if (tooltipDiv) {
			//var left = Math.floor(rect.x) + 20;
			var lines = Math.floor(dataTip.length / maxLength);

			if (lines == 0) {
				lines = 1;
			}

			//console.log(lines)
			var pos = (lines * rect.height) + 120;

			var top = Math.floor(rect.y) - pos;

			//console.log("top:" + top);
			//console.log("left:" + left);

			tooltipDiv.style.top = top + "px";
			tooltipDiv.style.left = "60px";
			tooltipDiv.innerText = dataTip;

			tooltipDiv.style.display = "block";
		}
	}

}

function hoverCheckedListOut(obj, id) {

	var tooltipDivId = id + "tooltipDiv";
	var tooltipDiv = document.getElementById(tooltipDivId);
	if (tooltipDiv) {
		tooltipDiv.style.display = "none";
	}

}