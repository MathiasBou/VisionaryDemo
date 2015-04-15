<html>
<head>
</head>
<body>

<h1>Health Check</h1>
</ul>
<?php

@$logging_db = array(
	"host" => "localhost:3306", 
	"user" => "visionarydemo",
	"pass" => "Lnj9QqhV89MbtjLW");


echo "<li>Test database connection ";
$link = mysqli_connect($logging_db['host'], $logging_db['user'], $logging_db['pass']);
	if (!$link) {
		echo "Connection failed: " . mysqli_connect_error();
	   	return false;
	} else {
		echo "Connection succeeded";
	}
echo "</li>";

echo "<li>";
echo "Check if logging table is available";
echo "</li>";


echo "<li>";
echo "Check if logging table is writable";
echo "</li>";

?>
</ul>
</body>
</html>