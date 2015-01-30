<?php

include_once 'config.php';
include_once	'Locator.php';

$action = $_REQUEST["action"];

if(!isset($action)){
				throw	new	Exception("'action' parameter is not supplied");
}

switch	($action)	{
				case	"nearbysearch":
								print Locatr::getNearBySearchLocations();
								break;

				case	"details":
								print Locatr::getPlaceDetails();
								break;
}

?>
