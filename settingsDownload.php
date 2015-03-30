<?
/*
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);
*/

/* Check if the required parameters are set, if not, display message, else download generated js page */
if ( checkRequired() ) {

	header("Content-type: text/js");
	header('Content-Disposition: attachment; filename=settings.js');

} else {
	
	die("<html><head></head><body><h1>Please make sure the required parameters are filled out.</h1><h3><a href=\"generate_settings.html\">Back</a></h3></body></html>");

}

/* returns true if the required parameters are set, false if not */
function checkRequired() {
	/* check if both are set */
	if ( isset($_POST["sourceURL"]) && isset($_POST["sourceRefreshSeconds"]) ){
		/* make sure they are both the same length */
		if ( count($_POST["sourceURL"]) == count($_POST["sourceRefreshSeconds"]) ) {		
			/* iterate through and make sure none of them are null */
			for ($i = 0 ; $i < count($_POST["sourceURL"]) ; $i++ ) {
				if ( null == $_POST["sourceURL"][$i] ) return false;
				if ( null == $_POST["sourceRefreshSeconds"][$i] ) return false;
			}
			
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
	return false;

}

/* gets the array from post data based on id */
function getJSArray($id){
	$out = "";
	if ( isset($_POST[$id]) ) {
		for( $i = 0 ; $i < count($_POST[$id]) ; $i++ ){
			if ( null != $_POST[$id][$i] ) {
				$out.=sprintf("\"%s\",",$_POST[$id][$i]);
			} else {
				$out.=sprintf("undefined,");
			}
		}
	}
	return rtrim($out,",");
}

/* gets array with encoded URLS */
function getURLJSArray ($id) {

	$out = "";
	if ( isset($_POST[$id]) ) {
		for( $i = 0 ; $i < count($_POST[$id]) ; $i++ ){
			if ( null != $_POST[$id][$i] ) {
				$out.=sprintf("encodeURIComponent(\"%s\"),",$_POST[$id][$i]);
			} else {
				$out.=sprintf("null,");
			}
		}
	}
	return rtrim($out,",");

}

function getTitle(){

	if ( isset($_POST["title"]) && $_POST["title"] != ""  ) {
		return sprintf("\"%s\"",$_POST["title"]);
	}

	return "undefined";
}

function getDebug(){

	if ( isset($_POST["debug"]) && $_POST["debug"] != "false"  ) {
		return sprintf("debug: %s,",$_POST["debug"]);
	}

	return "";
}

?>

var settingsObj = {

	title: <? echo getTitle(); ?>,

	<? echo getDebug(); ?>

	sourceURL: [<? echo getURLJSArray("sourceURL"); ?>],
	
	sourceRefreshSeconds: [<? echo getJSArray("sourceRefreshSeconds"); ?>],

	sourceLinkToFullURL: [<? echo getJSArray("sourceLinkToFullURL"); ?>],

	sourceMetaJSON: [<? echo getJSArray("sourceMetaJSON"); ?>],

	sourceMetaRefreshSeconds: [<? echo getJSArray("sourceMetaRefreshSeconds"); ?>],

	sourceLinkToFullURLBehavior: [<? echo getJSArray("sourceLinkToFullURLBehavior"); ?>],

	sourceStaleSeconds: [<? echo getJSArray("sourceStaleSeconds"); ?>],

	sourceOverlayTextTop: [<? echo getJSArray("sourceOverlayTextTop"); ?>],
	
	sourceEXIF: [<? echo getJSArray("sourceEXIF"); ?>],

	sourceEXIFLabel: [<? echo getJSArray("sourceEXIFLabel"); ?>]

}

function additionalSettings(){



}
