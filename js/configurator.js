
function initConfigurator() {
	$('#configuratorTabs').tab();
	var rowCount= $('#configuratorMobileNumberTbody tr').length;
    $("#numberRecipients").html("" + rowCount + ""); 

    /*** for-loop to get all fromFields from scenario.json ***/
    for (var property in configScenario.formFields) {
        if (configScenario.formFields.hasOwnProperty(property)) {
            if (property)
                $('#' + property + "Input").val(configScenario.formFields[property]);
        }
    }
    
    /*** for-loop to get all demoImages from scenario.json ***/
    for (var image in configScenario.demoImages) {
        if (configScenario.demoImages.hasOwnProperty(image)) {
            if (image)
                $('#' + image + "Image").val(configScenario.demoImages[image]);
        }
    }

	clearMobileNumbers();
    if(configScenario.mobileNumbers) {
    	for(var i = 0; i < configScenario.mobileNumbers.length; i++) {
        	addMobileNumber(configScenario.mobileNumbers[i]["name"], configScenario.mobileNumbers[i]["mobile"], configScenario.mobileNumbers[i]["smsText"]);
    	}
    }
   
   clearHistoryRecords();
   	if(configScenario.nbaHistory) {
    	for(var i = 0; i < configScenario.nbaHistory.items.length; i++) {
        	addHistoryRecord(configScenario.nbaHistory.items[i]["id"], configScenario.nbaHistory.items[i]["desc"], configScenario.nbaHistory.items[i]["responseDate"], configScenario.nbaHistory.items[i]["response"] );
    	}
    }
    
    clearNbaRecords();
    if(configScenario.nba) {
    	for(var i = 0; i < configScenario.nba.items.length; i++) {
        	addNbaRecord(configScenario.nba.items[i]["id"], configScenario.nba.items[i]["desc"], configScenario.nba.items[i]["propensity"], configScenario.nba.items[i]["detailImg"] );
    	}
    }
    
    clearSearchPostRecords();
    if(configScenario.searchHistory) {
    	for(var i = 0; i < configScenario.searchHistory.items.length; i++) {
        	addSearchPost(configScenario.searchHistory.items[i]["id"], configScenario.searchHistory.items[i]["desc"], configScenario.searchHistory.items[i]["responseDate"], configScenario.searchHistory.items[i]["source"] );
    	}
    }
    
	clearAnalyticsRecords();
    if(configScenario.customerAnalytics) {
    	for(var i = 0; i < configScenario.customerAnalytics.items.length; i++) {
        	addAnalyticsRecord(configScenario.customerAnalytics.items[i]["label"], configScenario.customerAnalytics.items[i]["value"], configScenario.customerAnalytics.items[i]["text"]);
    	}
    }
       
    $("#demoTitleInput").val(configScenario.demoTitle);
    
    $("#sendsmsInput").prop("checked", checkIfTrue(configScenario.sendsms));
    if (checkIfTrue(configScenario.sendsms)) {
	    $("#smsTab").show();
	} else {
		$("#smsTab").hide();
	}
		
    $("#usecurrentlocationInput").prop("checked", checkIfTrue(configScenario.usecurrentlocation));    
    $("#latitudeInput").val(configScenario.latitude);
    $("#longtitudeInput").val(configScenario.longtitude);
    
    if ($("#usecurrentlocationInput").prop("checked")) {
    	document.getElementById("latitudeInput").disabled = true;
		document.getElementById("longtitudeInput").disabled = true;
    }
}    

function smsCheckboxOnChange(element){
	if (element.checked) {
		$("#smsTab").show();
	} else {
		$("#smsTab").hide();
	}
}

function geoCheckboxOnChange(element){
	if (element.checked) {
		document.getElementById("latitudeInput").disabled = true;
		document.getElementById("longtitudeInput").disabled = true;
	} else {
		document.getElementById("latitudeInput").disabled = false;
		document.getElementById("longtitudeInput").disabled = false;
	}
}


function getConfiguratorGeoCheckbox() {
	if ($("#usecurrentlocationInput").prop("checked")) {
		return true;
	} else {
		return false;
	}
}

function getSMSGeoCheckbox() {
	if ($("#sendsmsInput").prop("checked")) {
		return true;
	} else {
		return false;
	}
}

function getConfiguratorLatitude() {
	return $("#latitudeInput").val();
}

function getConfiguratorLongtitude() {
	return $("#longtitudeInput").val();
}


function saveConfiguration() {
	console.log("Saving Config");
	/*** for-loop to get all fromFields from configurator.html ***/
	for (var property in configScenario.formFields) {
        if (configScenario.formFields.hasOwnProperty(property)) {
            if (property && $('#' + property + "Input").val())
               configScenario.formFields[property] = $('#' + property + "Input").val();
        }
    }
    
    /*** for-loop to get all demoImages from configurator.html ***/
    for (var image in configScenario.demoImages) {
        if (configScenario.demoImages.hasOwnProperty(image)) {
            if (image && $('#' + image + "Image").val())
               configScenario.demoImages[image] = $('#' + image + "Image").val();
        }
    }

    // read grids.
	configScenario.mobileNumbers 			 = getMobileNumbers();
	configScenario.nba.items 				 = getNbaRecords();
	configScenario.nbaHistory.items 		 = getHistoryRecords();
	configScenario.searchHistory.items	 = getSearchPostRecords();
	configScenario.customerAnalytics.items = getAnalyticsRecords();
	configScenario.longtitude 			 = getConfiguratorLongtitude();
	configScenario.latitude 				 = getConfiguratorLatitude();
	configScenario.usecurrentlocation 	 = getConfiguratorGeoCheckbox();
	configScenario.sendsms 	             = getSMSGeoCheckbox();
	configScenario.demoTitle			 = $("#demoTitleInput").val();
	
    
    $.ajax(dataProviderUrl, {
        type: 'POST',
        data: { action: 'saveScenario', param: configScenario },
        success: function(jsonData) {
        	console.log(jsonData);
        	demoScenario = jsonData;
            $('#configuratorModal').modal('hide');
            updateCustomerData();
            initGoogleMap();
            initConfigurator();
        }
    } );


	iphonePowerClicked();
	
    return false;
}

/** Import Configuration as JSON object **/
/*****************************************/


function importConfiguration() {
  
  	var jsonStringConfigScenario = $('#jsonConfigTextarea').val();
  	console.log("jsonString: " + jsonStringConfigScenario);
  	
  		try {
  			var jsonConfigScenario = $.parseJSON(jsonStringConfigScenario);
  		} catch (exception) {
  			var jsonConfigScenario = undefined;
  		}
  		
  		console.log("jsonConfigScenario: " + jsonConfigScenario);
   	
		if (typeof jsonConfigScenario == 'object' && jsonConfigScenario.formFields != undefined ) {
			/* It is a JSON */
			configScenario = jsonConfigScenario;
			console.log ("configScenario: " + configScenario);
			$.ajax(dataProviderUrl, {
		        type: 'POST',
		        data: { action: 'saveScenario', param: configScenario },
		        success: function(jsonData) {
		        	console.log(jsonData);
		        	demoScenario = jsonData;
		            updateCustomerData();
		            initGoogleMap();
		            initConfigurator();
		            showConfigurator();
		            $('#successMessage').show();
		        }
	    	} );
	    	
		}
		else
		{
			// eingabefeld rot
			$('#jsonStringDiv').addClass('has-error');
			$('#errorMessage').show();
		}
  	
  
    return false;
}


/** Export Configuration as JSON object **/
/*****************************************/

function exportConfiguration() {
	console.log("Export Config");
	/*** for-loop to get all fromFields from configurator.html ***/
	for (var property in configScenario.formFields) {
        if (configScenario.formFields.hasOwnProperty(property)) {
            if (property && $('#' + property + "Input").val())
               configScenario.formFields[property] = $('#' + property + "Input").val();
        }
    }
    
    /*** for-loop to get all demoImages from configurator.html ***/
    for (var image in configScenario.demoImages) {
        if (configScenario.demoImages.hasOwnProperty(image)) {
            if (image && $('#' + image + "Image").val())
               configScenario.demoImages[image] = $('#' + image + "Image").val();
        }
    }

    // read grids.
	configScenario.mobileNumbers 		   = getMobileNumbers();
	configScenario.nba.items 			   = getNbaRecords();
	configScenario.nbaHistory.items 	   = getHistoryRecords();
	configScenario.searchHistory.items	   = getSearchPostRecords();
	configScenario.customerAnalytics.items = getAnalyticsRecords();
	configScenario.longtitude 			   = getConfiguratorLongtitude();
	configScenario.latitude 			   = getConfiguratorLatitude();
	configScenario.usecurrentlocation 	   = getConfiguratorGeoCheckbox();
	configScenario.sendsms				   = getSMSGeoCheckbox();
	
    console.log("export config json: " + configScenario);
    $("#jsonConfigTextarea").val(JSON.stringify(configScenario));
	
    return false;
}


/** Mobile Number Functions **/
/******************************/
function clearMobileNumbers() {
	$('#configuratorMobileNumberTbody').html("");
}

function addMobileNumber(name,mobileNumber,smsText) {
	if (!name) name = "";
	if (!mobileNumber) mobileNumber = "";
	if (!smsText) smsText = "";
	
	$('#configuratorMobileNumberTbody').append(
		"<tr><td><div style='padding: 7px 0px'><input name='name' type='text' placeholder='Name'   value='"+name+"'   class='form-control input-md'/></div></td>" 
      	+"<td><div style='padding: 7px 0px'><input name='mobile' type='text' placeholder='Mobile' value='"+mobileNumber+"' class='form-control input-md'></div></td>"
      	+"<td><textarea name='smstext' type='text' placeholder='SMS Text' class='form-control input-md'>"+smsText+"</textarea></td>"
      	+"<td><a onclick='dropRecord(this);' class='pull-right btn btn-danger btn-block'>Delete Row</a></td></tr>"		
	);

	var rowCount= $('#configuratorMobileNumberTbody tr').length;
    $("#numberRecipients").html("" + rowCount + "");  
    return false; 
}

function dropRecord(object) {
	var tr = $(object).closest('tr');
    tr.remove();
	
	var rowCount = $('#configuratorMobileNumberTbody tr').length;
	$("#numberRecipients").html("" + rowCount + ""); 
	return false;
}	

function getMobileNumbers() {
	var aMobileNumbers = [];

	$('#configuratorMobileNumberTbody tr').each(function() {
		var name = $(this).find("input[name='name']").val();
		var mobile = $(this).find("input[name='mobile']").val();		
		var smsText = $(this).find("textarea[name='smstext']").val();
		aMobileNumbers.push({name: name, mobile: mobile, smsText:smsText});
	});
	
	return aMobileNumbers;
}

/** Analytics Functions      **/
/******************************/
function clearAnalyticsRecords() {
	$('#configuratorAnalyticsTbody').html("");
}

function addAnalyticsRecord(label,value,text) {
	if (!label) label = "";
	if (!value) value = "";
	if (!text) text = "";
	
	$('#configuratorAnalyticsTbody').append(
		"<tr><td><input name='label' type='text' placeholder='Label' value='"+label+"'   class='form-control input-md'/></td>" 
      	+"<td><input    name='value' type='text' placeholder='Value' value='"+value+"'   class='form-control input-md'/></td>"
      	+"<td><input    name='text'  type='text' placeholder='Text'  value='"+text+"'    class='form-control input-md'/></td>"
      	+"</tr>"		
	);
    return false; 
}

function getAnalyticsRecords() {
	var aAnalytics = [];

	$('#configuratorAnalyticsTbody tr').each(function() {
		var label = $(this).find("input[name='label']").val();
		var value = $(this).find("input[name='value']").val();		
		var text = $(this).find("input[name='text']").val();
		aAnalytics.push({label: label, value: value, text:text});
	});
	
	return aAnalytics;
}

/** Action History Functions **/
/******************************/
function clearHistoryRecords() {
	$('#configuratorActionHistoryTbody').html("");
}

function addHistoryRecord(id,desc,date,response) {
	if (!id) id = "";
	if (!desc) desc = "";
	if (!date) date = "";
	if (!response) response = "";
	
	$('#configuratorActionHistoryTbody').append(
		"<tr><td><div style='padding: 7px 0px'><input name='historyID' type='text' placeholder='ID' size=\"4\" value='"+id+"' class='form-control input-md'/></div></td>"
		+"<td><textarea name='historyDescription' placeholder='Description' class='form-control input-md'>"+desc+"</textarea></td>" 
      	+"<td><div style='padding: 7px 0px'><input name='historyDate' type='date' size=\"4\" placeholder='Date' value='"+date+"' class='form-control input-md'></div></td>"
      	+"<td><textarea name='historyResponse'      type='text' placeholder='Action' class='form-control input-md'>"+response+"</textarea></td>"
      	+"<td><a onclick='dropRecord(this);' class='pull-right btn btn-danger btn-block'>Delete Row</a></td></tr>"		
	); 
    return false; 
}

function getHistoryRecords() {
	var aHistoryRecords = [];

	$('#configuratorActionHistoryTbody tr').each(function() {
		var id 		 	 = $(this).find("input[name='historyID']").val();
		var desc 		 = $(this).find("textarea[name='historyDescription']").val();
		var responsedate = $(this).find("input[name='historyDate']").val();
		var response 	 = $(this).find("textarea[name='historyResponse']").val();
		aHistoryRecords.push({id: id, desc: desc, responseDate: responsedate, response: response});
	});
	return aHistoryRecords;
}


/** Next Best Action Functions **/
/******************************/
function clearNbaRecords() {
	$('#configuratorNbaTbody').html("");
}

function addNbaRecord(id,name,propensity,image) {
	if (!id) id = "";
	if (!name) name = "";
	if (!propensity) propensity = "";
	if (!image) image = "";

	$('#configuratorNbaTbody').append(
		"<tr><td><div style='padding: 7px 0px'><input name='nbaID' type='text' placeholder='ID' size=\"4\" value='"+id+"' class='form-control input-md'/></div> </td>"
		+"<td><textarea name='nbaName' 		 placeholder='Offer Name' class='form-control input-md'>"+name+"</textarea></td>" 
      	+"<td><div style='padding: 7px 0px'><input name='nbaPropensity'    type='text' size=\"4\" placeholder='Propensity' value='"+propensity+"' class='form-control input-md'></div></td>"
      	+"<td><textarea name='nbaImage'      type='text' placeholder='Image' class='form-control input-md'>"+image+"</textarea></td>"
      	+"<td><a onclick='dropRecord(this);' class='pull-right btn btn-danger btn-block'>Delete Row</a></td></tr>"		
	); 
    return false; 
}

function getNbaRecords() {
	var aNbaRecords = [];

	$('#configuratorNbaTbody tr').each(function() {
		var id 		 	= $(this).find("input[name='nbaID']").val();
		var desc 		= $(this).find("textarea[name='nbaName']").val();
		var detailImg 	= $(this).find("textarea[name='nbaImage']").val();
		var propensity 	= $(this).find("input[name='nbaPropensity']").val();		
		aNbaRecords.push({id: id, desc: desc, detailImg: detailImg, propensity: propensity});
	});
	return aNbaRecords;
}


/** Search Post Functions **/
/******************************/
function clearSearchPostRecords() {
	$('#configuratorSearchPostTbody').html("");
}

function addSearchPost(id,desc,date,source) {
	if (!id) id = "";
	if (!desc) desc = "";
	if (!date) date = "";
	if (!source) source = "";
	
	$('#configuratorSearchPostTbody').append(
		"<tr><td><div style='padding: 7px 0px'><input name='spID'     type='text' placeholder='ID' size=\"4\" value='"+id+"' class='form-control input-md'/></div> </td>"
		+"<td><textarea name='spDesc'   placeholder='Search Post Content' class='form-control input-md'>"+desc+"</textarea></td>" 
      	+"<td><div style='padding: 7px 0px'><input    name='spDate'   type='date' size=\"4\" placeholder='Date' value='"+date+"'   class='form-control input-md'></div></td>"
      	+"<td><textarea name='spSource' placeholder='Source' class='form-control input-md'>"+source+"</textarea></td>"
      	+"<td><a onclick='dropRecord(this);' class='pull-right btn btn-danger btn-block'>Delete Row</a></td></tr>"		
	); 
    return false; 
}

function getSearchPostRecords() {
	var aSearchPostRecords = [];

	$('#configuratorSearchPostTbody tr').each(function() {
		var id 		 	 = $(this).find("input[name='spID']").val();
		var desc 		 = $(this).find("textarea[name='spDesc']").val();
		var responseDate = $(this).find("input[name='spDate']").val();
		var source 		 = $(this).find("textarea[name='spSource']").val();	
		aSearchPostRecords.push({id: id, desc: desc, responseDate: responseDate, source: source});
	});
	return aSearchPostRecords;
}

/** General Functions **/
/***********************/

function getAdvisorTitle() {
	return $("#advisorTitleInput").val();
}

function resetClicked() {
	configuratorResetDemo();
}

function configuratorClicked() {
	showConfigurator();
}

function aboutUsClicked() {
	$('#configuratorAboutUs').show();
	$('#importExportButton').hide();
	$('#configuratorTabpanel').hide();
	$('#configuratorImportExportConfig').hide();
	$('#aboutButton').hide();
	$('#resetButton').hide();
	$('#configuratorButton').show();
	$('#importConfig').hide();
	
}

function importExportClicked() {
	exportConfiguration();
	$('#configuratorImportExportConfig').show();
	$('#configuratorTabpanel').hide();
	$('#configuratorAboutUs').hide();
	$('#aboutButton').hide();
	$('#resetButton').hide();
	$('#importExportButton').hide();
	$('#configuratorButton').show();
	$('#importConfig').show();
	$('#saveButton').hide();
}

function showConfigurator() {
	/* show */
	$('#configuratorTabpanel').show();
	$('#aboutButton').show();
	$('#importExportButton').show();
	$('#resetButton').show();
	$('#saveButton').show();
	
	/* hide */
	$('#configuratorAboutUs').hide();
	$('#configuratorImportExportConfig').hide();
	$('#configuratorButton').hide();
	$('#importConfig').hide();
	$('#successMessage').hide();	
	
	
	$('#jsonStringDiv').removeClass('has-error');
	$('#errorMessage').hide();
}

function configuratorResetDemo() {
	$.ajax(dataProviderUrl, {
        type: 'POST',
        data: { action: 'reset' },
        success: function(jsonData) {
        	console.log(jsonData);
        	demoScenario = jsonData;
        	configScenario = jsonData;
            $('#configuratorModal').modal('hide');
            updateCustomerData();
            initGoogleMap();
            initConfigurator();
        }
    } );
}

function useCurrentConfig() {
	exportConfiguration();
}
function useBankingConfig() {
	$("#jsonConfigTextarea").val(bankingScenario);
}
function useAutomotiveConfig() {
	$("#jsonConfigTextarea").val(automotiveScenario);
}
function useTelcoConfig() {
	$("#jsonConfigTextarea").val("");
}
function useInsuranceConfig() {
	$("#jsonConfigTextarea").val("");
}
function useEmptyConfig() {
	$("#jsonConfigTextarea").val("");
}
