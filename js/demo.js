
var currentDemoStep = undefined;
var dataProviderUrl = 'data/provider.php';
var demoScenario = {}; // this will be injected


function processDemoStep(interaction) {
	if(!currentDemoStep) currentDemoStep = 0;
	console.log("Processing Demo Step: " + currentDemoStep);

	switch(currentDemoStep) {
		case 0: 
			hideRtdmAdvisor();
			setIPhonePicture(demoScenario.demoImages.iphone0);
			setPosterFramePicture(demoScenario.demoImages.poster0);	
			currentDemoStep++;
			break;
		case 1:
			if(interaction === 'POSTER') {
				setQrcodePicture(demoScenario.demoImages.qrcode);
				$("#posterPopupFrame").show();
				currentDemoStep++;
			}
			break;
		case 2:
			if(interaction === 'POSTERPOPUP') {
				$("#posterPopupFrame").hide();
				setIPhonePicture(demoScenario.demoImages.iphone1);
				currentDemoStep++;
			}
			break;
		case 3:
			if(interaction === 'IPHONE_SCREEN') {
				setIPhonePicture(demoScenario.demoImages.iphone2);
				currentDemoStep++;
			}
			break;
		case 4:
			if(interaction === 'IPHONE_SCREEN') {
				setIPhonePicture(demoScenario.demoImages.iphone3);
				setPosterFramePicture(demoScenario.demoImages.facebook);
				currentDemoStep++;
			}
			break;
		case 5:
			if(interaction === 'IPHONE_SCREEN') {
				setIPhonePicture(demoScenario.demoImages.iphone4);
				currentDemoStep++;
			}
			break;
		case 6:
			if(interaction === 'IPHONE_SCREEN') {
				setIPhonePicture(demoScenario.demoImages.iphone5);
				currentDemoStep++;
				showRtdmAdvisor();
			}
			break;
		case 7:
			if(interaction === 'IPHONE_HOME') {
				setIPhonePicture(demoScenario.demoImages.iphone6);
				currentDemoStep++;
				hideRtdmAdvisor();
				setPosterFramePicture(demoScenario.demoImages.poster1);
			}
			break;
		case 8:
			if(interaction === 'POSTER') {
				currentDemoStep++;
				setPosterFramePicture(demoScenario.demoImages.poster2);
			}
			break;
		case 9:
			if(interaction === 'POSTER') {
				currentDemoStep++;
				if(demoScenario.demoImages.poster3 != "") {
					setPosterFramePicture(demoScenario.demoImages.poster3);
				}
					
				else {
					currentDemoStep++;
					setIPhonePicture(demoScenario.demoImages.iphone7);
				}
			}
			break;
		case 10:
			if(interaction === 'POSTER') {
				currentDemoStep++;
				setIPhonePicture(demoScenario.demoImages.iphone7);
			}
			break;
		case 11:
			if(interaction === 'IPHONE_SCREEN') {
				currentDemoStep++;
				setIPhonePicture(demoScenario.demoImages.iphone8);	
			}
			break;
		case 12:
			if(interaction === 'IPHONE_SCREEN') {
				currentDemoStep++;
				setIPhonePicture(demoScenario.demoImages.iphone9);	
			}
			break;
	default:
			break;
	}
}


function initDemo() {
	$.ajax(dataProviderUrl, {
        type: 'GET',
        data: { action: '' },
        success: function(jsonData) {
            demoScenario = jsonData;
            console.log("Loading Data from Data Provider... \n" + JSON.stringify(demoScenario))	;

            $("#rtdmAdvisorContainer").load("./advisor.html", function () {
            	console.log("Loading Advisor completed.");
				initAdvisor();
				console.log("Init Advisor completed.");
			});

			processDemoStep();
        }
    } );

	$.ajax(dataProviderUrl, {
        type: 'GET',
        data: { action: 'readConfigScenario' },
        success: function(jsonData) {
            configScenario = jsonData;
            console.log("Loading Config from Data Provider... \n" + JSON.stringify(jsonData))	;

			$("#demoConfigurator").load("./configurator.html", function () {
				console.log("Loading Configurator completed.");
				initConfigurator();
				console.log("Init Configurator completed.");
			});
        }
    } );
}

function windowsResize(){
	//resizeAdvisor();
}

function initGoogleMap() {
	if(checkIfTrue(demoScenario.usecurrentlocation)) {
		navigator.geolocation.getCurrentPosition(updateGoogleMapPos);
	} else {
		updateGoogleMapPos ({coords: {latitude: demoScenario.latitude, longitude: demoScenario.longtitude}});	
	}
}

function updateGoogleMapPos(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	if(checkIfTrue(demoScenario.usecurrentlocation)) {
		demoScenario.latitude = latitude;
		demoScenario.longitude = longitude;
	}
	var coords = new google.maps.LatLng(latitude, longitude);
	var mapOptions = {
		zoom: 15,
		center: coords,
		mapTypeControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("googleMapsFrame"), mapOptions);
	var marker = new google.maps.Marker({
		position: coords,
		map: map,
		title: "Current location!"
	});
}


function iphoneHomeClicked() {
	processDemoStep('IPHONE_HOME');
}

function iphoneScreenClicked() {
	processDemoStep('IPHONE_SCREEN');
}


function frameScreenClicked() {
	processDemoStep('POSTER');
}

function framePopupClicked() {
	processDemoStep('POSTERPOPUP');
}



function iphonePowerClicked() {
	resetAdvisorDemo();
	setIPhonePicture("images/home_screen_start.gif");
	setPosterFramePicture("images/mainposter_start.jpg");
	setTimeout(function() {    //do something special
		console.log("Timer triggered");
		currentDemoStep = 0;
		processDemoStep();
  	}, 1000);
}

function iphoneMuteClicked() {
	$('#configuratorModal').modal('show');
	$('#successMessage').hide();
}

function setPosterFramePicture(img) {
	var imgHtml = "<img class=\"img-rounded\" src='"+img+"' />";
	$("#posterFrame").html(imgHtml);
}

function setIPhonePicture(img) {
	if(img) {
		var imgHtml = "<img src='"+img+"'  />";
		$("#iphoneScreen").html(imgHtml);
	}
	else {
		$("#iphoneScreen").html("");
	}
}

function setQrcodePicture(img) {
	if(img) {
		var imgHtml = "<img src='"+img+"'  />";
		$("#posterPopupFrame").html(imgHtml);
	}
	else {
		$("#posterPopupFrame").html("");
	}
}


function showRtdmAdvisor() {
	$("#posterFrame").hide();
	$("#posterPopupFrame").hide();
	$("#rtdmAdvisorFrame").show();
	$("#googleMapsFrame").show();
	$("#offerDetailsFrame").show();
	initGoogleMap();
}

function hideRtdmAdvisor() {
	$("#posterPopupFrame").hide();
	$("#rtdmAdvisorFrame").hide();
	$("#googleMapsFrame").hide();
	$("#offerDetailsFrame").hide();
	$("#posterFrame").show();
}

function checkIfTrue(value) {
	if ( value == true || value == "true" ) {
		return true;
	} 
	return false;
}


/***** Config Scenarios *****/

var bankingScenario = '{"id":"1234","demoTitle":"Banking","longtitude":"-78.767082","latitude":"35.828772","usecurrentlocation":true,"sendsms":false,"formFields":{"lastName":"Boerner","firstName":"Oliver","twitterid":"oliboe","facebookid":"Oliver.Boerner@facebook.com","facebookpage":"https://www.facebook.com/oliver.boerner","address":"Henley Road","city":"Marlow","state":"NH","zip":"SL7 2EB","mobile":"+49 173 6647047","phone":"+49 173 6647047","email":"oboerner@sas.com","purpose":"product inquiry","product":"","demeanor":"","profileImage":"images/profile_image.png","Familienstand":"married with Annette Boerner (Origin: Facebook)","Arbeitgeber":"SAS Institute GmbH (Origin: Facebook)","Interests":"Cars (Facebook like BMW)\\nFootball (Facebook like Bayern Muenchen)","additionalinfotitle":"Home Branch","additionalinfovalue":"100 Sas Campus Dr\\nCary NC 27513\\nUnited States"},"mobileNumbers":[{"name":"Mathias","mobile":"491735755021","smsText":"Thanks {name} for accepting the {offername} offer!"}],"demoImages":{"poster0":"images/mainposter.jpg","poster1":"images/marlow.jpg","poster2":"images/marlow_house.jpg","poster3":"images/marlow_house2.jpg","facebook":"images/facebook.png","iphone0":"images/home_screen.png","iphone1":"images/screen-1.png","iphone2":"images/screen-2.png","iphone3":"images/screen-3.png","iphone4":"images/screen-4.png","iphone5":"images/screen-5.png","iphone6":"images/home_screen.png","iphone7":"images/screen-approved.png","qrcode": "images/qrcode.png"},"customerAnalytics":{"title":"Customer Analytics","goodThreshold":"0.7","okThreshold":"0.35","items":[{"label":"Satisfaction","value":"0.44","text":"45 %"},{"label":"Lifetime Value","value":"0.7","text":"75"},{"label":"Risk","value":"0.8","text":"10 "},{"label":"Fraud","value":"0.2","text":"5"}]},"nba":{"title":"Next Best Actions","items":[{"id":"2001","desc":"Special Mortgage: 2 Year Fixed Advance Standard","detailImg":"images/mortgage_2.jpg","propensity":"78"},{"id":"2002","desc":"Initial Mortgage Calculation","detailImg":"images/mortgage_1.jpg","propensity":"55"}]},"nbaHistory":{"title":"Action History","items":[{"id":"1001","desc":"Mortgage","responseDate":"2014-06-25","response":"Presented in Mobile Browser"},{"id":"1002","desc":"HSBC Sale 2014","responseDate":"2014-06-25","response":"Qr-Code Scan"},{"id":"1003","desc":"HSBC Current Account","responseDate":"2014-07-19","response":"Accepted"}]},"searchHistory":{"title":"Search Post History","items":[{"id":"3001","desc":"HSBC Sale 2014","responseDate":"2014-06-23","source":"Website - search"}]}}';
var automotiveScenario = '{"id":1234,"demoTitle":"Automotive","longtitude":"-78.767082","latitude":"35.828772","usecurrentlocation":true,"sendsms":false,"formFields":{"lastName":"Boerner","firstName":"Oliver","twitterid":"oliboe","facebookid":"Oliver.Boerner@facebook.com","facebookpage":"https://www.facebook.com/oliver.boerner","address":"Henley Road","city":"Marlow","state":"NH","zip":"SL7 2EB","mobile":"+49 173 6647047","phone":"+49 173 6647047","email":"oboerner@sas.com","purpose":"product inquiry","product":"","demeanor":"","profileImage":"images/profile_image.png","Familienstand":"married with Annette Boerner (Origin: Facebook)","Arbeitgeber":"SAS Institute GmbH (Origin: Facebook)","Interests":"Cars (Facebook like BMW)\\nFootball (Facebook like Bayern Muenchen)","additionalinfotitle":"Home Branch","additionalinfovalue":"100 Sas Campus Dr\\nCary NC 27513\\nUnited States"},"mobileNumbers":[{"name":"Mathias","mobile":"491735755021","smsText":"Thanks {name} for accepting the {offername} offer!"}],"demoImages":{"poster0":"images/automotive/poster.jpg","poster1":"images/automotive/showroom_1.jpg","poster2":"images/automotive/showroom_2.jpg","poster3":"images/automotive/showroom_2.jpg","facebook":"images/facebook.png","iphone0":"images/automotive/home_screen.jpg","iphone1":"images/automotive/s1_bmw4.jpg","iphone2":"images/automotive/s2_testdrive.jpg","iphone3":"images/automotive/s3_fb_login.jpg","iphone4":"images/automotive/s4_fb_allow.jpg","iphone5":"images/automotive/s5_videochat.jpg","iphone6":"images/automotive/s6_credit_request.jpg","iphone7":"images/automotive/s7_approval.jpg","qrcode": "images/qrcode.png"},"customerAnalytics":{"title":"Customer Analytics","goodThreshold":0.7,"okThreshold":0.35,"items":[{"label":"Satisfaction","value":"0.44","text":"45 %"},{"label":"Lifetime Value","value":"0.7","text":"75"},{"label":"Risk","value":"0.8","text":"10 "},{"label":"Fraud","value":"0.2","text":"5"}]},"nba":{"title":"Next Best Actions","items":[{"id":"2001","desc":"Test Drive on race track (Silverstone)","detailImg":"images/automotive/offer_silverstone.jpg","propensity":"82"},{"id":"2002","desc":"Test Drive de Luxe (BMW LSO Open Air Classics)","detailImg":"images/automotive/offer_lso.jpg","propensity":"78"},{"id":"2003","desc":"Extended warranty special","detailImg":"images/automotive/offer_warranty.jpg","propensity":"55"}]},"nbaHistory":{"title":"Action History","items":[{"id":"1001","desc":"BMW 4er Coupe Information","responseDate":"2014-09-01","response":"Mobile Browser"},{"id":"1002","desc":"BMW 4er Coupe Information","responseDate":"2014-09-01","response":"Qr-Code Scan"},{"id":"1003","desc":"BMW X6 3.0d M-S 1140 EZ 07/2012","responseDate":"2014-09-19","response":"BMW Select Finance"}]},"searchHistory":{"title":"Search Post History","items":[{"id":"3001","desc":"BMW 4er Coupe Information","responseDate":"2014-09-02","source":"Website - search"}]}}';



