<?php
/*
 Handle RDM Advisor requests.
by Khaled Nabli - khaled.nabli@sas.com
*/
@$http_proxy = "srv01gr.unx.sas.com:80";
@$demoScenarioFile = "../data/scenario.json";
@$demoScenario = array();
@$enable_logging = true;
@$logging_db = array(
	"host" => "localhost:3306", 
	"user" => "visionarydemo",
	"pass" => "Lnj9QqhV89MbtjLW");


if($_SERVER['REQUEST_METHOD'] == "GET") {
	@$action = $_GET['action'];
	@$offerId = $_GET['offerId'];
	@$param = $_GET['param'];
} else {
	@$action = $_POST['action'];
	@$offerId = $_POST['offerId'];
	@$param = $_POST['param'];	
}


session_set_cookie_params(3600*24*30);
session_start();


process($action, $offerId, $param);
return;


function process($action, $offerId, $param) {
	if($action == 'reset') {
		session_destroy();
		header('Location:'.$_SERVER['PHP_SELF'] );
		return true;
	}

	else if($action == 'restartScenario') {
		resetDemoScenario();
		@header('Content-type: application/json');
		echo json_encode(getDemoScenario());
		@logUsage("DEMO_RESTART", getDemoScenario(), "", "");
		return true;
	}

	else if($action == 'saveScenario') {
		if($param) {
			resetDemoScenario();
			setDemoScenario($param);
		}
		@header('Content-type: application/json');
		echo json_encode(getDemoScenario());
		@logUsage("DEMO_SAVE", getDemoScenario(), "", "");
		return true;
	}
	
	else if ($action == 'acceptOffer'){
		acceptOffer($offerId);
		@header('Content-type: application/json');
		echo json_encode(getDemoScenario());
		return true;
	}

	else if ($action == 'declineOffer'){
		declineOffer($offerId);
		@header('Content-type: application/json');
		echo json_encode(getDemoScenario());
		return true;
	}

	else if ($action == 'maybeOffer'){
		maybeOffer($offerId);
		@header('Content-type: application/json');
		echo json_encode(getDemoScenario());
		return true;
	}

	else if ($action == 'readConfigScenario'){
		@header('Content-type: application/json');
		echo json_encode(getConfigScenario());
		return true;
	}

	else {
		@header('Content-type: application/json');
		echo json_encode(getDemoScenario());
		@logUsage("DEMO_LOADING", getDemoScenario(), "", "");
		return true;	
	}
}



function loadDemoScenario() {
	global $demoScenarioFile;
	$_demoScenario = null;

	if(file_exists($demoScenarioFile)) { // try to read profile file
		$_demoScenario = json_decode(file_get_contents($demoScenarioFile), true);
		setDemoScenario($_demoScenario);		
	} else {
		// file doesnt exist
	}
	return $_demoScenario;
}

function getDemoScenario() {
	if(!empty($_SESSION['coedemo_scenario_hotcache'])) {
		return $_SESSION['coedemo_scenario_hotcache'];
	}
	else if(!empty($_SESSION['coedemo_scenario_cache'])) {
		return $_SESSION['coedemo_scenario_cache'];
	} else {
		return loadDemoScenario();
	}
}

function getConfigScenario() {
	if(!empty($_SESSION['coedemo_scenario_cache'])) {
		return $_SESSION['coedemo_scenario_cache'];
	} else {
		return loadDemoScenario();
	}
}

function setDemoScenario($_demoScenario) {
	@$_SESSION['coedemo_scenario_cache'] = $_demoScenario;
}

function resetDemoScenario () {
	$_SESSION['coedemo_scenario_hotcache'] = null;
}

function acceptOffer($offerId) {
	$_demoScenario = getDemoScenario();
	$removedOffer = removeOffer($_demoScenario, $offerId);
	
	$numberOfSmsContacts = sendSMS($_demoScenario, $removedOffer);

	if($removedOffer) {
		addToHistory($_demoScenario, $removedOffer["id"], $removedOffer["desc"], 'Accepted');
		$_demoScenario["customerAnalytics"]["items"][0]["value"] += 0.015;
		$_demoScenario["customerAnalytics"]["items"][0]["text"] = $_demoScenario["customerAnalytics"]["items"]	[0]["value"]*100;
		$_SESSION['coedemo_scenario_hotcache'] = $_demoScenario;
	}
	
	return $removedOffer;		
}

function sendSMS($_demoScenario, $removedOffer) {
	
	if($_demoScenario["sendsms"]==false){
		logUsage("SEND_SMS", $_demoScenario, "SEND SMS is Deactivated", "");
		return false;
	} 

	global $http_proxy;
	$mobileList = $_demoScenario["mobileNumbers"];
	$mobileSize = sizeof($mobileList);
	
	$api_key="594b5de6";
	$api_secret="bd95b0d2";
	$api_from="SAS";
	$nexmo_endpoint="http://rest.nexmo.com/sms/json";
	
	$i = 0;
	while($i < $mobileSize) {
		$mobileNumber = $mobileList[$i]["mobile"];
		$mobileName   = $mobileList[$i]["name"];
		$mobileSmsText= $mobileList[$i]["smsText"];
		$newText      = str_replace("{name}",$mobileName,$mobileSmsText);   // REPLACE name placeholder in SMS text
		$newText      = str_replace("{offername}",$removedOffer["desc"],$newText); // REPLACE offername placeholder in SMS text
		$newText      = str_replace(" ","+",$newText);  // REPLACE all spaces with a plus symbol
		//echo "-Mobile=",$mobileNumber," -Name=",$mobileName," -Text=",$newText, " --OfferName=",$removedOffer["desc"], " --";
		
		$nexmo_url=$nexmo_endpoint."?api_key=".$api_key."&api_secret=".$api_secret."&from=".$api_from."&to=".$mobileNumber."&text=".$newText;		
		$nexmo_url;

		// contact NEXMO for SMS
		$ch = curl_init();
		  curl_setopt($ch, CURLOPT_URL, $nexmo_url);
		  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		  curl_setopt($ch, CURLOPT_HEADER, 1);
		  if(!empty($http_proxy)) {
			curl_setopt($ch, CURLOPT_PROXY, $http_proxy);  		  
		  }
		  $output = curl_exec($ch); // execute the request		
		  //echo($output) . PHP_EOL; // output the profile information - includes the header	
		curl_close($ch); // close curl resource to free up system resources
		
		logUsage("SEND_SMS", $_demoScenario, "SEND SMS to " . $mobileName . " on " . $mobileNumber , "Text: " . $newText );
		$i++;
	}
	
	return null;		
}

function declineOffer($offerId) {
	$_demoScenario = getDemoScenario();
	$removedOffer = removeOffer($_demoScenario, $offerId);

	if($removedOffer) {
		addToHistory($_demoScenario, $removedOffer["id"], $removedOffer["desc"], 'Declined');
		$_demoScenario["customerAnalytics"]["items"][0]["value"] -= 0.015;
		$_demoScenario["customerAnalytics"]["items"][0]["text"] = $_demoScenario["customerAnalytics"]["items"][0]["value"]*100;
		$_SESSION['coedemo_scenario_hotcache'] = $_demoScenario;
	}
	
	return $removedOffer;		
}

function maybeOffer($offerId) {
	$_demoScenario = getDemoScenario();
	$removedOffer = removeOffer($_demoScenario, $offerId);

	if($removedOffer) {
		addToHistory($_demoScenario, $removedOffer["id"], $removedOffer["desc"], 'May Accept Later');
		$_SESSION['coedemo_scenario_hotcache'] = $_demoScenario;
	}
	
	return $removedOffer;		
}


function removeOffer(&$_demoScenario, $offerId) {
	$offerList = $_demoScenario["nba"]["items"];
	$offerSize = sizeof($offerList);
	$i = 0;
	while($i < $offerSize) {
		if(((int) $offerList[$i]["id"]) == ((int) $offerId)) {
			break;
		}
		$i++;
	}

	if($i < $offerSize) {
		$result = array_splice($_demoScenario["nba"]["items"], $i, 1);
		return $result[0];
	}

	return null;
}

function addToHistory(&$_demoScenario, $offerId, $offerDesc, $response) {
	$formattedDate = date("d/m/Y");
	$offerObj = array("id" => $offerId, "desc" => $offerDesc, "responseDate" => $formattedDate, "response" => $response);
	array_unshift($_demoScenario["nbaHistory"]["items"], $offerObj);
}



function logUsage($eventType, $demoScenario, $detail1, $detail2) {
	global $enable_logging;
	global $logging_db;

	if($enable_logging == false) {
		return false; 
	}

	$userIp = "IP: " . (isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] . " over proxy" : $_SERVER['REMOTE_ADDR'] . " direct access");
	$userSystem = htmlspecialchars($_SERVER["HTTP_USER_AGENT"]);
	$userLongtitude = $demoScenario["longtitude"];
	$userLatitute = $demoScenario["latitude"];


	$link = mysqli_connect($logging_db['host'], $logging_db['user'], $logging_db['pass']);
	if (!$link) {
	   	return false;
	}

	$sqlInsertQuery = "INSERT INTO visionarydemo.demo_events (id, session,event_dttm, event_type, user_ip, user_lon, user_lat, user_system, user_scenario, detail1, detail2) VALUES (NULL, \"". session_id() ."\" ,CURRENT_TIMESTAMP, \"" . $eventType . "\", \"".$userIp."\", \"".$userLongtitude."\", \"".$userLatitute."\",\"".$userSystem."\", \"". addslashes(json_encode($demoScenario)) ."\", \"".$detail1."\",  \"".$detail2."\");";
	mysqli_query($link,$sqlInsertQuery);
	mysqli_close($link);
	return true;
}